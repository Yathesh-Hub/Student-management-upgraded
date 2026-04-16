const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });


const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB connection error:", err));

const studentSchema = new mongoose.Schema({
    sid:    { type: String },
    name:   String,
    dept:   String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

studentSchema.index({ sid: 1, userId: 1 }, { unique: true });

const Student = mongoose.model("Student", studentSchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model("User", userSchema);

app.post("/addStudent", async (req, res) => {
    try {
        const { sid, name, dept, userId } = req.body;
        const student = new Student({ sid, name, dept, userId });
        await student.save();
        res.json({ message: "Student data saved Successfully!" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Student ID already exists!" });
        }
        res.status(500).json({ message: "Error saving student" });
    }
});

app.get("/searchStudent/:sid", async (req, res) => {
    try {
        const { userId } = req.query;
        const student = await Student.findOne({ sid: req.params.sid, userId });
        if (!student) return res.json({ message: "Student Not Found" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: "Search error" });
    }
});

app.get("/allStudent", async (req, res) => {
    try {
        const { userId } = req.query;
        const students = await Student.find({ userId });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: "Error fetching students" });
    }
});

app.delete("/delStudent/:sid", async (req, res) => {
    try {
        const { userId } = req.query;
        const student = await Student.findOneAndDelete({ sid: req.params.sid, userId });
        if (!student) return res.json({ message: "Student Not Found!" });
        res.json({ message: "Student deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting student" });
    }
});

app.put("/updateStudent/:sid", async (req, res) => {
    try {
        const { name, dept, userId } = req.body;
        const student = await Student.findOneAndUpdate(
            { sid: req.params.sid, userId },
            { name, dept },
            { new: true }
        );
        if (!student) return res.json({ message: "Student Not Found" });
        res.json({ message: "Student Updated Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Update error" });
    }
});
// ✅ SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully", userId: user._id });

  } catch (err) {
    res.status(500).json({ message: "Signup error" });
  }
});

// ✅ LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful", name: user.name, userId: user._id });

  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
