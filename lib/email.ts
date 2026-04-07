import { Resend } from 'resend';

import { prisma } from '@/lib/prisma';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = 'orders@gotxring.com';

type OrderEmailPayload = {
  id: string;
  customerName: string;
  email: string;
  shippingAddress: string;
  phone: string;
  chassisModelOrPartModel?: string | null;
  handedness?: string | null;
  finishColor?: string | null;
  options?: string | null;
  specialInstructions?: string | null;
  discipline?: string | null;
  caliber?: string | null;
  notes?: string | null;
  status: string;
  createdAt: Date;
};

function orderSummaryRows(order: OrderEmailPayload): string {
  const rows = [
    ['Order ID', order.id],
    ['Name', order.customerName],
    ['Email', order.email],
    ['Phone', order.phone],
    ['Shipping Address', order.shippingAddress],
    ['Model', order.chassisModelOrPartModel || 'Not provided'],
    ['Handedness', order.handedness || 'Not provided'],
    ['Finish/Color', order.finishColor || 'Not provided'],
    ['Options', order.options || 'Not provided'],
    ['Special Instructions', order.specialInstructions || 'Not provided'],
    ['Discipline', order.discipline || 'Not provided'],
    ['Caliber', order.caliber || 'Not provided'],
    ['Internal Notes', order.notes || 'Not provided'],
    ['Status', order.status]
  ];

  return rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#d1d5db;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#fff;">${value}</td></tr>`
    )
    .join('');
}

function wrapTemplate(title: string, bodyHtml: string): string {
  return `
  <div style="background:#0a0a0a;padding:24px;font-family:Inter,Arial,sans-serif;color:#fff;">
    <div style="max-width:640px;margin:0 auto;border:1px solid #2a2a2a;background:#111;">
      <div style="padding:18px 22px;border-bottom:1px solid #2a2a2a;">
        <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#d1d5db;">Competition Machine Inc</div>
        <h1 style="margin:8px 0 0;font-size:20px;color:#fff;">${title}</h1>
      </div>
      <div style="padding:22px;">${bodyHtml}</div>
    </div>
  </div>`;
}

export async function sendOrderEmails(order: OrderEmailPayload): Promise<void> {
  if (!resend) {
    console.warn('RESEND_API_KEY not set, skipping order emails.');
    return;
  }

  const settings = await prisma.settings.findFirst();
  const adminEmail = settings?.notificationEmail || 'spraynandprayn@gmail.com';

  const adminHtml = wrapTemplate(
    'New Order Received',
    `<p style="color:#e5e7eb;margin-top:0;">A new order was submitted on GotXRing.com.</p>
     <table style="width:100%;border-collapse:collapse;margin-top:12px;">${orderSummaryRows(order)}</table>`
  );

  const customerHtml = wrapTemplate(
    'Order Confirmation',
    `<p style="color:#e5e7eb;margin-top:0;">Hi ${order.customerName},</p>
     <p style="color:#e5e7eb;">Your order has been received. We'll be in touch within 24 hours.</p>
     <p style="color:#e5e7eb;">We will contact you with cost and delivery schedule within 24 hours, no funds are required to place an order.</p>
     <table style="width:100%;border-collapse:collapse;margin-top:12px;">${orderSummaryRows(order)}</table>`
  );

  await resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `New GotXRing Order: ${order.customerName}`,
    html: adminHtml
  });

  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.email,
    subject: 'Your GotXRing Order Confirmation',
    html: customerHtml
  });
}
