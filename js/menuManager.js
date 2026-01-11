/**
 * menuManager.js - Sistema de gestión del menú principal AlkeWallet
 * Conectado con sessionManager.js y transactionManager.js
 */

class MenuManager {
    constructor() {
        this.currentUser = null;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        console.log('🏠 Inicializando MenuManager');
        
        // Verificar dependencias
        if (!window.sessionManager) {
            console.error('❌ SessionManager no disponible');
            window.location.href = './login.html';
            return;
        }

        // Verificar autenticación
        if (!window.sessionManager.isAuthenticated) {
            console.log('❌ Usuario no autenticado, redirigiendo...');
            window.location.href = './login.html';
            return;
        }

        // Esperar a que TransactionManager esté disponible
        await this.waitForTransactionManager();

        // Obtener usuario actual
        this.currentUser = window.sessionManager.getCurrentUser();
        if (!this.currentUser) {
            console.error('❌ No se pudo obtener el usuario actual');
            window.location.href = './login.html';
            return;
        }

        this.isInitialized = true;
        console.log('✅ MenuManager inicializado correctamente');
        console.log('👤 Usuario actual:', `${this.currentUser.firstName} ${this.currentUser.lastName}`);
        
        // Inicializar interfaz
        this.initializeInterface();
    }

    // Esperar a que TransactionManager esté disponible
    async waitForTransactionManager() {
        let attempts = 0;
        const maxAttempts = 50; // 5 segundos máximo
        
        while (!window.transactionManager && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.transactionManager) {
            console.warn('⚠️ TransactionManager no disponible, usando saldo de sessionManager');
        }
    }

    // Inicializar la interfaz del menú
    initializeInterface() {
        // Actualizar información del usuario
        this.updateUserInfo();
        
        // Actualizar saldo
        this.updateBalanceDisplay();
        
        // Configurar botones de acción
        this.setupActionButtons();
        
        // Configurar actualizaciones automáticas
        this.setupAutoRefresh();
    }

    // Actualizar información del usuario
    updateUserInfo() {
        try {
            const userName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            const userSpan = document.querySelector('.navbar-brand span');
            if (userSpan) {
                userSpan.textContent = userName;
                console.log('👤 Usuario actualizado en navbar:', userName);
            }
        } catch (error) {
            console.error('❌ Error actualizando información del usuario:', error);
        }
    }

    // Actualizar saldo mostrado
    updateBalanceDisplay() {
        try {
            let currentBalance;
            
            // Intentar obtener saldo de TransactionManager primero
            if (window.transactionManager) {
                currentBalance = window.transactionManager.calculateUserBalance(this.currentUser.email);
                console.log('💰 Saldo obtenido de TransactionManager:', currentBalance);
            } else {
                // Fallback al saldo de sessionManager
                currentBalance = this.currentUser.balance || 173249.50;
                console.log('💰 Saldo obtenido de SessionManager:', currentBalance);
            }

            // Actualizar en el input del saldo
            const saldoInput = document.getElementById('inpsaldo');
            if (saldoInput) {
                const formattedBalance = currentBalance.toLocaleString('es-CO', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
                saldoInput.value = formattedBalance;
                saldoInput.setAttribute('readonly', true);
                console.log('💰 Saldo actualizado en input:', formattedBalance);
            }

            // Actualizar en el saldo principal si existe
            const mainBalanceElement = document.querySelector('.balance-display');
            if (mainBalanceElement) {
                const formattedBalance = currentBalance.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP'
                });
                mainBalanceElement.textContent = formattedBalance;
            }

        } catch (error) {
            console.error('❌ Error actualizando saldo:', error);
        }
    }

    // Configurar botones de acción
    setupActionButtons() {
        // Agregar eventos de tracking para analytics (opcional)
        const buttons = document.querySelectorAll('main a.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.textContent.trim();
                console.log('🔘 Botón presionado:', action);
                
                // Opcional: tracking de analytics
                this.trackButtonClick(action);
            });
        });
    }

    // Track button clicks (para futuras métricas)
    trackButtonClick(action) {
        // Aquí se podría implementar analytics
        console.log('📊 Acción registrada:', action, 'Usuario:', this.currentUser.email);
    }

    // Configurar actualización automática
    setupAutoRefresh() {
        // Actualizar saldo cada 30 segundos
        setInterval(() => {
            if (this.isInitialized && document.visibilityState === 'visible') {
                this.updateBalanceDisplay();
            }
        }, 30000);

        // Actualizar cuando la ventana regain focus
        window.addEventListener('focus', () => {
            if (this.isInitialized) {
                this.updateBalanceDisplay();
                console.log('🔄 Saldo actualizado por focus');
            }
        });

        // Actualizar cuando se recibe un evento de storage (desde otras pestañas)
        window.addEventListener('storage', (e) => {
            if (e.key === 'alkeWallet_transactions') {
                this.updateBalanceDisplay();
                console.log('🔄 Saldo actualizado por storage event');
            }
        });
    }

    // Refrescar datos manualmente
    refreshData() {
        console.log('🔄 Refrescando datos del menú...');
        this.updateUserInfo();
        this.updateBalanceDisplay();
    }

    // Obtener estadísticas rápidas del usuario
    getUserStats() {
        if (!window.transactionManager) {
            return null;
        }

        try {
            const transactions = window.transactionManager.getUserTransactions(this.currentUser.email, 10);
            const deposits = transactions.filter(tx => tx.type === 'deposit').length;
            const transfers = transactions.filter(tx => tx.type === 'transfer' && tx.amount < 0).length;
            
            return {
                totalTransactions: transactions.length,
                deposits,
                transfers,
                lastTransaction: transactions[0]
            };
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            return null;
        }
    }
}

// Variable global
window.menuManager = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    window.menuManager = new MenuManager();
    console.log('✅ MenuManager expuesto globalmente');
});

// Función global para refrescar el menú
window.refreshMenu = () => {
    if (window.menuManager) {
        window.menuManager.refreshData();
    }
};

console.log('🎯 MenuManager cargado');