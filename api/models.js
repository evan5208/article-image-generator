export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.sendStatus(200);

    const API_KEY = process.env.GOOGLE_API_KEY;
    const BASE = 'https://generativelanguage.googleapis.com/v1beta';

    if (!API_KEY) {
        return res.status(500).json({ error: 'Missing GOOGLE_API_KEY' });
    }

    try {
        const response = await fetch(`${BASE}/models?key=${API_KEY}`);
        const text = await response.text();
        res.status(response.status).type('application/json').send(text);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
}
