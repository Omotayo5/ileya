const pool = require('./db');

const handleReport = async (req, res) => {
    const { id: listerId } = req.params;
    const { reportType } = req.body;
    const reporterId = req.session.user ? req.session.user.id : null;

    if (!reporterId) {
        return res.status(401).json({ success: false, message: 'You must be logged in to report a lister.' });
    }

    if (parseInt(listerId, 10) === reporterId) {
        return res.status(403).json({ success: false, message: 'You cannot report yourself.' });
    }

    if (!['legit', 'scam'].includes(reportType)) {
        return res.status(400).json({ success: false, message: 'Invalid report type.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();

        // Check if the user has already reported this lister
        const [existingReports] = await connection.execute(
            'SELECT id FROM lister_reports WHERE reporter_id = ? AND lister_id = ?',
            [reporterId, listerId]
        );

        if (existingReports.length > 0) {
            return res.status(409).json({ success: false, message: 'You have already reported this lister.' });
        }

        // Insert the new report
        await connection.execute(
            'INSERT INTO lister_reports (reporter_id, lister_id, report_type) VALUES (?, ?, ?)',
            [reporterId, listerId, reportType]
        );

        res.status(201).json({ success: true, message: 'Your report has been submitted successfully.' });

    } catch (error) {
        console.error('Error submitting report:', error);
        // Check for foreign key constraint violation (e.g., lister not found)
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).json({ success: false, message: 'The lister you are trying to report does not exist.' });
        }
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { handleReport };
