import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const submitVerificationRequest = createAsyncThunk(
    'verification/submit',
    async ({ userData, documents }, { rejectWithValue }) => {
        console.log("userData in slice", userData);
        console.log("documents in slice", documents);
        try {
            const formData = new FormData();

            // Add user data with actual values
            formData.append('userId', userData.id);
            formData.append('username', userData.username);
            formData.append('phone', userData.phone);

            // Add documents
            const frontDoc = documents.find(doc => doc.id === 1);
            const backDoc = documents.find(doc => doc.id === 2);

            if (!frontDoc?.file || !backDoc?.file) {
                throw new Error('Please upload both front and back images');
            }

            // Add debugging for files
            console.log('Front file:', frontDoc.file);
            console.log('Back file:', backDoc.file);

            formData.append('frontSide', frontDoc.file);
            formData.append('backSide', backDoc.file);

            // Add debugging to inspect FormData contents
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ', pair[1]);
            }

            const response = await fetch(`http://localhost:3000/verification-requests`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            });
            console.log(response);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const verificationSlice = createSlice({
    name: 'verification',
    initialState: {
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetVerificationState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitVerificationRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitVerificationRequest.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(submitVerificationRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetVerificationState } = verificationSlice.actions;
export default verificationSlice.reducer; 