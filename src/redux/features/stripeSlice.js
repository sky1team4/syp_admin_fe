import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const saveStripeConfig = createAsyncThunk(
  'stripe/saveConfig',
  async (data) => {
    const response = await fetch('/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        publish_key: data.publishableKey,
        secret_key: data.secretKey,
        webhook_signing_secret: data.webhookSigningSecret,
        webhook_url: data.webhookUrl,
        default_currency: data.defaultCurrency,
        allowed_currency: data.allowedCurrencies.join(','),
        text_mode: data.testMode ? 'test' : 'live'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save Stripe configuration');
    }

    return await response.json();
  }
);

const stripeSlice = createSlice({
  name: 'stripe',
  initialState: {
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveStripeConfig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveStripeConfig.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(saveStripeConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default stripeSlice.reducer; 