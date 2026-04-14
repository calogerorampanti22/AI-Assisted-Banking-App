import csv

# Configurazione nomi file
file_input = '1000 Register Request.csv'  # Il file con 10 colonne
file_output = '1000 Login Request.csv' # Il file che otterrai con 2 colonne

try:
    with open(file_input, mode='r', encoding='utf-8') as infile:
        # DictReader legge la prima riga e usa i nomi delle colonne come chiavi
        reader = csv.DictReader(infile)
        
        with open(file_output, mode='w', newline='', encoding='utf-8') as outfile:
            # Definiamo le colonne che vogliamo nel nuovo file
            fieldnames = ['email', 'password']
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)
            
            # Scriviamo l'intestazione (email, password)
            writer.writeheader()
            
            # Cicliamo su ogni riga del file originale
            for row in reader:
                # Scriviamo solo i dati che ci interessano
                writer.writerow({
                    'email': row['email'],
                    'password': row['password']
                })
                
    print(f"✅ Estrazione completata! Il file '{file_output}' è pronto.")

except FileNotFoundError:
    print(f"❌ Errore: Non ho trovato il file '{file_input}'. Controlla il nome!")
except KeyError as e:
    print(f"❌ Errore: Nel file mancano le colonne richieste. Errore su: {e}")