/**
 * auth.js - Sistema de autenticación AlkeWallet
 * Conectado con sessionManager.js y database.js
 */

// Funciones para manejar "Recuérdame"
function saveRememberMeData(email, remember, showNotifications = true) {
    if (remember) {
        const rememberData = {
            email: email,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('alkewallet_remember', JSON.stringify(rememberData));
        console.log('💾 Datos de "Recuérdame" guardados');
        
        // Mostrar notificación sutil solo si se solicita
        if (showNotifications && typeof showNotification === 'function') {
            showNotification('Tus datos de acceso serán recordados por 30 días', 'info', '🔒 Datos Recordados');
        }
    } else {
        localStorage.removeItem('alkewallet_remember');
        console.log('🗑️ Datos de "Recuérdame" eliminados');
        
        // Mostrar notificación de limpieza solo si se solicita
        if (showNotifications && typeof showNotification === 'function') {
            showNotification('Ya no recordaremos tus datos de acceso', 'info', '🚫 Datos Olvidados');
        }
    }
}

function loadRememberMeData() {
    try {
        const rememberData = localStorage.getItem('alkewallet_remember');
        if (rememberData) {
            const data = JSON.parse(rememberData);
            const now = new Date().getTime();
            const daysPassed = (now - data.timestamp) / (1000 * 60 * 60 * 24);
            
            // Los datos se mantienen por 30 días
            if (daysPassed < 30) {
                const emailField = document.getElementById('email');
                const rememberCheckbox = document.getElementById('rememberMe');
                
                if (emailField && data.email) {
                    emailField.value = data.email;
                    emailField.classList.add('pre-filled');
                    emailField.focus();
                    // Enfocar el campo de contraseña después de un momento
                    setTimeout(() => {
                        const passwordField = document.getElementById('password');
                        if (passwordField) passwordField.focus();
                        // Remover clase visual después de la animación
                        setTimeout(() => emailField.classList.remove('pre-filled'), 600);
                    }, 100);
                }
                
                if (rememberCheckbox) {
                    rememberCheckbox.checked = true;
                }
                
                console.log('✅ Datos de "Recuérdame" cargados:', data.email);
                
                // Mostrar notificación de bienvenida sutil
                setTimeout(() => {
                    if (typeof showNotification === 'function') {
                        showNotification('Hemos precargado tu email. Solo ingresa tu contraseña.', 'success', '👋 ¡Bienvenido de vuelta!');
                    }
                }, 500);
                
                return data;
            } else {
                // Datos expirados, limpiar
                localStorage.removeItem('alkewallet_remember');
                console.log('🗑️ Datos de "Recuérdame" expirados y eliminados');
            }
        }
    } catch (error) {
        console.error('❌ Error cargando datos de "Recuérdame":', error);
        localStorage.removeItem('alkewallet_remember');
    }
    return null;
}

function clearRememberMeData() {
    localStorage.removeItem('alkewallet_remember');
    console.log('🗑️ Datos de "Recuérdame" limpiados');
}

// Manejo de login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email')?.value?.trim();
    const password = document.getElementById('password')?.value?.trim();
    const rememberMe = document.getElementById('rememberMe')?.checked || false;

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
                // Guardar datos de "Recuérdame" si está marcado
                saveRememberMeData(email, rememberMe, false); // Sin notificación durante login
                
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
    // Verificar si debe mantener los datos de "Recuérdame"
    const rememberData = localStorage.getItem('alkewallet_remember');
    const shouldKeepRemember = rememberData !== null;
    
    if (window.sessionManager) {
        window.sessionManager.logout();
    }
    
    // Si no hay datos de "Recuérdame", o si el usuario desmarcó la opción, limpiar
    if (!shouldKeepRemember) {
        clearRememberMeData();
    }
    
    window.location.href = './index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Cargar datos de "Recuérdame" al inicializar la página
    loadRememberMeData();
    
    // Agregar listener al checkbox de "Recuérdame"
    const rememberCheckbox = document.getElementById('rememberMe');
    if (rememberCheckbox) {
        rememberCheckbox.addEventListener('change', (e) => {
            const emailField = document.getElementById('email');
            const currentEmail = emailField?.value?.trim();
            
            if (!e.target.checked) {
                // Si se desmarca, limpiar datos guardados
                clearRememberMeData();
            } else if (currentEmail) {
                // Si se marca y ya hay email, guardar inmediatamente
                saveRememberMeData(currentEmail, true, true);
            }
        });
    }
    
    // Listener para guardar email cuando se modifica y "Recuérdame" está marcado
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', () => {
            const rememberMe = document.getElementById('rememberMe')?.checked;
            const email = emailField.value?.trim();
            
            if (rememberMe && email) {
                saveRememberMeData(email, true, false); // Sin notificación durante escritura
            }
        });
    }

    document.querySelectorAll('.logout-trigger, a[href*="index.html"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.classList.contains('logout-trigger') || btn.textContent.toLowerCase().includes('cerrar')) {
                e.preventDefault();
                handleLogout();
            }
        });
    });
    
    // Funcionalidad para mostrar/ocultar contraseña con jQuery
    initializePasswordToggle();
});

// Función para inicializar el toggle de contraseña
function initializePasswordToggle() {
    $(document).ready(function() {
        console.log('🔐 Inicializando toggle de contraseña');
        
        // Manejar click en el botón de toggle
        $('.password-toggle').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const $button = $(this);
            const $passwordInput = $('#password');
            const $icon = $('#password-icon');
            
            if ($passwordInput.length && $icon.length) {
                const currentType = $passwordInput.attr('type');
                
                if (currentType === 'password') {
                    // Mostrar contraseña
                    $passwordInput.attr('type', 'text');
                    $icon.removeClass('fa-eye').addClass('fa-eye-slash');
                    $button.attr('title', 'Ocultar contraseña');
                    console.log('👁️ Contraseña visible');
                } else {
                    // Ocultar contraseña
                    $passwordInput.attr('type', 'password');
                    $icon.removeClass('fa-eye-slash').addClass('fa-eye');
                    $button.attr('title', 'Mostrar contraseña');
                    console.log('🙈 Contraseña oculta');
                }
                
                // Mantener el foco en el input de contraseña
                $passwordInput.focus();
            }
        });
        
        // Ocultar contraseña cuando se pierde el foco del campo (opcional - para mayor seguridad)
        $('#password').on('blur', function() {
            const $passwordInput = $(this);
            const $icon = $('#password-icon');
            const $button = $('.password-toggle');
            
            // Solo ocultar si se está mostrando como texto
            if ($passwordInput.attr('type') === 'text') {
                setTimeout(() => {
                    // Verificar si el botón toggle no tiene foco antes de ocultar
                    if (!$button.is(':focus')) {
                        $passwordInput.attr('type', 'password');
                        $icon.removeClass('fa-eye-slash').addClass('fa-eye');
                        $button.attr('title', 'Mostrar contraseña');
                        console.log('🔒 Contraseña auto-oculta por seguridad');
                    }
                }, 150);
            }
        });
        
        // Prevenir que el botón toggle quite el foco del input
        $('.password-toggle').on('mousedown', function(e) {
            e.preventDefault();
        });
        
        // Establecer título inicial
        $('.password-toggle').attr('title', 'Mostrar contraseña');
    });
}