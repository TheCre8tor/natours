import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
    'pk_test_51Iih6gETtKG5xBkZenwQJ3C8MIf8xaAr3R8dSc9iSj34asWxzTuTfNxvYgCLWP5YiwWkcSi9Ny8sf6JjfdzmWA7400ulWNFk0K'
);

export const bookTour = async tourId => {
    try {
        // 1) get checkout session from API -->
        const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
        console.log(session);

        // 2) Create checkout form + charge credit card -->
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};
