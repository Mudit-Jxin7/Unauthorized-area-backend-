const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const EmailModel = require("./emailModel");

const app = express();
const port = 3000;

const users = [
  { username: "ramanjotsingh247@gmail.com", password: "123456" },
  { username: "muditert34@gmail.com", password: "938583" },
  { username: "muniyandi", password: "842985" },
];

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://muditert34:B63OMLaX7UjmmvFq@cluster0.szvhxep.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  res.json({ message: "Login successful!" });
});

app.get("/mail", async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  // connect with the smtp
  const emailDoc = await EmailModel.findOne();

  // If no email found, return an error
  if (!emailDoc) {
    return res.status(404).json({ message: "Email address not found." });
  }

  let transporter = await nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "muditert34@gmail.com",
      pass: "otzbxqvmoeoihfoe",
    },
  });

  let info = await transporter.sendMail({
    from: '"Mudit Jain" <muditert34@gmail.com>',
    to: emailDoc.email,
    subject: "Hello Admin",
    text: "Unauthorized user detected!!",
    html: "<b>Unauthorized user detected!!</b>",
  });

  console.log("Message sent: %s", info.messageId);
  res.json(info);
});

app.post("/mail", async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  // connect with the smtp
  const email = req.body.email;
  const message = req.body.message;

  // If no email found, return an error
  if (!email) {
    return res.status(404).json({ message: "Email address not found." });
  }

  const emailDoc = await EmailModel.findOne();

  if (!emailDoc) {
    return res.status(404).json({ message: "Email address not found." });
  }

  let transporter = await nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "muditert34@gmail.com",
      pass: "otzbxqvmoeoihfoe",
    },
  });

  let info = await transporter.sendMail({
    from: email,
    to: emailDoc.email,
    subject: "Access to unauthorized area",
    text: `You have message from ${email} : ${message}`,
  });

  console.log("Message sent: %s", info.messageId);
  res.json(info);
});

app.post("/updateEmail", async (req, res) => {
  const newEmail = req.body.email;

  if (!newEmail) {
    return res.status(400).json({ message: "New email address is required." });
  }

  // Update the recipient email address in MongoDB
  try {
    await EmailModel.findOneAndUpdate(
      {},
      { email: newEmail },
      { upsert: true }
    );
    res.json({ message: "Recipient email updated successfully.", newEmail });
  } catch (error) {
    console.error("Error updating recipient email:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
