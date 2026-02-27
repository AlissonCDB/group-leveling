import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Usar 'export default' resolve o erro de exportação no Next.js 16/Turbopack
export default async function proxy(req) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, // Verifique se esta variável está correta no seu .env
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Atualiza a requisição para que o getUser() veja os cookies novos imediatamente
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));

          // Sincroniza a resposta com os novos cabeçalhos
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });

          // Define os cookies na resposta final para o navegador
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Esta chamada só será feita nas rotas definidas no matcher abaixo
  const { data: { user } } = await supabase.auth.getUser();

  // Redireciona se não houver usuário autenticado
  if (!user) {
    const url = new URL("/", req.url);
    url.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return res;
}

// O matcher garante que o proxy NÃO rode na '/' (Login) ou em '/assets'
export const config = {
  matcher: [
    "/home/:path*",
    "/groups/:path*"
  ],
};