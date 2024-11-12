import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { files } = await parseMultipartForm(event);
    const imageFile = files[0];
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Identify and list all ingredients visible in this image. Include approximate quantities if possible. Format the response as a comma-separated list.";
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageFile.content.toString('base64'),
          mimeType: imageFile.type
        }
      }
    ]);

    const response = await result.response;
    
    if (!response.text()) {
      throw new Error('No ingredients detected in the image');
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        success: true,
        ingredients: response.text() 
      })
    };
  } catch (error: any) {
    return {
      statusCode: 200, // Keep 200 to handle errors gracefully on client
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to analyze image'
      })
    };
  }
};