/**
 * Gestor de Envío de Dinero - AlkeWallet
 * Conectado con database.js y sessionManager.js
 */

class SendMoneyManager {
    constructor() {
        this.currentUser = null;
        this.database = null;
        this.transactions = [];
        
        this.initializeFromSession();
        this.initializeEvents();
    }

    // Inicializar desde sessionManager
    async initializeFromSession() {
        try {
            if (window.sessionManager && window.sessionManager.database) {
                this.database = window.sessionManager.database;
                this.currentUser = window.sessionManager.currentUser;
                
                if (this.currentUser) {
                    this.loadTransactions();
                    console.log('✅ SendMoneyManager inicializado para usuario:', this.currentUser.firstName);
                } else {
                    console.error('❌ Usuario no encontrado en sessionManager');
                }
            } else {
                console.log('⏳ Esperando SessionManager para SendMoney...');
                setTimeout(() => this.initializeFromSession(), 1000);
            }
        } catch (error) {
            console.error('❌ Error inicializando SendMoneyManager:', error);
        }
    }

    // Cargar transacciones desde database
    loadTransactions() {
        if (this.database && this.database.transactions) {
            this.transactions = this.database.transactions;
            console.log('💳 Transacciones cargadas:', this.transactions.length);
        }
    }

    // Inicializar eventos
    initializeEvents() {
        const sendButton = document.getElementById('btn-send-money');
        if (sendButton) {
            sendButton.addEventListener('click', () => {
                this.processSendMoney();
            });
        }

        // Validación en tiempo real del monto
        const amountInput = document.getElementById('send-amount');
        if (amountInput) {
            amountInput.addEventListener('input', (e) => {
                this.validateAmount(e.target.value);
            });
        }
    }

    // Validar monto
    validateAmount(amount) {
        const amountInput = document.getElementById('send-amount');
        const sendButton = document.getElementById('btn-send-money');
        
        const numAmount = parseFloat(amount);
        const currentBalance = this.currentUser ? this.currentUser.balance : 0;
        
        let isValid = true;
        let errorMessage = '';

        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            isValid = false;
            errorMessage = 'Ingrese un monto válido';
        } else if (numAmount < 1000) {
            isValid = false;
            errorMessage = 'El monto mínimo es $1.000';
        } else if (numAmount > 1000000) {
            isValid = false;
            errorMessage = 'El monto máximo es $1.000.000';
        } else if (numAmount > currentBalance) {
            isValid = false;
            errorMessage = 'Saldo insuficiente';
        }

        // Actualizar estilos del input
        if (amountInput) {
            if (amount && !isValid) {
                amountInput.classList.add('is-invalid');
                amountInput.classList.remove('is-valid');
            } else if (amount && isValid) {
                amountInput.classList.add('is-valid');
                amountInput.classList.remove('is-invalid');
            } else {
                amountInput.classList.remove('is-valid', 'is-invalid');
            }
        }

        // Habilitar/deshabilitar botón
        if (sendButton) {
            const hasContact = (window.contactManager && window.contactManager.selectedContact) ||
                             (typeof contactManager !== 'undefined' && contactManager.selectedContact);
            sendButton.disabled = !isValid || !hasContact;
            
            console.log('🔘 Botón estado - Monto válido:', isValid, 'Contacto seleccionado:', !!hasContact);
        }

        return { isValid, errorMessage };
    }

    // Procesar envío de dinero
    processSendMoney() {
        console.log('💰 Procesando envío de dinero...');
        console.log('🔍 window.contactManager existe:', !!window.contactManager);
        console.log('🔍 contactManager global existe:', typeof contactManager !== 'undefined');
        
        const selectedContact = window.contactManager?.selectedContact || 
                               (typeof contactManager !== 'undefined' ? contactManager.selectedContact : null);
        
        console.log('👤 Contacto seleccionado:', selectedContact);
        
        if (!selectedContact) {
            console.error('❌ No hay contacto seleccionado');
            this.showError('Debe seleccionar un contacto para realizar la transferencia');
            return;
        }

        const amountInput = document.getElementById('send-amount');
        const conceptInput = document.getElementById('send-concept');
        
        if (!amountInput || !conceptInput) {
            this.showError('Error en el formulario');
            return;
        }

        const amount = parseFloat(amountInput.value);
        const concept = conceptInput.value.trim() || 'Transferencia';

        // Validar monto
        const validation = this.validateAmount(amount);
        if (!validation.isValid) {
            this.showError(validation.errorMessage);
            return;
        }

        // Confirmar transferencia
        this.showConfirmationDialog(selectedContact, amount, concept);
    }

    // Mostrar diálogo de confirmación
    showConfirmationDialog(contact, amount, concept) {
        const confirmMessage = `¿Confirma la transferencia de $${amount.toLocaleString('es-CL', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })} a ${contact.name}?\n\nConcepto: ${concept}`;

        if (confirm(confirmMessage)) {
            this.executeTransfer(contact, amount, concept);
        }
    }

    // Ejecutar transferencia REAL
    executeTransfer(contact, amount, concept) {
        try {
            if (!this.currentUser || !this.database) {
                throw new Error('Sistema no inicializado correctamente');
            }

            // Verificar saldo suficiente
            if (this.currentUser.balance < amount) {
                throw new Error('Saldo insuficiente');
            }

            // Buscar usuario destinatario en database
            const recipientUser = this.database.users.find(u => u.id === contact.id);
            if (!recipientUser) {
                throw new Error('Usuario destinatario no encontrado');
            }

            // Crear nueva transacción
            const newTransaction = {
                id: this.database.transactions.length + 1,
                fromUserId: this.currentUser.id,
                toUserId: contact.id,
                amount: amount,
                type: 'transfer',
                description: concept,
                timestamp: new Date().toISOString(),
                status: 'completed',
                transactionCode: 'TXN' + String(Date.now()).slice(-6)
            };

            // Actualizar saldos
            this.currentUser.balance -= amount;
            recipientUser.balance += amount;

            // Agregar transacción
            this.database.transactions.push(newTransaction);
            this.transactions.push(newTransaction);

            // Registrar en TransactionManager para persistencia
            if (window.transactionManager) {
                window.transactionManager.addTransaction({
                    userId: this.currentUser.email,
                    type: 'transfer',
                    description: `Transferencia a ${contact.name}`,
                    recipient: contact.name,
                    recipientEmail: contact.email,
                    amount: -amount, // Negativo porque es un egreso
                    status: 'completed'
                });
                
                // También registrar la transacción del receptor
                window.transactionManager.addTransaction({
                    userId: contact.email,
                    type: 'transfer',
                    description: `Recibido de ${this.currentUser.firstName} ${this.currentUser.lastName}`,
                    recipient: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
                    recipientEmail: this.currentUser.email,
                    amount: amount, // Positivo porque es un ingreso
                    status: 'completed'
                });
                
                console.log('📊 Transacciones registradas en TransactionManager');
            }

            // Actualizar sessionManager
            if (window.sessionManager) {
                window.sessionManager.currentUser.balance = this.currentUser.balance;
                window.sessionManager.saveUserSession();
            }

            // Actualizar contactManager
            if (window.contactManager) {
                window.contactManager.updateBalanceFromSession();
            }

            // Actualizar database.js en memoria
            if (window.DATABASE) {
                const userIndex = window.DATABASE.users.findIndex(u => u.id === this.currentUser.id);
                const recipientIndex = window.DATABASE.users.findIndex(u => u.id === contact.id);
                
                if (userIndex !== -1) window.DATABASE.users[userIndex].balance = this.currentUser.balance;
                if (recipientIndex !== -1) window.DATABASE.users[recipientIndex].balance = recipientUser.balance;
                
                window.DATABASE.transactions.push(newTransaction);
            }

            // Mostrar mensaje de éxito
            this.showSuccess(contact, amount, newTransaction.transactionCode);
            
            // Limpiar formulario
            this.clearForm();
            
            console.log('✅ Transferencia exitosa:', newTransaction);

        } catch (error) {
            console.error('❌ Error en transferencia:', error);
            this.showError(error.message);
        }
    }

    // Mostrar mensaje de éxito
    showSuccess(contact, amount, transactionCode) {
        const message = `✅ ¡Transferencia exitosa!\n\nSe enviaron $${amount.toLocaleString('es-CL')} a ${contact.name}\nCódigo: ${transactionCode}`;
        alert(message);
        
        // También usar notificaciones si están disponibles
        if (typeof showNotification === 'function') {
            showNotification(`Transferencia de $${amount.toLocaleString('es-CL')} enviada a ${contact.name}`, 'success', 'Transferencia Exitosa');
        }
    }

    // Mostrar mensaje de error
    showError(message) {
        alert('❌ Error: ' + message);
        
        if (typeof showNotification === 'function') {
            showNotification(message, 'error', 'Error en Transferencia');
        }
    }

    // Limpiar formulario
    clearForm() {
        const amountInput = document.getElementById('send-amount');
        const conceptInput = document.getElementById('send-concept');
        
        if (amountInput) {
            amountInput.value = '';
            amountInput.classList.remove('is-valid', 'is-invalid');
        }
        
        if (conceptInput) {
            conceptInput.value = '';
        }

        // Deseleccionar contacto
        if (window.contactManager) {
            window.contactManager.selectedContact = null;
            window.contactManager.renderContacts();
        } else if (typeof contactManager !== 'undefined') {
            contactManager.selectedContact = null;
            contactManager.renderContacts();
        }

        // Deshabilitar botón
        const sendButton = document.getElementById('btn-send-money');
        if (sendButton) {
            sendButton.disabled = true;
        }
    }

    // Obtener historial de transacciones
    getTransactions() {
        return this.transactions;
    }
}

// Instancia global
let sendMoneyManager;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    sendMoneyManager = new SendMoneyManager();
    window.sendMoneyManager = sendMoneyManager; // Exponerlo globalmente
    console.log('✅ SendMoneyManager expuesto globalmente');
});