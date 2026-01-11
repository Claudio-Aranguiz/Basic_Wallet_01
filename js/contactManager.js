/**
 * Gestor de Contactos - AlkeWallet
 * Conectado con database.js y sessionManager.js
 */

class ContactManager {
    constructor() {
        this.contacts = [];
        this.selectedContact = null;
        this.currentUser = null;
        this.currentBalance = 0;
        this.database = null;

        this.initializeFromSession();
        this.initializeEvents();
    }

    // Inicializar desde sessionManager
    async initializeFromSession() {
        try {
            // Esperar a que SessionManager esté disponible
            if (window.sessionManager && window.sessionManager.database) {
                this.database = window.sessionManager.database;
                this.currentUser = window.sessionManager.currentUser;

                if (this.currentUser) {
                    // Obtener saldo calculado por TransactionManager para consistencia
                    if (window.transactionManager) {
                        this.currentBalance = window.transactionManager.calculateUserBalance(this.currentUser.email);
                    } else {
                        this.currentBalance = this.currentUser.balance;
                    }
                    this.loadAvailableContacts();
                    this.renderContacts();
                    this.updateBalanceDisplay();
                    console.log('✅ ContactManager inicializado con usuario:', this.currentUser.firstName);
                } else {
                    console.error('❌ Usuario no encontrado en sessionManager');
                }
            } else {
                console.log('⏳ Esperando SessionManager...');
                // Reintentar en 1 segundo
                setTimeout(() => this.initializeFromSession(), 1000);
            }
        } catch (error) {
            console.error('❌ Error inicializando ContactManager:', error);
        }
    }

    // Cargar contactos disponibles desde database
    loadAvailableContacts() {
        if (!this.database || !this.currentUser) {
            console.warn('⚠️ Database o currentUser no disponibles');
            return;
        }

        // Obtener todos los usuarios excepto el actual
        this.contacts = this.database.users
            .filter(user => user.id !== this.currentUser.id && user.isActive)
            .map(user => ({
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                alias: user.username,
                email: user.email,
                accountNumber: user.accountNumber,
                phone: user.phone,
                profileImage: user.profileImage,
                isFavorite: false // Por ahora todos como no favoritos
            }));

        console.log('📞 Contactos cargados:', this.contacts.length);
    }

    // Actualizar saldo desde sessionManager
    updateBalanceFromSession() {
        if (window.sessionManager && window.sessionManager.currentUser) {
            this.currentUser = window.sessionManager.currentUser;

            // Obtener saldo calculado por TransactionManager
            if (window.transactionManager) {
                this.currentBalance = window.transactionManager.calculateUserBalance(this.currentUser.email);
            } else {
                this.currentBalance = this.currentUser.balance;
            }

            this.updateBalanceDisplay();
        }
    }

    // Actualizar display del saldo
    updateBalanceDisplay() {
        const balanceElement = document.getElementById('currentBalance');
        if (balanceElement && this.currentBalance !== undefined) {
            // Usar formato es-CO (COP) para consistencia con el resto de la app
            balanceElement.textContent = this.currentBalance.toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        }
    }

    // Inicializar eventos
    initializeEvents() {
        // Búsqueda de contactos
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterContacts(e.target.value);
            });
        }

        // Formulario de nuevo contacto en el modal
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addContactFromModal();
            });
        }

        // Validaciones en tiempo real
        this.setupRealTimeValidation();
    }

    // Configurar validaciones en tiempo real
    setupRealTimeValidation() {
        const cbuInput = document.getElementById('contactCBU');
        const aliasInput = document.getElementById('contactAlias');

        if (cbuInput) {
            cbuInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, ''); // Solo números
                this.validateCBU(e.target.value);
            });
        }

        if (aliasInput) {
            aliasInput.addEventListener('input', (e) => {
                this.validateAlias(e.target.value);
            });
        }
    }

    // Validar CBU
    validateCBU(cbu) {
        const cbuInput = document.getElementById('contactCBU');
        const isValid = cbu.length === 22 && /^\d{22}$/.test(cbu);

        if (cbuInput) {
            if (cbu.length > 0 && !isValid) {
                cbuInput.classList.add('is-invalid');
                cbuInput.classList.remove('is-valid');
            } else if (isValid) {
                cbuInput.classList.add('is-valid');
                cbuInput.classList.remove('is-invalid');
            } else {
                cbuInput.classList.remove('is-valid', 'is-invalid');
            }
        }
        return isValid;
    }

    // Validar alias
    validateAlias(alias) {
        const aliasInput = document.getElementById('contactAlias');
        const isValid = alias.length >= 6 && alias.length <= 20;
        const isDuplicate = this.contacts.some(contact => contact.alias === alias);

        if (aliasInput) {
            if (alias.length > 0 && (!isValid || isDuplicate)) {
                aliasInput.classList.add('is-invalid');
                aliasInput.classList.remove('is-valid');
            } else if (isValid && !isDuplicate) {
                aliasInput.classList.add('is-valid');
                aliasInput.classList.remove('is-invalid');
            } else {
                aliasInput.classList.remove('is-valid', 'is-invalid');
            }
        }
        return isValid && !isDuplicate;
    }

    // Agregar contacto desde modal
    addContactFromModal() {
        const name = document.getElementById('contactName').value.trim();
        const alias = document.getElementById('contactAlias').value.trim();
        const cbu = document.getElementById('contactCBU').value.trim();
        const bank = document.getElementById('contactBank').value;
        const phone = document.getElementById('contactPhone').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const isFavorite = document.getElementById('addToFavorites').checked;

        // Validaciones
        if (!name || !alias || !cbu || !bank) {
            this.showError('Por favor complete todos los campos obligatorios');
            return;
        }

        if (!this.validateCBU(cbu)) {
            this.showError('El CBU debe tener exactamente 22 dígitos');
            return;
        }

        if (!this.validateAlias(alias)) {
            this.showError('El alias debe tener entre 6 y 20 caracteres y no estar en uso');
            return;
        }

        // Crear nuevo contacto
        const newContact = {
            id: Date.now(),
            name,
            alias,
            cbu,
            bank,
            phone: phone || null,
            email: email || null,
            isFavorite
        };

        this.contacts.push(newContact);
        this.saveContactsToStorage();
        this.renderContacts();

        // Limpiar formulario y cerrar modal
        document.getElementById('contactForm').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
        if (modal) {
            modal.hide();
        }

        // Notificación de éxito usando el sistema de notificaciones de AlkeWallet
        if (typeof showNotification === 'function') {
            showNotification('Contacto agregado correctamente', 'success', 'Éxito');
        }
    }

    // Mostrar error
    showError(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'error', 'Error');
        } else {
            alert(message);
        }
    }

    // Filtrar contactos
    filterContacts(searchTerm) {
        const filteredContacts = this.contacts.filter(contact =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.alias.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderContacts(filteredContacts);
    }

    // Renderizar contactos
    renderContacts(contactsToRender = this.contacts) {
        const contactsList = document.getElementById('contacts-list');
        if (!contactsList) return;

        if (contactsToRender.length === 0) {
            contactsList.innerHTML = `
                <div class="text-center text-muted py-3">
                    <i class="fas fa-users fa-2x mb-2"></i>
                    <p>No se encontraron contactos</p>
                </div>
            `;
            return;
        }

        // Ordenar: favoritos primero, luego por nombre
        const sortedContacts = contactsToRender.sort((a, b) => {
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;
            return a.name.localeCompare(b.name);
        });

        contactsList.innerHTML = sortedContacts.map(contact => `
            <div class="card mb-2 contact-card bg-transparent border-secondary ${contact.isFavorite ? 'border-info' : ''}" 
                 onclick="contactManager.selectContact(${contact.id})" 
                 style="cursor: pointer; transition: all 0.3s ease;">
                <div class="card-body py-2">
                    <div class="row align-items-center">
                        <div class="col-auto">
                            <div class="bg-info text-white rounded-circle d-flex align-items-center justify-content-center" 
                                 style="width: 40px; height: 40px;">
                                <i class="fas fa-user"></i>
                            </div>
                        </div>
                        <div class="col">
                            <h6 class="mb-0">
                                ${contact.name}
                                ${contact.isFavorite ? '<i class="fas fa-star text-warning ms-1" title="Favorito"></i>' : ''}
                            </h6>
                            <small class="text-muted">${contact.alias} • ${contact.bank}</small>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-chevron-right text-muted"></i>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Seleccionar contacto
    selectContact(contactId) {
        console.log('👤 Seleccionando contacto con ID:', contactId);
        this.selectedContact = this.contacts.find(c => c.id === contactId);

        if (this.selectedContact) {
            console.log('✅ Contacto seleccionado:', this.selectedContact.name);
            this.showSelectedContactInfo();
            this.showSendMoneySection();

            // Marcar contacto seleccionado visualmente
            document.querySelectorAll('.contact-card').forEach(card => {
                card.classList.remove('border-info', 'glass-panel-accent');
                card.classList.add('border-secondary');
            });

            // Buscar la tarjeta específica y marcarla
            const selectedCard = event ? event.currentTarget :
                document.querySelector(`.contact-card[onclick*="${contactId}"]`);
            if (selectedCard) {
                selectedCard.classList.remove('border-secondary');
                selectedCard.classList.add('border-info', 'glass-panel-accent');
            }

            // Habilitar botón de envío si existe
            const sendButton = document.getElementById('btn-send-money');
            if (sendButton) {
                // Verificar también que hay monto válido
                const amountInput = document.getElementById('send-amount');
                const amount = amountInput ? parseFloat(amountInput.value) : 0;

                if (amount > 0 && !isNaN(amount)) {
                    sendButton.disabled = false;
                    console.log('✅ Botón de envío habilitado');
                }
            }
        } else {
            console.error('❌ Contacto no encontrado con ID:', contactId);
        }
    }

    // Mostrar información del contacto seleccionado
    showSelectedContactInfo() {
        const infoContainer = document.getElementById('selected-contact-info');
        if (!infoContainer || !this.selectedContact) return;

        infoContainer.innerHTML = `
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card border-info bg-transparent">
                        <div class="card-header border-0 bg-transparent text-info fw-bold">
                            <h6 class="mb-0 small">
                                <i class="fas fa-user-check mr-2"></i>CONTACTO SELECCIONADO
                            </h6>
                        </div>
                        <div class="card-body pt-0 text-white">
                            <div class="row">
                                <div class="col-md-6">
                                    <strong>Nombre:</strong> ${this.selectedContact.name}<br>
                                    <strong>Alias:</strong> ${this.selectedContact.alias}<br>
                                    <strong>Banco:</strong> ${this.selectedContact.bank}
                                </div>
                                <div class="col-md-6">
                                    <strong>CBU:</strong> ${this.selectedContact.cbu}<br>
                                    ${this.selectedContact.phone ? `<strong>Teléfono:</strong> ${this.selectedContact.phone}<br>` : ''}
                                    ${this.selectedContact.email ? `<strong>Email:</strong> ${this.selectedContact.email}` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Mostrar sección de envío de dinero
    showSendMoneySection() {
        const sendMoneySection = document.getElementById('send-money-section');
        if (sendMoneySection) {
            sendMoneySection.style.display = 'block';

            // Habilitar botón cuando hay monto válido
            const amountInput = document.getElementById('send-amount');
            const sendButton = document.getElementById('btn-send-money');

            if (amountInput && sendButton) {
                amountInput.addEventListener('input', () => {
                    const amount = parseFloat(amountInput.value);
                    sendButton.disabled = !amount || amount <= 0 || amount > this.currentBalance;
                });
            }
        }
    }

    // Obtener contacto seleccionado
    getSelectedContact() {
        return this.selectedContact;
    }

    // Actualizar saldo después de transferencia
    updateBalance(newBalance) {
        this.currentBalance = newBalance;
        localStorage.setItem('alkeWallet_balance', this.currentBalance.toString());
        this.updateBalanceDisplay();
    }
}

// Instancia global
let contactManager;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    contactManager = new ContactManager();
    window.contactManager = contactManager; // Exponerlo globalmente
    console.log('✅ ContactManager expuesto globalmente');
});