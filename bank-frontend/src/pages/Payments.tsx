import React from 'react';
import ServiceCard from '../components/ServiceCard';

const Payments: React.FC = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Pagamenti e Servizi</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <ServiceCard
                    title="Ricarica Telefonica"
                    description="Ricarica il tuo credito o quello dei tuoi contatti in pochi secondi."
                    icon="bi-phone"
                    route="/phone-topup"
                    color="var(--success)"
                    borderColor="var(--success)"
                />

                <ServiceCard
                    title="PagoPA"
                    description="Paga tasse, multe e servizi pubblici in modo rapido e sicuro."
                    icon="bi-bank"
                    route="/pagopa"
                />

                <ServiceCard
                    title="Bollettino Postale"
                    description="Paga bollettini bianchi e premarcati comodamente da casa."
                    icon="bi-file-earmark-text"
                    route="/bollettino"
                />
            </div>
        </div>
    );
};

export default Payments;
