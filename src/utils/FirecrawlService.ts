export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'outscraper_api_key';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async crawlWebsite(domain: string): Promise<EmailResult[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not found');
    }

    try {
      const response = await fetch(
        `https://api.app.outscraper.com/emails-and-contacts?query=${domain}&async=false`,
        {
          headers: {
            'X-API-KEY': apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data from Outscraper API');
      }

      const data = await response.json();
      
      // Transform the response into our EmailResult format
      // Note: Adjust this mapping based on the actual Outscraper API response structure
      return data.map((item: any) => ({
        name: item.name || 'Unknown',
        email: item.email,
        designation: item.job_title || 'Employee',
        company: domain
      }));
    } catch (error) {
      console.error('Error during crawl:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch email addresses');
    }
  }
}

interface EmailResult {
  name: string;
  email: string;
  designation: string;
  company: string;
}