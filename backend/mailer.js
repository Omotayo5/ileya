const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

/**
 * Sends an email using a pre-defined HTML template.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} templateName - The filename of the HTML template in the 'mail-templates' directory.
 * @param {object} replacements - An object where keys are placeholders in the template and values are the replacements.
 */
async function sendEmail(to, subject, templateName, replacements) {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Correctly constructs the path to the templates in the /frontend/mail-templates/ directory
    const templatePath = path.join(__dirname, '..', 'frontend', 'mail-templates', templateName);

    try {
        // Read the HTML template file asynchronously
        let htmlContent = await fs.readFile(templatePath, 'utf-8');

        // Replace placeholders with actual values
        for (const placeholder in replacements) {
            const regex = new RegExp(placeholder.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            htmlContent = htmlContent.replace(regex, replacements[placeholder]);
        }

        const mailOptions = {
            from: `"Ileya" <${process.env.EMAIL_FROM || 'noreply@ileya.com'}>`,
            to,
            subject,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Error in sendEmail for template ${templateName}:`, error);
        // Re-throw the error to be caught by the calling function
        throw error;
    }
}

module.exports = { sendEmail };
