import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabase/supabaseClient";

export const fetchStocks = createAsyncThunk('stocks/fetchStocks', async () => {
    const { data, error } = await supabase
        .from('stocks')
        .select('*')

    if(error) {
        throw error;
    }

    return data;
});

const stockSlice = createSlice({
    name: 'stocks',
    initialState: {
        items: [],
        status: 'idle',
        error: null
    },
    reducers: {
        addStockLocal: (state, action) => {
            state.items.push(action.payload);
        },
        updateStockLocal: (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if(index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deleteStockLocal: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStocks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchStocks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchStocks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { addStockLocal, updateStockLocal, deleteStockLocal } = stockSlice.actions;
export default stockSlice.reducer;