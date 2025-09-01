import fetch from 'node-fetch';

// This function acts as a proxy to the Gemini API endpoints.
// It uses the API key stored securely as an environment variable on Vercel.
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { type, payload } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API key is not configured.' });
        }

        let apiUrl = '';
        if (type === 'text') {
            apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        } else if (type === 'audio') {
            apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
        } else {
            return res.status(400).json({ error: 'Invalid request type.' });
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('API Error:', result);
            return res.status(response.status).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
