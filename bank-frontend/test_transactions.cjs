const axios = require('axios');

async function t() {
    try {
        const u = 'test4_' + Date.now();
        await axios.post('http://localhost:8080/api/auth/register', { username: u, password: 'p', firstName: 'A', lastName: 'B', initialDeposit: 500, nationality: 'IT', age: 30, idCardNumber: u, taxId: u });
        const token = (await axios.post('http://localhost:8080/api/auth/login', { username: u, password: 'p' })).data.token;

        await axios.post('http://localhost:8080/api/transactions/transfer',
            { amount: 10, type: 'OUT', relatedAccountNumber: 'IT31649263242E434E8CF580', description: 't', recipientFirstName: 'Carlo', recipientLastName: 'Bianchi' },
            { headers: { Authorization: 'Bearer ' + token } }
        );

        const tx = await axios.get('http://localhost:8080/api/transactions', { headers: { Authorization: 'Bearer ' + token } });
        console.log('TXS Length:', tx.data.length);
        console.log('TXS:', JSON.stringify(tx.data, null, 2));
    } catch (e) {
        if (e.response) {
            console.error('API Error:', e.response.status, e.response.data);
        } else {
            console.error('Sys Error:', e.message);
        }
    }
}
t();
