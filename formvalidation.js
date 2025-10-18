const form = document.getElementById('contact-form');
const email = document.getElementById('form-email');
const name = document.getElementById('form-name');
const confirm = document.getElementById('form-confirm');
const errorContainer = document.getElementById('form-errors');

form.addEventListener('submit', (e) => {
    let errorMessages = [];
    if (!name.checkValidity()) {
        e.preventDefault();
        if (name.validity.patternMismatch) {
            addErrorMsg(errorMessages, name, 'Must not contain numbers.')
        } else {
            addErrorMsg(errorMessages, name, 'Unknown error.')
        }
    }

    if (!email.checkValidity()) {
        e.preventDefault(); // prevent form submission
        if (email.validity.valueMissing) {
            addErrorMsg(errorMessages, email, 'Email is required.')
        } else if (email.validity.patternMismatch) {
            addErrorMsg(errorMessages, email, 'Email must contain "@" and a period.')
        } else if (email.validity.typeMismatch) {
            addErrorMsg(errorMessages, email, 'Please enter a valid email address.')
        } else {
            addErrorMsg(errorMessages, email, 'Invalid email.')
        }
    }

    if (!confirm.checkValidity()) {
        e.preventDefault();
        if (confirm.validity.valueMissing) {
            addErrorMsg(errorMessages, confirm, 'Must be checked.')
        } else {
            addErrorMsg(errorMessages, confirm, 'Unknown error.')
        }
    }

    errorContainer.innerHTML = "";
    if (errorMessages.length > 0) {
        for (const error of errorMessages) {
            let p = document.createElement('p');
            p.innerHTML = error;
            errorContainer.appendChild(p)
        }
    }
});

function addErrorMsg(errorMessages, inputElement, errorMessage) {
    errorMessages.push(inputElement.name + ': ' + errorMessage);
}