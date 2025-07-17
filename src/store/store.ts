import { configureStore } from '@reduxjs/toolkit';
import  carritoReducer  from '../slices/carritoSlice';



const store = configureStore({
    reducer: {
        carrito:carritoReducer,
        }
    });
        
        
export default store;