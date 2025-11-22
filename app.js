apps.js
// Aplicación principal - Interfaz de usuario
class ElevaApp {
    constructor() {
        this.initEventListeners();
    }

    initEventListeners() {
        // Formulario de registro
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister();
        });

        // Formulario de login
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
    }

    async handleRegister() {
        const businessName = document.getElementById('businessName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        this.showLoading('Creando tu página...');

        const result = await authSystem.register(businessName, email, password);
        
        this.hideLoading();

        if (result.success) {
            this.showSuccess('¡Cuenta creada! Redirigiendo a tu dashboard...');
        } else {
            this.showError(result.error);
        }
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        this.showLoading('Iniciando sesión...');

        const result = await authSystem.login(email, password);
        
        this.hideLoading();

        if (result.success) {
            this.showSuccess('¡Bienvenido!');
        } else {
            this.showError(result.error);
        }
    }

    showLoading(message) {
        // Puedes implementar un spinner aquí
        console.log('Loading:', message);
    }

    hideLoading() {
        console.log('Loading hidden');
    }

    showSuccess(message) {
        alert('✅ ' + message);
    }

    showError(message) {
        alert('❌ ' + message);
    }
}

// Funciones globales para los modals
function showLogin() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('loginModal').classList.add('flex');
    document.getElementById('registerModal').classList.add('hidden');
}

function showRegister() {
    document.getElementById('registerModal').classList.remove('hidden');
    document.getElementById('registerModal').classList.add('flex');
    document.getElementById('loginModal').classList.add('hidden');
}

function hideModals() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('registerModal').classList.add('hidden');
    document.getElementById('loginModal').classList.remove('flex');
    document.getElementById('registerModal').classList.remove('flex');
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ElevaApp();
});
