import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchManagers,
  createManager,
  updateManager,
  deleteManager,
} from "../../redux/slices/employerSlice";
import Button from "../../components/Button";
import Input from "../../components/Input";

const EmployerManagers = () => {
  const dispatch = useDispatch();
  const { managers, isLoading, error } = useSelector((state) => state.employer);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentManager, setCurrentManager] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(fetchManagers());
  }, [dispatch]);

  const handleOpenModal = (manager = null) => {
    if (manager) {
      setIsEditMode(true);
      setCurrentManager(manager);
      setFormData({
        name: manager.name,
        email: manager.email,
        password: "", // Don't populate password for security
      });
    } else {
      setIsEditMode(false);
      setCurrentManager(null);
      setFormData({
        name: "",
        email: "",
        password: "",
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

    if (isEditMode && currentManager) {
      // Only include password if it was changed
      const updateData = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      await dispatch(
        updateManager({
          id: currentManager.id,
          data: updateData,
        })
      );
    } else {
      await dispatch(createManager(formData));
    }

    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this manager?")) {
      await dispatch(deleteManager(id));
    }
  };

  if (isLoading && managers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Managers</h1>
        <Button onClick={() => handleOpenModal()}>Add Manager</Button>
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
          {managers.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No managers found. Add your first manager.
            </li>
          ) : (
            managers.map((manager) => (
              <li key={manager.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {manager.name}
                    </h3>
                    <p className="text-sm text-gray-500">{manager.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(manager)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(manager.id)}
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

      {/* Manager Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Manager" : "Add Manager"}
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
                label={
                  isEditMode
                    ? "Password (leave blank to keep current)"
                    : "Password"
                }
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditMode}
              />

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

export default EmployerManagers;
