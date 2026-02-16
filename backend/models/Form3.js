// models/Form3.js
const mongoose = require("mongoose");

const Form3 = new mongoose.Schema({
  academicYear: {type: String, required: true},
  weeks: [
    {
      weekNumber: Number,
      fromDate: Date,
      toDate: Date,
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Form3", Form3);
