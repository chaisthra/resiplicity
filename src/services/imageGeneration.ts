interface GenerateImageParams {
  prompt: string;
  style?: string;
}

export async function generateImage({ prompt, style = 'vintage' }: GenerateImageParams): Promise<string> {
  const response = await fetch('http://localhost:4000/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: `${style === 'vintage' ? 'A retro 70s style food photo of ' : ''}${prompt}`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate image');
  }

  const data = await response.json();
  return data.url;
}