import csv
import random
from datetime import datetime, timedelta

# Liste per dati verosimili
nomi_m = ["Mario", "Luca", "Stefano", "Alessandro", "Giuseppe", "Francesco", "Roberto"]
nomi_f = ["Giulia", "Elena", "Chiara", "Francesca", "Valentina", "Martina", "Sofia"]
cognomi = ["Rossi", "Bianchi", "Verdi", "Ferrari", "Russo", "Esposito", "Romano", "Gallo", "Costa"]
citta = [("Roma", "H501"), ("Milano", "F205"), ("Napoli", "F839"), ("Torino", "L219"), ("Firenze", "D612")]

def genera_cf(nome, cognome, data, cod_belfiore):
    # Generatore semplificato di Codice Fiscale (struttura 16 caratteri)
    base = (cognome[:3] + nome[:3] + data.strftime("%y") + "A" + data.strftime("%d") + cod_belfiore + "X").upper()
    return base.ljust(16, '0')

with open('1000 Register Request.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(["password", "email", "initialDeposit", "firstName", "lastName", "nationality", "birthday", "birthPlace", "idCardNumber", "taxId"])
    
    for i in range(1000):
        sesso = random.choice(['M', 'F'])
        nome = random.choice(nomi_m if sesso == 'M' else nomi_f)
        cognome = random.choice(cognomi)
        luogo = random.choice(citta)
        
        # Data di nascita tra 18 e 60 anni fa
        data_nascita = datetime.now() - timedelta(days=random.randint(6570, 22000))
        
        writer.writerow([
            f"SecretPass_{i}!",
            f"{nome.lower()}.{cognome.lower()}.{i}@example.com",
            round(random.uniform(10.0, 50000.0), 2),
            nome,
            cognome,
            "Italiana",
            data_nascita.strftime("%Y-%m-%d"),
            luogo[0],
            f"CA{i:05d}ZZ",
            genera_cf(nome, cognome, data_nascita, luogo[1])
        ])

print("File '1000 Register Request.csv' generato con successo!")