import { composterLocations } from '../pages/Map';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Rate limiting configuration
const RETRY_DELAYS = [2000, 4000, 8000]; // Delays in milliseconds
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // Minimum time between requests in milliseconds

async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequestWithRetry(url: string, options: RequestInit, retryCount = 0): Promise<Response> {
  try {
    // Implement rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await wait(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    }
    
    lastRequestTime = Date.now();
    const response = await fetch(url, options);

    if (response.status === 429 && retryCount < RETRY_DELAYS.length) {
      console.log(`Rate limit hit, retrying in ${RETRY_DELAYS[retryCount]}ms...`);
      await wait(RETRY_DELAYS[retryCount]);
      return makeRequestWithRetry(url, options, retryCount + 1);
    }

    return response;
  } catch (error) {
    if (retryCount < RETRY_DELAYS.length) {
      console.log(`Request failed, retrying in ${RETRY_DELAYS[retryCount]}ms...`);
      await wait(RETRY_DELAYS[retryCount]);
      return makeRequestWithRetry(url, options, retryCount + 1);
    }
    throw error;
  }
}

export async function sendMessage(message: string): Promise<string> {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Please configure your Gemini API key in the .env file');
    }

    if (!message.trim()) {
      throw new Error('Message cannot be empty');
    }

    const response = await makeRequestWithRetry(
      `${API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [{
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few moments.');
      } else if (response.status === 400 && errorData.error?.message?.includes('API key')) {
        throw new Error('Invalid or expired API key. Please check your API key configuration.');
      } else {
        throw new Error(`API request failed with status ${response.status}`);
      }
    }

    const data = await response.json();
    let text = '';

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from API');
    }

    // Check if the message is asking about locations
    if (message.toLowerCase().includes('compost') || 
        message.toLowerCase().includes('recycl') || 
        message.toLowerCase().includes('location') || 
        message.toLowerCase().includes('facility') ||
        message.toLowerCase().includes('where')) {
      const locationMatches = composterLocations.filter(location =>
        location.name.toLowerCase().includes(message.toLowerCase()) ||
        location.city.toLowerCase().includes(message.toLowerCase()) ||
        location.materials?.some(material => 
          material.toLowerCase().includes(message.toLowerCase())
        )
      );

      if (locationMatches.length > 0) {
        const locationsList = locationMatches
          .slice(0, 3)
          .map(location => `
- **${location.name}** in ${location.city}
  - Address: ${location.address}, ${location.city}, ${location.state} ${location.zip}
  - Type: ${location.type}
  ${location.phone ? `- Phone: ${location.phone}` : ''}
  ${location.website ? `- Website: ${location.website}` : ''}
`).join('\n');

        text += `\n\nHere are some relevant locations in the Bay Area:\n${locationsList}\n\nYou can find these and more locations on our interactive map page!`;
      }
    }

    return text;
  } catch (error) {
    console.error('Error in Gemini chat:', error);
    if (error instanceof Error) {
      throw new Error(`Chat error: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while connecting to the AI service');
  }
}