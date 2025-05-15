# Prenota Relazione Tecnica

Un'applicazione web per richiedere preventivi di relazioni tecniche e perizie immobiliari.

## Funzionalità

- Form per la raccolta dei dati del cliente e dell'immobile
- Invio automatico di email di conferma al cliente
- Notifica via email all'ingegnere ad ogni nuova richiesta
- Design responsive per tutti i dispositivi
- Gestione degli errori e validazione del form

## Configurazione EmailJS

L'applicazione utilizza EmailJS per l'invio delle email. Per configurare correttamente:

1. Creare un account su [EmailJS](https://www.emailjs.com/)
2. Configurare un servizio email
3. Creare un template per la conferma al cliente e la notifica all'ingegnere
4. Aggiornare gli ID del servizio e del template nel file `static/js/form.js`

Per maggiori dettagli, vedere il file `static/js/email-templates-guide.txt`.

## Deployment su GitHub Pages

L'applicazione è configurata per essere facilmente deployata su GitHub Pages:

1. Creare un repository su GitHub
2. Caricare tutti i file di questo progetto
3. Attivare GitHub Pages nelle impostazioni del repository
4. GitHub Actions si occuperà automaticamente del deployment

## Struttura dei File

- `index.html` - Pagina principale per GitHub Pages
- `templates/index.html` - Pagina principale per Flask
- `static/css/styles.css` - Stili dell'applicazione
- `static/js/form.js` - Logica di gestione del form
- `.github/workflows/static.yml` - Configurazione per GitHub Actions
- `app.py` - Server Flask (per sviluppo locale)

## Licenza

© Ing. Marco D'Amore - Tutti i diritti riservati