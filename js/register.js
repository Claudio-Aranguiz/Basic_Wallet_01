/**
 * register.js - Sistema de registro de usuarios AlkeWallet
 */

class UserRegistration {
    constructor() {
        this.database = null;
        this.init();
    }

    async init() {
        if (window.sessionManager) {
            await window.sessionManager.readyPromise;
            this.database = window.sessionManager.database || window.DATABASE;
        }
    }

    generateAccountNumber() {
        return `123${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    }

    userExists(username, email) {
        if (!this.database || !this.database.users) return false;
        return this.database.users.some(u => u.username === username || u.email === email);
    }

    async registerUser(userData) {
        const { firstName, lastName, username, email, password, phone } = userData;

        if (this.userExists(username, email)) {
            return { success: false, message: 'El usuario o email ya existe' };
        }

        const newUser = {
            id: Date.now(),
            username: username.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            balance: 50000, // Bono inicial de registro
            accountNumber: this.generateAccountNumber(),
            alias: "",
            bank: "AlkeWallet",
            isVerified: false,
            createdAt: new Date().toISOString(),
            isActive: true,
            profileImage: `img/avatar${Math.floor(Math.random() * 5) + 1}.png`
        };

        this.database.users.push(newUser);

        // Guardar usuarios locales para persistencia simple
        const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        localUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(localUsers));

        return { success: true, user: newUser };
    }
}

window.userRegistration = new UserRegistration();

window.handleRegistration = async function (event) {
    event.preventDefault();

    const userData = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        username: $('#usernameRegister').val(),
        email: $('#emailRegister').val(),
        password: $('#passwordRegister').val(),
        phone: $('#phone').val()
    };

    const $btn = $('.register-btn');
    const originalText = $btn.text();
    $btn.prop('disabled', true).text('Procesando...');

    try {
        const result = await window.userRegistration.registerUser(userData);

        if (result.success) {
            showNotification('¡Registro exitoso! Ya puedes iniciar sesión.', 'success', 'Bienvenido');
            $('#registerModal').modal('hide');
            $('#registerForm')[0].reset();
            $('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
        } else {
            showNotification(result.message, 'error', 'Error de Registro');
        }
    } catch (e) {
        showNotification('Ocurrió un error inesperado.', 'error');
    } finally {
        $btn.prop('disabled', false).text(originalText);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const regForm = document.getElementById('registerForm');
    if (regForm) regForm.addEventListener('submit', window.handleRegistration);
});