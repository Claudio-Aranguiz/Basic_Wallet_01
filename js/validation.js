// validation.js - Validación de formularios con jQuery para AlkeWallet

$(document).ready(function() {
    console.log('Sistema de validación inicializado');
    
    // Configuración de validaciones
    const validationRules = {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Ingresa un email válido'
        },
        phone: {
            pattern: /^\+?56[0-9]{8,9}$/,
            message: 'Formato: +56912345678 (teléfono chileno)'
        },
        password: {
            minLength: 6,
            pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
            message: 'Mínimo 6 caracteres, debe contener letras y números'
        },
        username: {
            pattern: /^[a-zA-Z0-9._]{3,20}$/,
            message: 'Solo letras, números, puntos y guiones bajos (3-20 caracteres)'
        },
        name: {
            pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,30}$/,
            message: 'Solo letras y espacios (2-30 caracteres)'
        },
        amount: {
            min: 1000,
            max: 500000,
            message: 'Monto entre $1.000 y $500.000'
        }
    };

    // Función para mostrar feedback visual
    function showFieldFeedback(field, message, type) {
        const $field = $(field);
        const fieldId = $field.attr('id');
        
        // Remover clases anteriores
        $field.removeClass('valid invalid');
        
        // Buscar o crear elemento de feedback
        let $feedback = $(`#${fieldId}-feedback`);
        if ($feedback.length === 0) {
            $feedback = $(`<div id="${fieldId}-feedback" class="field-feedback"></div>`);
            $field.after($feedback);
        }
        
        if (type === 'success') {
            $field.addClass('valid');
            $feedback.removeClass('error').addClass('success').text(message);
        } else {
            $field.addClass('invalid');
            $feedback.removeClass('success').addClass('error').text(message);
        }
    }

    // Función para limpiar feedback
    function clearFieldFeedback(field) {
        const $field = $(field);
        const fieldId = $field.attr('id');
        
        $field.removeClass('valid invalid');
        $(`#${fieldId}-feedback`).remove();
    }

    // Validación de email
    function validateEmail(email) {
        return validationRules.email.pattern.test(email);
    }

    // Validación de teléfono
    function validatePhone(phone) {
        const cleanPhone = phone.replace(/\s/g, '');
        return validationRules.phone.pattern.test(cleanPhone);
    }

    // Validación de contraseña
    function validatePassword(password) {
        return password.length >= validationRules.password.minLength && 
               validationRules.password.pattern.test(password);
    }

    // Validación de nombre de usuario
    function validateUsername(username) {
        return validationRules.username.pattern.test(username);
    }

    // Validación de nombre
    function validateName(name) {
        return validationRules.name.pattern.test(name.trim());
    }

    // Validación de monto
    function validateAmount(amount) {
        const numAmount = parseFloat(amount);
        return numAmount >= validationRules.amount.min && 
               numAmount <= validationRules.amount.max;
    }

    // Formato de montos en tiempo real
    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // Event listeners para validación en tiempo real

    // Validación de email
    $(document).on('blur', 'input[type="email"], input[name="email"]', function() {
        const email = $(this).val().trim();
        
        if (email === '') {
            clearFieldFeedback(this);
            return;
        }
        
        if (validateEmail(email)) {
            showFieldFeedback(this, '✓ Email válido', 'success');
        } else {
            showFieldFeedback(this, validationRules.email.message, 'error');
        }
    });

    // Validación de teléfono
    $(document).on('blur', 'input[name="phone"], #phone', function() {
        const phone = $(this).val().trim();
        
        if (phone === '') {
            clearFieldFeedback(this);
            return;
        }
        
        if (validatePhone(phone)) {
            showFieldFeedback(this, '✓ Teléfono válido', 'success');
        } else {
            showFieldFeedback(this, validationRules.phone.message, 'error');
        }
    });

    // Validación de contraseña
    $(document).on('input', 'input[type="password"][name="password"], #password', function() {
        const password = $(this).val();
        
        if (password === '') {
            clearFieldFeedback(this);
            return;
        }
        
        if (validatePassword(password)) {
            showFieldFeedback(this, '✓ Contraseña segura', 'success');
        } else {
            showFieldFeedback(this, validationRules.password.message, 'error');
        }
        
        // Validar confirmación si existe
        const confirmPassword = $('input[name="confirmPassword"], #confirmPassword').val();
        if (confirmPassword && password !== confirmPassword) {
            showFieldFeedback('input[name="confirmPassword"], #confirmPassword', 
                            'Las contraseñas no coinciden', 'error');
        } else if (confirmPassword && password === confirmPassword) {
            showFieldFeedback('input[name="confirmPassword"], #confirmPassword', 
                            '✓ Las contraseñas coinciden', 'success');
        }
    });

    // Validación de confirmación de contraseña
    $(document).on('input', 'input[name="confirmPassword"], #confirmPassword', function() {
        const confirmPassword = $(this).val();
        const password = $('input[type="password"][name="password"], #password').val();
        
        if (confirmPassword === '') {
            clearFieldFeedback(this);
            return;
        }
        
        if (password === confirmPassword) {
            showFieldFeedback(this, '✓ Las contraseñas coinciden', 'success');
        } else {
            showFieldFeedback(this, 'Las contraseñas no coinciden', 'error');
        }
    });

    // Validación de username
    $(document).on('blur', 'input[name="username"], #username', function() {
        const username = $(this).val().trim();
        
        if (username === '') {
            clearFieldFeedback(this);
            return;
        }
        
        if (validateUsername(username)) {
            // Si existe la función de verificación de disponibilidad, la llamamos
            if (typeof checkUsernameAvailability === 'function') {
                checkUsernameAvailability(username);
            } else {
                showFieldFeedback(this, '✓ Formato válido', 'success');
            }
        } else {
            showFieldFeedback(this, validationRules.username.message, 'error');
        }
    });

    // Validación de nombres
    $(document).on('blur', 'input[name="firstName"], input[name="lastName"], #firstName, #lastName', function() {
        const name = $(this).val().trim();
        
        if (name === '') {
            clearFieldFeedback(this);
            return;
        }
        
        if (validateName(name)) {
            showFieldFeedback(this, '✓ Nombre válido', 'success');
        } else {
            showFieldFeedback(this, validationRules.name.message, 'error');
        }
    });

    // Validación y formato de montos
    $(document).on('input', 'input[name="amount"], #amount, .amount-input', function() {
        let value = $(this).val().replace(/[^\d]/g, ''); // Solo números
        
        if (value === '') {
            clearFieldFeedback(this);
            return;
        }
        
        const numValue = parseInt(value);
        
        // Formatear el valor mostrado
        $(this).val(formatCurrency(numValue).replace('CLP', '').trim());
        
        // Validar el monto
        if (validateAmount(numValue)) {
            showFieldFeedback(this, '✓ Monto válido', 'success');
        } else {
            showFieldFeedback(this, validationRules.amount.message, 'error');
        }
    });

    // Prevenir caracteres no válidos en campos numéricos
    $(document).on('keypress', 'input[name="amount"], #amount, .amount-input', function(e) {
        // Permitir: backspace, delete, tab, escape, enter
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true)) {
            return;
        }
        // Asegurar que es un número
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    // Validación completa del formulario
    function validateForm(form) {
        let isValid = true;
        const errors = [];
        
        $(form).find('input[required]').each(function() {
            const $field = $(this);
            const value = $field.val().trim();
            const fieldName = $field.attr('name') || $field.attr('id');
            
            if (value === '') {
                errors.push(`El campo ${fieldName} es obligatorio`);
                showFieldFeedback(this, 'Campo obligatorio', 'error');
                isValid = false;
            }
        });
        
        // Verificar campos con errores visibles
        $(form).find('.invalid').each(function() {
            isValid = false;
        });
        
        return { isValid, errors };
    }

    // Event listener para validar antes del envío
    $(document).on('submit', 'form', function(e) {
        const validation = validateForm(this);
        
        if (!validation.isValid) {
            e.preventDefault();
            
            // Mostrar mensaje general de error
            const $form = $(this);
            let $errorDiv = $form.find('.form-errors');
            
            if ($errorDiv.length === 0) {
                $errorDiv = $('<div class="form-errors"></div>');
                $form.prepend($errorDiv);
            }
            
            $errorDiv.html(
                '<p><strong>Por favor corrige los siguientes errores:</strong></p>' +
                '<ul><li>' + validation.errors.join('</li><li>') + '</li></ul>'
            ).show();
            
            // Scroll al primer error
            const $firstError = $form.find('.invalid').first();
            if ($firstError.length) {
                $firstError.focus();
                $('html, body').animate({
                    scrollTop: $firstError.offset().top - 100
                }, 500);
            }
        }
    });

    // Limpiar errores generales cuando se corrigen campos
    $(document).on('input change', 'form input', function() {
        const $form = $(this).closest('form');
        const $errorDiv = $form.find('.form-errors');
        
        // Si no hay campos inválidos, ocultar errores generales
        if ($form.find('.invalid').length === 0) {
            $errorDiv.fadeOut();
        }
    });

    // Funciones de utilidad globales
    window.clearAllValidation = function(form) {
        $(form).find('.valid, .invalid').removeClass('valid invalid');
        $(form).find('.field-feedback').remove();
        $(form).find('.form-errors').hide();
    };

    window.validateField = function(fieldSelector, value, rule) {
        const $field = $(fieldSelector);
        
        switch (rule) {
            case 'email':
                return validateEmail(value);
            case 'phone':
                return validatePhone(value);
            case 'password':
                return validatePassword(value);
            case 'username':
                return validateUsername(value);
            case 'name':
                return validateName(value);
            case 'amount':
                return validateAmount(value);
            default:
                return true;
        }
    };

    // Estilos CSS dinámicos para la validación
    const validationStyles = `
        <style>
            .field-feedback {
                font-size: 0.85rem;
                margin-top: 0.25rem;
                padding: 0.25rem;
                border-radius: 4px;
            }
            .field-feedback.success {
                color: #28a745;
                background-color: rgba(40, 167, 69, 0.1);
            }
            .field-feedback.error {
                color: #dc3545;
                background-color: rgba(220, 53, 69, 0.1);
            }
            .valid {
                border-color: #28a745 !important;
                box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
            }
            .invalid {
                border-color: #dc3545 !important;
                box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
            }
            .form-errors {
                background-color: #f8d7da;
                border: 1px solid #f5c6cb;
                color: #721c24;
                padding: 1rem;
                border-radius: 0.375rem;
                margin-bottom: 1rem;
            }
            .form-errors ul {
                margin: 0;
                padding-left: 1.5rem;
            }
        </style>
    `;
    
    // Agregar estilos al head si no existen
    if (!$('#validation-styles').length) {
        $('head').append(validationStyles);
    }

    console.log('✓ Sistema de validación jQuery listo');
});