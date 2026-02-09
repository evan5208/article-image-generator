export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);

    const API_KEY = process.env.GOOGLE_API_KEY;
    const BASE = 'https://generativelanguage.googleapis.com/v1beta';

    if (!API_KEY) {
        return res.status(500).json({ error: 'Missing GOOGLE_API_KEY' });
    }

    try {
        const { model, prompt } = req.body || {};
        if (!model || !prompt) {
            return res.status(400).json({ error: 'model and prompt required' });
        }

        const url = `${BASE}/models/${model}:generateContent?key=${API_KEY}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const raw = await response.text();
        res.status(response.status).type('application/json').send(raw);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
}
