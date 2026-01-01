// app/api/send-email/route.js
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
  try {
    const { to, subject, text } = await request.json();
    
    // Validate required fields
    if (!to || !subject || !text) {
      return NextResponse.json(
        { error: { message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    const msg = {
      to,
      from: process.env.EMAIL_FROM,
      subject,
      text,
      html: `<div style="white-space: pre-wrap;">${text}</div>`,
    };

    const [response] = await sgMail.send(msg);
    return NextResponse.json({ success: true });

  } catch (error) {
    // Enhanced error formatting
    const errorDetails = {
      code: error.code,
      message: error.message,
      sendgridErrors: error.response?.body?.errors,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };

    console.error('API Route Error:', errorDetails);
    
    return NextResponse.json(
      { error: errorDetails },
      { status: 500 }
    );
  }
}