import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3004/api/employer";

// Async Thunks
export const fetchProfile = createAsyncThunk(
  "employer/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/profile`);
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
      const response = await axios.get(`${API_URL}/managers`);
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
      const response = await axios.post(`${API_URL}/managers`, managerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateManager = createAsyncThunk(
  "employer/updateManager",
  async ({ managerId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/managers/${managerId}`,
        data
      );
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
      await axios.delete(`${API_URL}/managers/${managerId}`);
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
      const response = await axios.get(`${API_URL}/leads`, { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createLead = createAsyncThunk(
  "employer/createLead",
  async (leadData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/leads`, leadData);
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
      const response = await axios.put(`${API_URL}/leads/${leadId}`, data);
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
      await axios.delete(`${API_URL}/leads/${leadId}`);
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
      const response = await axios.get(`${API_URL}/dashboard/stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
      .addCase(createManager.fulfilled, (state, action) => {
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
      .addCase(createLead.fulfilled, (state, action) => {
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
