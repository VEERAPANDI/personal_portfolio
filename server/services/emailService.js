const nodemailer = require('nodemailer');
const { Newsletter, Blog } = require('../models');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Generate an attractive HTML email template for the newsletter
 */
const generateEmailTemplate = (blogs, watchContent) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const siteName = process.env.SITENAME || 'My Portfolio';

    const blogListHtml = blogs.length > 0 
        ? blogs.map(blog => `
            <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; color: #333;">${blog.title}</h3>
                <p style="margin: 0 0 15px 0; color: #666; line-height: 1.5;">${blog.excerpt}</p>
                <a href="${clientUrl}/blog/${blog.slug}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Read More</a>
            </div>
        `).join('')
        : '<p style="color: #666;">No new blogs this week, but stay tuned for more!</p>';

    const watchSectionHtml = watchContent && watchContent.link
        ? `
            <div style="margin-top: 30px; background-color: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 5px solid #28a745;">
                <h2 style="margin-top: 0; color: #28a745;">📺 Good Content to Watch</h2>
                <h3 style="margin-bottom: 10px;">${watchContent.title || 'Recommended Video'}</h3>
                ${watchContent.description ? `<p style="color: #666; margin-bottom: 15px;">${watchContent.description}</p>` : ''}
                <a href="${watchContent.link}" style="color: #28a745; font-weight: bold; text-decoration: underline;">Watch on YouTube/Platform</a>
            </div>
        `
        : '';

    const logoHtml = `
        <div style="font-family: monospace; font-size: 24px; font-weight: bold; color: white;">
            <span style="color: #64ffda;">&lt;</span>
            <span style="letter-spacing: 1px;">vp</span>
            <span style="color: #64ffda;">/&gt;</span>
        </div>
    `;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; }
            .header { text-align: center; padding: 30px 0; background-color: #112240; color: white; border-radius: 5px 5px 0 0; }
            .content { padding: 30px 20px; background-color: #ffffff; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div style="margin-bottom: 10px;">${logoHtml}</div>
                <h1 style="margin: 0; font-size: 18px; opacity: 0.9;">${siteName} Weekly Update</h1>
            </div>
            <div class="content">
                <h2 style="color: #1a1a1a; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px;">New Blog Posts</h2>
                ${blogListHtml}
                
                ${watchSectionHtml}
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                    <p>Want to see more? Visit the full blog at <a href="${clientUrl}/blog" style="color: #007bff;">${clientUrl}/blog</a></p>
                </div>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
                <p>You are receiving this email because you subscribed to our newsletter.</p>
                <p><a href="${process.env.BACKEND_URL || clientUrl + '/api'}/newsletter/unsubscribe?email={{EMAIL}}" style="color: #999;">Unsubscribe</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
};

/**
 * Send the weekly newsletter to all active subscribers
 */
const sendWeeklyNewsletter = async (watchContent = null) => {
    try {
        // 1. Get all active subscribers
        const subscribers = await Newsletter.find({ 
            isActive: true,
            status: 'active' 
        });
        if (subscribers.length === 0) {
            console.log('No active subscribers found.');
            return { success: true, message: 'No active subscribers.' };
        }

        // 2. Get blogs from the last 7 days
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const newBlogs = await Blog.find({
            isPublished: true,
            createdAt: { $gte: lastWeek }
        }).sort({ createdAt: -1 });

        // 3. Generate HTML
        const html = generateEmailTemplate(newBlogs, watchContent);

        // 4. Send email to each subscriber (using Promise.all for speed, but consider limiting if list is huge)
        const sendPromises = subscribers.map(sub => {
            // Personalize the HTML with the subscriber's email for the unsubscribe link
            const personalizedHtml = html.replace(/{{EMAIL}}/g, encodeURIComponent(sub.email));
            
            return transporter.sendMail({
                from: `"${process.env.SITENAME || 'Portfolio'}" <${process.env.SMTP_USER}>`,
                to: sub.email,
                subject: `Weekly Update: New Content from ${process.env.SITENAME || 'my blog'}!`,
                html: personalizedHtml,
            });
        });

        const results = await Promise.allSettled(sendPromises);
        
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failureCount = results.length - successCount;

        console.log(`Newsletter sent! Success: ${successCount}, Failures: ${failureCount}`);
        
        return {
            success: true,
            count: successCount,
            failures: failureCount
        };
    } catch (error) {
        console.error('Error in sendWeeklyNewsletter:', error);
        throw error;
    }
};

module.exports = {
    sendWeeklyNewsletter
};
