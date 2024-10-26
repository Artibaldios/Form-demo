import Inputmask from "inputmask";
require("../scss/styles.scss");

const form = document.getElementById('contact-form');
const errorMessageDiv = document.querySelector('.error-message');

Inputmask("+7 (999) 999-99-99").mask(form.querySelector('input[name="phone"]'));

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const errors = validateForm(data);

    if (Object.keys(errors).length > 0) {
        displayErrors(errors);
    } else {
        try {
            const response = await fetch('http://localhost:9090/api/registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === "success") {
                form.reset();
                alert(result.msg);
            } else {
                alert(result.message);
                displayErrors(result.fields)
            }

        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            errorMessageDiv.textContent = "Произошла ошибка при отправке данных.";
        }
    }
});

function validateForm(data) {
    const errors = {};
    if (!data.name) {
        errors.name = "Имя обязательно для заполнения.";
    }
    if (!data.email) {
        errors.email = "E-mail обязателен для заполнения.";
    } else if (!validateEmail(data.email)) {
        errors.email = "Введите корректный адрес электронной почты.";
    }
    if (!data.phone) {
        errors.phone = "Телефон обязателен для заполнения.";
    }
    if (!data.message) {
        errors.message = "Сообщение обязательно для заполнения.";
    }

    return errors;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function displayErrors(errors) {
    for (const [inputName, errorMessage] of Object.entries(errors)) {
        const inputField = form.querySelector(`[name="${inputName}"]`);
        if (inputField) {
            inputField.style.borderColor = 'red';

            const errorElement = document.createElement('div');
            errorElement.textContent = errorMessage;
            errorElement.style.color = 'red';
            errorElement.classList.add('error-message');
            inputField.parentNode.insertBefore(errorElement, inputField.nextSibling);
        }
    }
}

function clearErrors() {
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach((msg) => msg.remove());
    const inputFields = form.querySelectorAll('input, textarea');
    inputFields.forEach((field) => {
        field.style.borderColor = '';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const openModalButton = document.getElementById('open-modal');
    const closeModalButtons = document.querySelectorAll('#close-modal, #close-modal-button');

    openModalButton.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});
