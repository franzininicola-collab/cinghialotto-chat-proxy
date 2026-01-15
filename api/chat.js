// Vercel Serverless Function - Proxy per Gemini API
// Questo file gestisce le richieste chat in modo sicuro, nascondendo la chiave API

export default async function handler(req, res) {
    // CORS headers per permettere richieste dal sito
    res.setHeader('Access-Control-Allow-Origin', '*'); // In produzione, sostituisci con 'https://www.pennellicinghiale.it'
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Solo POST permesso
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metodo non permesso' });
    }

    try {
        const { chatHistory, systemPrompt } = req.body;

        if (!chatHistory || !Array.isArray(chatHistory)) {
            return res.status(400).json({ error: 'chatHistory richiesto' });
        }

        // Chiave API sicura lato server (da variabile d'ambiente)
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        
        if (!GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY non configurata');
            return res.status(500).json({ error: 'Configurazione server mancante' });
        }

        const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent';

        // Costruisci la richiesta per Gemini
        const requestBody = {
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: chatHistory,
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 600
            }
        };

        // Chiama Gemini API
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        // Gestisci errori da Gemini
        if (data.error) {
            console.error('Errore Gemini API:', data.error);
            return res.status(500).json({ error: data.error.message || 'Errore API Gemini' });
        }

        // Restituisci la risposta al client
        return res.status(200).json(data);

    } catch (error) {
        console.error('Errore server:', error);
        return res.status(500).json({ error: 'Errore interno del server' });
    }
}
