// Initialize EmailJS con gestione errori
(function() {
  try {
    // Public key
    emailjs.init("V21dWVAkg1V_bX0iH");
    console.log("EmailJS inizializzato correttamente");
  } catch (error) {
    console.error("Errore durante l'inizializzazione di EmailJS:", error);
  }
})();

// Funzione di debug per aiutare a risolvere i problemi
function debug(message) {
  console.log(message);
  const debugOutput = document.getElementById('debugOutput');
  const debugConsole = document.querySelector('.debug-console');
  
  if (debugOutput && debugConsole) {
    // Mostra la console di debug in modalità sviluppo
    debugConsole.style.display = 'block';
    
    // Aggiungi il messaggio alla console
    const logEntry = document.createElement('div');
    logEntry.textContent = new Date().toLocaleTimeString() + ': ' + message;
    debugOutput.appendChild(logEntry);
    
    // Auto-scroll al fondo
    debugOutput.scrollTop = debugOutput.scrollHeight;
  }
}

// Elements
const form = document.getElementById('prenotazioneForm');
const formFields = document.getElementById('formFields');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const submitButton = document.getElementById('submitButton');

// Function to show loading spinner
function showLoadingSpinner() {
  loadingSpinner.style.display = 'block';
  formFields.style.display = 'none';
  submitButton.style.display = 'none';
}

// Function to hide loading spinner
function hideLoadingSpinner() {
  loadingSpinner.style.display = 'none';
}

// Function to show success message
function showSuccessMessage() {
  successMessage.style.display = 'block';
  formFields.style.display = 'none';
  submitButton.style.display = 'none';
}

// Function to show error message
function showErrorMessage(errorText) {
  errorMessage.style.display = 'block';
  formFields.style.display = 'none';
  submitButton.style.display = 'none';
  
  // Se abbiamo un messaggio di errore specifico, aggiorniamo il testo
  if (errorText) {
    const errorMsgElement = errorMessage.querySelector('p');
    if (errorMsgElement) {
      errorMsgElement.textContent = errorText;
    }
  }
}

// Function to hide error message
function hideErrorMessage() {
  errorMessage.style.display = 'none';
  formFields.style.display = 'block';
  submitButton.style.display = 'block';
  
  // Ripristina il messaggio di errore predefinito
  const errorMsgElement = errorMessage.querySelector('p');
  if (errorMsgElement) {
    errorMsgElement.textContent = 'Non è stato possibile inviare la tua richiesta. Si prega di riprovare più tardi.';
  }
}

// Form submission handler
form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Show loading spinner
  showLoadingSpinner();
  
  const formData = new FormData(form);
  
  // Crea un oggetto con tutti i parametri per l'email al cliente
  const customerTemplateParams = {
    nome: formData.get("nome"),
    cognome: formData.get("cognome"),
    codiceFiscale: formData.get("codiceFiscale"),
    email: formData.get("email"),
    ubicazione: formData.get("ubicazione"),
    tipoImmobile: formData.get("tipoImmobile"),
    grandezzaImmobile: formData.get("grandezzaImmobile"),
    haVisura: formData.has("haVisura") ? "Sì" : "No",
    proprietario: formData.has("proprietario") ? "Sì" : "No",
    privacy: formData.has("privacy") ? "Accettata" : "Non accettata",
    to_name: `${formData.get("nome")} ${formData.get("cognome")}`,
    to_email: formData.get("email"),
    from_name: "Studio di Consulenza Tecnica",
    subject: "Conferma richiesta di relazione tecnica di stima"
  };
  
  // Crea una copia con gli stessi parametri ma con l'email dell'ingegnere
  const ownerTemplateParams = {
    ...customerTemplateParams,
    to_email: "ing.marcodamore@gmail.com",
    to_name: "Ing. Marco D'Amore",
    subject: "Nuova richiesta di relazione tecnica"
  };
  
  debug("Invio email al cliente con i seguenti parametri: " + JSON.stringify(customerTemplateParams));
  debug("Invio email al proprietario con i seguenti parametri: " + JSON.stringify(ownerTemplateParams));
  
  // Verifica che tutti i campi obbligatori siano presenti
  if (!customerTemplateParams.nome || !customerTemplateParams.cognome || !customerTemplateParams.email || 
      !customerTemplateParams.ubicazione || !customerTemplateParams.tipoImmobile || !customerTemplateParams.grandezzaImmobile) {
    debug("ERRORE: Mancano campi obbligatori nel form");
    hideLoadingSpinner();
    showErrorMessage("Per favore, compila tutti i campi obbligatori.");
    return;
  }
  
  // Controllo di validità sull'indirizzo email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(customerTemplateParams.email)) {
    debug("ERRORE: Formato email non valido");
    hideLoadingSpinner();
    showErrorMessage("Per favore, inserisci un indirizzo email valido.");
    return;
  }
  
  debug("Invio email di conferma al cliente usando il servizio service_gaa9bxh e il template template_n9xghph");
  
  // Prima inviamo l'email di conferma al cliente
  emailjs.send("service_gaa9bxh", "template_n9xghph", customerTemplateParams)
    .then(function(response) {
      debug('Email al cliente inviata con successo! Status: ' + response.status + ', Text: ' + response.text);
      
      // Dopo il successo, inviamo l'email di notifica al proprietario
      debug("Invio email di notifica al proprietario usando il template specifico to_professionista (template_oxau0aa)...");
      return emailjs.send("service_gaa9bxh", "template_oxau0aa", ownerTemplateParams);
    })
    .then(function(response) {
      debug('Email al proprietario inviata con successo! Status: ' + response.status + ', Text: ' + response.text);
      
      // Mostriamo la conferma di successo solo quando entrambe le email sono state inviate
      hideLoadingSpinner();
      showSuccessMessage();
      
      // Reset form
      form.reset();
      
      // Store submission in localStorage to prevent multiple submissions
      localStorage.setItem('formSubmitted', 'true');
      localStorage.setItem('submissionTime', new Date().toString());
    })
    .catch(function(error) {
      debug('ERRORE durante invio email: ' + JSON.stringify(error));
      hideLoadingSpinner();
      
      let errorMessage = 'Non è stato possibile inviare la tua richiesta. Si prega di riprovare più tardi.';
      
      // Mostra un messaggio di errore più specifico se disponibile
      if (error && error.text) {
        errorMessage += ' Dettaglio errore: ' + error.text;
        debug('Dettaglio errore: ' + error.text);
      }
      
      // Verifica problemi specifici
      if (error && error.status === 0) {
        debug('Possibile problema di connessione internet o CORS');
        errorMessage = 'Impossibile contattare il server di posta. Verifica la tua connessione internet e riprova.';
      }
      
      if (error && error.status === 400) {
        debug('Errore 400: Richiesta non valida. Possibile problema con i parametri o il template.');
        errorMessage = 'Errore nella compilazione dei dati. Verifica tutti i campi e riprova.';
      }
      
      if (error && error.status === 401 || error && error.status === 403) {
        debug('Errore di autenticazione con EmailJS');
        errorMessage = 'Errore di autenticazione con il servizio email. Contatta l\'amministratore.';
      }
      
      showErrorMessage(errorMessage);
    });
});

// Form validation enhancements
const inputs = form.querySelectorAll('input[required], select[required]');
inputs.forEach(input => {
  input.addEventListener('blur', function() {
    if (!this.validity.valid) {
      this.style.borderColor = '#e74c3c';
    } else {
      this.style.borderColor = '#ccc';
    }
  });
  
  input.addEventListener('input', function() {
    if (this.validity.valid) {
      this.style.borderColor = '#ccc';
    }
  });
});

// Check for previous successful submission
document.addEventListener('DOMContentLoaded', function() {
  const formSubmitted = localStorage.getItem('formSubmitted');
  const submissionTime = localStorage.getItem('submissionTime');
  
  if (formSubmitted === 'true' && submissionTime) {
    const submissionDate = new Date(submissionTime);
    const currentDate = new Date();
    const hoursDiff = (currentDate - submissionDate) / (1000 * 60 * 60);
    
    // If form was submitted less than 24 hours ago, show the success message
    if (hoursDiff < 24) {
      showSuccessMessage();
    } else {
      // Clear the localStorage after 24 hours
      localStorage.removeItem('formSubmitted');
      localStorage.removeItem('submissionTime');
    }
  }
});
