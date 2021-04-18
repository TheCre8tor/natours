import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email: email,
                password: password
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');

            // Redirect after Logged In
            window.setTimeout(() => {
                // Redirect to Homepage -->
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
        // console.log(err.response.data);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout'
        });

        /* RELOAD THE CURRENT PAGE:
         * Reloads the page from the server (e.g. does not store
         * the data cached by the browser) */
        if (res.data.status === 'success') {
            window.location.reload(true);
        }
    } catch (err) {
        console.log(err);
        showAlert('error', 'Error logging out! Try again.');
    }
};
