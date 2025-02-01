import FirecrawlApp from '@mendable/firecrawl-js';
import { EmailResult } from '@/components/ResultCard';
import type { FirecrawlDocument } from '@mendable/firecrawl-js';

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
  data: FirecrawlDocument[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

interface ParsedDocument {
  name?: string;
  email?: string;
  title?: string;
  company?: string;
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
          formats: ['markdown', 'html']
        }
      }) as CrawlResponse;

      if (!response.success) {
        throw new Error(response.error || 'Failed to crawl website');
      }

      // Parse the documents and extract relevant information
      const emailResults: EmailResult[] = response.data
        .map(doc => {
          const parsedDoc: ParsedDocument = {
            name: doc.metadata?.name || doc.content?.match(/name:\s*([^\n]+)/i)?.[1],
            email: doc.metadata?.email || doc.content?.match(/email:\s*([^\n]+)/i)?.[1],
            title: doc.metadata?.title || doc.content?.match(/title:\s*([^\n]+)/i)?.[1],
            company: doc.metadata?.company || doc.content?.match(/company:\s*([^\n]+)/i)?.[1]
          };
          
          return parsedDoc;
        })
        .filter((doc): doc is Required<ParsedDocument> => 
          !!doc.email && !!doc.name && !!doc.title && !!doc.company
        )
        .map(doc => ({
          name: doc.name,
          email: doc.email,
          designation: doc.title,
          company: doc.company
        }));

      return emailResults;
    } catch (error) {
      console.error('Error during crawl:', error);
      throw new Error('Failed to fetch email addresses');
    }
  }
}