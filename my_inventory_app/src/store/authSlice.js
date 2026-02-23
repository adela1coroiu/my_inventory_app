import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isLoggedIn: false
    },
    reducers: {
        setAuth: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = !!action.payload; //true if the user exists and false if the user is null
        },
        clearAuth: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;