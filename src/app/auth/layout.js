export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black overflow-hidden relative">
      {/* Exemplo: Um efeito de gradiente v4 no fundo só para o login */}
      <div className="absolute inset-0 bg-linear-to-tr from-purple-900/20 via-black to-black -z-10" />
      
      <section className="w-full max-w-md p-4">
        {children}
      </section>
    </div>
  );
}