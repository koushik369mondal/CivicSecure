require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Log the loaded Mongo URI to debug
console.log("Loaded Mongo URI:", process.env.MONGODB_URI);

// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ Database connected successfully");
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err.message);
    });

// Middleware
app.use(cors());
app.use(express.json());

// Complaint Schema
const complaintSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    reporterType: {
        type: String,
        enum: ['anonymous', 'pseudonymous', 'verified'],
        default: 'anonymous'
    },
    department: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Review', 'Resolved'],
        default: 'Pending'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    assignedOfficer: {
        type: String,
        default: 'Pending Assignment'
    },
    attachments: {
        type: Number,
        default: 0
    },
    submittedDate: {
        type: String,
        required: true
    },
    lastUpdate: {
        type: String,
        required: true
    },
    estimatedResolution: {
        type: String
    },
    actualResolution: {
        type: String
    },
    history: [{
        step: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        remark: {
            type: String,
            required: true
        },
        officer: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// Create Complaint model
const Complaint = mongoose.model('Complaint', complaintSchema);

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "CivicSecure Backend is running!",
        status: "active",
        database: "MongoDB",
        timestamp: new Date().toISOString()
    });
});

// Health check route
app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});

// GET all complaints
app.get("/api/complaints", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.category) filter.category = req.query.category;
        if (req.query.priority) filter.priority = req.query.priority;

        const complaints = await Complaint.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Complaint.countDocuments(filter);

        res.json({
            success: true,
            count: complaints.length,
            total: total,
            page: page,
            pages: Math.ceil(total / limit),
            complaints: complaints
        });
    } catch (error) {
        console.error("❌ Failed to fetch complaints:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch complaints",
            message: error.message
        });
    }
});

// GET complaint by ID
app.get("/api/complaints/:id", async (req, res) => {
    try {
        const complaint = await Complaint.findOne({ id: req.params.id });
        if (!complaint) {
            return res.status(404).json({
                success: false,
                error: "Complaint not found"
            });
        }
        res.json({
            success: true,
            complaint: complaint
        });
    } catch (error) {
        console.error("❌ Failed to fetch complaint:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch complaint",
            message: error.message
        });
    }
});

// POST create new complaint
app.post("/api/complaints", async (req, res) => {
    try {
        const {
            id,
            title,
            category,
            description,
            location,
            reporterType = "anonymous",
            department,
            priority = "Medium",
            submittedDate,
            lastUpdate,
            attachments = 0,
            estimatedResolution,
            history = []
        } = req.body;

        // Validate required fields
        if (!id || !title || !category || !description || !location || !department) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: id, title, category, description, location, department"
            });
        }

        // Check if complaint with this ID already exists
        const existingComplaint = await Complaint.findOne({ id });
        if (existingComplaint) {
            return res.status(409).json({
                success: false,
                error: "Complaint with this ID already exists"
            });
        }

        // Create new complaint
        const newComplaint = new Complaint({
            id,
            title,
            category,
            description,
            location,
            reporterType,
            department,
            status: "Pending",
            priority,
            assignedOfficer: "Pending Assignment",
            attachments,
            submittedDate: submittedDate || new Date().toISOString().split('T')[0],
            lastUpdate: lastUpdate || new Date().toISOString().split('T')[0],
            estimatedResolution: estimatedResolution || null,
            history: history.length > 0 ? history : [{
                step: "Pending",
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour12: true }),
                remark: "Complaint filed successfully via online portal. Complaint ID generated and confirmation sent.",
                officer: "System"
            }]
        });

        const savedComplaint = await newComplaint.save();
        console.log("✅ New complaint saved:", savedComplaint.id);

        res.status(201).json({
            success: true,
            message: "Complaint filed successfully",
            complaint: savedComplaint
        });
    } catch (error) {
        console.error("❌ Failed to save complaint:", error);
        if (error.code === 11000) {
            res.status(409).json({
                success: false,
                error: "Complaint with this ID already exists"
            });
        } else {
            res.status(500).json({
                success: false,
                error: "Failed to save complaint",
                message: error.message
            });
        }
    }
});

// PUT update complaint
app.put("/api/complaints/:id", async (req, res) => {
    try {
        const { status, remark, officer, assignedOfficer, priority } = req.body;

        const complaint = await Complaint.findOne({ id: req.params.id });
        if (!complaint) {
            return res.status(404).json({
                success: false,
                error: "Complaint not found"
            });
        }

        // Update fields if provided
        if (status) {
            complaint.status = status;
            complaint.lastUpdate = new Date().toISOString().split('T')[0];
        }

        if (assignedOfficer) complaint.assignedOfficer = assignedOfficer;
        if (priority) complaint.priority = priority;

        // Add to history if remark is provided
        if (remark) {
            complaint.history.push({
                step: status || complaint.status,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour12: true }),
                remark: remark,
                officer: officer || "System"
            });
        }

        // Set actual resolution date if status is resolved
        if (status === 'Resolved' && !complaint.actualResolution) {
            complaint.actualResolution = new Date().toISOString().split('T')[0];
        }

        const updatedComplaint = await complaint.save();
        console.log("✅ Complaint updated:", updatedComplaint.id);

        res.json({
            success: true,
            message: "Complaint updated successfully",
            complaint: updatedComplaint
        });
    } catch (error) {
        console.error("❌ Failed to update complaint:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update complaint",
            message: error.message
        });
    }
});

// DELETE complaint
app.delete("/api/complaints/:id", async (req, res) => {
    try {
        const deletedComplaint = await Complaint.findOneAndDelete({ id: req.params.id });
        if (!deletedComplaint) {
            return res.status(404).json({
                success: false,
                error: "Complaint not found"
            });
        }

        console.log("✅ Complaint deleted:", deletedComplaint.id);
        res.json({
            success: true,
            message: "Complaint deleted successfully",
            complaint: deletedComplaint
        });
    } catch (error) {
        console.error("❌ Failed to delete complaint:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete complaint",
            message: error.message
        });
    }
});

// GET complaint statistics
app.get("/api/complaints/stats/summary", async (req, res) => {
    try {
        const totalComplaints = await Complaint.countDocuments();
        const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
        const inReviewComplaints = await Complaint.countDocuments({ status: 'In Review' });
        const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });

        const categoryStats = await Complaint.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const priorityStats = await Complaint.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            stats: {
                total: totalComplaints,
                pending: pendingComplaints,
                inReview: inReviewComplaints,
                resolved: resolvedComplaints,
                categories: categoryStats,
                priorities: priorityStats
            }
        });
    } catch (error) {
        console.error("❌ Failed to fetch stats:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch complaint statistics",
            message: error.message
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('❌ Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path
    });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
