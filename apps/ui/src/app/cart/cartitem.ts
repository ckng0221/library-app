import { createSlice } from '@reduxjs/toolkit';

export const cartItemsSlice = createSlice({
  name: 'cartitems',
  initialState: {
    value: [],
  },
  reducers: {
    addToCart: (state, action) => {
      state.value.push(action.payload);
    },
    setCartItems: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, setCartItems } = cartItemsSlice.actions;

export default cartItemsSlice.reducer;
