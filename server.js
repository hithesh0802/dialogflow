import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const GITHUB_JSON_URL = "https://raw.githubusercontent.com/hithesh0802/dialogflow/refs/heads/main/rawfile.json";

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
        console.log("Fetched data:", JSON.stringify(data, null, 2));

        let fulfillmentText = "Sorry, I don't have that information.";

        if (intent === "Admission Information") {
            fulfillmentText = data["Admission Information"]?.general_info || fulfillmentText;
        } else if (intent === "About the College") {
            const about = data["About the College"];
            fulfillmentText = `NIT Trichy, established in 1964, is one of India's premier engineering institutions.
            \n📍 Location: ${about?.location || "N/A"}
            \n🏆 Ranking: ${about?.ranking || "N/A"}
            \n🏫 History: ${about?.history || "N/A"}`;
        } else if (intent === "Eligibility Criteria") {
            const eligibility = data["Admission Information"]?.eligibility;
            fulfillmentText = `Eligibility:\nB.Tech: ${eligibility?.BTech || "N/A"}\nM.Tech: ${eligibility?.MTech || "N/A"}\nMBA: ${eligibility?.MBA || "N/A"}\nMSc: ${eligibility?.MSc || "N/A"}\nPhD: ${eligibility?.PhD || "N/A"}`;
        } else if (intent === "Application Process") {
            fulfillmentText = data["Admission Information"]?.application_process || fulfillmentText;
        } else if (intent === "Important Dates") {
            const dates = data["Admission Information"]?.important_dates;
            fulfillmentText = `Admission Dates:\nB.Tech: ${dates?.BTech || "N/A"}\nM.Tech: ${dates?.MTech || "N/A"}\nMBA: ${dates?.MBA || "N/A"}`;
        } else if (intent === "Courses Offered") {
            fulfillmentText = `Undergraduate: ${data["Courses Offered"]?.undergraduate.join(", ") || "N/A"}\nPostgraduate: ${data["Courses Offered"]?.postgraduate.join(", ") || "N/A"}\nDoctoral: ${data["Courses Offered"]?.doctoral.join(", ") || "N/A"}`;
        } else if (intent === "Fee Structure") {
            const fee = data["Fee Structure"];
            fulfillmentText = `B.Tech: ${fee?.BTech || "N/A"}\nM.Tech: ${fee?.MTech || "N/A"}\nMBA: ${fee?.MBA || "N/A"}\nMSc: ${fee?.MSc || "N/A"}\nPhD: ${fee?.PhD || "N/A"}\nHostel Fees: ${fee?.hostel_fees || "N/A"}`;
        } else if (intent === "Placement Information") {
            const placement = data["Placement Information"];
            fulfillmentText = `Highest Package: ${placement?.highest_package || "N/A"}\nAverage Package: ${placement?.average_package || "N/A"}\nPlacement Percentage: ${placement?.placement_percentage || "N/A"}\nTop Recruiters: ${placement?.top_recruiters.join(", ") || "N/A"}`;
        } else if (intent === "Internship Opportunities") {
            fulfillmentText = data["Placement Information"]?.internship_opportunities || fulfillmentText;
        } else if (intent === "About the College") {
            fulfillmentText = data["About the College"]?.history || fulfillmentText;
        } else if (intent === "College Location") {
            fulfillmentText = data["About the College"]?.location || fulfillmentText;
        } else if (intent === "College Ranking") {
            fulfillmentText = data["About the College"]?.ranking || fulfillmentText;
        } else if (intent === "Campus Facilities") {
            fulfillmentText = `Library: ${data["Campus Facilities"]?.library || "N/A"}\nSports: ${data["Campus Facilities"]?.sports || "N/A"}\nLabs: ${data["Campus Facilities"]?.labs || "N/A"}\nHostel: ${data["Campus Facilities"]?.hostel || "N/A"}`;
        } else if (intent === "Student Clubs") {
            fulfillmentText = `Clubs: ${data["Student Life"]?.clubs.join(", ") || "N/A"}`;
        } else if (intent === "Cultural Events") {
            fulfillmentText = `Festivals: ${data["Student Life"]?.festivals.join(", ") || "N/A"}`;
        } else if (intent === "Research Opportunities") {
            fulfillmentText = `Research Centers: ${data["Research Opportunities"]?.centers.join(", ") || "N/A"}\nFunding: ${data["Research Opportunities"]?.funding || "N/A"}`;
        } else if (intent === "Scholarship Opportunities") {
            fulfillmentText = `Merit-Based: ${data["Scholarship Opportunities"]?.merit_scholarships || "N/A"}\nNeed-Based: ${data["Scholarship Opportunities"]?.need_based || "N/A"}\nGovernment Schemes: ${data["Scholarship Opportunities"]?.government_schemes.join(", ") || "N/A"}`;
        } else if (intent === "Alumni Network") {
            fulfillmentText = `Top Companies: ${data["Alumni Network"]?.top_companies.join(", ") || "N/A"}\nMentorship: ${data["Alumni Network"]?.mentorship || "N/A"}`;
        } else if (intent === "Hostel and Accommodation") {
            fulfillmentText = `Hostel Facilities: ${data["Hostel and Accommodation"]?.hostel_facilities || "N/A"}\nHostel Fee: ${data["Hostel and Accommodation"]?.hostel_fee || "N/A"}`;
        }

        return res.json({ fulfillmentText });
    } catch (error) {
        console.error("Error fetching the data:", error);
        return res.json({ fulfillmentText: `Error fetching data. ${error.message}` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
