import { configureStore } from '@reduxjs/toolkit';
import authSlice from './postsSlice';

export default configureStore({
  reducer: {
    posts: authSlice,
  },
});
