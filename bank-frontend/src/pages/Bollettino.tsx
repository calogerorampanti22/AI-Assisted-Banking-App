import React from 'react';
import PaymentForm from '../components/PaymentForm';

const Bollettino: React.FC = () => {
    const handleScan = (scannedText: string) => {
        return {
            biller: 'Poste Italiane / Ente',
            reference: scannedText.substring(0, 12),
            amount: '120.00', // Importo fittizio
            description: 'Bollettino Precompilato'
        };
    };

    return (
        <PaymentForm
            type="BOLLETTINO"
            title="Bollettino Postale"
            billerLabel="Intestatario"
            billerPlaceholder="Es. Poste Italiane SpA"
            referenceLabel="Codice Bollettino (12 o 18 cifre)"
            referencePlaceholder="123456789012"
            descriptionPlaceholder="Causale del versamento"
            scanButtonLabel="Scansiona Bollettino"
            successMessage="Pagamento Bollettino effettuato con successo!"
            onScan={handleScan}
        />
    );
};

export default Bollettino;
