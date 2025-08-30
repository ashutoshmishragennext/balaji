
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Types
interface FormData {
  visitorName: string;
  phoneNo: string;
  emailId: string;
  currentStrapper: string;
  modelInterested: string;
  make: string;
  serviceRoll: string;
  remarks: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}

// Gmail SMTP Transporter - FIXED: createTransport (not createTransporter)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your-email@gmail.com
    pass: process.env.EMAIL_PASS  // your gmail app password
  }
});

// Email HTML Template Function
const generateEmailHTML = (formData: FormData): string => {
  const currentTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>New Visitor Inquiry - Shree Balaji Packtech</title>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
        background: #f9fafb;
        color: #333;
      }
      .email-container {
        max-width: 650px;
        margin: 0 auto;
        background: #fff;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #e5e7eb;
      }
      /* HEADER with LOGO THEME */
      .header {
        background: linear-gradient(135deg, #D72658, #C2185B);
        color: #fff;
        padding: 40px 30px;
        text-align: center;
      }
      .company-name {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 8px;
      }
      .company-tagline {
        font-size: 14px;
        opacity: 0.9;
      }
      .badge {
        display: inline-block;
        margin-top: 12px;
        background: rgba(255,255,255,0.2);
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
      }
      .content {
        padding: 30px;
      }
      .section-title {
        font-size: 16px;
        font-weight: 600;
        margin: 20px 0 10px;
        color: #C2185B;
        border-bottom: 2px solid #f1f5f9;
        padding-bottom: 6px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      td {
        padding: 12px;
        border: 1px solid #e5e7eb;
        font-size: 14px;
      }
      td.label {
        background: #fdf2f8;
        font-weight: bold;
        color: #C2185B;
        width: 35%;
        text-transform: uppercase;
        font-size: 12px;
      }
      .remarks {
        background: #fff7ed;
        border: 1px solid #fb923c;
        padding: 16px;
        border-radius: 6px;
        font-style: italic;
        margin-top: 20px;
        color: #92400e;
      }
      .timestamp {
        text-align: center;
        margin-top: 25px;
      }
      .timestamp span {
        background: #ecfdf5;
        padding: 10px 16px;
        border-radius: 6px;
        color: #047857;
        font-size: 13px;
      }
      .footer {
        background: #C2185B;
        color: #fff;
        text-align: center;
        padding: 25px;
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <!-- Header -->
      <div class="header">
        <div class="company-name">SHREE BALAJI PACKTECH</div>
        <div class="company-tagline">Industrial Packaging Solutions</div>
        <div class="badge">New Visitor Inquiry</div>
      </div>

      <!-- Content -->
      <div class="content">
        <p>Dear Sales Team,</p>
        <p>A new visitor has submitted an inquiry through our website form. Please review the details below:</p>
        
        <!-- Visitor Info -->
        <div class="section-title">Visitor Information</div>
        <table>
          <tr><td class="label">Full Name</td><td>${formData.visitorName || "Not provided"}</td></tr>
          <tr><td class="label">Phone Number</td><td>${formData.phoneNo || "Not provided"}</td></tr>
          <tr><td class="label">Email Address</td><td>${formData.emailId || "Not provided"}</td></tr>
        </table>

        <!-- Equipment Info -->
        <div class="section-title">Equipment & Service</div>
        <table>
          <tr><td class="label">Current Strapper</td><td>${formData.currentStrapper || "Not specified"}</td></tr>
          <tr><td class="label">Model of Interest</td><td>${formData.modelInterested || "Not specified"}</td></tr>
          <tr><td class="label">Make/Brand</td><td>${formData.make || "Not specified"}</td></tr>
          <tr><td class="label">Service / PT Roll</td><td>${formData.serviceRoll || "Not specified"}</td></tr>
        </table>

        <!-- Remarks -->
        ${formData.remarks ? `
        <div class="section-title">Additional Comments</div>
        <div class="remarks">${formData.remarks.replace(/\n/g, "<br>")}</div>
        ` : ""}

        <!-- Timestamp -->
        <div class="timestamp">
          <span>Form Submitted: ${currentTime}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <strong>Shree Balaji Packtech</strong><br/>
        Leading manufacturer of industrial packaging equipment.<br/>
        <small>This is an automated notification from our visitor management system.</small>
      </div>
    </div>
  </body>
  </html>
  `
;
};

// App Router Handler Functions (for app/api/send-email/route.ts)
export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json();

    // Validation
    if (!formData.visitorName || !formData.phoneNo || !formData.emailId) {
      return NextResponse.json({
        success: false,
        message: 'Required fields are missing (visitorName, phoneNo, emailId)',
        error: 'Validation failed'
      }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailId)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format',
        error: 'Email validation failed'
      }, { status: 400 });
    }

    // Phone validation
    const phoneRegex = /^[+]?[0-9\s-()]{10,}$/;
    if (!phoneRegex.test(formData.phoneNo)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid phone number format',
        error: 'Phone validation failed'
      }, { status: 400 });
    }

    // Email configuration
    const mailOptions = {
      from: {
        name: 'Shree Balaji Packtech',
        address: process.env.EMAIL_USER!
      },
      to: 'ashutosh.mishra@gennextit.com',
      subject: `New Visitor Form - ${formData.visitorName}`,
      html: generateEmailHTML(formData),
      text: `
===============================================
SHREE BALAJI PACKTECH
Industrial Packaging Solutions
===============================================

NEW VISITOR INQUIRY NOTIFICATION

Dear Sales Team,

A new visitor has submitted an inquiry through our website contact form. 
Please review the details below and ensure follow-up within 24 hours.

VISITOR INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Full Name:        ${formData.visitorName || 'Not provided'}
• Phone Number:     ${formData.phoneNo || 'Not provided'}  
• Email Address:    ${formData.emailId || 'Not provided'}

EQUIPMENT & SERVICE REQUIREMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Current Strapper: ${formData.currentStrapper || 'Not specified'}
• Model Interest:   ${formData.modelInterested || 'Not specified'}
• Make/Brand:       ${formData.make || 'Not specified'}
• Service/PT Roll:  ${formData.serviceRoll || 'Not specified'}

${formData.remarks ? `
ADDITIONAL COMMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.remarks}
` : ''}

SUBMISSION DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Source: Website Contact Form
• Priority: Standard Follow-up Required

NEXT STEPS:
• Contact visitor within 24 hours
• Update CRM system with inquiry details
• Schedule product demonstration if applicable

===============================================
This is an automated notification from the 
Visitor Management System.

For technical support, contact IT department.
===============================================
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', info.messageId);
    
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    });

  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to send email. Please try again.',
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

// Pages Router Handler Function (for pages/api/send-email.ts)
// Uncomment this if you're using Pages Router instead of App Router
/*
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Only POST requests are accepted.'
    });
  }

  try {
    const formData: FormData = req.body;

    // ... (same validation and email sending logic as above)

  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again.',
      error: error.message || 'Internal server error'
    });
  }
}
*/