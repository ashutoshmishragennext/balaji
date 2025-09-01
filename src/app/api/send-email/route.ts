/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import nodemailer from 'nodemailer';
import { NextRequest } from 'next/server';

interface FormData {
  companyName: string;
  personName: string;
  phone: string;
  email: string;
  make: string;
  model: string;
  technicalSupport: string;
  newMachineModel: string;
  eventName: string;
  remarks: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json();
    console.log('Received form data:', formData);
    // Create transporter with your email service (FIXED: createTransport not createTransporter)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Email content - Using your specific HTML template format
    const emailHTML = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Visitor Inquiry - VAJRA EQUIPMENTS</title>
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
      background: linear-gradient(135deg, #9333ea, #7e22ce); /* purple gradient */
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
      color: #7e22ce; /* purple */
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
      background: #faf5ff; /* light purple bg */
      font-weight: bold;
      color: #7e22ce; /* purple */
      width: 35%;
      text-transform: uppercase;
      font-size: 12px;
    }
    .remarks {
      background: #fdf4ff;
      border: 1px solid #d8b4fe;
      padding: 16px;
      border-radius: 6px;
      font-style: italic;
      margin-top: 20px;
      color: #6b21a8; /* deep purple */
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
      background: #7e22ce; /* purple */
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
      <div class="company-name">VAJRA EQUIPMENTS</div>
      <div class="company-tagline">Industrial Packaging Solutions</div>
      <div class="badge">INDIA CORR EXPO 2025 - New Visitor Inquiry</div>
    </div>

    <!-- Content -->
    <div class="content">
      <p>Dear Sales Team,</p>
      <p>A new visitor has submitted an inquiry through our INDIA CORR EXPO 2025 form at Stall No. C-15. Please review the details below:</p>
      
      <!-- Visitor Info -->
      <div class="section-title">Visitor Information</div>
      <table>
        <tr><td class="label">Company Name</td><td>${formData.companyName || "Not provided"}</td></tr>
        <tr><td class="label">Person Name</td><td>${formData.personName || "Not provided"}</td></tr>
        <tr><td class="label">Phone Number</td><td>${formData.phone || "Not provided"}</td></tr>
        <tr><td class="label">Email Address</td><td>${formData.email || "Not provided"}</td></tr>
      </table>

      <!-- Equipment Info -->
      <div class="section-title">Equipment & Service Details</div>
      <table>
        <tr><td class="label">Existing Machine Make</td><td>${formData.make || "Not specified"}</td></tr>
        <tr><td class="label">Existing Model</td><td>${formData.model || "Not specified"}</td></tr>
        <tr><td class="label">Service Type</td><td>${formData.technicalSupport || "Not specified"}</td></tr>
        <tr><td class="label">New Machine Interest</td><td>${formData.newMachineModel || "Not specified"}</td></tr>
        ${formData.eventName ? `<tr><td class="label">Event Name</td><td>${formData.eventName}</td></tr>` : ''}
      </table>

      <!-- Remarks -->
      ${formData.remarks ? `
      <div class="section-title">Additional Comments</div>
      <div class="remarks">${formData.remarks.replace(/\n/g, "<br>")}</div>
      ` : ""}

      <!-- Timestamp -->
      <div class="timestamp">
        <span>Form Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <strong>Vajra Equipments</strong><br/>
      INDIA CORR EXPO 2025 | Stall No. C-15 | 11-12-13 SEP<br/>
      India Expo Centre, Greater Noida<br/>
      <small>This is an automated notification from our visitor management system.</small>
    </div>
  </div>
</body>
</html>

    `;

    // Send email  
    await transporter.sendMail({
      from: `"Vajra Equipments" <${process.env.EMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject: `EXPO Lead: ${formData.companyName} - ${formData.personName}`,
      html: emailHTML,
      replyTo: formData.email,
    });

    console.log('Email sent successfully to:', process.env.RECIPIENT_EMAIL);

    return Response.json({ 
      success: true, 
      message: 'Email sent successfully!' 
    });
    
  } catch (error: any) {
    console.error('Error sending email:', error);
    
    // More detailed error handling
    let errorMessage = 'Failed to send email';
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your credentials.';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'SMTP server not found. Please check your email settings.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return Response.json(
      { 
        success: false, 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}