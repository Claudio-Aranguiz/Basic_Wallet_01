// register.js - Sistema de registro de usuarios AlkeWallet

class UserRegistration {
    constructor() {
        this.database = null;
        this.loadDatabase();
    }

    // Cargar la base de datos JSON
    async loadDatabase() {
        try {
            // Usar la variable global DATABASE cargada desde database.js
            if (window.DATABASE) {
                this.database = window.DATABASE;
                console.log('✅ Database cargada desde database.js para registro:', this.database.users.length, 'usuarios');
            } else {
                throw new Error('window.DATABASE no está disponible');
            }
        } catch (error) {
            console.error('Error al cargar la base de datos:', error);
            console.warn('Usando datos de fallback para registro');
            
            // Fallback con datos de prueba para registro
            this.database = {
                users: [
                    {
                        id: 1,
                        username: "admin",
                        email: "admin@alkewallet.com",
                        password: "admin123",
                        firstName: "Administrador",
                        lastName: "AlkeWallet",
                        phone: "+56900000001",
                        balance: 1000000,
                        accountNumber: "12345678000",
                        createdAt: "2025-01-01T08:00:00Z",
                        isActive: true,
                        profileImage: "img/admin-avatar.png"
                    },
                    {
                        id: 2,
                        username: "juan.perez",
                        email: "juan.perez@email.com",
                        password: "123456",
                        firstName: "Juan",
                        lastName: "Pérez",
                        phone: "+56912345678",
                        balance: 250000,
                        accountNumber: "12345678901",
                        createdAt: "2025-01-01T10:00:00Z",
                        isActive: true,
                        profileImage: "img/avatar1.png"
                    },
                    {
                        id: 3,
                        username: "maria.gonzalez",
                        email: "maria.gonzalez@email.com",
                        password: "password123",
                        firstName: "María",
                        lastName: "González",
                        phone: "+56987654321",
                        balance: 180000,
                        accountNumber: "12345678902",
                        createdAt: "2025-01-02T14:30:00Z",
                        isActive: true,
                        profileImage: "img/avatar2.png"
                    },
                    {
                        id: 4,
                        username: "test",
                        email: "test@test.com",
                        password: "123",
                        firstName: "Usuario",
                        lastName: "Prueba",
                        phone: "+56900000000",
                        balance: 100000,
                        accountNumber: "12345678999",
                        createdAt: "2025-01-05T12:00:00Z",
                        isActive: true,
                        profileImage: "img/avatar1.png"
                    }
                ]
            };
        }
    }

    // Generar número de cuenta único
    generateAccountNumber() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `123${timestamp.slice(-6)}${random}`;
    }

    // Validar si el usuario ya existe
    userExists(username, email) {
        if (!this.database || !this.database.users) return false;
        
        return this.database.users.some(user => 
            user.username === username || user.email === email
        );
    }

    // Validar fortaleza de la contraseña
    validatePassword(password) {
        const minLength = 6;
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        
        const errors = [];
        
        if (password.length < minLength) {
            errors.push(`La contraseña debe tener al menos ${minLength} caracteres`);
        }
        
        if (!hasNumber) {
            errors.push('La contraseña debe contener al menos un número');
        }
        
        if (!hasLetter) {
            errors.push('La contraseña debe contener al menos una letra');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Validar email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar teléfono chileno
    validatePhone(phone) {
        const phoneRegex = /^\+?56[0-9]{8,9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Registrar nuevo usuario
    async registerUser(userData) {
        // Esperar a que la base de datos esté cargada
        if (!this.database) {
            await this.loadDatabase();
        }

        const {
            firstName,
            lastName,
            username,
            email,
            password,
            confirmPassword,
            phone
        } = userData;

        // Validaciones
        const validationErrors = [];

        // Verificar campos obligatorios
        if (!firstName.trim()) validationErrors.push('El nombre es obligatorio');
        if (!lastName.trim()) validationErrors.push('El apellido es obligatorio');
        if (!username.trim()) validationErrors.push('El nombre de usuario es obligatorio');
        if (!email.trim()) validationErrors.push('El email es obligatorio');
        if (!password) validationErrors.push('La contraseña es obligatoria');
        if (!phone.trim()) validationErrors.push('El teléfono es obligatorio');

        // Validar email
        if (email && !this.validateEmail(email)) {
            validationErrors.push('El formato del email no es válido');
        }

        // Validar teléfono
        if (phone && !this.validatePhone(phone)) {
            validationErrors.push('El formato del teléfono no es válido (ej: +56912345678)');
        }

        // Validar contraseña
        if (password) {
            const passwordValidation = this.validatePassword(password);
            if (!passwordValidation.isValid) {
                validationErrors.push(...passwordValidation.errors);
            }
        }

        // Verificar que las contraseñas coincidan
        if (password !== confirmPassword) {
            validationErrors.push('Las contraseñas no coinciden');
        }

        // Verificar que el usuario no exista
        if (this.userExists(username, email)) {
            validationErrors.push('El usuario o email ya está registrado');
        }

        // Si hay errores, retornar
        if (validationErrors.length > 0) {
            return {
                success: false,
                errors: validationErrors
            };
        }

        // Crear nuevo usuario
        const newUser = {
            id: this.getNextUserId(),
            username: username.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password: password, // En producción, esto debe hashearse
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            balance: 0, // Saldo inicial en 0
            accountNumber: this.generateAccountNumber(),
            createdAt: new Date().toISOString(),
            isActive: true,
            profileImage: `img/avatar${Math.floor(Math.random() * 5) + 1}.png`
        };

        // Simular guardado en la base de datos
        // En una aplicación real, esto sería una llamada a la API
        this.database.users.push(newUser);
        this.saveToLocalStorage(newUser);

        return {
            success: true,
            user: newUser,
            message: '¡Usuario registrado exitosamente!'
        };
    }

    // Obtener el siguiente ID de usuario
    getNextUserId() {
        if (!this.database || !this.database.users || this.database.users.length === 0) {
            return 1;
        }
        
        const maxId = Math.max(...this.database.users.map(user => user.id));
        return maxId + 1;
    }

    // Guardar en localStorage (simulación de persistencia)
    saveToLocalStorage(newUser) {
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        existingUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        
        console.log('Usuario guardado localmente:', newUser.username);
    }

    // Cargar usuarios registrados localmente
    loadLocalUsers() {
        const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        if (localUsers.length > 0 && this.database) {
            // Agregar usuarios locales a la base de datos si no existen
            localUsers.forEach(localUser => {
                if (!this.userExists(localUser.username, localUser.email)) {
                    this.database.users.push(localUser);
                }
            });
        }
    }
}

// Instancia global del gestor de registro
const userRegistration = new UserRegistration();

// Función global para manejar el registro
window.handleRegistration = async function(event) {
    event.preventDefault();
    
    // Obtener datos del formulario (usando IDs del modal)
    const userData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        username: document.getElementById('usernameRegister').value,
        email: document.getElementById('emailRegister').value,
        password: document.getElementById('passwordRegister').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        phone: document.getElementById('phone').value
    };
    
    // Mostrar indicador de carga
    const registerBtn = document.querySelector('.register-btn');
    const originalText = registerBtn.textContent;
    registerBtn.textContent = 'Registrando...';
    registerBtn.disabled = true;
    
    try {
        const result = await userRegistration.registerUser(userData);
        
        if (result.success) {
            // Limpiar formulario
            document.getElementById('registerForm').reset();
            
            // Mostrar mensaje de éxito
            showRegistrationMessage(
                `${result.message} Tu número de cuenta es: ${result.user.accountNumber}`,
                'success'
            );
            
            // Cerrar el modal después de 2 segundos y redirigir
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                modal.hide();
                
                setTimeout(() => {
                    // Auto-login del usuario recién registrado usando email
                    authManager.login(result.user.email, userData.password).then(() => {
                        window.location.href = 'menu.html';
                    });
                }, 500);
            }, 2000);
        } else {
            // Mostrar errores de validación
            showRegistrationMessage(result.errors.join('<br>'), 'error');
        }
    } catch (error) {
        console.error('Error durante el registro:', error);
        showRegistrationMessage('Error de conexión. Inténtalo nuevamente.', 'error');
    } finally {
        // Restaurar botón
        registerBtn.textContent = originalText;
        registerBtn.disabled = false;
    }
};

// Función para mostrar mensajes de registro
function showRegistrationMessage(message, type) {
    // Remover mensajes anteriores
    const existingMessage = document.querySelector('.register-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `register-message ${type}`;
    messageDiv.innerHTML = message;
    
    const form = document.querySelector('.register-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-remover después de 8 segundos para mensajes de éxito
    const timeout = type === 'success' ? 8000 : 5000;
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, timeout);
}

// Verificar disponibilidad de username en tiempo real
window.checkUsernameAvailability = async function(username) {
    if (username.length < 3) return;
    
    await userRegistration.loadDatabase();
    const exists = userRegistration.userExists(username, '');
    
    const usernameInput = document.getElementById('usernameRegister');
    let feedback = document.getElementById('usernameRegister-feedback');
    
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.id = 'usernameRegister-feedback';
        feedback.className = 'field-feedback';
        usernameInput.after(feedback);
    }
    
    if (exists) {
        feedback.textContent = 'Este nombre de usuario ya está en uso';
        feedback.className = 'field-feedback error';
        usernameInput.classList.add('is-invalid');
        usernameInput.classList.remove('is-valid');
    } else {
        feedback.textContent = 'Nombre de usuario disponible';
        feedback.className = 'field-feedback success';
        usernameInput.classList.remove('is-invalid');
        usernameInput.classList.add('is-valid');
    }
};

// Cargar usuarios locales al inicializar
document.addEventListener('DOMContentLoaded', () => {
    userRegistration.loadLocalUsers();
});

// Exponer instancia globalmente
window.userRegistration = userRegistration;