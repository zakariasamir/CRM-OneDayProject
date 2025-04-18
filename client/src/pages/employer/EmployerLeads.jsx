import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeads,
  fetchManagers,
  createLead,
  updateLead,
  deleteLead,
  // assignLead,
} from "../../redux/slices/employerSlice";
import Button from "../../components/Button";
import Input from "../../components/Input";

const EmployerLeads = () => {
  const dispatch = useDispatch();
  const { leads, managers, isLoading, error } = useSelector(
    (state) => state.employer
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "in_progress",
    notes: "",
    managerId: "",
  });

  useEffect(() => {
    dispatch(fetchLeads());
    dispatch(fetchManagers());
  }, [dispatch]);

  const handleOpenModal = (lead = null) => {
    if (lead) {
      setIsEditMode(true);
      setCurrentLead(lead);
      setFormData({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        notes: lead.notes || "",
        managerId: lead.managerId || "",
      });
    } else {
      setIsEditMode(false);
      setCurrentLead(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        status: "in_progress",
        notes: "",
        managerId: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditMode && currentLead) {
      await dispatch(
        updateLead({
          id: currentLead.id,
          data: formData,
        })
      );
    } else {
      await dispatch(createLead(formData));
    }

    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      await dispatch(deleteLead(id));
    }
  };

  // const handleAssign = async (leadId, managerId) => {
  //   await dispatch(assignLead({ leadId, managerId }));
  // };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading && leads.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button onClick={() => handleOpenModal()}>Add Lead</Button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {leads.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No leads found. Add your first lead.
            </li>
          ) : (
            leads.map((lead) => (
              <li key={lead._id} className="px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {lead.name}
                      </h3>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(
                          lead.status
                        )}`}
                      >
                        {lead.status === "in_progress"
                          ? "In Progress"
                          : lead.status === "completed"
                          ? "Completed"
                          : "Canceled"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{lead.email}</p>
                    <p className="text-sm text-gray-500">{lead.phone}</p>
                    {lead.notes && (
                      <p className="text-sm text-gray-500 mt-1">
                        Notes: {lead.notes}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Assigned to:{" "}
                      {lead.managerId
                        ? managers.find((m) => m._id === lead.managerId)?.name ||
                          "Unknown"
                        : "Unassigned"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(lead)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(lead.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Lead" : "Add Lead"}
            </h2>

            <form onSubmit={handleSubmit}>
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELED">Canceled</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to Manager
                </label>
                <select
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Unassigned</option>
                  {managers.map((manager) => (
                    <option key={manager._id} value={manager._id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditMode ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerLeads;
