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
  private static API_KEY_STORAGE_KEY = 'outscraper_api_key';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  private static extractNameFromEmail(email: string): string {
    const [localPart] = email.split('@');
    return localPart
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  private static guessDesignation(email: string): string {
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('ceo') || lowerEmail.includes('founder')) return 'CEO';
    if (lowerEmail.includes('cto')) return 'CTO';
    if (lowerEmail.includes('cfo')) return 'CFO';
    if (lowerEmail.includes('hr')) return 'HR Manager';
    if (lowerEmail.includes('sales')) return 'Sales Manager';
    if (lowerEmail.includes('marketing')) return 'Marketing Manager';
    if (lowerEmail.includes('dev') || lowerEmail.includes('engineer')) return 'Software Engineer';
    return 'Employee';
  }

  static async crawlWebsite(url: string): Promise<EmailResult[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not found');
    }

    try {
      const domain = new URL(url).hostname.replace('www.', '');
      
      const response = await fetch(`https://api.app.outscraper.com/emails-and-contacts?query=${domain}&async=false`, {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from Outscraper API');
      }

      const data = await response.json();
      
      // Transform the response into our EmailResult format
      const results: EmailResult[] = [];
      
      if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0].emails)) {
        data[0].emails.forEach((email: string) => {
          results.push({
            name: this.extractNameFromEmail(email),
            email,
            designation: this.guessDesignation(email),
            company: domain
          });
        });
      }

      console.log(`Found ${results.length} unique emails`);
      return results;
    } catch (error) {
      console.error('Error during crawl:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to crawl website');
    }
  }
}