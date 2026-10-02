import { Order } from '../types';
import { BRAND_STORY } from '../data/seedData';

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  provider: string;
  error?: string;
  htmlContent: string;
}

export interface IEmailProvider {
  sendOrderConfirmation(order: Order): Promise<EmailSendResult>;
}

export function generateOrderConfirmationHtml(order: Order): string {
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 14px 0; border-bottom: 1px solid #F1F5F9;">
          <strong style="color: #0F172A; font-size: 15px; display: block;">${item.product_name}</strong>
          ${item.variant_information ? `<span style="color: #64748B; font-size: 13px;">${item.variant_information}</span>` : ''}
          <div style="color: #64748B; font-size: 13px; margin-top: 2px;">Qty: ${item.quantity} × ₦${item.unit_price.toLocaleString()}</div>
        </td>
        <td style="padding: 14px 0; border-bottom: 1px solid #F1F5F9; text-align: right; vertical-align: top; font-weight: 700; color: #0F172A; font-size: 15px;">
          ₦${item.subtotal.toLocaleString()}
        </td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation #${order.order_number}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 32px 16px; color: #0F172A; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);">
    
    <!-- Header -->
    <div style="background-color: #0F172A; padding: 32px 32px; text-align: center;">
      <h1 style="color: #FFFFFF; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
        Nova<span style="color: #EA580C;">Stores</span>
      </h1>
      <p style="color: #94A3B8; margin: 6px 0 0 0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">
        Discover Products You'll Love · Lagos & Nationwide Nigeria Delivery
      </p>
    </div>

    <!-- Body Content -->
    <div style="padding: 32px;">
      <div style="border-bottom: 1px solid #F1F5F9; padding-bottom: 20px; margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 8px 0;">
          Thank you for your order, ${order.customer_name}.
        </h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0;">
          Your order has been confirmed and is being prepared for dispatch by our fulfillment center. We curate trending lifestyle products with 100% verified authentic items.
        </p>
      </div>

      <!-- Order Metadata -->
      <table style="width: 100%; margin-bottom: 24px; font-size: 14px; color: #475569;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 6px 0;"><strong>Order Reference:</strong></td>
          <td style="padding: 6px 0; text-align: right; font-family: monospace; color: #0F172A; font-weight: bold;">${order.order_number}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0;"><strong>Date:</strong></td>
          <td style="padding: 6px 0; text-align: right; color: #0F172A;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0;"><strong>Payment Status:</strong></td>
          <td style="padding: 6px 0; text-align: right; color: #16A34A; font-weight: 600;">Approved (Secure Test Gateway)</td>
        </tr>
        <tr>
          <td style="padding: 6px 0;"><strong>Fulfillment Status:</strong></td>
          <td style="padding: 6px 0; text-align: right; text-transform: capitalize; color: #0F172A; font-weight: 500;">${order.status}</td>
        </tr>
      </table>

      <!-- Items Table -->
      <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; margin: 0 0 12px 0;">
        Items in this Order
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;" cellpadding="0" cellspacing="0">
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <!-- Totals Breakdown -->
      <table style="width: 100%; margin-bottom: 24px; font-size: 14px; color: #475569;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 6px 0;">Subtotal:</td>
          <td style="padding: 6px 0; text-align: right; color: #0F172A;">₦${order.subtotal.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0;">Delivery Fee (${order.state}):</td>
          <td style="padding: 6px 0; text-align: right; color: #0F172A;">₦${order.delivery_fee.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0 0 0; font-size: 16px; font-weight: 800; color: #0F172A; border-top: 2px solid #0F172A;">Total Paid:</td>
          <td style="padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: 800; color: #EA580C; border-top: 2px solid #0F172A;">₦${order.total.toLocaleString()}</td>
        </tr>
      </table>

      <!-- Delivery Address -->
      <div style="background-color: #F8FAFC; border-radius: 6px; padding: 18px; margin-bottom: 24px; border: 1px solid #E2E8F0;">
        <h4 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748B;">
          Delivery Address
        </h4>
        <p style="margin: 0; color: #0F172A; font-size: 14px; line-height: 1.6;">
          <strong>${order.customer_name}</strong><br>
          ${order.delivery_address}<br>
          ${order.city}, ${order.state}<br>
          Phone: ${order.customer_phone}<br>
          ${order.notes ? `<em>Notes: ${order.notes}</em>` : ''}
        </p>
      </div>

      <!-- Support / Contact -->
      <div style="border-top: 1px solid #F1F5F9; padding-top: 20px; text-align: center; color: #64748B; font-size: 13px; line-height: 1.6;">
        <p style="margin: 0 0 4px 0;">
          Need assistance or questions about your delivery?
        </p>
        <p style="margin: 0;">
          Reach Nova Stores Support at <a href="mailto:${BRAND_STORY.contactEmail}" style="color: #EA580C; font-weight: 600; text-decoration: none;">${BRAND_STORY.contactEmail}</a> or call ${BRAND_STORY.contactPhone}.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 18px; text-align: center; color: #94A3B8; font-size: 12px;">
      <p style="margin: 0 0 4px 0;">${BRAND_STORY.origin}</p>
      <p style="margin: 0;">${BRAND_STORY.address}</p>
    </div>

  </div>
</body>
</html>
  `;
}

/**
 * Resend Email Provider (Dispatches via server API)
 */
export class ResendEmailProvider implements IEmailProvider {
  private apiKey: string;
  private fromEmail: string;

  constructor(apiKey = '', fromEmail = 'Nova Stores <onboarding@resend.dev>') {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
  }

  async sendOrderConfirmation(order: Order): Promise<EmailSendResult> {
    const htmlContent = generateOrderConfirmationHtml(order);

    // Call server endpoint /api/send-email to keep keys secure server-side
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: order.customer_email,
          subject: `Your Nova Stores Order #${order.order_number} is Confirmed`,
          html: htmlContent,
          orderId: order.id,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        console.warn('Server email dispatch notice:', errJson);
        return {
          success: false,
          error: errJson.message || 'Server email dispatch failed',
          provider: 'resend',
          htmlContent,
        };
      }

      const data = await response.json();
      return {
        success: true,
        messageId: data.messageId,
        provider: 'resend',
        htmlContent,
      };
    } catch (err: any) {
      console.warn('Network issue during email dispatch:', err.message);
      return {
        success: false,
        error: err.message,
        provider: 'resend',
        htmlContent,
      };
    }
  }
}

class EmailServiceManager {
  private provider: IEmailProvider;

  constructor(provider?: IEmailProvider) {
    this.provider = provider || new ResendEmailProvider();
  }

  setProvider(provider: IEmailProvider) {
    this.provider = provider;
  }

  async sendOrderConfirmation(order: Order): Promise<EmailSendResult> {
    return this.provider.sendOrderConfirmation(order);
  }
}

export const emailService = new EmailServiceManager();
