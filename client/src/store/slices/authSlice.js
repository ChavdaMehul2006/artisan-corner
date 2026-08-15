import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get('/auth/me');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Not authenticated');
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post('/auth/login', credentials);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post('/auth/register', userData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Registration failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await axiosClient.post('/auth/logout');
    return true;
  } catch (err) {
    return rejectWithValue(err.message || 'Logout failed');
  }
});

const initialState = {
  user: null,
  store: null,
  isAuthenticated: false,
  isVendor: false,
  isAdmin: false,
  loading: true,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setStoreInfo: (state, action) => {
      state.store = action.payload;
      if (state.store?.isApproved) {
        state.isVendor = true;
      }
    }
  },
  extraReducers: (builder) => {
    // checkAuth
    builder.addCase(checkAuth.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.store = action.payload.store || null;
      state.isAuthenticated = true;
      state.isVendor = action.payload.user?.role === 'VENDOR' || action.payload.user?.role === 'ADMIN';
      state.isAdmin = action.payload.user?.role === 'ADMIN';
      state.error = null;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.loading = false;
      state.user = null;
      state.store = null;
      state.isAuthenticated = false;
      state.isVendor = false;
      state.isAdmin = false;
    });

    // login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isVendor = action.payload.user?.role === 'VENDOR' || action.payload.user?.role === 'ADMIN';
      state.isAdmin = action.payload.user?.role === 'ADMIN';
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isVendor = action.payload.user?.role === 'VENDOR' || action.payload.user?.role === 'ADMIN';
      state.isAdmin = action.payload.user?.role === 'ADMIN';
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.store = null;
      state.isAuthenticated = false;
      state.isVendor = false;
      state.isAdmin = false;
      state.loading = false;
      state.error = null;
    });
  }
});

export const { clearAuthError, setStoreInfo } = authSlice.actions;
export default authSlice.reducer;
