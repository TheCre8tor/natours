import '@babel/polyfill';
import { login, logout } from './authenticate';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';

// DOM ELEMENTS -->
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');

// DELEGATION
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (logOutBtn) {
    logOutBtn.addEventListener('click', logout);
}

if (updateDataForm) {
    updateDataForm.addEventListener('submit', async event => {
        event.preventDefault();
        document.querySelector('.btn--save-data').textContent = 'Updating...';

        const userName = document.getElementById('name').value;
        const userEmail = document.getElementById('email').value;
        await updateSettings({ email: userEmail, name: userName }, 'data');

        document.querySelector('.btn--save-data').textContent = 'Save Settings';
    });
}

if (updatePasswordForm) {
    updatePasswordForm.addEventListener('submit', async event => {
        event.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...';

        const currentPassword = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('password-confirm').value;
        await updateSettings({ currentPassword, password, confirmPassword }, 'password');

        document.querySelector('.btn--save-password').textContent = 'Save Password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}
