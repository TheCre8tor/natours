// Type is 'success' or 'error'

export const hideAlert = () => {
    const element = document.querySelector('.alert');
    if (element) {
        element.parentElement.removeChild(element);
    }
};

export const showAlert = (type, msg) => {
    hideAlert();
    const markUp = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markUp);
    window.setTimeout(hideAlert, 5000);
};
