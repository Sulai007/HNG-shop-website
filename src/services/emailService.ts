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
        <td style="padding: 14px 0; border-bottom: 1px solid #EBE7E0;">
          <strong style="color: #2C241E; font-size: 15px; display: block;">${item.product_name}</strong>
          ${item.variant_information ? `<span style="color: #7A6F65; font-size: 13px;">${item.variant_information}</span>` : ''}
          <div style="color: #7A6F65; font-size: 13px; margin-top: 2px;">Qty: ${item.quantity} × ₦${item.unit_price.toLocaleString()}</div>
        </td>
        <td style="padding: 14px 0; border-bottom: 1px solid #EBE7E0; text-align: right; vertical-align: top; font-weight: 600; color: #2C241E; font-size: 15px;">
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
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 32px 16px; color: #2C241E; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E6E1D8; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(44, 36, 30, 0.04);">
    
    <!-- Header -->
    <div style="background-color: #2C241E; padding: 36px 32px; text-align: center;">
      <h1 style="color: #FAF8F5; margin: 0; font-size: 26px; font-weight: 400; letter-spacing: 3px; text-transform: uppercase;">
        ÈDÁ
      </h1>
      <p style="color: #C8BDB0; margin: 8px 0 0 0; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase;">
        Artisanal Living · Lagos, Nigeria
      </p>
    </div>

    <!-- Body Content -->
    <div style="padding: 36px 32px;">
      <div style="border-bottom: 1px solid #EBE7E0; padding-bottom: 24px; margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 500; color: #2C241E; margin: 0 0 8px 0;">
          Thank you for your order, ${order.customer_name}.
        </h2>
        <p style="color: #695E54; font-size: 15px; line-height: 1.5; margin: 0;">
          Your order has been received and is being prepared in our Lagos atelier. We take immense care in hand-crafting and packing your botanical pieces.
        </p>
      </div>

      <!-- Order Metadata -->
      <table style="width: 100%; margin-bottom: 28px; font-size: 14px; color: #695E54;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 4px 0;"><strong>Order Reference:</strong></td>
          <td style="padding: 4px 0; text-align: right; font-family: monospace; color: #2C241E; font-weight: bold;">${order.order_number}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;"><strong>Date:</strong></td>
          <td style="padding: 4px 0; text-align: right; color: #2C241E;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;"><strong>Payment Status:</strong></td>
          <td style="padding: 4px 0; text-align: right; color: #2E7D32; font-weight: 600;">Approved (Mock Gateway)</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;"><strong>Order Status:</strong></td>
          <td style="padding: 4px 0; text-align: right; text-transform: capitalize; color: #2C241E; font-weight: 500;">${order.status}</td>
        </tr>
      </table>

      <!-- Items Table -->
      <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #7A6F65; margin: 0 0 12px 0;">
        Items in this Order
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;" cellpadding="0" cellspacing="0">
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <!-- Totals Breakdown -->
      <table style="width: 100%; margin-bottom: 28px; font-size: 14px; color: #695E54;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 6px 0;">Subtotal:</td>
          <td style="padding: 6px 0; text-align: right; color: #2C241E;">₦${order.subtotal.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0;">Delivery Fee (${order.state}):</td>
          <td style="padding: 6px 0; text-align: right; color: #2C241E;">₦${order.delivery_fee.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0 0 0; font-size: 16px; font-weight: bold; color: #2C241E; border-top: 1px solid #2C241E;">Total Amount:</td>
          <td style="padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: bold; color: #2C241E; border-top: 1px solid #2C241E;">₦${order.total.toLocaleString()}</td>
        </tr>
      </table>

      <!-- Delivery Address -->
      <div style="background-color: #FAF8F5; border-radius: 4px; padding: 20px; margin-bottom: 28px; border: 1px solid #EBE7E0;">
        <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #7A6F65;">
          Delivery Address
        </h4>
        <p style="margin: 0; color: #2C241E; font-size: 14px; line-height: 1.6;">
          <strong>${order.customer_name}</strong><br>
          ${order.delivery_address}<br>
          ${order.city}, ${order.state}<br>
          Phone: ${order.customer_phone}<br>
          ${order.notes ? `<em>Notes: ${order.notes}</em>` : ''}
        </p>
      </div>

      <!-- Support / Contact -->
      <div style="border-top: 1px solid #EBE7E0; padding-top: 24px; text-align: center; color: #7A6F65; font-size: 13px; line-height: 1.6;">
        <p style="margin: 0 0 4px 0;">
          Need assistance or wish to customize your sanctuary blend?
        </p>
        <p style="margin: 0;">
          Reach our Lagos Concierge at <a href="mailto:${BRAND_STORY.contactEmail}" style="color: #2C241E; font-weight: 600;">${BRAND_STORY.contactEmail}</a> or call ${BRAND_STORY.contactPhone}.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #FAF8F5; border-top: 1px solid #E6E1D8; padding: 20px; text-align: center; color: #8F847A; font-size: 12px;">
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

  constructor(apiKey = '', fromEmail = 'ÈDÁ Concierge <orders@eda-living.ng>') {
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
          subject: `Your ÈDÁ Artisanal Living Order #${order.order_number} is Confirmed`,
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
