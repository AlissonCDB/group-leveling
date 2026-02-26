import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function proxy(req) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Atualiza a requisição para que o getUser() veja os cookies novos imediatamente
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));

          // Recria a resposta para sincronizar os headers
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });

          // Define os cookies na resposta que será enviada ao navegador
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Validação de segurança com Supabase
  const { data: { user } } = await supabase.auth.getUser();

  // Proteção de rotas
  if (!user) {
    const url = new URL("/", req.url);
    url.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return res;
}

// O config continua igual, mas agora o Next.js procura pela função 'proxy' acima
export const config = {
  matcher: [
    "/home/:path*",
    "/groups/:path*"
  ],
};