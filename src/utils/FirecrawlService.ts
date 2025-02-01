import FirecrawlApp from '@mendable/firecrawl-js';
import { EmailResult } from '@/components/ResultCard';

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async crawlWebsite(url: string): Promise<EmailResult[]> {
    try {
      const apiKey = this.getApiKey();
      if (!apiKey) {
        throw new Error('API key not found. Please set your Firecrawl API key first.');
      }

      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const response = await this.firecrawlApp.crawlUrl(url, {
        limit: 100,
        scrapeOptions: {
          formats: ['markdown', 'html'],
          selectors: {
            emails: true,
            names: true,
            titles: true,
            companies: true
          }
        }
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to crawl website');
      }

      // Transform the Firecrawl response into EmailResult format
      const emailResults: EmailResult[] = response.data.map(item => ({
        name: item.name || 'Unknown',
        email: item.email,
        designation: item.title || 'Employee',
        company: item.company || url.replace(/^(https?:\/\/)/, '')
      }));

      return emailResults;
    } catch (error) {
      console.error('Error during crawl:', error);
      throw new Error('Failed to fetch email addresses');
    }
  }
}