const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./database.js');
require('dotenv').config(); // Muat variabel lingkungan

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3001;

// --- Inisialisasi AI ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // Limit 10MB

// --- API Endpoints ---
app.get('/api/log/today', (req, res) => {
  const today = new Date().toLocaleDateString();
  db.all('SELECT * FROM food_log WHERE date = ?', [today], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post('/api/food/manual', (req, res) => {
  const { name, calories, protein, mealTime } = req.body;
  if (!name || calories === undefined || protein === undefined || !mealTime) {
    return res.status(400).json({ error: 'Semua field harus diisi.' });
  }
  const date = new Date().toLocaleDateString();
  const sql = 'INSERT INTO food_log (name, calories, protein, mealTime, date) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [name, calories, protein, mealTime, date], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.status(201).json({ id: this.lastID, name, calories, protein, mealTime, date });
  });
});

// --- Endpoint Analisis AI ---
app.post('/api/food/analyze', upload.single('foodImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Tidak ada file gambar yang diunggah.' });
  }

  try {
    const imageBuffer = req.file.buffer;
    const imageBase64 = imageBuffer.toString("base64");
    const mimeType = req.file.mimetype;
    const description = req.body.description; // Ambil deskripsi

    let prompt = `
      Analyze the food items in this image. Based on your analysis, provide a realistic estimation of the nutritional content.
      Your response MUST be a valid JSON object. Do not include any text, explanation, or markdown formatting before or after the JSON object.
      The JSON object should have the following structure:
      {
        "detectedItems": [
          { "name": "...", "calories": ..., "protein": ... },
          ...
        ],
        "total": { "calories": ..., "protein": ... }
      }
      Please identify each distinct food item and provide its estimated calories (in kcal) and protein (in grams). Sum these values to get the total.
      If the image does not contain food, return an empty "detectedItems" array and zero for the totals.
    `;

    if (description) {
      prompt += `\n\nFor additional context, the user has provided the following description: "${description}". Use this to improve the accuracy of your analysis.`;
    }

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Membersihkan respons untuk memastikan itu adalah JSON yang valid
    const jsonResponse = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());

    res.json(jsonResponse);

  } catch (error) {
    console.error('Error with Gemini AI:', error);
    res.status(500).json({ error: 'Gagal menganalisis gambar dengan AI.' });
  }
});

app.get('/api/targets', (req, res) => {
  db.get('SELECT calorieTarget, proteinTarget FROM targets WHERE id = 1', (err, row) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(row);
  });
});

app.post('/api/targets', (req, res) => {
  const { calorieTarget, proteinTarget } = req.body;
  if (calorieTarget === undefined || proteinTarget === undefined) {
    return res.status(400).json({ error: 'Target kalori dan protein harus diisi.' });
  }
  const sql = 'UPDATE targets SET calorieTarget = ?, proteinTarget = ? WHERE id = 1';
  db.run(sql, [calorieTarget, proteinTarget], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Target berhasil disimpan.', targets: { calorieTarget, proteinTarget } });
  });
});

// Endpoint untuk mereset semua data
app.delete('/api/reset', (req, res) => {
  db.serialize(() => {
    // Hapus semua entri dari log makanan
    db.run('DELETE FROM food_log', function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
    });

    // Reset target ke nilai default
    db.run('UPDATE targets SET calorieTarget = 2500, proteinTarget = 120 WHERE id = 1', function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
    });

    res.json({ message: 'Semua data berhasil direset.' });
  });
});

app.listen(port, () => {
  console.log(`Backend server berjalan di http://localhost:${port}`);
});
