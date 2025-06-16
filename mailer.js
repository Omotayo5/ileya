const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // Your SMTP username
        pass: process.env.SMTP_PASS  // Your SMTP password
    }
});

/**
 * Sends an email using a pre-defined template.
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Email subject.
 * @param {string} templateName - The name of the HTML template file (e.g., 'welcome-email.html').
 * @param {object} placeholders - An object with keys to replace in the template (e.g., { '[User_s_Name]': 'John' }).
 */
const sendEmail = async (to, subject, templateName, placeholders) => {
    const templatePath = path.join(__dirname, 'ileya-app', 'mail-templates', templateName);

    try {
        // Read the HTML template
        const template = await fs.promises.readFile(templatePath, 'utf-8');

        // Add logo URL to placeholders if it's not already present
        const logoUrl = process.env.LOGO_URL || '';
        const logoPlaceholders = {
            '[Logo URL]': logoUrl
        };

        // Merge logo placeholders with provided placeholders
        const allPlaceholders = { ...logoPlaceholders, ...placeholders };

        // Replace placeholders in the template
        let html = template;
        for (const [key, value] of Object.entries(allPlaceholders)) {
            // Escape regex special characters in the placeholder key so we treat it literally
            const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(safeKey, 'g');
            html = html.replace(regex, value);
        }

        // Send the email using Nodemailer
        const mailOptions = {
            from: `"Ileya" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: to,
            subject: subject,
            html: html
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw error;
    }
};

module.exports = { sendEmail };
