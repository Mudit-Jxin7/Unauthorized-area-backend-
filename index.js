const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

const users = [
  { username: "ramanjot", password: 123456 },
  { username: "mudit", password: 938583 },
  { username: "muniyandi", password: 842985 },
];

app.use(bodyParser.json());

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
