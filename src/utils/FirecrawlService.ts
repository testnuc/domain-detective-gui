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

interface SearchEngineResponse {
  emails: string[];
  source: string;
}

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;
  private static USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  private static async searchGoogle(domain: string): Promise<SearchEngineResponse> {
    try {
      const response = await fetch(`https://www.google.com/search?q=intext:@${domain}&num=100`, {
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'text/html',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      const text = await response.text();
      const emailRegex = new RegExp(`[a-zA-Z0-9._%+-]+@${domain.replace('.', '\\.')}`, 'g');
      const emails = [...new Set(text.match(emailRegex) || [])];
      return { emails, source: 'Google' };
    } catch (error) {
      console.error('Google search error:', error);
      return { emails: [], source: 'Google' };
    }
  }

  private static async searchBing(domain: string): Promise<SearchEngineResponse> {
    try {
      const response = await fetch(`https://www.bing.com/search?q=inbody:@${domain}&count=50`, {
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'text/html',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      const text = await response.text();
      const emailRegex = new RegExp(`[a-zA-Z0-9._%+-]+@${domain.replace('.', '\\.')}`, 'g');
      const emails = [...new Set(text.match(emailRegex) || [])];
      return { emails, source: 'Bing' };
    } catch (error) {
      console.error('Bing search error:', error);
      return { emails: [], source: 'Bing' };
    }
  }

  private static async searchYandex(domain: string): Promise<SearchEngineResponse> {
    try {
      const response = await fetch(`https://www.yandex.com/search/?text=inbody:"@${domain}"&numdoc=50`, {
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'text/html',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      const text = await response.text();
      const emailRegex = new RegExp(`[a-zA-Z0-9._%+-]+@${domain.replace('.', '\\.')}`, 'g');
      const emails = [...new Set(text.match(emailRegex) || [])];
      return { emails, source: 'Yandex' };
    } catch (error) {
      console.error('Yandex search error:', error);
      return { emails: [], source: 'Yandex' };
    }
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
    if (lowerEmail.includes('support')) return 'Support Representative';
    if (lowerEmail.includes('dev') || lowerEmail.includes('engineer')) return 'Software Engineer';
    return 'Employee';
  }

  static async crawlWebsite(url: string): Promise<EmailResult[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not found');
    }

    try {
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      // Extract domain from URL
      const domain = new URL(url).hostname.replace('www.', '');

      // Parallel search using multiple search engines
      const [googleResults, bingResults, yandexResults] = await Promise.all([
        this.searchGoogle(domain),
        this.searchBing(domain),
        this.searchYandex(domain)
      ]);

      // Combine and deduplicate emails
      const allEmails = new Set([
        ...googleResults.emails,
        ...bingResults.emails,
        ...yandexResults.emails
      ]);

      // Transform emails into EmailResult format with improved metadata
      const results: EmailResult[] = Array.from(allEmails).map(email => ({
        name: this.extractNameFromEmail(email),
        email,
        designation: this.guessDesignation(email),
        company: domain
      }));

      console.log(`Found ${results.length} unique emails from multiple sources`);
      return results;
    } catch (error) {
      console.error('Error during email search:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to search for emails');
    }
  }
}