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
  static async crawlWebsite(url: string): Promise<EmailResult[]> {
    try {
      console.log('Making request to getprospect.com');
      
      // Make the HTTP request to getprospect.com
      const response = await fetch(`https://getprospect.com/email-finder/email-finder-by-domain/${url}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from getprospect.com');
      }

      const text = await response.text();
      
      // Extract emails using regex pattern
      const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
      const emails = text.match(emailPattern) || [];
      
      // Process and format the results
      const emailResults: EmailResult[] = emails.map(email => {
        // Generate a name from email (basic example)
        const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
        const name = namePart
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return {
          name,
          email,
          designation: 'Found in Website Scan',
          company: url
        };
      });

      return emailResults;
    } catch (error) {
      console.error('Error during fetch:', error);
      throw error;
    }
  }
}