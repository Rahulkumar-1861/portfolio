const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from the portfolio root folder
dotenv.config({
    path: path.join(__dirname, "../.env")
});

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Gmail transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test backend
app.get("/", (req, res) => {
    res.send("Portfolio backend is running!");
});

// Contact form API
app.post("/api/contact", async(req, res) => {
    try {
        const { name, email, message } = req.body;

        // Check fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });
        }

        // Email to your Gmail
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Portfolio Contact - ${name}`,
            text: `
You received a new message from your portfolio.

Name: ${name}
Email: ${email}

Message:
${message}
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "Message sent successfully!"
        });

    } catch (error) {
        console.error("Email error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send message."
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});