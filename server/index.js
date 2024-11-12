import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFile } from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const upload = multer();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Load recipe knowledge base from Excel
const workbook = readFile(path.join(__dirname, 'data/recipes.xlsx'));
const recipeData = workbook.Sheets[workbook.SheetNames[0]];
const recipes = readFile.utils.sheet_to_json(recipeData);

app.use(cors());
app.use(express.json());

// Analyze ingredients from text input
app.post('/api/analyze-ingredients', async (req, res) => {
  try {
    const { ingredients } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze these ingredients and suggest possible dishes: ${ingredients.join(', ')}. 
                   Consider common cooking techniques and flavor combinations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({ suggestions: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate recipe with nutritional info
app.post('/api/generate-recipe', async (req, res) => {
  try {
    const { ingredients, cuisine, restrictions, proficiency } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Create a detailed recipe using these ingredients: ${ingredients.join(', ')}
                   Cuisine type: ${cuisine}
                   Dietary restrictions: ${restrictions.join(', ')}
                   Cook's proficiency: ${proficiency}
                   
                   Include:
                   1. Step-by-step instructions
                   2. Cooking time and difficulty level
                   3. Nutritional information per serving
                   4. Cultural background and history
                   5. Plating suggestions`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({ recipe: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Image analysis for ingredient recognition
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const prompt = "Identify and list all ingredients visible in this image. Include approximate quantities if possible.";
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: req.file.buffer.toString('base64'),
          mimeType: req.file.mimetype
        }
      }
    ]);

    const response = await result.response;
    res.json({ ingredients: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});