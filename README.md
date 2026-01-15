# 🐗 Cinghialotto Chat Proxy

Backend serverless per il chatbot Cinghialotto che fa da proxy sicuro verso l'API Gemini.

## 🔒 Perché questo proxy?

La chiave API di Gemini non deve MAI essere esposta nel codice JavaScript del browser. Questo proxy:
- Mantiene la chiave API **sicura sul server**
- Permette di implementare **rate limiting** (opzionale)
- Fornisce **logging** delle richieste (opzionale)
- Blocca richieste non autorizzate

## 🚀 Deploy su Vercel (Gratuito)

### 1. Prerequisiti
- Account GitHub
- Account Vercel (gratis, registrati con GitHub)

### 2. Passaggi

1. **Crea un repository GitHub** con il contenuto di questa cartella `api-proxy`

2. **Vai su [vercel.com](https://vercel.com)** e fai login con GitHub

3. **Clicca "New Project"** e seleziona il repository

4. **Configura le variabili d'ambiente:**
   - Vai su Settings → Environment Variables
   - Aggiungi: `GEMINI_API_KEY` = `la_tua_chiave_gemini`

5. **Deploy!** Vercel farà tutto automaticamente

6. **Copia l'URL** del deploy (es. `https://tuo-progetto.vercel.app`)

### 3. Aggiorna il frontend

Nel file `index.html` e `manutenzione.html`, la costante `CHAT_API_URL` deve puntare al tuo deploy:

```javascript
const CHAT_API_URL = 'https://tuo-progetto.vercel.app/api/chat';
```

## 📁 Struttura

```
api-proxy/
├── api/
│   └── chat.js      # Serverless function
├── .env.example     # Esempio variabili ambiente
├── .gitignore       # File da ignorare
├── package.json     # Configurazione progetto
├── vercel.json      # Configurazione Vercel
└── README.md        # Questa guida
```

## 🔧 Test locale (opzionale)

```bash
# Installa Vercel CLI
npm i -g vercel

# Avvia ambiente locale
vercel dev
```

## 📞 Endpoint API

### POST /api/chat

**Request body:**
```json
{
  "chatHistory": [
    { "role": "user", "parts": [{ "text": "Come si applica la pittura?" }] }
  ],
  "systemPrompt": "Sei Cinghialotto, l'esperto di pittura..."
}
```

**Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [{ "text": "Ciao! Per applicare la pittura..." }]
      }
    }
  ]
}
```

## ⚠️ Sicurezza

- **MAI committare** il file `.env` con la chiave reale
- In produzione, limita CORS solo al dominio `pennellicinghiale.it`
- Considera l'aggiunta di rate limiting per prevenire abusi
