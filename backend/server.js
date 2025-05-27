require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: 'sz-postgres',
    database: process.env.DB_NAME
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// REST API
app.get('/api/moods', async (req, res) => {
    const result = await pool.query('SELECT * FROM moods ORDER BY id DESC LIMIT 20');
    res.json(result.rows);
});

app.post('/api/moods', async (req, res) => {
    const { name, mood } = req.body;
    const result = await pool.query(
        'INSERT INTO moods (name, mood) VALUES ($1, $2) RETURNING *',
        [name, mood]
    );
    const newMood = result.rows[0];
    res.status(201).json(newMood);

    // Notify all WebSocket clients
    const message = JSON.stringify({ type: 'new_mood', payload: newMood });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
});

// WebSocket
wss.on('connection', ws => {
    console.log('Client connected to WebSocket');
});

// DB connection with retry
const port = 3000;
async function connectWithRetry() {
    try {
        await pool.connect();
        console.log("Connected to DB");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS moods (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                mood TEXT NOT NULL,
                timestamp TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        server.listen(port, '0.0.0.0', () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error("Postgres not ready, retrying in 3s...");
        setTimeout(connectWithRetry, 3000);
    }
}

connectWithRetry();
