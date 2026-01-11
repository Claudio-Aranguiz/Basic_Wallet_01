/**
 * transactionManager.js - Sistema de gestión de transacciones AlkeWallet
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
    }

    loadTransactionsFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.transactions = JSON.parse(stored);
            } else {
                this.initializeDefaultTransactions();
            }
        } catch (error) {
            console.error('❌ Error cargando transacciones:', error);
            this.initializeDefaultTransactions();
        }
    }

    initializeDefaultTransactions() {
        this.transactions = [
            { id: 'tx_001', userId: 'juan.perez@email.com', date: '2025-12-22', time: '14:30:00', type: 'deposit', description: 'Sucursal Central', amount: 50000.00, status: 'completed', timestamp: new Date('2025-12-22T14:30:00').getTime() },
            { id: 'tx_002', userId: 'juan.perez@email.com', date: '2025-12-21', time: '09:15:00', type: 'transfer', description: 'Transferencia a María González', amount: -15500.00, status: 'completed', timestamp: new Date('2025-12-21T09:15:00').getTime() },
            { id: 'tx_003', userId: 'juan.perez@email.com', date: '2025-12-20', time: '16:45:00', type: 'deposit', description: 'ATM Plaza Central', amount: 25000.00, status: 'completed', timestamp: new Date('2025-12-20T16:45:00').getTime() }
        ];
        this.saveTransactionsToStorage();
    }

    saveTransactionsToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.transactions));
        } catch (error) {
            console.error('❌ Error guardando transacciones:', error);
        }
    }

    addTransaction(transactionData) {
        const transaction = {
            id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            userId: transactionData.userId,
            date: transactionData.date || new Date().toISOString().split('T')[0],
            time: transactionData.time || new Date().toTimeString().split(' ')[0],
            type: transactionData.type,
            description: transactionData.description,
            amount: transactionData.amount,
            status: transactionData.status || 'completed',
            timestamp: transactionData.timestamp || Date.now()
        };

        this.transactions.unshift(transaction);
        this.saveTransactionsToStorage();
        return transaction;
    }

    getUserTransactions(userId, limit = null) {
        const userTransactions = this.transactions
            .filter(tx => tx.userId === userId)
            .sort((a, b) => b.timestamp - a.timestamp);

        return limit ? userTransactions.slice(0, limit) : userTransactions;
    }

    calculateUserBalance(userId, initialBalance = 173249.50) {
        const userTransactions = this.getUserTransactions(userId);
        const totalMovements = userTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        return initialBalance + totalMovements;
    }

    formatAmount(amount) {
        const isPositive = amount >= 0;
        const formattedAmount = window.sessionManager ?
            window.sessionManager.formatCurrency(Math.abs(amount)) :
            `$${Math.abs(amount).toLocaleString('es-CO')}`;

        return {
            text: `${isPositive ? '+' : '-'}${formattedAmount}`,
            class: isPositive ? 'text-success' : 'text-danger'
        };
    }

    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
}

window.transactionManager = new TransactionManager();

console.log('🎯 TransactionManager cargado y disponible globalmente');