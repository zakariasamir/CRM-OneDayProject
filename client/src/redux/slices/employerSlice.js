import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Configure axios instance with credentials
const API = axios.create({
  baseURL: "http://localhost:3004/api/employer",
  withCredentials: true, // This is crucial for sending cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// API.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Redirect to login page on unauthorized
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// Async Thunks
export const fetchProfile = createAsyncThunk(
  "employer/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`/profile`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchManagers = createAsyncThunk(
  "employer/fetchManagers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`/managers`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createManager = createAsyncThunk(
  "employer/createManager",
  async (managerData, { rejectWithValue }) => {
    try {
      const response = await API.post("/managers", managerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateManager = createAsyncThunk(
  "employer/updateManager",
  async ({ managerId, data }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/managers/${managerId}`, data);
      return { ...response.data, managerId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteManager = createAsyncThunk(
  "employer/deleteManager",
  async (managerId, { rejectWithValue }) => {
    try {
      await API.delete(`/managers/${managerId}`);
      return managerId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchLeads = createAsyncThunk(
  "employer/fetchLeads",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await API.get("/leads", { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createLead = createAsyncThunk(
  "employer/createLead",
  async (leadData, { rejectWithValue }) => {
    try {
      const response = await API.post(`/leads`, leadData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateLead = createAsyncThunk(
  "employer/updateLead",
  async ({ leadId, data }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/leads/${leadId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteLead = createAsyncThunk(
  "employer/deleteLead",
  async (leadId, { rejectWithValue }) => {
    try {
      await API.delete(`/leads/${leadId}`);
      return leadId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  "employer/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/dashboard/stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  profile: null,
  managers: [],
  leads: [],
  dashboardStats: {
    inProgress: 0,
    completed: 0,
    canceled: 0,
  },
  status: "idle",
  error: null,
};

const employerSlice = createSlice({
  name: "employer",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Profile
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Managers
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.managers = action.payload;
      })
      .addCase(createManager.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateManager.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.managers = state.managers.map((manager) =>
          manager._id === action.payload.managerId
            ? { ...manager, ...action.payload }
            : manager
        );
      })
      .addCase(deleteManager.fulfilled, (state, action) => {
        state.managers = state.managers.filter(
          (manager) => manager._id !== action.payload
        );
      })

      // Leads
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.leads = action.payload;
      })
      .addCase(createLead.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.leads = state.leads.map((lead) =>
          lead._id === action.payload.lead._id ? action.payload.lead : lead
        );
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.leads = state.leads.filter((lead) => lead._id !== action.payload);
      })

      // Dashboard Stats
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStats = action.payload;
      });
  },
});

export const { resetStatus } = employerSlice.actions;
export default employerSlice.reducer;
