import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get('/wishlist');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const toggleWishlistAsync = createAsyncThunk(
  'wishlist/toggleWishlistAsync',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(`/wishlist/toggle/${productId}`);
      return { productId, isAdded: res.data.isAdded };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    productIds: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      if (action.payload) {
        state.items = action.payload.products || [];
        state.productIds = (action.payload.products || []).map((p) => p._id);
      }
    });
    builder.addCase(toggleWishlistAsync.fulfilled, (state, action) => {
      const { productId, isAdded } = action.payload;
      if (isAdded) {
        if (!state.productIds.includes(productId)) {
          state.productIds.push(productId);
        }
      } else {
        state.productIds = state.productIds.filter((id) => id !== productId);
        state.items = state.items.filter((p) => p._id !== productId);
      }
    });
  }
});

export default wishlistSlice.reducer;
