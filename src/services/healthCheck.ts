export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:4000/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Server health check failed');
    }

    const data = await response.json();
    return data.message === 'Server is running!';
  } catch (error) {
    console.error('Server health check error:', error);
    return false;
  }
}