const fs = require('fs');
const path = require('path');

const files = [
    'src/pages/Bollettino.tsx',
    'src/pages/PagoPA.tsx',
    'src/pages/PhoneTopUp.tsx',
    'src/pages/Profile.tsx',
    'src/pages/Register.tsx',
    'src/pages/SavingsGoals.tsx',
    'src/pages/Transfer.tsx'
];

files.forEach(file => {
    const fullPath = path.join('c:\\Users\\calor\\Banking App\\bank-frontend', file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        // Replace React.FormEvent with React.SyntheticEvent<HTMLFormElement>
        content = content.replace(/React\.FormEvent(?![<])/g, 'React.SyntheticEvent<HTMLFormElement>');
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`File not found: ${file}`);
    }
});
