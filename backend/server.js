import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8000',
    'https://onlydogfanspage.github.io'
  ]
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dog Name Generator API is running!' });
});

// Generate names endpoint
app.post('/api/generate-names', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Try multiple Gemini models for compatibility
    const models = [
      'gemini-2.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-2.0-flash-lite',
      'gemini-2.5-flash',
    ];

    let response;
    let lastError;

    for (const model of models) {
      try {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        }),
      }
        );

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (generatedText) {
            const names = generatedText
              .split('\n')
              .filter((name) => name.trim())
              .slice(0, 5);

            console.log(`✅ Success with model: ${model}`);
            return res.json({ names });
          }
        }
      } catch (err) {
        lastError = err;
        console.log(`❌ Failed with model ${model}:`, err.message);
        continue;
      }
    }

    // If all models failed
    throw new Error(lastError?.message || 'All models failed to generate names');
  } catch (error) {
    console.error('Error generating names:', error);
    res.status(500).json({
      error: 'Failed to generate names. Please try again.',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Dog Name Generator API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🐕 Generate names: http://localhost:${PORT}/api/generate-names`);
});