interface EmailResult {
  name: string;
  email: string;
  designation: string;
  company: string;
}

interface EmailData {
  value: string;
  full_name?: string;
  title?: string;
  sources?: Array<{
    ref: string;
    extracted_on: string;
    updated_on: string;
  }>;
}

interface OutscraperResponse {
  data: Array<{
    query: string;
    emails: EmailData[];
  }>;
}

export class OutscraperService {
  private static API_KEY = 'OWU0OTIwODg4ZTRjNGZjNDlmZWZmZDdhYmY5MTQ4OGV8ZTdmZjYzOWI1Yg';
  private static BASE_URL = 'https://api.app.outscraper.com';

  static async findEmails(domain: string): Promise<EmailResult[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/emails-and-contacts?query=${domain}&async=false`,
        {
          headers: {
            'X-API-KEY': this.API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch email addresses');
      }

      const data: OutscraperResponse = await response.json();
      const results: EmailResult[] = [];
      
      data.data.forEach(item => {
        item.emails?.forEach(emailData => {
          if (emailData.value && typeof emailData.value === 'string') {
            results.push({
              name: emailData.full_name || this.extractNameFromEmail(emailData.value),
              email: emailData.value,
              designation: emailData.title || 'Employee',
              company: domain
            });
          }
        });
      });

      return results;
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }

  private static extractNameFromEmail(email: string): string {
    try {
      if (typeof email !== 'string') {
        return 'Unknown User';
      }
      
      const [localPart] = email.split('@');
      if (!localPart) {
        return 'Unknown User';
      }

      return localPart
        .split(/[._-]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    } catch (error) {
      console.error('Error extracting name from email:', error);
      return 'Unknown User';
    }
  }
}