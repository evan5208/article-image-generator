import express from "express";
const app = express();
app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});

const API_KEY = process.env.GOOGLE_API_KEY;
const BASE = "https://generativelanguage.googleapis.com/v1beta";

function mustKey() {
    if (!API_KEY) {
        const msg = "Missing GOOGLE_API_KEY in environment. Example: export GOOGLE_API_KEY='AIzaSy...'";
        throw new Error(msg);
    }
}

app.get("/api/health", (req, res) => {
    res.json({ ok: true, hasKey: !!API_KEY, keyLen: API_KEY ? API_KEY.length : 0 });
});

app.get("/api/models", async (req, res) => {
    try {
        mustKey();
        const r = await fetch(`${BASE}/models?key=${API_KEY}`);
        const text = await r.text();
        res.status(r.status).type("application/json").send(text);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.post("/api/generate", async (req, res) => {
    try {
        mustKey();
        const { model, prompt } = req.body || {};
        if (!model || !prompt) {
            return res.status(400).json({ error: "model and prompt required" });
        }
        const url = `${BASE}/models/${model}:generateContent?key=${API_KEY}`;
        // 不指定 responseModalities，让模型根据 prompt 决定是否生成图片
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
        };
        const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const raw = await r.text();
        res.status(r.status).type("application/json").send(raw);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.listen(8787, () => {
    console.log("Gemini proxy server: http://127.0.0.1:8787");
    console.log("Health check: http://127.0.0.1:8787/api/health");
});
