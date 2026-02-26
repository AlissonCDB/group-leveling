'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function authenticate(previousState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const supabase = await createClient();

  // 1. Tenta realizar o login
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  // Se houver erro nas credenciais, retorna a mensagem
  if (signInError) {
    return { message: 'Credenciais inválidas. Verifique seu e-mail e senha.' };
  }

  // 2. Valida se o usuário realmente existe na sessão
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    await supabase.auth.signOut();
    return { message: 'Erro ao validar sessão. Tente fazer login novamente.' };
  }

  await supabase
    .from('user_access')
    .select('access_level')
    .eq('user_id', user.id)
    .single();

  // 3. Redirecionamento forçado para /home
  revalidatePath('/', 'layout');
  redirect('/home');
}

export async function register(previousState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  // Novos campos capturados do formulário
  const userName = formData.get('user_name');
  const lastName = formData.get('last_name');
  const idClass = formData.get('id_class');

  const supabase = await createClient();

  if (password !== confirmPassword) {
    return { message: 'As senhas não coincidem.' };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) return { message: authError.message };

  // Inserção na tabela User conforme o teu diagrama
  if (authData.user) {
    const { error: dbError } = await supabase
      .from('User')
      .insert([
        {
          id_login: authData.user.id,
          user_name: userName,
          last_name: lastName,
          id_class: idClass // Agora incluído!
        }
      ]);

    if (dbError) console.error("Erro ao salvar perfil:", dbError.message);
  }

  return { success: true, message: 'Cadastro realizado! Verifique seu e-mail.' };
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath('/', 'layout');

  redirect('/');
}