"use client"

import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { logoutUser } from "../redux/slices/authSlice"

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, role } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate("/login")
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">Lead CRM</h1>
          </div>

          <nav className="flex items-center space-x-4">
            {role === "employer" && (
              <>
                <Link
                  to="/employer/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/employer/managers"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Managers
                </Link>
                <Link
                  to="/employer/leads"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Leads
                </Link>
              </>
            )}

            {role === "manager" && (
              <Link
                to="/manager/leads"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                My Leads
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-gray-700">{user?.name || "User"}</div>
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
