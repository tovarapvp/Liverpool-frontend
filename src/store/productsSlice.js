import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ page = 1, name = '' }, { rejectWithValue }) => {
        try {
            let url = `/api/rickandmorty/character?page=${page}`;
            if (name) url += `&name=${name}`;
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                    return { results: [], info: { pages: 0, count: 0, next: null } };
                }
                throw new Error('Failed to fetch products');
            }
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchProductDetail = createAsyncThunk(
    'products/fetchProductDetail',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/rickandmorty/character/${id}`);
            if (!response.ok) throw new Error('Product not found');
            const character = await response.json();

            const episodePromises = character.episode.slice(0, 5).map((epUrl) =>
                fetch(epUrl.replace('https://rickandmortyapi.com/api', '/api/rickandmorty')).then((res) => res.json())
            );
            const episodes = await Promise.all(episodePromises);

            return { ...character, episodeDetails: episodes };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        selectedProduct: null,
        loading: false,
        detailLoading: false,
        error: null,
        detailError: null,
        currentPage: 1,
        totalPages: 0,
        hasMore: true,
        searchTerm: '',
    },
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
            state.items = [];
            state.currentPage = 1;
            state.hasMore = true;
        },
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
            state.detailError = null;
        },
        resetProducts: (state) => {
            state.items = [];
            state.currentPage = 1;
            state.hasMore = true;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                const { results, info } = action.payload;
                if (results.length === 0) {
                    state.hasMore = false;
                } else {
                    const existingIds = new Set(state.items.map((item) => item.id));
                    const newItems = results.filter((item) => !existingIds.has(item.id));
                    state.items = [...state.items, ...newItems];
                    state.totalPages = info.pages;
                    state.hasMore = info.next !== null;
                    state.currentPage += 1;
                }
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductDetail.pending, (state) => {
                state.detailLoading = true;
                state.detailError = null;
            })
            .addCase(fetchProductDetail.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductDetail.rejected, (state, action) => {
                state.detailLoading = false;
                state.detailError = action.payload;
            });
    },
});

export const { setSearchTerm, clearSelectedProduct, resetProducts } = productsSlice.actions;
export default productsSlice.reducer;
