require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: 'sz-postgres',
    database: process.env.DB_NAME
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/items', async (req, res) => {
    const result = await pool.query('SELECT * FROM items ORDER BY id');
    res.json(result.rows);
});

app.post('/api/items', async (req, res) => {
    const { text } = req.body;
    const result = await pool.query('INSERT INTO items (text) VALUES ($1) RETURNING *', [text]);
    res.status(201).json(result.rows[0]);
});

app.delete('/api/items/:id', async (req, res) => {
    await pool.query('DELETE FROM items WHERE id = $1', [req.params.id]);
    res.status(204).end();
});

const port = 3000;
app.listen(port, async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL
  )`);
    console.log(`Server running on port ${port}`);
});
