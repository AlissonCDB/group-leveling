'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function authenticate(previousState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const supabase = await createClient();

  // O signInWithPassword já retorna o 'user' se for bem-sucedido
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError || !data.user) {
    return { message: 'Credenciais inválidas.' };
  }

  // Agora só precisa de verificar o acesso, eliminando o getUser() redundante
  const { data: access } = await supabase
    .from('user_access')
    .select('access_level')
    .eq('user_id', data.user.id)
    .single();

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