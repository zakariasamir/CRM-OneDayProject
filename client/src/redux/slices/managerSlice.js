import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3004/api/manager";

// Async Thunks
export const fetchMyLeads = createAsyncThunk(
  "manager/fetchMyLeads",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/leads`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateMyLead = createAsyncThunk(
  "manager/updateMyLead",
  async ({ leadId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/leads/${leadId}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  leads: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const managerSlice = createSlice({
  name: "manager",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Leads
      .addCase(fetchMyLeads.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyLeads.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leads = action.payload;
        state.error = null;
      })
      .addCase(fetchMyLeads.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update My Lead
      .addCase(updateMyLead.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMyLead.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leads = state.leads.map((lead) =>
          lead._id === action.payload.lead._id ? action.payload.lead : lead
        );
        state.error = null;
      })
      .addCase(updateMyLead.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetStatus } = managerSlice.actions;
export default managerSlice.reducer;