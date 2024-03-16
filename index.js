const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;

const users = [
  { username: "ramanjot", password: "123456" },
  { username: "mudit", password: "938583" },
  { username: "muniyandi", password: "842985" },
];

app.use(bodyParser.json());
app.use(cors());

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
    to: "muditert34@gmail.com",
    subject: "Hello Admin",
    text: "Unauthorized user detected!!",
    html: "<b>Unauthorized user detected!!</b>",
  });

  console.log("Message sent: %s", info.messageId);
  res.json(info);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
