import axios from 'axios';
import { showAlert } from './alert';
import { logout } from './authenticate';

// This function update either DATA or Password -->
const updateSettings = async (data, type) => {
    try {
        const url = type === 'password' ? 'update-password' : 'update-profile';
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/users/${url}`,
            data: data,
        });

        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} Updated Successfully!`);

            if (type === 'data') {
                window.setTimeout(() => {
                    window.location.reload(true);
                }, 1500);
            } else {
                await logout();
            }
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export default updateSettings;
