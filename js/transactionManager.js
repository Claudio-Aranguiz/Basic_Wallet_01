/**
 * transactionManager.js - Sistema de gestión de transacciones AlkeWallet
 * Maneja el historial de transacciones con persistencia en localStorage
 */

class TransactionManager {
    constructor() {
        this.transactions = [];
        this.storageKey = 'alkeWallet_transactions';
        this.init();
    }

    init() {
        this.loadTransactionsFromStorage();
        console.log('📊 TransactionManager inicializado');
        console.log('💾 Transacciones cargadas:', this.transactions.length);
    }

    /**
     * Carga las transacciones desde localStorage
     */
    loadTransactionsFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.transactions = JSON.parse(stored);
                console.log('✅ Transacciones cargadas desde localStorage:', this.transactions.length);
            } else {
                // Si no hay transacciones guardadas, inicializar con transacciones de ejemplo
                this.initializeDefaultTransactions();
            }
        } catch (error) {
            console.error('❌ Error cargando transacciones desde localStorage:', error);
            this.initializeDefaultTransactions();
        }
    }

    /**
     * Inicializa con transacciones de ejemplo
     */
    initializeDefaultTransactions() {
        this.transactions = [
            {
                id: 'tx_001',
                userId: 'juan.perez@email.com',
                date: '2025-12-22',
                time: '14:30:00',
                type: 'deposit',
                description: 'Sucursal Central',
                amount: 50000.00,
                status: 'completed',
                timestamp: new Date('2025-12-22 14:30:00').getTime()
            },
            {
                id: 'tx_002',
                userId: 'juan.perez@email.com',
                date: '2025-12-21',
                time: '09:15:00',
                type: 'transfer',
                description: 'Transferencia a María González',
                recipient: 'María González',
                recipientEmail: 'maria.gonzalez@email.com',
                amount: -15500.00,
                status: 'completed',
                timestamp: new Date('2025-12-21 09:15:00').getTime()
            },
            {
                id: 'tx_003',
                userId: 'juan.perez@email.com',
                date: '2025-12-20',
                time: '16:45:00',
                type: 'deposit',
                description: 'ATM Plaza Central',
                amount: 25000.00,
                status: 'completed',
                timestamp: new Date('2025-12-20 16:45:00').getTime()
            },
            {
                id: 'tx_004',
                userId: 'juan.perez@email.com',
                date: '2025-12-19',
                time: '11:20:00',
                type: 'payment',
                description: 'Supermercado La Cosecha',
                amount: -8750.50,
                status: 'completed',
                timestamp: new Date('2025-12-19 11:20:00').getTime()
            },
            {
                id: 'tx_005',
                userId: 'juan.perez@email.com',
                date: '2025-12-18',
                time: '08:30:00',
                type: 'transfer',
                description: 'Transferencia a Carlos Rodríguez',
                recipient: 'Carlos Rodríguez',
                recipientEmail: 'carlos.rodriguez@email.com',
                amount: -12000.00,
                status: 'completed',
                timestamp: new Date('2025-12-18 08:30:00').getTime()
            },
            {
                id: 'tx_006',
                userId: 'juan.perez@email.com',
                date: '2025-12-17',
                time: '00:01:00',
                type: 'salary',
                description: 'Empresa ABC S.A.',
                amount: 180000.00,
                status: 'completed',
                timestamp: new Date('2025-12-17 00:01:00').getTime()
            },
            {
                id: 'tx_007',
                userId: 'juan.perez@email.com',
                date: '2025-12-16',
                time: '23:59:00',
                type: 'fee',
                description: 'Mantenimiento de cuenta',
                amount: -2500.00,
                status: 'completed',
                timestamp: new Date('2025-12-16 23:59:00').getTime()
            },
            {
                id: 'tx_008',
                userId: 'juan.perez@email.com',
                date: '2025-12-15',
                time: '13:45:00',
                type: 'withdrawal',
                description: 'ATM Banco Nacional',
                amount: -30000.00,
                status: 'completed',
                timestamp: new Date('2025-12-15 13:45:00').getTime()
            }
        ];
        this.saveTransactionsToStorage();
        console.log('🔄 Transacciones de ejemplo inicializadas');
    }

    /**
     * Guarda las transacciones en localStorage
     */
    saveTransactionsToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.transactions));
            console.log('💾 Transacciones guardadas en localStorage');
        } catch (error) {
            console.error('❌ Error guardando transacciones en localStorage:', error);
        }
    }

    /**
     * Registra una nueva transacción
     */
    addTransaction(transactionData) {
        try {
            const transaction = {
                id: this.generateTransactionId(),
                userId: transactionData.userId,
                date: transactionData.date || new Date().toISOString().split('T')[0],
                time: transactionData.time || new Date().toTimeString().split(' ')[0],
                type: transactionData.type,
                description: transactionData.description,
                amount: transactionData.amount,
                status: transactionData.status || 'completed',
                timestamp: transactionData.timestamp || new Date().getTime()
            };

            // Agregar campos específicos según el tipo
            if (transactionData.recipient) {
                transaction.recipient = transactionData.recipient;
                transaction.recipientEmail = transactionData.recipientEmail;
            }

            this.transactions.unshift(transaction); // Agregar al inicio para mostrar las más recientes primero
            this.saveTransactionsToStorage();

            console.log('✅ Transacción registrada:', transaction);
            return transaction;
        } catch (error) {
            console.error('❌ Error registrando transacción:', error);
            throw error;
        }
    }

    /**
     * Obtiene las transacciones de un usuario específico
     */
    getUserTransactions(userId, limit = null) {
        try {
            const userTransactions = this.transactions
                .filter(tx => tx.userId === userId)
                .sort((a, b) => b.timestamp - a.timestamp); // Ordenar por más reciente

            if (limit) {
                return userTransactions.slice(0, limit);
            }

            return userTransactions;
        } catch (error) {
            console.error('❌ Error obteniendo transacciones del usuario:', error);
            return [];
        }
    }

    /**
     * Calcula el saldo actual del usuario basado en las transacciones
     */
    calculateUserBalance(userId, initialBalance = 173249.50) {
        try {
            const userTransactions = this.getUserTransactions(userId);
            const totalMovements = userTransactions.reduce((sum, tx) => sum + tx.amount, 0);
            return initialBalance + totalMovements;
        } catch (error) {
            console.error('❌ Error calculando saldo:', error);
            return initialBalance;
        }
    }

    /**
     * Genera un ID único para la transacción
     */
    generateTransactionId() {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        return `tx_${timestamp}_${random}`;
    }

    /**
     * Obtiene el tipo de badge para mostrar en la interfaz
     */
    getTransactionBadge(type) {
        const badges = {
            'deposit': { class: 'bg-success', text: 'Depósito' },
            'transfer': { class: 'bg-danger', text: 'Transferencia' },
            'payment': { class: 'bg-warning', text: 'Pago' },
            'salary': { class: 'bg-primary', text: 'Salario' },
            'fee': { class: 'bg-secondary', text: 'Comisión' },
            'withdrawal': { class: 'bg-danger', text: 'Retiro' }
        };

        return badges[type] || { class: 'bg-info', text: 'Transacción' };
    }

    /**
     * Formatea el monto para mostrar en la interfaz
     */
    formatAmount(amount) {
        const isPositive = amount >= 0;
        const formattedAmount = Math.abs(amount).toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP'
        });

        return {
            text: `${isPositive ? '+' : '-'}${formattedAmount}`,
            class: isPositive ? 'text-success' : 'text-danger'
        };
    }

    /**
     * Formatea la fecha para mostrar en la interfaz
     */
    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

// Crear instancia global del TransactionManager
window.transactionManager = new TransactionManager();

console.log('🎯 TransactionManager cargado y disponible globalmente');