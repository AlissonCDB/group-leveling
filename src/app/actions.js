'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { meetingService } from '@/services/meeting.service'

export async function authenticate(previousState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Validação básica para evitar requisições desnecessárias
  if (!email || !password) {
    return { message: 'E-mail e senha são obrigatórios.' };
  }

  const supabase = await createClient();

  // O signInWithPassword já retorna o 'user' se for bem-sucedido
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError || !data.user) {
    return { message: 'Credenciais inválidas.' };
  }

  // Otimização: A verificação de acesso pode ser feita na página protegida para economizar edge requests no login
  revalidatePath('/', 'layout');
  redirect('/home');
}

export async function register(previousState, formData) {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const confirmPassword = formData.get('confirmPassword')?.toString();

  // Captura os dados do perfil
  const userName = formData.get('user_name');
  const lastName = formData.get('last_name');
  const idClass = formData.get('id_class');

  // 1. VALIDAÇÃO CRUCIAL: Impede o erro de "Anonymous sign-ins"
  if (!email || !password) {
    return { success: false, message: 'E-mail e senha são obrigatórios para o despertar.' };
  }

  if (password !== confirmPassword) {
    return { success: false, message: 'As senhas não coincidem.' };
  }

  if (password.length < 6) {
    return { success: false, message: 'A senha deve ter no mínimo 6 caracteres.' };
  }

  const supabase = await createClient();

  // 2. Criação do usuário no Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    // Se o erro for de usuário já existente, o Supabase retorna uma mensagem amigável
    return { success: false, message: authError.message };
  }

  // 3. Inserção na tabela pública "User"
  if (authData?.user) {
    const { error: dbError } = await supabase
      .from('User')
      .insert([
        {
          id_login: authData.user.id,
          id_class: parseInt(idClass),
          user_name: userName,
          last_name: lastName,
        }
      ]);

    if (dbError) {
      console.error("Erro ao salvar perfil no banco:", dbError.message);
      return { success: false, message: "Erro ao criar perfil. Tente novamente." };
    }
  }

  return {
    success: true,
    message: 'Cadastro realizado com sucesso! Verifique seu e-mail para ativar sua conta.'
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function createMeetingAction(previousState, formData) {
  const supabase = await createClient();

  // 1. Validar utilizador no Auth
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return { success: false, message: "Sessão expirada. Faça login." };

  // 2. Buscar o ID numérico (bigint) do utilizador na tabela "User"
  const { data: userData, error: userError } = await supabase
    .from('User')
    .select('id')
    .eq('id_login', authUser.id)
    .single();

  if (userError || !userData) {
    return { success: false, message: "Perfil não encontrado no banco de dados." };
  }

  try {
    // 3. Mapear dados do formulário para as colunas do SQL
    await meetingService.createRaid(supabase, {
      creator: userData.id, // bigint
      meeting_date: formData.get('meeting_date'), // timestamp
      plataform_meeting: formData.get('plataform_meeting'),
      discipline: formData.get('disciplina'), // Mapeia 'disciplina' -> 'discipline'
      content: formData.get('conteudo'),      // Mapeia 'conteudo' -> 'content'
      duration: formData.get('tempo_estimado'), // Mapeia 'tempo_estimado' -> 'duration'
    });

    revalidatePath('/groups');
    return { success: true, message: "Raid registada na base de missões!" };
  } catch (error) {
    console.error("Erro Supabase:", error);
    return { success: false, message: "Erro ao registar raid. Verifique os dados." };
  }
}

export async function publishWorkAction(previousState, formData) {
  const supabase = await createClient();

  // 1. Validação de Auth
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return { success: false, message: "Sessão expirada. Faça login." };

  // 2. Busca o perfil (Padrão de segurança que você já usa)
  const { data: userData, error: userError } = await supabase
    .from('User')
    .select('id')
    .eq('id_login', authUser.id)
    .single();

  if (userError || !userData) {
    return { success: false, message: "Perfil não encontrado." };
  }

  try {
    const arquivo = formData.get('arquivo');
    const disciplina = formData.get('disciplina'); // No DB será 'subject'
    const tema = formData.get('tema');             // No DB será 'type' ou 'subject'
    const graduation = formData.get('graduation'); // Campo novo que adicionamos no Modal

    if (!arquivo || arquivo.size === 0) {
      return { success: false, message: "O arquivo é obrigatório." };
    }

    // 3. Upload para o Storage
    const fileExt = arquivo.name.split('.').pop();
    const fileName = `${userData.id}/${Date.now()}.${fileExt}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('trabalhos_arquivos')
      .upload(fileName, arquivo);

    if (storageError) throw storageError;

    // 4. URL Pública
    const { data: { publicUrl } } = supabase.storage
      .from('trabalhos_arquivos')
      .getPublicUrl(fileName);

    // 5. Inserção no Banco (Mapeamento seguindo seu SQL)
    const { error: dbError } = await supabase
      .from('Work')
      .insert([
        {
          type: tema,               // Ex: "TCC", "Exercício"
          subject: disciplina,      // Ex: "Banco de Dados"
          archive: publicUrl,       // Link do arquivo
          graduation: graduation    // Ex: "Análise e Desenv. de Sistemas"
        }
      ]);

    if (dbError) throw dbError;

    revalidatePath('/trabalhos');
    return { success: true, message: "ARTEFATO SINCRONIZADO COM SUCESSO! 🚀" };

  } catch (error) {
    console.error("Erro:", error);
    return { success: false, message: "FALHA NA TRANSMISSÃO: " + error.message };
  }
}