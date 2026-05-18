import React from 'react';
import PaymentForm from '../components/PaymentForm';

const PagoPA: React.FC = () => {
    const handleScan = (scannedText: string) => {
        return {
            biller: 'PagoPA - Ente Creditore',
            reference: scannedText.substring(0, 18),
            amount: '50.00', // Importo fittizio da QR
            description: 'Pagamento Multa / Tassa PagoPA'
        };
    };

    return (
        <PaymentForm
            type="PAGOPA"
            title="Pagamento PagoPA"
            billerLabel="Ente Creditore"
            billerPlaceholder="Es. Comune di Roma"
            referenceLabel="Codice Avviso (IUV)"
            referencePlaceholder="000000000000000000"
            descriptionPlaceholder="Causale del versamento"
            scanButtonLabel="Scansiona Avviso PagoPA"
            successMessage="Pagamento PagoPA effettuato con successo!"
            onScan={handleScan}
        />
    );
};

export default PagoPA;
