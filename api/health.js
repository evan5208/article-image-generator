export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const API_KEY = process.env.GOOGLE_API_KEY;
    res.json({
        ok: true,
        hasKey: !!API_KEY,
        keyLen: API_KEY ? API_KEY.length : 0,
    });
}
