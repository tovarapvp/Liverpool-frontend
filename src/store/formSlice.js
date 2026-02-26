import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const MOCK_FORM_DATA = [
    {
        label: 'Full Name',
        type: 'text',
        mandatory: true,
        placeholder: 'Enter your full name',
        name: 'fullName',
    },
    {
        label: 'Email',
        type: 'email',
        mandatory: true,
        placeholder: 'Enter your email',
        name: 'email',
    },
    {
        label: 'Phone Number',
        type: 'tel',
        mandatory: false,
        placeholder: 'Enter your phone number',
        name: 'phone',
    },
    {
        label: 'Date of Birth',
        type: 'date',
        mandatory: true,
        placeholder: '',
        name: 'dateOfBirth',
    },
    {
        label: 'Gender',
        type: 'select',
        mandatory: true,
        options: ['Male', 'Female', 'Other', 'Prefer not to say'],
        name: 'gender',
    },
    {
        label: 'Address',
        type: 'textarea',
        mandatory: false,
        placeholder: 'Enter your address',
        name: 'address',
    },
    {
        label: 'Password',
        type: 'password',
        mandatory: true,
        placeholder: 'Enter a password',
        name: 'password',
    },
    {
        label: 'Quantity',
        type: 'number',
        mandatory: false,
        placeholder: 'Enter quantity',
        name: 'quantity',
    },
    {
        label: 'I agree to terms and conditions',
        type: 'checkbox',
        mandatory: true,
        name: 'terms',
    },
];

export const fetchFormFields = createAsyncThunk(
    'form/fetchFormFields',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(
                'https://run.mocky.io/v3/2a5049a2-c09b-49e6-8fd1-09aa4f0bc7bb'
            );
            if (!response.ok) throw new Error('Failed to fetch form data');
            const data = await response.json();
            return Array.isArray(data) ? data : data.fields || data;
        } catch (error) {
            console.warn('Mocky.io API unavailable, using fallback mock data:', error.message);
            return MOCK_FORM_DATA;
        }
    }
);

const formSlice = createSlice({
    name: 'form',
    initialState: {
        fields: [],
        values: {},
        errors: {},
        loading: false,
        error: null,
        submitted: false,
    },
    reducers: {
        setFieldValue: (state, action) => {
            const { name, value } = action.payload;
            state.values[name] = value;
            if (state.errors[name]) {
                delete state.errors[name];
            }
        },
        setErrors: (state, action) => {
            state.errors = action.payload;
        },
        setSubmitted: (state, action) => {
            state.submitted = action.payload;
        },
        resetForm: (state) => {
            state.values = {};
            state.errors = {};
            state.submitted = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFormFields.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFormFields.fulfilled, (state, action) => {
                state.loading = false;
                state.fields = action.payload;
                const initialValues = {};
                action.payload.forEach((field) => {
                    const key = field.name || field.label;
                    initialValues[key] = field.type === 'checkbox' ? false : '';
                });
                state.values = initialValues;
            })
            .addCase(fetchFormFields.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setFieldValue, setErrors, setSubmitted, resetForm } = formSlice.actions;
export default formSlice.reducer;
