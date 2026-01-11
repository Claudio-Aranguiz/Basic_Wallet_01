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
            if (window.sessionManager) {
                await window.sessionManager.readyPromise;

                this.database = window.sessionManager.database;
                this.currentUser = window.sessionManager.currentUser;

                if (this.currentUser) {
                    this.loadTransactions();
                    console.log('✅ SendMoneyManager inicializado');
                }
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

        // Obtener saldo actualizado de TransactionManager para la validación
        let currentBalance = this.currentUser ? this.currentUser.balance : 0;
        if (window.transactionManager && this.currentUser) {
            currentBalance = window.transactionManager.calculateUserBalance(this.currentUser.email);
        }

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

    // Mostrar diálogo de confirmación (Modal Personalizado)
    showConfirmationDialog(contact, amount, concept) {
        const formattedAmount = window.sessionManager.formatCurrency(amount);

        // Crear modal dinámicamente con estilo Glassmorphism (consistente con depositManager)
        const modalHTML = `
        <div class="modal fade" id="transferConfirmModal" tabindex="-1" role="dialog" aria-labelledby="transferConfirmModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content text-white border-primary shadow-lg glass-modal-content">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title text-primary fw-bold" id="transferConfirmModalLabel">
                            <i class="fas fa-paper-plane mr-2"></i>Confirmar Transferencia
                        </h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body text-center pt-4">
                        <div class="mb-4">
                            <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 bg-send-accent icon-circle-lg">
                                <i class="fas fa-exchange-alt fa-2x text-primary"></i>
                            </div>
                            <h2 class="text-white fw-bold">${formattedAmount}</h2>
                            <p class="text-muted italic">Monto a enviar</p>
                        </div>
                        
                        <div class="row text-start px-3">
                            <div class="col-12 p-3 rounded-3 bg-white-translucent-low">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-muted">Destinatario:</span>
                                    <span class="fw-bold text-white">${contact.name}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-muted">Email:</span>
                                    <span class="text-muted small">${contact.email}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-muted">Concepto:</span>
                                    <span class="text-white">${concept}</span>
                                </div>
                                <div class="d-flex justify-content-between mt-3 pt-2 border-top border-secondary">
                                    <span class="text-muted">Comisión:</span>
                                    <span class="text-success fw-bold">Gratis</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 justify-content-center pb-4">
                        <button type="button" class="btn btn-outline-light px-4" data-dismiss="modal">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-primary px-4 fw-bold" id="confirmTransferBtn">
                            Enviar Dinero
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Agregar modal al DOM si no existe
        let existingModal = document.getElementById('transferConfirmModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Configurar evento del botón confirmar
        document.getElementById('confirmTransferBtn').addEventListener('click', () => {
            const btn = document.getElementById('confirmTransferBtn');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';

            // Cerrar modal y ejecutar
            setTimeout(() => {
                $('#transferConfirmModal').modal('hide');
                this.executeTransfer(contact, amount, concept);
            }, 1000);
        });

        // Mostrar modal
        $('#transferConfirmModal').modal('show');
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
        const formattedAmount = window.sessionManager.formatCurrency(amount);

        // Usar solo notificaciones para evitar redundancia
        if (typeof showNotification === 'function') {
            showNotification(
                `Transferencia de ${formattedAmount} enviada exitosamente a ${contact.name}`,
                'success',
                'Transferencia Exitosa'
            );
        }
    }

    // Mostrar mensaje de error
    showError(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'error', 'Error en Transferencia');
        } else {
            console.error('❌ Error de transferencia:', message);
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