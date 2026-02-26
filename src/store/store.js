import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import formReducer from './formSlice';

const store = configureStore({
    reducer: {
        products: productsReducer,
        form: formReducer,
    },
});

export default store;
