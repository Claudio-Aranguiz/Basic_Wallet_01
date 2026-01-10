// notifications.js - Sistema de notificaciones y animaciones con jQuery para AlkeWallet

$(document).ready(function() {
    console.log('Sistema de notificaciones AlkeWallet inicializado');
    
    // Variables de control para evitar duplicados
    let isProcessingClick = false;
    let lastClickTime = 0;
    
    // Configuración global de notificaciones
    const notificationConfig = {
        duration: 3000, // Duración en milisegundos
        fadeSpeed: 300, // Velocidad de fade in/out
        position: 'top-right' // Posición de las notificaciones
    };

    // Función para crear contenedor de notificaciones si no existe
    function createNotificationContainer() {
        if ($('#notification-container').length === 0) {
            const container = $(`
                <div id="notification-container" style="
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    z-index: 9999;
                    max-width: 350px;
                    min-width: 280px;
                "></div>
            `);
            $('body').append(container);
        }
    }

    // Función principal para mostrar notificaciones
    function showNotification(message, type = 'info', title = '') {
        createNotificationContainer();
        
        // Tipos de notificación y sus estilos
        const types = {
            'info': {
                class: 'alert-info',
                icon: 'fas fa-info-circle',
                bgColor: '#d1ecf1',
                borderColor: '#bee5eb',
                textColor: '#0c5460'
            },
            'success': {
                class: 'alert-success',
                icon: 'fas fa-check-circle',
                bgColor: '#d4edda',
                borderColor: '#c3e6cb',
                textColor: '#155724'
            },
            'warning': {
                class: 'alert-warning',
                icon: 'fas fa-exclamation-triangle',
                bgColor: '#fff3cd',
                borderColor: '#ffeaa7',
                textColor: '#856404'
            },
            'error': {
                class: 'alert-danger',
                icon: 'fas fa-times-circle',
                bgColor: '#f8d7da',
                borderColor: '#f5c6cb',
                textColor: '#721c24'
            },
            'coming-soon': {
                class: 'alert-primary',
                icon: 'fas fa-clock',
                bgColor: '#cce7ff',
                borderColor: '#b8daff',
                textColor: '#004085'
            }
        };
        
        const typeConfig = types[type] || types['info'];
        const notificationId = 'notification-' + Date.now();
        
        // Crear elemento de notificación
        const notification = $(`
            <div id="${notificationId}" class="alert ${typeConfig.class} alert-dismissible fade show mb-3" 
                 role="alert" style="
                    border-left: 4px solid ${typeConfig.borderColor};
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    animation: slideInRight 0.3s ease-out;
                    position: relative;
                    overflow: hidden;
                ">
                <div class="d-flex align-items-center">
                    <i class="${typeConfig.icon} me-2" style="font-size: 1.1rem;"></i>
                    <div class="flex-grow-1">
                        ${title ? `<strong class="d-block">${title}</strong>` : ''}
                        <span style="font-size: 0.9rem;">${message}</span>
                    </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                <div class="progress-bar" style="
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background: ${typeConfig.borderColor};
                    transition: width ${notificationConfig.duration}ms linear;
                    width: 100%;
                "></div>
            </div>
        `);
        
        // Agregar al contenedor
        $('#notification-container').append(notification);
        
        // Animar la barra de progreso
        setTimeout(() => {
            notification.find('.progress-bar').css('width', '0%');
        }, 100);
        
        // Auto-cerrar después del tiempo configurado
        setTimeout(() => {
            notification.fadeOut(notificationConfig.fadeSpeed, function() {
                $(this).remove();
            });
        }, notificationConfig.duration);
        
        // Manejar clic en cerrar manualmente
        notification.find('.btn-close').on('click', function() {
            notification.fadeOut(notificationConfig.fadeSpeed, function() {
                $(this).remove();
            });
        });
    }

    // Función específica para "Próximamente"
    function showComingSoonNotification(feature = 'Esta funcionalidad') {
        showNotification(
            `${feature} estará disponible en futuras versiones de AlkeWallet.`,
            'coming-soon',
            'Próximamente 🚀'
        );
    }

    // Event listener para el avatar del usuario - CORREGIDO para evitar duplicidad
    $(document).on('click', '.navbar-brand[title*="perfil"]', function(e) {
        e.preventDefault(); // Prevenir navegación
        e.stopPropagation(); // Prevenir bubbling
        
        // Control de duplicados - evitar clics múltiples rápidos
        const currentTime = Date.now();
        if (isProcessingClick || (currentTime - lastClickTime) < 1000) {
            console.log('Click duplicado ignorado');
            return false;
        }
        
        isProcessingClick = true;
        lastClickTime = currentTime;
        
        // Agregar efecto de click al avatar
        const $avatar = $(this).find('.rounded-circle');
        $avatar.addClass('animate__pulse');
        
        // Mostrar notificación
        showComingSoonNotification('Configuración de perfil');
        
        // Remover animación y liberar el control después de un momento
        setTimeout(() => {
            $avatar.removeClass('animate__pulse');
            isProcessingClick = false;
        }, 1000);
        
        return false; // Doble seguridad para prevenir propagación
    });

    // Función para notificación de funciones en desarrollo
    window.showDevelopmentNotification = function(featureName) {
        showNotification(
            `La función "${featureName}" está actualmente en desarrollo.`,
            'info',
            'En desarrollo 🔧'
        );
    };

    // Función para notificación de éxito
    window.showSuccessNotification = function(message, title = '¡Éxito!') {
        showNotification(message, 'success', title);
    };

    // Función para notificación de error
    window.showErrorNotification = function(message, title = 'Error') {
        showNotification(message, 'error', title);
    };

    // Función para notificación de advertencia
    window.showWarningNotification = function(message, title = 'Advertencia') {
        showNotification(message, 'warning', title);
    };

    // Exponer función principal globalmente
    window.showNotification = showNotification;
    window.showComingSoonNotification = showComingSoonNotification;

    // Añadir estilos CSS para animaciones
    if ($('#notification-styles').length === 0) {
        $(`<style id="notification-styles">
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .user-avatar:hover .rounded-circle {
                transform: scale(1.05);
                transition: transform 0.2s ease;
                cursor: pointer;
            }
            
            .user-avatar .rounded-circle {
                transition: transform 0.2s ease;
            }
            
            .animate__pulse {
                animation: pulse 0.6s ease-in-out;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            #notification-container .alert {
                border-radius: 8px;
                font-family: 'Montserrat', sans-serif;
            }
            
            #notification-container .progress-bar {
                border-radius: 0 0 4px 4px;
            }
        </style>`).appendTo('head');
    }

    console.log('✅ Sistema de notificaciones listo');
});

// Funciones de utilidad disponibles globalmente
$(document).ready(function() {
    // Ejemplo de uso en consola:
    // showNotification('Mensaje de prueba', 'info', 'Título opcional');
    // showComingSoonNotification('Configuración avanzada');
    // showSuccessNotification('Operación completada');
    // showErrorNotification('Error en la operación');
    // showWarningNotification('Advertencia importante');
});