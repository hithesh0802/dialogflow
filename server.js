import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const GITHUB_JSON_URL = "https://raw.githubusercontent.com/srdarknighter/website_data/main/db-scraped-data.json";

app.post("/webhook", async (req, res) => {
    const intent = req.body.queryResult.intent.displayName;

    try {
        console.log(`Fetching data from: ${GITHUB_JSON_URL}`);
        const response = await fetch(GITHUB_JSON_URL);

        if (!response.ok) {
            console.error(`Error fetching GitHub data: ${response.status} ${response.statusText}`);
            return res.json({ fulfillmentText: `Error fetching data: ${response.status} ${response.statusText}` });
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        let fulfillmentText = "Sorry, I don't have that information.";

        if (intent === "Admission Information") {
            fulfillmentText = data["Admission Information"]?.general_info || fulfillmentText;
        } else if (intent === "Eligibility Criteria") {
            fulfillmentText = `Eligibility for courses: \nB.Tech - ${data["Admission Information"].eligibility.BTech} \nM.Tech - ${data["Admission Information"].eligibility.MTech} \nMBA - ${data["Admission Information"].eligibility.MBA} \nMSc - ${data["Admission Information"].eligibility.MSc} \nPhD - ${data["Admission Information"].eligibility.PhD}`;
        } else if (intent === "Application Process") {
            fulfillmentText = data["Admission Information"]?.application_process || fulfillmentText;
        } else if (intent === "Important Dates") {
            fulfillmentText = `Admission Dates:\nB.Tech - ${data["Admission Information"].important_dates.BTech} \nM.Tech - ${data["Admission Information"].important_dates.MTech} \nMBA - ${data["Admission Information"].important_dates.MBA}`;
        } else if (intent === "Courses Offered") {
            fulfillmentText = `Undergraduate courses: ${data["Courses Offered"].undergraduate.join(", ")}`;
        } else if (intent === "Doctoral Programs") {
            fulfillmentText = `PhD programs offered: ${data["Courses Offered"].doctoral.join(", ")}`;
        } else if (intent === "Fee Structure") {
            fulfillmentText = `B.Tech: ${data["Fee Structure"].BTech} \nM.Tech: ${data["Fee Structure"].MTech} \nMBA: ${data["Fee Structure"].MBA} \nMSc: ${data["Fee Structure"].MSc} \nPhD: ${data["Fee Structure"].PhD}`;
        } else if (intent === "Hostel Fees") {
            fulfillmentText = `Hostel fee per semester: ${data["Fee Structure"].hostel_fees}`;
        } else if (intent === "Scholarship Opportunities") {
            fulfillmentText = data["Scholarship Opportunities"].merit_scholarships;
        } else if (intent === "Government Scholarships") {
            fulfillmentText = `Government scholarships: ${data["Scholarship Opportunities"].government_schemes.join(", ")}`;
        } else if (intent === "Corporate Scholarships") {
            fulfillmentText = `Corporate scholarships available from: ${data["Scholarship Opportunities"].corporate_scholarships}`;
        } else if (intent === "Placement Information") {
            fulfillmentText = `Highest package: ${data["Placement Information"].highest_package}`;
        } else if (intent === "Average Package") {
            fulfillmentText = `Average package: ${data["Placement Information"].average_package}`;
        } else if (intent === "Top Recruiters") {
            fulfillmentText = `Top recruiters: ${data["Placement Information"].top_recruiters.join(", ")}`;
        } else if (intent === "Placement Percentage") {
            fulfillmentText = `Placement percentage: ${data["Placement Information"].placement_percentage}`;
        } else if (intent === "Internship Opportunities") {
            fulfillmentText = data["Placement Information"].internship_opportunities;
        } else if (intent === "PhD Admissions") {
            fulfillmentText = `PhD admission process: ${data["Admission Information"].eligibility.PhD}`;
        } else if (intent === "M.Tech Admission Process") {
            fulfillmentText = `M.Tech admission process: ${data["Admission Information"].eligibility.MTech}`;
        } else if (intent === "MBA Admission Process") {
            fulfillmentText = `MBA admission process: ${data["Admission Information"].eligibility.MBA}`;
        } else if (intent === "MSc Admission Process") {
            fulfillmentText = `MSc admission process: ${data["Admission Information"].eligibility.MSc}`;
        }

        return res.json({ fulfillmentText });
    } catch (error) {
        console.error("Error fetching the data:", error);
        return res.json({ fulfillmentText: `Error fetching data. ${error.message}` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
