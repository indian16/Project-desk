// const mongoose = require("mongoose");

// const headSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true },
//     password: { type: String, required: true },
//     department: { type: String, required: true },
//     academicYear: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear" }, // optional if you want HOD per year
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Head", headSchema);


const mongoose = require("mongoose");

const headSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "head",
      enum: ["head"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Head", headSchema);

