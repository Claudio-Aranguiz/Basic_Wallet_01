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

        // Verificar dependencias
        if (!window.sessionManager) {
            console.error('❌ SessionManager no disponible');
            return;
        }

        if (!window.transactionManager) {
            console.error('❌ TransactionManager no disponible');
            return;
        }

        // Obtener usuario actual
        this.currentUser = window.sessionManager.getCurrentUser();
        if (!this.currentUser) {
            console.error('❌ No hay usuario logueado');
            window.location.href = './login.html';
            return;
        }

        // Obtener database
        this.database = window.sessionManager.database || window.DATABASE;
        if (!this.database) {
            console.error('❌ Database no disponible');
            return;
        }

        this.isInitialized = true;
        console.log('✅ DepositManager inicializado correctamente');

        // Actualizar saldo en la interfaz
        this.updateBalanceDisplay();

        // Configurar event listeners
        this.setupEventListeners();
    }

    // Configurar event listeners
    setupEventListeners() {
        console.log('🎯 Configurando event listeners');

        // Formulario de depósito
        const depositForm = document.getElementById('depositForm');
        if (depositForm) {
            depositForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleDepositSubmission();
            });
        }

        // Validación en tiempo real del monto
        const amountInput = document.getElementById('depositAmount');
        if (amountInput) {
            amountInput.addEventListener('input', (e) => {
                this.validateAmount(e.target.value);
            });

            // Formatear entrada
            amountInput.addEventListener('blur', (e) => {
                this.formatAmountInput(e.target);
            });
        }

        // Botón QR (simulado)
        const qrBtn = document.getElementById('scanQRBtn');
        if (qrBtn) {
            qrBtn.addEventListener('click', () => {
                this.handleQRScan();
            });
        }
    }

    // Actualizar saldo mostrado
    updateBalanceDisplay() {
        try {
            const balanceElement = document.querySelector('.current-balance h2');
            if (balanceElement && this.currentUser) {
                // Obtener saldo calculado por TransactionManager
                const currentBalance = window.transactionManager.calculateUserBalance(this.currentUser.email);
                const formattedBalance = currentBalance.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP'
                });
                balanceElement.textContent = formattedBalance;
                console.log('💰 Saldo actualizado:', formattedBalance);
            }
        } catch (error) {
            console.error('❌ Error actualizando saldo:', error);
        }
    }

    // Validar monto de depósito
    validateAmount(amount) {
        const amountInput = document.getElementById('depositAmount');
        const submitBtn = document.querySelector('#depositForm button[type="submit"]');

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

        // Actualizar estilos del input
        if (amountInput) {
            if (amount && !isValid) {
                amountInput.classList.add('is-invalid');
                amountInput.classList.remove('is-valid');

                // Mostrar mensaje de error
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

                // Remover mensaje de error
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
            const numValue = parseFloat(value);
            input.value = Math.round(numValue); // Sin decimales para pesos colombianos
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

        if (!amountInput || !methodSelect) {
            this.showError('Error en el formulario');
            return;
        }

        const amount = parseFloat(amountInput.value);
        const method = methodSelect.value;

        // Validar campos
        if (!amount || !method) {
            this.showError('Por favor, completa todos los campos requeridos');
            return;
        }

        // Validar monto
        const validation = this.validateAmount(amount);
        if (!validation.isValid) {
            this.showError(validation.errorMessage);
            return;
        }

        // Mostrar modal de confirmación
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

        const formattedAmount = amount.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP'
        });

        // Crear modal dinámicamente
        const modalHTML = `
        <div class="modal fade" id="depositConfirmModal" tabindex="-1" role="dialog" aria-labelledby="depositConfirmModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content bg-dark text-white border-info shadow-lg" style="backdrop-filter: blur(15px); background-color: rgba(30, 45, 60, 0.95) !important;">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title text-info fw-bold" id="depositConfirmModalLabel">
                            <i class="fas fa-plus-circle mr-2"></i>Confirmar Depósito
                        </h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body text-center pt-4">
                        <div class="mb-4">
                            <div class="rounded-circle bg-info d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px; background-color: rgba(23, 162, 184, 0.2) !important;">
                                <i class="fas fa-money-bill-wave fa-2x text-info"></i>
                            </div>
                            <h2 class="text-white fw-bold">${formattedAmount}</h2>
                            <p class="text-muted italic">Monto a depositar</p>
                        </div>
                        
                        <div class="row text-start px-3">
                            <div class="col-12 p-3 rounded-3" style="background-color: rgba(255,255,255,0.05);">
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
                        
                        <div class="mt-4 px-3">
                            <p class="small text-muted mb-0">
                                <i class="fas fa-info-circle mr-1 text-info"></i>
                                Los fondos estarán disponibles en tu cuenta tras confirmar.
                            </p>
                        </div>
                    </div>
                    <div class="modal-footer border-0 justify-content-center pb-4">
                        <button type="button" class="btn btn-outline-light px-4" data-dismiss="modal">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-info px-4 fw-bold" id="confirmDepositBtn">
                            Confirmar Depósito
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Agregar modal al DOM si no existe
        let existingModal = document.getElementById('depositConfirmModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Configurar evento del botón confirmar
        document.getElementById('confirmDepositBtn').addEventListener('click', () => {
            this.executeDeposit(amount, method);
        });

        // Mostrar modal
        $('#depositConfirmModal').modal('show');
    }

    // Ejecutar depósito real
    async executeDeposit(amount, method) {
        const confirmBtn = document.getElementById('confirmDepositBtn');
        const originalBtnText = confirmBtn.innerHTML;

        try {
            // Mostrar loading
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Procesando...';

            // Simular procesamiento (en una app real, aquí iría la API)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Actualizar saldo del usuario
            this.currentUser.balance += amount;

            // Actualizar en sessionManager
            if (window.sessionManager) {
                window.sessionManager.currentUser.balance = this.currentUser.balance;
                window.sessionManager.saveUserSession();
            }

            // Actualizar en database
            if (this.database && window.DATABASE) {
                const userIndex = window.DATABASE.users.findIndex(u => u.id === this.currentUser.id);
                if (userIndex !== -1) {
                    window.DATABASE.users[userIndex].balance = this.currentUser.balance;
                }
            }

            // Registrar transacción en TransactionManager
            if (window.transactionManager) {
                const methodNames = {
                    'bank': 'Depósito vía transferencia bancaria',
                    'card': 'Depósito vía tarjeta',
                    'paypal': 'Depósito vía PayPal',
                    'crypto': 'Depósito vía criptomoneda',
                    'cash': 'Depósito en efectivo - Sucursal'
                };

                window.transactionManager.addTransaction({
                    userId: this.currentUser.email,
                    type: 'deposit',
                    description: methodNames[method] || `Depósito - ${method}`,
                    amount: amount, // Positivo porque es un ingreso
                    status: 'completed'
                });

                console.log('📊 Transacción de depósito registrada');
            }

            // Cerrar modal
            $('#depositConfirmModal').modal('hide');

            // Mostrar éxito
            this.showSuccess(amount, method);

            // Limpiar formulario
            this.clearForm();

            // Actualizar saldo mostrado
            this.updateBalanceDisplay();

            console.log('✅ Depósito exitoso:', amount);

        } catch (error) {
            console.error('❌ Error ejecutando depósito:', error);
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = originalBtnText;
            this.showError('Error procesando el depósito. Intenta nuevamente.');
        }
    }

    // Mostrar mensaje de éxito
    showSuccess(amount, method) {
        const methodNames = {
            'bank': 'transferencia bancaria',
            'card': 'tarjeta',
            'paypal': 'PayPal',
            'crypto': 'criptomoneda',
            'cash': 'efectivo'
        };

        const formattedAmount = amount.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP'
        });

        const message = `¡Depósito exitoso!\n\nSe han depositado ${formattedAmount} mediante ${methodNames[method]}\n\nTu saldo ha sido actualizado correctamente.`;

        // Usar solo notificaciones para evitar redundancia
        if (typeof showNotification === 'function') {
            showNotification(
                `Depósito de ${formattedAmount} realizado exitosamente`,
                'success',
                'Depósito Exitoso'
            );
        }
    }

    // Mostrar mensaje de error
    showError(message) {
        console.error('❌ Error:', message);
        alert('Error: ' + message);

        if (typeof showNotification === 'function') {
            showNotification(message, 'error', 'Error en Depósito');
        }
    }

    // Limpiar formulario
    clearForm() {
        const form = document.getElementById('depositForm');
        if (form) {
            form.reset();

            // Limpiar clases de validación
            const inputs = form.querySelectorAll('.form-control, .form-select');
            inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });

            // Remover mensajes de error
            const feedbacks = form.querySelectorAll('.invalid-feedback');
            feedbacks.forEach(feedback => feedback.remove());
        }
    }

    // Manejar escaneo QR simulado
    handleQRScan() {
        const qrBtn = document.getElementById('scanQRBtn');
        if (!qrBtn) return;

        const originalText = qrBtn.innerHTML;
        qrBtn.disabled = true;
        qrBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Iniciando cámara...';

        setTimeout(() => {
            qrBtn.disabled = false;
            qrBtn.innerHTML = originalText;

            alert('🚧 Funcionalidad de escáner QR en desarrollo.\n\nPor favor, usa el depósito manual por ahora.');

            if (typeof showNotification === 'function') {
                showNotification(
                    'Funcionalidad en desarrollo. Usa el depósito manual.',
                    'info',
                    'QR Scanner'
                );
            }
        }, 1500);
    }
}

// Crear instancia global
window.depositManager = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.depositManager = new DepositManager();
    console.log('✅ DepositManager expuesto globalmente');
});

console.log('🎯 DepositManager cargado');