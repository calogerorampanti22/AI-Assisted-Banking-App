const fs = require('fs');
const path = require('path');

const files = [
    'src/pages/SavingsGoals.tsx',
    'src/pages/Profile.tsx',
    'src/pages/PhoneTopUp.tsx',
    'src/pages/PagoPA.tsx',
    'src/pages/Bollettino.tsx',
    'src/components/BottomBar.tsx'
];

files.forEach(file => {
    const fullPath = path.join('c:\\Users\\calor\\Banking App\\bank-frontend', file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        // Replace <i className= with <span className=
        content = content.replace(/<i className=/g, '<span className=');
        // Replace </i> with </span>
        content = content.replace(/<\/i>/g, '</span>');
        // Handle self-closing <i> if any (e.g. <i className="..." />)
        content = content.replace(/<i (.*?) \/>/g, '<span $1 />');
        
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`File not found: ${file}`);
    }
});
