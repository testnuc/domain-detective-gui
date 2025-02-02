interface EmailResult {
  name: string;
  email: string;
  designation: string;
  company: string;
}

interface OutscraperResponse {
  data: Array<{
    emails: string[];
    contacts: Array<{
      name?: string;
      position?: string;
      email?: string;
    }>;
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
      
      // Transform the response into our EmailResult format
      const results: EmailResult[] = [];
      
      data.data.forEach(item => {
        // Handle contacts with detailed information
        item.contacts?.forEach(contact => {
          if (contact.email) {
            results.push({
              name: contact.name || this.extractNameFromEmail(contact.email),
              email: contact.email,
              designation: contact.position || 'Employee',
              company: domain
            });
          }
        });

        // Handle additional emails found
        item.emails?.forEach(email => {
          // Only add emails that weren't already added from contacts
          if (!results.some(r => r.email === email)) {
            results.push({
              name: this.extractNameFromEmail(email),
              email: email,
              designation: 'Employee',
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
    const [localPart] = email.split('@');
    return localPart
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }
}