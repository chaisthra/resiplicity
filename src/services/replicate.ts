import Replicate from 'replicate';
import { Buffer } from 'buffer';
const encodedData = Buffer.from('Some data', 'utf-8');
interface ReplicateResponse {
  error?: string;
  output?: string[];
}

export const generatePlatingImage = async (recipe: {
  title: string;
  description: string;
  plating: string;
}): Promise<string> => {
  try {
    const replicate = new Replicate({
      auth: import.meta.env.VITE_REPLICATE_API_TOKEN,
    });

    // Create a retro-style prompt based on the recipe
    const prompt = `A photo of ${recipe.title} in classic 70s style. 
                   ${recipe.description}. 
                   Styled like a vintage cookbook photo, 
                   with bold colors and retro plating presentation.
                   Garnished with typical 70s decorations.`;

    const output = await replicate.run(
      "fofr/flux-bad-70s-food:bca7e1eae47786328b0745fc0a1188b26e979197c980087485f099543fd9f85b",
      {
        input: {
          prompt,
          aspect_ratio: "3:2",
          output_quality: 80,
          num_outputs: 1
        }
      }
    ) as string[];

    if (!output || !output.length) {
      throw new Error('No image generated');
    }

    return output[0];
  } catch (error) {
    console.error('Error generating plating image:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate image');
  }
};