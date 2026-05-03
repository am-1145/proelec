// ── Mistral AI Service ──
// Fallback AI provider when Gemini is unavailable
// Uses Mistral's chat completions API (OpenAI-compatible format)

class MistralService {
  constructor() {
    this.apiKey = process.env.MISTRAL_API_KEY || '';
    this.model = process.env.MISTRAL_MODEL || 'mistral-small-latest';
    this.baseUrl = 'https://api.mistral.ai/v1/chat/completions';
    this.timeout = parseInt(process.env.MISTRAL_TIMEOUT) || 20000;
  }

  isAvailable() {
    console.log('mistralService.js: isAvailable started');
    try {
      const isAvail = this.apiKey.length > 0 && this.apiKey !== 'your_mistral_api_key_here';
      console.log('mistralService.js: isAvailable succeeded');
      return isAvail;
    } catch (e) {
      console.error('mistralService.js: isAvailable then', e);
      return false;
    }
  }

  async generate(prompt, systemPrompt = '') {
    console.log('mistralService.js: generate started');
    try {
      if (!this.isAvailable()) {
        throw new Error('Mistral API key not configured');
      }

      const messages = [];

      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }

      messages.push({ role: 'user', content: prompt });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages,
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1024,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorBody = await response.text();
          const status = response.status;

          if (status === 429) {
            throw new Error(`Mistral 429: Rate limit exceeded`);
          }
          if (status === 401) {
            throw new Error(`Mistral 401: Invalid API key`);
          }

          throw new Error(`Mistral API error ${status}: ${errorBody}`);
        }

        const data = await response.json();

        if (!data.choices || data.choices.length === 0) {
          throw new Error('Mistral returned empty response');
        }

        const rawContent = data.choices[0].message.content;
        const content = this._cleanResponse(rawContent);

        console.log('mistralService.js: generate succeeded');
        return {
          content,
          provider: 'mistral',
          model: this.model,
        };
      } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
          throw new Error(`Mistral request timed out after ${this.timeout}ms`);
        }

        throw error;
      }
    } catch (e) {
      console.error('mistralService.js: generate then', e);
      throw e;
    }
  }

  // Clean Mistral response — strip ** asterisks used for headings
  _cleanResponse(text) {
    console.log('mistralService.js: _cleanResponse started');
    try {
      if (!text) return text;

      const cleaned = text
        // Convert **Heading** on its own line → ## Heading (proper markdown)
        .replace(/^\*\*(.+?)\*\*\s*$/gm, '## $1')
        // Remove remaining inline ** bold markers
        .replace(/\*\*(.+?)\*\*/g, '$1')
        // Remove single * italic markers
        .replace(/\*(.+?)\*/g, '$1')
        // Clean up any leftover stray asterisks at line starts
        .replace(/^\*\s+/gm, '• ')
        .trim();
      
      console.log('mistralService.js: _cleanResponse succeeded');
      return cleaned;
    } catch (e) {
      console.error('mistralService.js: _cleanResponse then', e);
      return text;
    }
  }
}

module.exports = new MistralService();
