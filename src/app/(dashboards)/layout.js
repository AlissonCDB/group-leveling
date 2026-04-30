import FloatingNav from "@/components/Navagation/FloatingNav.js";
export default function MainLayout({ children }) {
  return (
    <div className="relative h-full w-screen bg-gray-900">
      <main>
        {children}
      </main>
      <FloatingNav /> 
    </div>
  );
}