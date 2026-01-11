/**
 * auth.js - Sistema de autenticación AlkeWallet
 * Conectado con sessionManager.js y database.js
 */

// Manejo de login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email')?.value?.trim();
    const password = document.getElementById('password')?.value?.trim();

    if (!email || !password) {
        showLoginError('Por favor complete todos los campos');
        return;
    }

    const submitBtn = document.querySelector('.login-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Iniciando sesión...';
    }

    if (!window.sessionManager) {
        showLoginError('Error del sistema. Recarga la página.');
        restoreLoginButton(submitBtn);
        return;
    }

    setTimeout(() => {
        try {
            const result = window.sessionManager.login(email, password);

            if (result && result.success) {
                showWelcomeModal(result.user);
                setTimeout(() => {
                    window.location.href = './menu.html';
                }, 1500);
            } else {
                showLoginError(result?.message || 'Email o contraseña incorrectos.');
                restoreLoginButton(submitBtn);
            }
        } catch (error) {
            console.error('💥 Error en login:', error);
            showLoginError('Error inesperado. Intenta nuevamente.');
            restoreLoginButton(submitBtn);
        }
    }, 600);
}

function restoreLoginButton(submitBtn) {
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Ingresar';
    }
}

function showLoginError(message) {
    if (typeof showNotification === 'function') {
        showNotification(message, 'error', 'Error de Login');
    }

    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');

    if (emailField) {
        emailField.classList.add('is-invalid');
        setTimeout(() => emailField.classList.remove('is-invalid'), 4000);
    }

    if (passwordField) {
        passwordField.classList.add('is-invalid');
        setTimeout(() => passwordField.classList.remove('is-invalid'), 4000);
        passwordField.value = '';
    }
}

function showWelcomeModal(user) {
    const modal = document.getElementById('welcomeModal');
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (modal && welcomeMessage) {
        welcomeMessage.textContent = `¡Bienvenido ${user.firstName}!`;
        $(modal).modal('show');
    }
}

function handleLogout() {
    if (window.sessionManager) {
        window.sessionManager.logout();
    }
    window.location.href = './index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    document.querySelectorAll('.logout-trigger, a[href*="index.html"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.classList.contains('logout-trigger') || btn.textContent.toLowerCase().includes('cerrar')) {
                e.preventDefault();
                handleLogout();
            }
        });
    });
});