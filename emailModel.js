// Assuming you have MongoDB properly configured and running
const mongoose = require("mongoose");

// Define a schema for the email addresses
const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});

// Create a model based on the schema
const EmailModel = mongoose.model("Email", emailSchema);

module.exports = EmailModel;
