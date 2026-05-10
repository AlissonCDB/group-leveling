import { logout } from '@/app/actions.js'; // Adicione isto no topo do LogoutModal.js

// ... dentro do componente LogoutModal:
const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
        console.log("Deslogando do Group Leveling...");
        sessionStorage.removeItem('hasSeenRatingAlert'); // Limpa alertas pendentes
        
        await logout(); // 🔴 Chama a sua Server Action original
        
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        setIsLoggingOut(false);
    }
};