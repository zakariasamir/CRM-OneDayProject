import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMyLeads, updateMyLead } from "../../redux/slices/managerSlice"
import Button from "../../components/Button"

const ManagerLeads = () => {
  const dispatch = useDispatch()
  const { leads, isLoading, error } = useSelector((state) => state.manager)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentLead, setCurrentLead] = useState(null)
  const [formData, setFormData] = useState({
    status: "",
    notes: "",
  })

  useEffect(() => {
    dispatch(fetchMyLeads())
  }, [dispatch])

  const handleOpenModal = (lead) => {
    setCurrentLead(lead)
    setFormData({
      status: lead.status,
      notes: lead.notes || "",
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await dispatch(
      updateMyLead({
        id: currentLead.id,
        data: formData,
      }),
    )

    handleCloseModal()
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "canceled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading && leads.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Leads</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
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
            <li className="px-6 py-4 text-center text-gray-500">No leads assigned to you yet.</li>
          ) : (
            leads.map((lead) => (
              <li key={lead.id} className="px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">{lead.name}</h3>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(lead.status)}`}>
                        {lead.status === "in_progress"
                          ? "In Progress"
                          : lead.status === "completed"
                            ? "Completed"
                            : "Canceled"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{lead.email}</p>
                    <p className="text-sm text-gray-500">{lead.phone}</p>
                    {lead.notes && <p className="text-sm text-gray-500 mt-1">Notes: {lead.notes}</p>}
                  </div>
                  <div>
                    <Button variant="primary" size="sm" onClick={() => handleOpenModal(lead)}>
                      Update Status
                    </Button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Update Lead Status Modal */}
      {isModalOpen && currentLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Lead: {currentLead.name}</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
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
                <Button type="submit">Update</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagerLeads
