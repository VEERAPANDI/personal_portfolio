const cron = require('node-cron');
const { sendWeeklyNewsletter } = require('./emailService');

const initCronJobs = () => {
    // Schedule for every Monday at 9:00 AM
    // Seconds Minutes Hours DayOfMonth Month DayOfWeek
    // 0 9 * * 1
    cron.schedule('0 9 * * 1', async () => {
        console.log('Running scheduled weekly newsletter task...');
        try {
            await sendWeeklyNewsletter();
            console.log('Scheduled weekly newsletter sent successfully.');
        } catch (error) {
            console.error('Failed to send scheduled weekly newsletter:', error);
        }
    });

    console.log('Cron jobs initialized: Newsletter scheduled for every Monday at 9:00 AM.');
};

module.exports = {
    initCronJobs
};
