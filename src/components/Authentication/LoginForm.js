'use client';
import { useActionState } from 'react';
import { authenticate } from '@/app/actions';
import { StyledInput, PrimaryButton, Label } from '@/components/UI/Form';

export default function LoginForm() {
  const [state, action, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="space-y-4">
        <div>
          <Label>Email</Label>
          <StyledInput name="email" type="email" placeholder="nome@gmail.com" required />
        </div>
        <div>
          <Label>Senha</Label>
          <StyledInput name="password" type="password" placeholder="••••••••" required />
        </div>
      </div>

      <PrimaryButton type="submit" disabled={isPending}>
        {isPending ? 'Conectando...' : 'Entrar'}
      </PrimaryButton>
      
      {state?.message && (
        <p className="text-red-400 text-xs text-center animate-pulse">{state.message}</p>
      )}
    </form>
  );
}