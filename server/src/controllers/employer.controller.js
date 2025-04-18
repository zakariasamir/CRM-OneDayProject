import User from "../models/user.model.js";
import Lead from "../models/lead.model.js";
import bcrypt from "bcrypt";

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile" });
  }
};

// Manager Handlers

// GET all managers
const getManagers = async (req, res) => {
  const managers = await User.find({ role: "manager" }).select("-password");
  res.json(managers);
};

// POST create manager
const createManager = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const manager = await User.create({
    name,
    email,
    password: hashed,
    role: "manager",
  });
  res.status(201).json({ message: "Manager created", managerId: manager._id });
};

// PUT update manager
const updateManager = async (req, res) => {
  const { managerId } = req.params;
  const { name, email, password } = req.body;

  const updateData = { name, email };
  if (password) updateData.password = await bcrypt.hash(password, 10);

  const manager = await User.findOneAndUpdate(
    { _id: managerId, role: "manager" },
    updateData,
    { new: true }
  );
  if (!manager) return res.status(404).json({ message: "Manager not found" });
  res.json({ message: "Manager updated" });
};

// DELETE manager
const deleteManager = async (req, res) => {
  const { managerId } = req.params;
  const deleted = await User.findOneAndDelete({
    _id: managerId,
    role: "manager",
  });
  if (!deleted) return res.status(404).json({ message: "Manager not found" });
  res.json({ message: "Manager deleted" });
};

// Lead Handlers

// GET all leads (with optional filters)
const getLeads = async (req, res) => {
  const { managerId, status } = req.query;
  const filter = {};
  if (managerId) filter.managerId = managerId;
  if (status) filter.status = status;

  const leads = await Lead.find(filter).populate("managerId", "name email");
  res.json(leads);
};

// POST create lead
const createLead = async (req, res) => {
  const { contactName, contactEmail, companyName, status, managerId } =
    req.body;
  const lead = await Lead.create({
    contactName,
    contactEmail,
    companyName,
    status,
    managerId,
  });
  res.status(201).json({ message: "Lead created", leadId: lead._id });
};

// PUT update lead
const updateLead = async (req, res) => {
  const { leadId } = req.params;
  const update = req.body;

  const lead = await Lead.findByIdAndUpdate(leadId, update, { new: true });
  if (!lead) return res.status(404).json({ message: "Lead not found" });

  res.json({ message: "Lead updated", lead });
};

// DELETE lead
const deleteLead = async (req, res) => {
  const { leadId } = req.params;
  const deleted = await Lead.findByIdAndDelete(leadId);
  if (!deleted) return res.status(404).json({ message: "Lead not found" });

  res.json({ message: "Lead deleted" });
};

const getDashboardStats = async (req, res) => {
  try {
    const stats = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      total: 0,
      inProgress: 0,
      completed: 0,
      canceled: 0,
    };

    stats.forEach((stat) => {
      result.total += stat.count;
      switch (stat._id) {
        case "IN_PROGRESS":
          result.inProgress = stat.count;
          break;
        case "COMPLETED":
          result.completed = stat.count;
          break;
        case "CANCELED":
          result.canceled = stat.count;
          break;
      }
    });

    res.json(result);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  profile,
  getManagers,
  createManager,
  updateManager,
  deleteManager,
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  getDashboardStats,
};
