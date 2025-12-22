import sendEmail from "../utils/sendEmail.js";
import catchAsync from "../utils/catchAsync.js";

export const sendContactEmail = catchAsync(async (req, res, next) => {
    const { name, email, phone, projectType, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            status: "fail",
            message: "Please provide name, email, subject, and message.",
        });
    }

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .email-container {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 700px;
                margin: 0 auto;
                background-color: #f8f9fa;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .header {
                background: linear-gradient(135deg, #DC0000 0%, #8B0000 100%);
                color: #ffffff;
                padding: 40px 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            .header p {
                margin: 10px 0 0;
                opacity: 0.9;
                font-size: 16px;
            }
            .content {
                padding: 40px;
                background-color: #ffffff;
            }
            .field-row {
                margin-bottom: 25px;
                border-bottom: 1px solid #edf2f7;
                padding-bottom: 12px;
            }
            .field-label {
                font-weight: 600;
                color: #DC0000;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 6px;
                display: block;
            }
            .field-value {
                color: #1a202c;
                font-size: 17px;
                line-height: 1.5;
            }
            .message-box {
                background-color: #fff5f5;
                padding: 25px;
                border-radius: 8px;
                border-left: 5px solid #DC0000;
                margin-top: 15px;
            }
            .footer {
                padding: 25px;
                text-align: center;
                font-size: 12px;
                color: #a0aec0;
                background-color: #f8f9fa;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>${`New ${projectType} Project Inquiry` || "New Inquiry"}</h1>
            </div>
            <div class="content">
                <div class="field-row">
                    <span class="field-label">Sender Name</span>
                    <div class="field-value"><strong>${name}</strong></div>
                </div>
                <div class="field-row">
                    <span class="field-label">Email Address</span>
                    <div class="field-value"><a href="mailto:${email}" style="color: #DC0000; text-decoration: none; font-weight: 500;">${email}</a></div>
                </div>
                <div class="field-row" style="display: ${phone ? 'block' : 'none'}">
                    <span class="field-label">Phone Number</span>
                    <div class="field-value">${phone || "Not provided"}</div>
                </div>
                <div class="field-row">
                    <span class="field-label">Subject Line</span>
                    <div class="field-value">${subject}</div>
                </div>
                <div class="field-row" style="border-bottom: none;">
                    <span class="field-label">Detailed Message</span>
                    <div class="message-box">
                        <div class="field-value" style="color: #2d3748;">${message.replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Trivie Portfolio. All rights reserved.
            </div>
        </div>
    </body>
    </html>
  `;

    const text = `
    NEW PROJECT INQUIRY
    -------------------
    Name: ${name}
    Email: ${email}
    Phone: ${phone || "Not provided"}
    Project Type: ${projectType || "Not specified"}
    Subject: ${subject}
    
    MESSAGE:
    ${message}
  `;

    await sendEmail({
        to: process.env.SMTP_USER, // Sending the email to the admin
        subject: `New Contact Inquiry: ${subject}`,
        html,
        text,
    });

    res.status(200).json({
        status: "success",
        message: "Email sent successfully!",
    });
});
