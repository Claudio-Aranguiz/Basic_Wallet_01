/**
 * transactions.js - Interfaz de transacciones AlkeWallet
 * Conectado con transactionManager.js y sessionManager.js
 */

$(document).ready(function () {
    console.log('📊 Transactions.js inicializado');

    // Verificar autenticación
    if (!window.sessionManager || !window.sessionManager.isAuthenticated) {
        console.log('❌ Usuario no autenticado, redirigiendo...');
        window.location.href = './login.html';
        return;
    }

    // Verificar que TransactionManager esté disponible
    if (!window.transactionManager) {
        console.error('❌ TransactionManager no disponible');
        showError('Error del sistema. Recarga la página e intenta nuevamente.');
        return;
    }

    // Inicializar interfaz
    initializeTransactionsPage();
});

/**
 * Inicializa la página de transacciones
 */
function initializeTransactionsPage() {
    console.log('🚀 Inicializando página de transacciones');

    const currentUser = window.sessionManager.getCurrentUser();
    if (!currentUser) {
        console.error('❌ No se pudo obtener el usuario actual');
        return;
    }

    // Actualizar saldo
    updateUserBalance(currentUser.email);

    // Cargar y mostrar transacciones
    loadAndDisplayTransactions(currentUser.email);

    // Actualizar información del usuario en la navbar
    updateUserInfo(currentUser);
}

/**
 * Actualiza el saldo del usuario
 */
function updateUserBalance(userId) {
    try {
        const balance = window.transactionManager.calculateUserBalance(userId);
        const formattedBalance = balance.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP'
        });

        $('.balance-summary h2').text(formattedBalance);
        console.log('💰 Saldo actualizado:', formattedBalance);
    } catch (error) {
        console.error('❌ Error actualizando saldo:', error);
    }
}

/**
 * Carga y muestra las transacciones del usuario
 */
function loadAndDisplayTransactions(userId) {
    try {
        const transactions = window.transactionManager.getUserTransactions(userId);
        console.log('📋 Transacciones del usuario:', transactions.length);

        if (transactions.length === 0) {
            showNoTransactions();
            return;
        }

        renderTransactions(transactions);
    } catch (error) {
        console.error('❌ Error cargando transacciones:', error);
        showError('Error cargando las transacciones. Intenta recargar la página.');
    }
}

/**
 * Renderiza las transacciones en la tabla
 */
function renderTransactions(transactions) {
    const tbody = $('table tbody');
    tbody.empty();

    transactions.forEach(transaction => {
        const row = createTransactionRow(transaction);
        tbody.append(row);
    });

    console.log('✅ Transacciones renderizadas:', transactions.length);
}

/**
 * Crea una fila de transacción para la tabla
 */
function createTransactionRow(transaction) {
    const badge = window.transactionManager.getTransactionBadge(transaction.type);
    const amount = window.transactionManager.formatAmount(transaction.amount);
    const date = window.transactionManager.formatDate(transaction.date);

    return `
        <tr data-transaction-id="${transaction.id}">
            <td class="fw-semibold">${date}</td>
            <td>
                <span class="badge ${badge.class} rounded-pill">${badge.text}</span>
            </td>
            <td>${transaction.description}</td>
            <td class="${amount.class} fw-bold text-end">${amount.text}</td>
        </tr>
    `;
}

/**
 * Muestra mensaje cuando no hay transacciones
 */
function showNoTransactions() {
    const tbody = $('table tbody');
    tbody.html(`
        <tr>
            <td colspan="4" class="text-center text-muted py-5">
                <i class="fas fa-inbox fa-3x mb-3"></i>
                <p class="mb-0">No hay transacciones registradas</p>
                <small>Las transacciones aparecerán aquí cuando realices operaciones</small>
            </td>
        </tr>
    `);
}

/**
 * Actualiza la información del usuario en la navbar
 */
function updateUserInfo(user) {
    const userName = `${user.firstName} ${user.lastName}`;
    $('.navbar-brand span').text(userName);
    console.log('👤 Usuario actualizado en navbar:', userName);
}

/**
 * Muestra un mensaje de error
 */
function showError(message) {
    console.error('❌ Error:', message);

    if (typeof showNotification === 'function') {
        showNotification(message, 'error', 'Error en Historial');
    }
}

/**
 * Actualiza las transacciones - función llamada desde otras páginas
 */
function refreshTransactions() {
    if (window.sessionManager && window.sessionManager.isAuthenticated) {
        const currentUser = window.sessionManager.getCurrentUser();
        if (currentUser) {
            updateUserBalance(currentUser.email);
            loadAndDisplayTransactions(currentUser.email);
            console.log('🔄 Transacciones actualizadas');
        }
    }
}

// Exponer funciones globalmente para uso externo
window.refreshTransactions = refreshTransactions;

console.log('🎯 Transactions.js cargado completamente');