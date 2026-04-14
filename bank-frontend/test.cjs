const axios = require('axios');

async function test() {
    try {
        // Login 
        const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
            username: 'freshtest',
            password: 'testpass'
        });
        const token = loginRes.data.token;
        console.log('Got token:', token.substring(0, 30) + '...');

        const headers = { Authorization: `Bearer ${token}` };

        // Add a beneficiary
        console.log('\n1) Adding beneficiary...');
        const addRes = await axios.post('http://localhost:8080/api/beneficiaries', {
            firstName: 'Mario',
            lastName: 'Rossi',
            iban: 'IT60X0542811101000000123456'
        }, { headers });
        const created = addRes.data;
        console.log('Created:', created.id, created.firstName, created.lastName);

        // Get beneficiaries
        console.log('\n2) Getting beneficiaries...');
        const listRes = await axios.get('http://localhost:8080/api/beneficiaries', { headers });
        console.log('Count:', listRes.data.length);
        console.log('List:', JSON.stringify(listRes.data, null, 2));

        // Delete the created one
        console.log('\n3) Deleting beneficiary id:', created.id);
        const deleteRes = await axios.delete(`http://localhost:8080/api/beneficiaries/${created.id}`, { headers });
        console.log('Delete status:', deleteRes.status);

    } catch (err) {
        console.error('\nError during request:', err.config ? err.config.method.toUpperCase() + ' ' + err.config.url : '');
        console.error('Status:', err.response ? err.response.status : 'no response');
        console.error('Body:', err.response ? JSON.stringify(err.response.data) : err.message);
    }
}

test();
