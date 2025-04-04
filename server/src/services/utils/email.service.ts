import nodemailer from 'nodemailer';
// Import templating engine if rendering HTML emails from templates
// import handlebars from 'handlebars';
// import fs from 'fs/promises';
// import path from 'path';

// Define interfaces for email options and transport configuration
// interface EmailOptions {
//   to: string | string[]; // Recipient(s)
//   subject: string;
//   text?: string; // Plain text content
//   html?: string; // HTML content
//   from?: string; // Sender address (often configured globally)
//   cc?: string | string[];
//   bcc?: string | string[];
//   attachments?: any[]; // Nodemailer attachment format
// }

// interface EmailTransportConfig {
//   // Based on nodemailer transport options
//   // Example for SMTP:
//   host?: string;
//   port?: number;
//   secure?: boolean; // true for 465, false for other ports
//   auth?: {
//     user: string;
//     pass: string;
//   };
//   // Example for SendGrid/Mailgun (might use API keys directly)
//   apiKey?: string;
//   // Or use a service name like 'gmail' if configured
//   service?: string;
// }

/**
 * Service responsible for sending emails.
 */
export class EmailService {
  private transporter: nodemailer.Transporter;
  private defaultFrom: string;

  constructor(config: any /* Replace 'any' with EmailTransportConfig */, defaultFromAddress: string) {
    // Create a nodemailer transporter based on the provided configuration
    // This needs proper configuration loading (e.g., from environment variables)
    // Example SMTP setup:
    // this.transporter = nodemailer.createTransport({
    //   host: config.host || process.env.SMTP_HOST,
    //   port: config.port || parseInt(process.env.SMTP_PORT || '587', 10),
    //   secure: config.secure ?? (process.env.SMTP_SECURE === 'true'),
    //   auth: {
    //     user: config.auth?.user || process.env.SMTP_USER,
    //     pass: config.auth?.pass || process.env.SMTP_PASS,
    //   },
    // });

    // Placeholder transporter (does not actually send emails)
    console.warn('Email Service is using a placeholder transporter. Emails will not be sent.');
    this.transporter = nodemailer.createTransport({ streamTransport: true, newline: 'unix', buffer: true });

    this.defaultFrom = defaultFromAddress || process.env.EMAIL_DEFAULT_FROM || 'noreply@example.com';

    // Verify transporter configuration (optional but recommended)
    // this.transporter.verify((error, success) => {
    //   if (error) {
    //     console.error('Email transporter verification failed:', error);
    //   } else {
    //     console.log('Email transporter is ready to send messages');
    //   }
    // });
  }

  /**
   * Sends an email.
   * @param options - Options for the email (to, subject, content, etc.).
   * @returns A promise resolving when the email is sent (or queued).
   */
  async sendEmail(options: any /* Replace 'any' with EmailOptions */): Promise<void> {
    const mailOptions = {
      from: options.from || this.defaultFrom,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    };

    console.log(`Attempting to send email to: ${options.to} with subject: ${options.subject}`);

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId || '(no message ID)');
      // Log info.response for detailed SMTP response (if available)
      // console.log('Nodemailer transport response:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email to ${options.to}: ${error}`);
    }
  }

  /**
   * Renders an email template with given data.
   * Placeholder implementation.
   * @param templateName - The name of the template file (without extension).
   * @param data - Data to inject into the template.
   * @returns A promise resolving to the rendered HTML string.
   */
  async renderTemplate(templateName: string, data: Record<string, any>): Promise<string> {
    console.warn('Email template rendering is not fully implemented.');
    // Example using Handlebars:
    // try {
    //   const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.hbs`); // Adjust path as needed
    //   const templateSource = await fs.readFile(templatePath, 'utf-8');
    //   const template = handlebars.compile(templateSource);
    //   const html = template(data);
    //   return html;
    // } catch (error) {
    //   console.error(`Error rendering email template ${templateName}:`, error);
    //   throw new Error(`Could not render email template: ${templateName}`);
    // }
    // Placeholder: return simple HTML
    return `<p>This is a placeholder for the ${templateName} template. Data: ${JSON.stringify(data)}</p>`;
  }

  // Add other methods as needed:
  // - Sending specific types of emails (e.g., sendVerificationEmail, sendPasswordResetEmail)
  // - Managing email templates
  // - Tracking email delivery status (requires webhook integration with provider)
}

// Export requires configuration, so typically not a singleton instance immediately.
// You might export the class or have a factory function that reads config.
// Example:
// import { emailConfig } from '@config/index'; // Assuming email config exists
// export const emailService = new EmailService(emailConfig.transport, emailConfig.defaultFrom);
