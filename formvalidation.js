const form = document.getElementById('contact-form');
const submitButton = document.getElementById('form-submit');
const emailTextField = document.getElementById('form-email');
const nameTextField = document.getElementById('form-name');
const confirmCheckbox = document.getElementById('form-confirm');
const errorContainer = document.getElementById('form-errors');

confirmCheckbox.addEventListener("change", (e) => {
    submitButton.disabled = !confirmCheckbox.checked;
});

form.addEventListener('submit', (e) => {
    let errorMessagesList = [];
    if (!nameTextField.checkValidity()) {
        e.preventDefault();
        if (nameTextField.validity.patternMismatch) {
            addErrorMessageToList(errorMessagesList, nameTextField, 'Must not contain numbers.')
        } else {
            addErrorMessageToList(errorMessagesList, nameTextField, 'Unknown error.')
        }
    }

    if (!emailTextField.checkValidity()) {
        e.preventDefault(); // prevent form submission
        if (emailTextField.validity.valueMissing) {
            addErrorMessageToList(errorMessagesList, emailTextField, 'Email is required.')
        } else if (emailTextField.validity.patternMismatch) {
            addErrorMessageToList(errorMessagesList, emailTextField, 'Email must contain "@" and a period.')
        } else if (emailTextField.validity.typeMismatch) {
            addErrorMessageToList(errorMessagesList, emailTextField, 'Please enter a valid email address.')
        } else {
            addErrorMessageToList(errorMessagesList, emailTextField, 'Invalid email.')
        }
    }

    errorContainer.innerHTML = "";
    if (errorMessagesList.length > 0) {
        for (const error of errorMessagesList) {
            let p = document.createElement('p');
            p.innerHTML = error;
            errorContainer.appendChild(p)
        }
    }
});

function addErrorMessageToList(errorMessages, inputElement, errorMessage) {
    errorMessages.push(inputElement.name + ': ' + errorMessage);
}