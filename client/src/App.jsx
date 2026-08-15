import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/slices/authSlice';
import { fetchServerCart } from './store/slices/cartSlice';
import { fetchWishlist } from './store/slices/wishlistSlice';
import AppRoutes from './routes/AppRoutes';
import { ToastProvider } from './components/common/Toast';

export function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchServerCart());
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
}

export default App;
