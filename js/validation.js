/**
 * validation.js - Sistema de validación AlkeWallet con jQuery
 * Proporciona validación consistente para formularios de login, registro, transferencias y depósitos.
 */

$(document).ready(function () {
    console.log('🛡️ Sistema de validación inicializado');

    // Reglas de Validación Globales
    const validationRules = {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Ingresa un email válido'
        },
        password: {
            minLength: 6,
            pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
            message: 'Mínimo 6 caracteres, letras y números'
        },
        firstName: {
            pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,30}$/,
            message: 'Solo letras (2-30 caracteres)'
        },
        lastName: {
            pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,30}$/,
            message: 'Solo letras (2-30 caracteres)'
        },
        phone: {
            pattern: /^\+?56[0-9]{8,9}$/,
            message: 'Formato: +56912345678'
        },
        amount: {
            min: 1000,
            max: 5000000,
            message: 'Monto entre $1.000 y $5.000.000'
        }
    };

    /**
     * Función para mostrar feedback visual
     */
    function showFieldFeedback(field, message, type) {
        const $field = $(field);

        $field.removeClass('is-valid is-invalid');

        let $feedback = $field.siblings('.invalid-feedback');
        if ($feedback.length === 0) {
            $feedback = $('<div class="invalid-feedback"></div>').insertAfter($field);
        }

        if (type === 'success') {
            $field.addClass('is-valid');
            $feedback.text('');
        } else {
            $field.addClass('is-invalid');
            $feedback.text(message);
        }
    }

    /**
     * Funciones de Validación
     */
    window.validateEmail = (email) => validationRules.email.pattern.test(email);
    window.validatePassword = (pass) => pass.length >= validationRules.password.minLength && validationRules.password.pattern.test(pass);
    window.validateName = (name) => validationRules.firstName.pattern.test(name.trim());
    window.validateAmount = (amount) => {
        const num = parseFloat(amount);
        return !isNaN(num) && num >= validationRules.amount.min && num <= validationRules.amount.max;
    };

    // Event Listeners para validación en tiempo real (basado en data-validate)
    $(document).on('blur input', 'input[data-validate]', function () {
        const $input = $(this);
        const type = $input.data('validate');
        const value = $input.val().trim();

        if (value === '') {
            $input.removeClass('is-valid is-invalid');
            return;
        }

        let isValid = false;
        let message = '';

        switch (type) {
            case 'email':
                isValid = window.validateEmail(value);
                message = validationRules.email.message;
                break;
            case 'password':
                isValid = window.validatePassword(value);
                message = validationRules.password.message;
                break;
            case 'firstName':
            case 'lastName':
            case 'name':
                isValid = window.validateName(value);
                message = validationRules.firstName.message;
                break;
            case 'phone':
                isValid = /^\+?56[0-9]{8,9}$/.test(value.replace(/\s/g, ''));
                message = validationRules.phone.message;
                break;
            case 'amount':
                const cleanValue = value.replace(/[^\d]/g, '');
                isValid = window.validateAmount(cleanValue);
                message = validationRules.amount.message;
                break;
        }

        showFieldFeedback(this, message, isValid ? 'success' : 'error');
    });

    // Formateo de moneda en tiempo real para inputs de monto
    $(document).on('input', 'input[data-validate="amount"]', function () {
        let value = $(this).val().replace(/[^\d]/g, '');
        if (value === '') return;

        const numValue = parseInt(value);
        if (window.sessionManager) {
            $(this).val(window.sessionManager.formatCurrency(numValue));
        } else {
            $(this).val(numValue.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }));
        }
    });

    // Validación antes del envío
    $(document).on('submit', 'form', function (e) {
        let isFormValid = true;
        const $form = $(this);

        $form.find('input[required], input[data-validate]').each(function () {
            const $input = $(this);
            const value = $input.val().trim();
            const type = $input.data('validate');

            if ($input.prop('required') && value === '') {
                showFieldFeedback(this, 'Este campo es obligatorio', 'error');
                isFormValid = false;
            } else if (type && value !== '') {
                // Forzar validación
                $input.trigger('blur');
                if ($input.hasClass('is-invalid')) isFormValid = false;
            }
        });

        if (!isFormValid) {
            e.preventDefault();
            if (typeof showNotification === 'function') {
                showNotification('Por favor, revise los campos marcados en rojo.', 'error', 'Error en Formulario');
            }
        }
    });

    console.log('✓ Validation system ready');
});