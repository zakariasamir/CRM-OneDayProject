import Lead from "../models/lead.model.js";

// GET /api/managers/leads
const getMyLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ managerId: req.user.id });
    res.json(leads);
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/managers/leads/:id
const updateMyLead = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    if (lead.managerId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your lead" });

    if (status) {
      const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"];
      if (!validStatuses.includes(status))
        return res.status(400).json({ message: "Invalid status value" });
      lead.status = status;
    }

    await lead.save();
    res.json({ message: "Lead updated", lead });
  } catch (err) {
    console.error("Error updating lead:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getMyLeads,
  updateMyLead,
};
