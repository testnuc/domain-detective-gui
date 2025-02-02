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

interface SearchEngineResponse {
  emails: string[];
  source: string;
}

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

  private static async searchGoogle(domain: string): Promise<SearchEngineResponse> {
    try {
      const response = await fetch(`https://www.google.com/search?q=intext:@${domain}&num=100`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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
      const [googleResults, bingResults] = await Promise.all([
        this.searchGoogle(domain),
        this.searchBing(domain)
      ]);

      // Combine and deduplicate emails
      const allEmails = new Set([
        ...googleResults.emails,
        ...bingResults.emails
      ]);

      // Transform emails into EmailResult format
      const results: EmailResult[] = Array.from(allEmails).map(email => {
        const [localPart] = email.split('@');
        const name = localPart
          .split(/[._-]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');

        return {
          name,
          email,
          designation: 'Employee',
          company: domain
        };
      });

      console.log(`Found ${results.length} unique emails from multiple sources`);
      return results;
    } catch (error) {
      console.error('Error during email search:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to search for emails');
    }
  }
}