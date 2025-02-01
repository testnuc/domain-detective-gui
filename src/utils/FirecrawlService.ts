import FirecrawlApp from '@mendable/firecrawl-js';
import { EmailResult } from '@/components/ResultCard';

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async crawlWebsite(url: string): Promise<EmailResult[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not found');
    }

    try {
      console.log('Making crawl request to Firecrawl API');
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const crawlResponse = await this.firecrawlApp.crawlUrl(url, {
        limit: 100,
        scrapeOptions: {
          formats: ['markdown', 'html']
        }
      }) as CrawlResponse;

      if (!crawlResponse.success) {
        throw new Error((crawlResponse as ErrorResponse).error);
      }

      // Process the crawled data to extract email information
      const emailResults: EmailResult[] = [];
      const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
      
      crawlResponse.data.forEach(item => {
        const content = typeof item === 'string' ? item : JSON.stringify(item);
        const emails = content.match(emailPattern) || [];
        
        emails.forEach(email => {
          // Generate a name from email (basic example)
          const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
          const name = namePart
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          emailResults.push({
            name,
            email,
            designation: 'Found in Website Scan',
            company: url
          });
        });
      });

      return emailResults;
    } catch (error) {
      console.error('Error during crawl:', error);
      throw error;
    }
  }
}

// Initialize the API key when the file loads
FirecrawlService.saveApiKey('fc-ff42af0cd6b149268c208dedcb69eab0');