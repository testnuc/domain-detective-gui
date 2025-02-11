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

  private static isEmployeeEmail(email: string): boolean {
    const lowerEmail = email.toLowerCase();
    // Filter out common non-employee email patterns
    const excludePatterns = [
      'support',
      'info',
      'contact',
      'hello',
      'admin',
      'help',
      'service',
      'noreply',
      'no-reply',
      'feedback',
      'careers',
      'jobs',
      'press',
      'media'
    ];
    
    return !excludePatterns.some(pattern => lowerEmail.includes(pattern));
  }

  private static extractEmailsFromText(text: string, domain: string): string[] {
    const emailRegex = new RegExp(`[a-zA-Z0-9._%+-]+@${domain.replace('.', '\\.')}`, 'g');
    const allEmails = [...new Set(text.match(emailRegex) || [])];
    // Filter to only include employee emails
    return allEmails.filter(email => this.isEmployeeEmail(email));
  }

  static async crawlWebsite(url: string): Promise<EmailResult[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not found');
    }

    try {
      // Ensure URL is properly formatted
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      // Use Firecrawl to get the website content
      const response = await this.firecrawlApp.crawlUrl(url, {
        limit: 10,
        scrapeOptions: {
          formats: ['html']
        }
      });

      if (!response.success) {
        throw new Error('Failed to crawl website');
      }

      // Extract emails from the crawled content
      const emails = new Set<string>();
      response.data.forEach((page: any) => {
        if (page.html) {
          const foundEmails = this.extractEmailsFromText(page.html, domain);
          foundEmails.forEach(email => emails.add(email));
        }
      });

      // Transform emails into EmailResult format
      const results: EmailResult[] = Array.from(emails).map(email => ({
        name: this.extractNameFromEmail(email),
        email,
        designation: this.guessDesignation(email),
        company: domain
      }));

      console.log(`Found ${results.length} unique emails`);
      return results;
    } catch (error) {
      console.error('Error during crawl:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to crawl website');
    }
  }
}