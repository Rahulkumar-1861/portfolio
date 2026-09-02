const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { Resend } = require("resend");

dotenv.config({
    path: path.join(__dirname, "../.env")
});

const app = express();
const PORT = process.env.PORT || 5001;

function getResendClient() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return null;
    }

    return new Resend(apiKey);
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Portfolio backend is running!");
});

app.post("/api/contact", async (req, res) => {
    try {
        const name = String(req.body.name || "").trim();
        const email = String(req.body.email || "").trim();
        const message = String(req.body.message || "").trim();

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        if (!process.env.RESEND_API_KEY || !process.env.EMAIL_TO) {
            console.error("Missing RESEND_API_KEY or EMAIL_TO environment variable");
            return res.status(500).json({
                success: false,
                message: "Failed to send message."
            });
        }

        const resend = getResendClient();
        if (!resend) {
            return res.status(500).json({
                success: false,
                message: "Failed to send message."
            });
        }

        const fromAddress = process.env.EMAIL_FROM || "Portfolio <onboarding@resend.dev>";

        const { error } = await resend.emails.send({
            from: fromAddress,
            to: process.env.EMAIL_TO,
            replyTo: email,
            subject: `Portfolio Contact - ${name}`,
            text: `You received a new message from your portfolio.

Name: ${name}
Email: ${email}

Message:
${message}`,
            html: `<p>You received a new message from your portfolio.</p>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, "<br>")}</p>`
        });

        if (error) {
            console.error("Resend error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to send message."
            });
        }

        res.status(200).json({
            success: true,
            message: "Message sent successfully"
        });
    } catch (error) {
        console.error("Email error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send message."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
