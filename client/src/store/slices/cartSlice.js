import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Helper to load cart from localStorage
const loadLocalCart = () => {
  try {
    const saved = localStorage.getItem('artisan_cart');
    return saved ? JSON.parse(saved) : { items: [], subtotal: 0 };
  } catch (e) {
    return { items: [], subtotal: 0 };
  }
};

// Helper to save cart to localStorage
const saveLocalCart = (cart) => {
  try {
    localStorage.setItem('artisan_cart', JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart to localStorage', e);
  }
};

// Helper to calculate subtotal
const calculateCartSubtotal = (items = []) => {
  const sum = items.reduce((acc, item) => {
    const unitPrice = item.product?.price ?? item.price ?? 0;
    const qty = item.quantity || 1;
    return acc + unitPrice * qty;
  }, 0);
  return Math.round(sum * 100) / 100;
};

// Normalize item structure so both local additions and server cart responses have consistent product data
const normalizeCartItems = (items = []) => {
  return items.map((i) => {
    const p = i.product && typeof i.product === 'object' ? i.product : {};
    return {
      _id: i._id || p._id,
      product: {
        _id: p._id || i.productId || i.product,
        name: p.name || i.name || 'Handcrafted Artisan Craft',
        slug: p.slug || i.slug || '',
        price: p.price ?? i.price ?? 0,
        compareAtPrice: p.compareAtPrice ?? i.compareAtPrice,
        images: p.images || (i.image ? [{ url: i.image }] : []),
        stock: p.stock ?? i.stock ?? 99,
        vendor: p.vendor || i.vendor,
        store: p.store || i.store
      },
      quantity: i.quantity || 1,
      price: i.price ?? p.price ?? 0,
      vendor: i.vendor || p.vendor
    };
  });
};

export const fetchServerCart = createAsyncThunk('cart/fetchServerCart', async (_, { getState, rejectWithValue }) => {
  try {
    const res = await axiosClient.get('/cart');
    const serverCart = res.data;

    // If server has items, return them
    if (serverCart && serverCart.items && serverCart.items.length > 0) {
      return serverCart;
    }

    // If server has no items, check if local state or localStorage has items to sync to server
    const state = getState();
    const currentLocalItems = state.cart?.items?.length > 0 ? state.cart.items : loadLocalCart().items;

    if (currentLocalItems && currentLocalItems.length > 0) {
      const syncRes = await axiosClient.post('/cart/sync', {
        items: currentLocalItems.map((i) => ({
          productId: i.product?._id || i.product || i.productId,
          quantity: i.quantity
        }))
      });
      return syncRes.data;
    }

    return serverCart;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addToCartAsync = createAsyncThunk('cart/addToCartAsync', async ({ product, quantity = 1 }, { rejectWithValue }) => {
  try {
    const productId = product._id || product;
    const res = await axiosClient.post('/cart/items', { productId, quantity });
    return res.data;
  } catch (err) {
    // If not authenticated or error, client-side fallback handles it
    return rejectWithValue(err.message);
  }
});

export const updateCartQtyAsync = createAsyncThunk('cart/updateCartQtyAsync', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/cart/items/${productId}`, { quantity });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const removeCartItemAsync = createAsyncThunk('cart/removeCartItemAsync', async (productId, { rejectWithValue }) => {
  try {
    const res = await axiosClient.delete(`/cart/items/${productId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const clearCartAsync = createAsyncThunk('cart/clearCartAsync', async (_, { rejectWithValue }) => {
  try {
    await axiosClient.delete('/cart');
    return { items: [], subtotal: 0 };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const syncCartWithServer = createAsyncThunk('cart/syncCartWithServer', async (items, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post('/cart/sync', {
      items: items.map((i) => ({
        productId: i.product?._id || i.product || i.productId,
        quantity: i.quantity
      }))
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const localCart = loadLocalCart();

const initialState = {
  items: normalizeCartItems(localCart.items || []),
  subtotal: localCart.subtotal || calculateCartSubtotal(localCart.items || []),
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const targetId = String(product._id || product);

      const existingIdx = state.items.findIndex(
        (i) => String(i.product?._id || i.product) === targetId
      );

      if (existingIdx > -1) {
        const newQty = state.items[existingIdx].quantity + quantity;
        state.items[existingIdx].quantity = Math.min(newQty, product.stock || 999);
      } else {
        const normalized = normalizeCartItems([{
          product,
          vendor: product.vendor,
          quantity: Math.min(quantity, product.stock || 999),
          price: product.price
        }])[0];
        state.items.push(normalized);
      }

      state.subtotal = calculateCartSubtotal(state.items);
      saveLocalCart({ items: state.items, subtotal: state.subtotal });
    },
    updateItemQty: (state, action) => {
      const { productId, quantity } = action.payload;
      const targetId = String(productId);
      const item = state.items.find((i) => String(i.product?._id || i.product) === targetId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => String(i.product?._id || i.product) !== targetId);
        } else {
          item.quantity = Math.min(quantity, item.product?.stock || 999);
        }
      }

      state.subtotal = calculateCartSubtotal(state.items);
      saveLocalCart({ items: state.items, subtotal: state.subtotal });
    },
    removeItem: (state, action) => {
      const targetId = String(action.payload);
      state.items = state.items.filter((i) => String(i.product?._id || i.product) !== targetId);
      state.subtotal = calculateCartSubtotal(state.items);
      saveLocalCart({ items: state.items, subtotal: state.subtotal });
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      saveLocalCart({ items: [], subtotal: 0 });
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Server Cart
      .addCase(fetchServerCart.fulfilled, (state, action) => {
        if (action.payload && action.payload.items && action.payload.items.length > 0) {
          state.items = normalizeCartItems(action.payload.items);
          state.subtotal = action.payload.subtotal || calculateCartSubtotal(state.items);
          saveLocalCart({ items: state.items, subtotal: state.subtotal });
        }
      })
      // Add to Cart on Server
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        if (action.payload && action.payload.items) {
          state.items = normalizeCartItems(action.payload.items);
          state.subtotal = action.payload.subtotal || calculateCartSubtotal(state.items);
          saveLocalCart({ items: state.items, subtotal: state.subtotal });
        }
      })
      // Update Qty on Server
      .addCase(updateCartQtyAsync.fulfilled, (state, action) => {
        if (action.payload && action.payload.items) {
          state.items = normalizeCartItems(action.payload.items);
          state.subtotal = action.payload.subtotal || calculateCartSubtotal(state.items);
          saveLocalCart({ items: state.items, subtotal: state.subtotal });
        }
      })
      // Remove Item on Server
      .addCase(removeCartItemAsync.fulfilled, (state, action) => {
        if (action.payload && action.payload.items) {
          state.items = normalizeCartItems(action.payload.items);
          state.subtotal = action.payload.subtotal || calculateCartSubtotal(state.items);
          saveLocalCart({ items: state.items, subtotal: state.subtotal });
        }
      })
      // Clear Cart on Server
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.subtotal = 0;
        saveLocalCart({ items: [], subtotal: 0 });
      })
      // Sync Cart with Server
      .addCase(syncCartWithServer.fulfilled, (state, action) => {
        if (action.payload && action.payload.items) {
          state.items = normalizeCartItems(action.payload.items);
          state.subtotal = action.payload.subtotal || calculateCartSubtotal(state.items);
          saveLocalCart({ items: state.items, subtotal: state.subtotal });
        }
      });
  }
});

export const { addItem, updateItemQty, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
