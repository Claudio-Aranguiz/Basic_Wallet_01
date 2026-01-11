/**
 * depositManager.js - Sistema de gestión de depósitos AlkeWallet
 * Conectado con transactionManager.js y sessionManager.js
 */

class DepositManager {
    constructor() {
        this.currentUser = null;
        this.database = null;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        console.log('💰 Inicializando DepositManager');

        // Obtener usuario actual
        if (window.sessionManager) {
            await window.sessionManager.readyPromise;
            this.currentUser = window.sessionManager.getCurrentUser();
            this.database = window.sessionManager.database || window.DATABASE;
        }

        if (!this.currentUser) {
            console.error('❌ No hay usuario logueado');
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = './login.html';
            }
            return;
        }

        this.isInitialized = true;
        console.log('✅ DepositManager inicializado');

        // Actualizar UI
        this.updateBalanceDisplay();
        this.setupEventListeners();
    }

    // Configurar event listeners
    setupEventListeners() {
        const depositForm = document.getElementById('depositForm');
        if (depositForm) {
            depositForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleDepositSubmission();
            });
        }

        const amountInput = document.getElementById('depositAmount');
        if (amountInput) {
            amountInput.addEventListener('input', (e) => this.validateAmount(e.target.value));
            amountInput.addEventListener('blur', (e) => this.formatAmountInput(e.target));
        }

        const qrBtn = document.getElementById('scanQRBtn');
        if (qrBtn) {
            qrBtn.addEventListener('click', () => this.handleQRScan());
        }
    }

    // Actualizar saldo mostrado
    updateBalanceDisplay() {
        try {
            const balanceElement = document.querySelector('.current-balance h2');
            if (balanceElement && this.currentUser && window.sessionManager) {
                const currentBalance = window.transactionManager ?
                    window.transactionManager.calculateUserBalance(this.currentUser.email) :
                    this.currentUser.balance;

                balanceElement.textContent = window.sessionManager.formatCurrency(currentBalance);
            }
        } catch (error) {
            console.error('❌ Error actualizando saldo:', error);
        }
    }

    // Validar monto de depósito
    validateAmount(amount) {
        const amountInput = document.getElementById('depositAmount');
        let isValid = true;
        let errorMessage = '';
        const numAmount = parseFloat(amount);

        if (!amount || isNaN(numAmount)) {
            isValid = false;
            errorMessage = 'Ingrese un monto válido';
        } else if (numAmount < 1000) {
            isValid = false;
            errorMessage = 'El monto mínimo de depósito es $1,000';
        } else if (numAmount > 5000000) {
            isValid = false;
            errorMessage = 'El monto máximo de depósito es $5,000,000';
        }

        if (amountInput) {
            if (amount && !isValid) {
                amountInput.classList.add('is-invalid');
                amountInput.classList.remove('is-valid');
                let feedback = amountInput.parentNode.parentNode.querySelector('.invalid-feedback');
                if (!feedback) {
                    feedback = document.createElement('div');
                    feedback.className = 'invalid-feedback';
                    amountInput.parentNode.parentNode.appendChild(feedback);
                }
                feedback.textContent = errorMessage;
            } else if (amount && isValid) {
                amountInput.classList.add('is-valid');
                amountInput.classList.remove('is-invalid');
                const feedback = amountInput.parentNode.parentNode.querySelector('.invalid-feedback');
                if (feedback) feedback.remove();
            } else {
                amountInput.classList.remove('is-valid', 'is-invalid');
            }
        }

        return { isValid, errorMessage };
    }

    // Formatear input de monto
    formatAmountInput(input) {
        const value = input.value;
        if (value && !isNaN(value)) {
            input.value = Math.round(parseFloat(value));
        }
    }

    // Manejar envío del formulario
    handleDepositSubmission() {
        if (!this.isInitialized) {
            this.showError('Sistema no inicializado correctamente');
            return;
        }

        const amountInput = document.getElementById('depositAmount');
        const methodSelect = document.getElementById('depositMethod');

        if (!amountInput || !methodSelect) return;

        const amount = parseFloat(amountInput.value);
        const method = methodSelect.value;

        if (!amount || !method) {
            this.showError('Por favor, completa todos los campos requeridos');
            return;
        }

        const validation = this.validateAmount(amount);
        if (!validation.isValid) {
            this.showError(validation.errorMessage);
            return;
        }

        this.showDepositModal(amount, method);
    }

    // Mostrar modal de confirmación
    showDepositModal(amount, method) {
        const methodNames = {
            'bank': 'Transferencia bancaria',
            'card': 'Tarjeta de crédito/débito',
            'paypal': 'PayPal',
            'crypto': 'Criptomoneda',
            'cash': 'Efectivo - Sucursal'
        };

        const formattedAmount = window.sessionManager.formatCurrency(amount);

        const modalHTML = `
        <div class="modal fade" id="depositConfirmModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content text-white border-info shadow-lg glass-modal-content">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title text-info fw-bold">
                            <i class="fas fa-plus-circle mr-2"></i>Confirmar Depósito
                        </h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body text-center pt-4">
                        <div class="mb-4">
                            <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 bg-deposit-accent icon-circle-lg">
                                <i class="fas fa-money-bill-wave fa-2x text-info"></i>
                            </div>
                            <h2 class="text-white fw-bold">${formattedAmount}</h2>
                            <p class="text-muted italic">Monto a depositar</p>
                        </div>
                        <div class="row text-start px-3">
                            <div class="col-12 p-3 rounded-3 bg-white-translucent-low">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-muted">Método:</span>
                                    <span class="fw-bold text-info">${methodNames[method] || method}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-muted">Comisión:</span>
                                    <span class="text-success fw-bold">$0 (Sin costo)</span>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span class="text-muted">Disponibilidad:</span>
                                    <span class="text-white">Inmediata</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 justify-content-center pb-4">
                        <button type="button" class="btn btn-outline-light px-4" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-info px-4 fw-bold" id="confirmDepositBtn">Confirmar Depósito</button>
                    </div>
                </div>
            </div>
        </div>`;

        let existingModal = document.getElementById('depositConfirmModal');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('confirmDepositBtn').addEventListener('click', () => this.executeDeposit(amount, method));
        $('#depositConfirmModal').modal('show');
    }

    // Ejecutar depósito
    async executeDeposit(amount, method) {
        const confirmBtn = document.getElementById('confirmDepositBtn');
        if (!confirmBtn) return;

        const originalBtnText = confirmBtn.innerHTML;

        try {
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Procesando...';

            await new Promise(resolve => setTimeout(resolve, 1500));

            this.currentUser.balance += amount;

            if (window.sessionManager) {
                window.sessionManager.currentUser.balance = this.currentUser.balance;
                window.sessionManager.saveUserSession();
            }

            if (window.transactionManager) {
                const methodNames = {
                    'bank': 'Depósito vía transferencia bancaria', 'card': 'Depósito vía tarjeta',
                    'paypal': 'Depósito vía PayPal', 'crypto': 'Depósito vía criptomoneda',
                    'cash': 'Depósito en efectivo - Sucursal'
                };

                window.transactionManager.addTransaction({
                    userId: this.currentUser.email,
                    type: 'deposit',
                    description: methodNames[method] || `Depósito - ${method}`,
                    amount: amount,
                    status: 'completed'
                });
            }

            $('#depositConfirmModal').modal('hide');
            this.showSuccess(amount);
            this.clearForm();
            this.updateBalanceDisplay();

        } catch (error) {
            console.error('❌ Error ejecutando depósito:', error);
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = originalBtnText;
            this.showError('Error procesando el depósito. Intenta nuevamente.');
        }
    }

    // Mostrar éxito
    showSuccess(amount) {
        if (typeof showNotification === 'function') {
            const formattedAmount = window.sessionManager.formatCurrency(amount);
            showNotification(`Depósito de ${formattedAmount} realizado exitosamente`, 'success', 'Depósito Exitoso');
        }
    }

    // Mostrar error
    showError(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'error', 'Error en Depósito');
        } else {
            console.error('❌ Error:', message);
        }
    }

    // Limpiar formulario
    clearForm() {
        const form = document.getElementById('depositForm');
        if (form) {
            form.reset();
            form.querySelectorAll('.is-valid, .is-invalid').forEach(el => el.classList.remove('is-valid', 'is-invalid'));
            form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
        }
    }

    // Manejar escaneo QR
    handleQRScan() {
        if (typeof showNotification === 'function') {
            showNotification('Funcionalidad en desarrollo. Usa el depósito manual.', 'info', 'QR Scanner 🚧');
        }
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.depositManager = new DepositManager();
});