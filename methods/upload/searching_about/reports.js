 const {queryAsync, matchNLPSet} = require("../../common_methods");


const getAllReports = async (req, res) => {
    try {
        const getRepQuery = "SELECT title, text, author, location, issuedate, concern FROM Report";
        const results = await queryAsync(getRepQuery, []);

        const formattedReports = results.map(report => ({
            title: report.title,
            text: report.text,
            author: report.author,
            location: report.location,
            issuedate: report.issuedate,
            concern: report.concern
        }));

        res.json({reports: formattedReports});
    } catch (error) {
        console.error("Error fetching all reports:", error);
        res.status(500).send("Internal Server Error");
    }
};

const getSpecificReport = async (req, res) => {
    try {
        const title = req.params.title;
        const getRepQuery = "SELECT title, text, author, location, issuedate, concern FROM Report WHERE Report.Title = ?";
        const results = await queryAsync(getRepQuery, [title]);

        const formattedReports = results.map(report => ({
            title: report.title,
            text: report.text,
            author: report.author,
            location: report.location,
            issuedate: report.issuedate,
            concern: report.concern
        }));

        res.json({reports: formattedReports});
    } catch (error) {
        console.error("Error fetching specific report:", error);
        res.status(500).send("Internal Server Error");
    }
};

const getReportsByConcern = async (req, res) => {
    try {
        let concern = req.params.concern;

        if (!concern)
            return res.status(400).send("Invalid Data");

        const sql = "SELECT * FROM Report WHERE (Concern = ?)";
        const reports = await queryAsync(sql, [concern]);

        if (reports.length === 0)
            return res.status(400).send("No reports found for the specified concern");

        const formattedReports = [];
        for (const report of reports) {
            const reportDataSql = "SELECT Data FROM ReportData WHERE (Report = ?)";
            const reportData = await queryAsync(reportDataSql, [report.Title]);

            const formattedReport = {
                title: report.Title,
                text: report.Text,
                author: report.Author,
                location: report.Location,
                issueDate: report.IssueDate,
                concern: report.Concern,
                data: reportData.map(item => item.Data)
            };

            formattedReports.push(formattedReport);
        }

        res.json({reports: formattedReports});
    } catch (error) {
        console.error("Error getting reports by concern:", error);
        res.status(500).send("Internal Server Error");
    }
};


 const searchReportsByTextOrLocation = async (req, res) => {
     try {
         const searchText = req.query.text;
         const searchLocation = req.query.location;

          if (!searchText && !searchLocation) {
             return res.status(400).send('Invalid Data. Please provide text or location to search.');
         }

          const concernsArray = await matchNLPSet(searchText);

          let query = 'SELECT * FROM Report WHERE';
         const queryParams = [];

          if (concernsArray.length > 0) {
             query += ` Concern IN (${concernsArray.map(concern => `'${concern}'`).join(',')})`;
         }

         if (searchLocation) {
             if (concernsArray.length > 0) {
                 query += ' AND';
             }
             query += ' Location = ?';
             queryParams.push(searchLocation);
         }

          const searchResults = await queryAsync(query, queryParams);

         return res.status(200).json({ results: searchResults, text: searchText, location: searchLocation });
     } catch (error) {
         console.error('Error searching reports by text or location:', error);
         return res.status(500).send('Internal Server Error');
     }
 };

module.exports = {getAllReports, getSpecificReport, getReportsByConcern,searchReportsByTextOrLocation};
