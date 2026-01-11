/**
 * auth.js - Sistema de autenticación AlkeWallet
 * Conectado con sessionManager.js y database.js
 */

// Función principal de manejo de login
function handleLogin(event) {
    event.preventDefault();
    
    console.log('🔑 Iniciando proceso de login');
    
    // Obtener datos del formulario
    const email = document.getElementById('email')?.value?.trim();
    const password = document.getElementById('password')?.value?.trim();
    
    if (!email || !password) {
        showLoginError('Por favor complete todos los campos');
        return;
    }
    
    console.log('📧 Email ingresado:', email);
    console.log('🔒 Password length:', password.length);
    
    // Deshabilitar botón mientras procesa
    const submitBtn = document.querySelector('.login-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Iniciando sesión...';
    }
    
    // Verificar que SessionManager esté disponible
    if (!window.sessionManager) {
        console.error('❌ SessionManager no disponible');
        showLoginError('Error del sistema. Recarga la página e intenta nuevamente.');
        restoreLoginButton(submitBtn);
        return;
    }
    
    // Verificar que la database esté cargada
    if (!window.sessionManager.database) {
        console.error('❌ Database no cargada');
        showLoginError('Error de conexión. Verifica tu conexión e intenta nuevamente.');
        restoreLoginButton(submitBtn);
        return;
    }
    
    // Intentar login
    setTimeout(() => {
        try {
            const result = window.sessionManager.login(email, password);
            console.log('🎯 Resultado login:', result);
            
            if (result && result.success) {
                // Login exitoso
                console.log('✅ Login exitoso');
                showWelcomeModal(result.user);
                
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    window.location.href = './menu.html';
                }, 2000);
            } else {
                // Login fallido
                console.log('❌ Login fallido:', result?.message);
                const message = result?.message || 'Email o contraseña incorrectos. Verifica los datos e intenta nuevamente.';
                showLoginError(message);
                restoreLoginButton(submitBtn);
            }
        } catch (error) {
            console.error('💥 Error en login:', error);
            showLoginError('Error inesperado. Intenta nuevamente.');
            restoreLoginButton(submitBtn);
        }
    }, 500); // Pequeño delay para UX
}

// Restaurar botón de login
function restoreLoginButton(submitBtn) {
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Ingresar';
    }
}

// Mostrar error de login
function showLoginError(message) {
    console.log('⚠️ Mostrando error:', message);
    
    // Usar sistema de notificaciones si está disponible
    if (typeof showNotification === 'function') {
        showNotification(message, 'error', 'Error de Login');
    } else {
        // Mostrar alerta estándar como fallback
        alert('Error: ' + message);
    }
    
    // Resaltar campos con error
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    
    if (emailField) {
        emailField.classList.add('is-invalid');
        setTimeout(() => emailField.classList.remove('is-invalid'), 5000);
    }
    
    if (passwordField) {
        passwordField.classList.add('is-invalid');
        setTimeout(() => passwordField.classList.remove('is-invalid'), 5000);
        // Limpiar password por seguridad
        passwordField.value = '';
    }
}

// Mostrar modal de bienvenida
function showWelcomeModal(user) {
    const modal = document.getElementById('welcomeModal');
    const welcomeMessage = document.getElementById('welcomeMessage');
    
    if (modal && welcomeMessage) {
        welcomeMessage.textContent = `¡Bienvenido ${user.firstName}!`;
        
        // Mostrar modal usando Bootstrap
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const welcomeModal = new bootstrap.Modal(modal);
            welcomeModal.show();
        } else if (typeof $ !== 'undefined') {
            $(modal).modal('show');
        }
    }
}

// Función de logout
function handleLogout() {
    if (window.sessionManager) {
        window.sessionManager.logout();
    }
    window.location.href = './index.html';
}

// Inicialización cuando DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Configurar formulario de login
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Configurar botones de logout
    const logoutBtns = document.querySelectorAll('a[href*="index.html"], .btn[onclick*="logout"]');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.href?.includes('index.html') || btn.textContent?.includes('Cerrar')) {
                e.preventDefault();
                handleLogout();
            }
        });
    });
    
    console.log('🔐 Auth system ready');
});