/**
 * notifications.js - Sistema de notificaciones AlkeWallet
 */

$(document).ready(function () {
    console.log('🔔 Sistema de notificaciones inicializado');

    const NOTIFICATION_DURATION = 4000;
    const FADE_SPEED = 400;

    function createContainer() {
        if ($('#notification-container').length === 0) {
            $('body').append('<div id="notification-container"></div>');
        }
        return $('#notification-container');
    }

    window.showNotification = function (message, type = 'info', title = '') {
        const $container = createContainer();
        const notificationId = `notif-${Date.now()}`;

        const icons = {
            'info': 'fas fa-info-circle',
            'success': 'fas fa-check-circle',
            'warning': 'fas fa-exclamation-triangle',
            'error': 'fas fa-times-circle',
            'coming-soon': 'fas fa-clock'
        };

        const alertClass = type === 'coming-soon' ? 'alert-primary' : (type === 'error' ? 'alert-danger' : `alert-${type}`);
        const icon = icons[type] || icons.info;

        const $notification = $(`
            <div id="${notificationId}" class="alert ${alertClass} alert-dismissible fade show mb-3 glass-navbar border-0 shadow-lg" role="alert">
                <div class="d-flex align-items-start">
                    <i class="${icon} me-2 fs-5 mt-1"></i>
                    <div class="flex-grow-1">
                        ${title ? `<strong class="d-block">${title}</strong>` : ''}
                        <span class="small">${message}</span>
                    </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                <div class="progress-bar notification-progress"></div>
            </div>
        `);

        $container.append($notification);

        // Animar barra de progreso
        $notification.find('.notification-progress').animate({ width: '0%' }, NOTIFICATION_DURATION, 'linear');

        // Auto-remover
        const timer = setTimeout(() => {
            $notification.fadeOut(FADE_SPEED, () => $notification.remove());
        }, NOTIFICATION_DURATION);

        // Botón cerrar manual
        $notification.find('.btn-close').on('click', () => {
            clearTimeout(timer);
            $notification.fadeOut(FADE_SPEED, () => $notification.remove());
        });
    };

    window.showComingSoonNotification = (feature = 'Esta función') => {
        window.showNotification(`${feature} estará disponible próximamente en AlkeWallet.`, 'coming-soon', 'Próximamente 🚀');
    };

    // Shortcut utilities
    window.showSuccess = (msg, title = 'Éxito') => window.showNotification(msg, 'success', title);
    window.showError = (msg, title = 'Error') => window.showNotification(msg, 'error', title);
    window.showInfo = (msg, title = 'Información') => window.showNotification(msg, 'info', title);

    // Event listener para avatar / perfil (Coming Soon)
    $(document).on('click', 'a[title*="perfil"], .navbar-brand[title*="perfil"]', function (e) {
        e.preventDefault();
        window.showComingSoonNotification('La configuración de perfil');
    });

    console.log('✅ Notificaciones listas');
});