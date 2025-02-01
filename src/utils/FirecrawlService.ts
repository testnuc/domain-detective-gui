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
      
      // Remove any existing http:// or https:// from the URL
      const cleanUrl = url.replace(/^(https?:\/\/)/, '');
      
      // Make the HTTP request to getprospect.com
      const response = await fetch(`https://getprospect.com/email-finder/email-finder-by-domain/${cleanUrl}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      // Since we're using no-cors mode, we'll get an opaque response
      // We'll return a default set of test data for now
      // In a production environment, you would need to set up a backend proxy
      const dummyEmails = [
        'contact@' + cleanUrl,
        'info@' + cleanUrl,
        'support@' + cleanUrl
      ];
      
      // Process and format the results
      const emailResults: EmailResult[] = dummyEmails.map(email => {
        const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
        const name = namePart
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return {
          name,
          email,
          designation: 'Common Email Pattern',
          company: cleanUrl
        };
      });

      return emailResults;
    } catch (error) {
      console.error('Error during fetch:', error);
      throw error;
    }
  }
}