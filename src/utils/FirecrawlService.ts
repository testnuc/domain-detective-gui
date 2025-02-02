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
  private static USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  private static async searchEmails(domain: string): Promise<SearchEngineResponse[]> {
    // Using a proxy service or backend API endpoint would be better for production
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    
    try {
      const results: SearchEngineResponse[] = [];
      const emailRegex = new RegExp(`[a-zA-Z0-9._%+-]+@${domain.replace('.', '\\.')}`, 'g');

      // Google search simulation
      try {
        const googleUrl = encodeURIComponent(`https://www.google.com/search?q=intext:@${domain}&num=100`);
        const googleResponse = await fetch(`${proxyUrl}${googleUrl}`);
        const googleText = await googleResponse.text();
        const googleEmails = [...new Set(googleText.match(emailRegex) || [])];
        results.push({ emails: googleEmails, source: 'Google' });
      } catch (error) {
        console.error('Google search error:', error);
      }

      // Bing search simulation
      try {
        const bingUrl = encodeURIComponent(`https://www.bing.com/search?q=inbody:@${domain}&count=50`);
        const bingResponse = await fetch(`${proxyUrl}${bingUrl}`);
        const bingText = await bingResponse.text();
        const bingEmails = [...new Set(bingText.match(emailRegex) || [])];
        results.push({ emails: bingEmails, source: 'Bing' });
      } catch (error) {
        console.error('Bing search error:', error);
      }

      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
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
      // Extract domain from URL
      const domain = new URL(url).hostname.replace('www.', '');
      
      // Search for emails using multiple methods
      const searchResults = await this.searchEmails(domain);
      
      // Combine all found emails
      const allEmails = new Set<string>();
      searchResults.forEach(result => {
        result.emails.forEach(email => allEmails.add(email));
      });

      // Transform emails into EmailResult format
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