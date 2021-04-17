// const login = async (email, password) => {
//     console.log(email, password);
//
//     try {
//         const res = await axios({
//             method: 'POST',
//             url: 'http://127.0.0.1:3000/api/v1/users/login',
//             data: {
//                 email: email,
//                 password: password
//             }
//         });
//
//         console.log(res);
//     } catch (err) {
//         console.log(err);
//     }
// };

document.querySelector('.form').addEventListener('submit', async event => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // login(email, password);

    console.log(email, password);

    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email: email,
                password: password
            }
        });

        console.log(res);
    } catch (err) {
        console.log(err.response.data);
    }
});
