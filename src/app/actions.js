'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { meetingService } from '@/services/meeting.service'
import { workService } from '@/services/work.service'

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
    // Caso o tema venha vazio (embora agora seja obrigatório no form), fazemos o parsing seguro
    const themeId = formData.get('theme');
    const parsedTheme = themeId ? parseInt(themeId) : null;

    // 3. Mapear dados do formulário para as colunas do SQL
    await meetingService.createRaid(supabase, {
      creator: userData.id,
      meeting_date: formData.get('meeting_date'),
      plataform_meeting: parseInt(formData.get('plataform_meeting')),
      meeting_tamplate: parseInt(formData.get('meeting_tamplate')),
      group_category: parseInt(formData.get('group_category')),
      adress: formData.get('adress'),
      theme: parsedTheme,
      content: formData.get('conteudo'),
      duration: formData.get('tempo_estimado'),
    });

    revalidatePath('/groups');
    return { success: true, message: "Raid registada na base de missões!" };
  } catch (error) {
    console.error("Erro Supabase:", error);
    return { success: false, message: "Erro ao registar raid. Verifique os dados." };
  }
}

export async function updateMeetingAction(previousState, formData) {
  const supabase = await createClient();

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return { success: false, message: "Sessão expirada. Faça login." };

  try {
    const meetingId = formData.get('meeting_id');
    const themeId = formData.get('theme');
    const parsedTheme = themeId ? parseInt(themeId) : null;

    await meetingService.updateRaid(supabase, meetingId, {
      meeting_date: formData.get('meeting_date'),
      plataform_meeting: parseInt(formData.get('plataform_meeting')),
      meeting_tamplate: parseInt(formData.get('meeting_tamplate')),
      group_category: parseInt(formData.get('group_category')),
      adress: formData.get('adress'),
      theme: parsedTheme,
      content: formData.get('conteudo'),
      duration: formData.get('tempo_estimado'),
    });

    revalidatePath('/groups');
    return { success: true, message: "Raid atualizada com sucesso!" };
  } catch (error) {
    console.error("Erro Supabase Update:", error);
    return { success: false, message: "Erro ao atualizar raid. Verifique os dados." };
  }
}

export async function publishWorkAction(prevState, formData) {
    const supabase = await createClient();

    // 1. VALIDAR O USUÁRIO E PEGAR O ID DELE
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return { success: false, message: "Sessão expirada. Faça login." };

    const { data: userData, error: userError } = await supabase
        .from('User')
        .select('id')
        .eq('id_login', authUser.id)
        .single();

    if (userError || !userData) {
        return { success: false, message: "Perfil não encontrado no banco de dados." };
    }

    try {
        const file = formData.get('arquivo');
        const subject = formData.get('disciplina');
        const type = formData.get('tema');
        const graduation = formData.get('graduation');

        if (!file || file.size === 0) throw new Error("Arquivo é obrigatório");

        // 2. Upload do Arquivo para o Supabase Storage
        // Nota: O nome foi ajustado para remover espaços, evitando problemas de URL
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `${Date.now()}_${safeFileName}`;
        
        const { data: storageData, error: storageError } = await supabase.storage
            .from('trabalhos_arquivos') // O BUCKET DEVE ESTAR PÚBLICO NO SUPABASE
            .upload(fileName, file);

        if (storageError) throw storageError;

        // Pegar a URL pública do arquivo
        const { data: { publicUrl } } = supabase.storage
            .from('trabalhos_arquivos')
            .getPublicUrl(fileName);

        // 3. Salvar no Banco de Dados usando o Service
        const workData = {
            subject: subject,
            type: type,
            archive: publicUrl,
            graduation: graduation || 'Não informada',
            user_id: userData.id // VINCULA O TRABALHO A QUEM FEZ O UPLOAD
        };

        await workService.createWork(supabase, workData);

        // Atualiza a lista de trabalhos na UI
        revalidatePath('/works'); 
        
        return { success: true, message: "Trabalho publicado com sucesso!" };

    } catch (error) {
        console.error('Erro na action publishWorkAction:', error);
        return { success: false, message: error.message || "Erro ao publicar trabalho." };
    }
}

export async function updateWorkAction(prevState, formData) {
    const supabase = await createClient();

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return { success: false, message: "Sessão expirada. Faça login." };

    try {
        const workId = formData.get('work_id');
        const file = formData.get('arquivo');
        const existingArchive = formData.get('existing_archive');
        
        let finalArchiveUrl = existingArchive;

        // Se o utilizador enviou um novo ficheiro, fazemos o upload
        if (file && file.size > 0) {
            const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
            const fileName = `${Date.now()}_${safeFileName}`;
            
            const { error: storageError } = await supabase.storage
                .from('trabalhos_arquivos') 
                .upload(fileName, file);

            if (storageError) throw storageError;

            const { data: { publicUrl } } = supabase.storage
                .from('trabalhos_arquivos')
                .getPublicUrl(fileName);
                
            finalArchiveUrl = publicUrl;
        }

        const workData = {
            subject: formData.get('disciplina'),
            type: formData.get('tema'),
            graduation: formData.get('graduation'),
            archive: finalArchiveUrl
        };

        // Certifique-se de que o workService possui a função updateWork
        await supabase.from('Work').update(workData).eq('id', workId);

        revalidatePath('/works'); 
        return { success: true, message: "Trabalho atualizado com sucesso!" };

    } catch (error) {
        console.error('Erro na action updateWorkAction:', error);
        return { success: false, message: error.message || "Erro ao atualizar trabalho." };
    }
}

// Adicione isto no final do seu src/app/actions.js
export async function postCommentAction(prevState, formData) {
    const supabase = await createClient();

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return { success: false, message: "Sessão expirada. Faça login." };

    const { data: userData, error: userError } = await supabase
        .from('User')
        .select('id')
        .eq('id_login', authUser.id)
        .single();

    if (userError || !userData) {
        return { success: false, message: "Perfil não encontrado." };
    }

    try {
        const meetingId = formData.get('meeting_id');
        // Mantemos o nome do campo do formulário como 'content', mas enviamos para a coluna 'text'
        const commentText = formData.get('content'); 

        if (!commentText || commentText.trim() === '') {
            return { success: false, message: "O comentário não pode estar vazio." };
        }

        // AQUI ESTÁ A CORREÇÃO: Usar a coluna 'text'
        const { error } = await supabase.from('Comments').insert([{ 
            meeting_id: meetingId, 
            user_id: userData.id, 
            text: commentText 
        }]);

        if (error) throw error;

        // Opcional: Revalidar o path se estiver a usar cache
        // revalidatePath(`/groups/${meetingId}`); 
        return { success: true, message: "Mensagem enviada!" };

    } catch (error) {
        console.error('Erro ao enviar comentário:', error);
        return { success: false, message: "Erro ao enviar a mensagem." };
    }
}