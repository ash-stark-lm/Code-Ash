import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from './utils/axiosClient.js'

// REGISTER USER
// REGISTER USER
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/user/register', {
        firstName: userData.firstName,
        emailId: userData.emailId,
        password: userData.password,
      })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }
)

// VERIFY OTP
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ emailId, otp, firstName, password }, { rejectWithValue }) => {
    try {
      const payload = {
        emailId,
        otp,
        firstName, // Changed from username
        password,
      }

      const res = await axiosClient.post('/auth/verify-otp', payload)
      return res.data.user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'OTP verification failed'
      )
    }
  }
)
// LOGIN
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/login', credentials)
      return response.data.user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Invalid Credentials'
      )
    }
  }
)

// GOOGLE LOGIN
export const googleLogin = createAsyncThunk(
  'auth/google-login',
  async (token, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/auth/google-login', { token })
      return res.data.user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Google login failed'
      )
    }
  }
)

// CHECK AUTH
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/auth/check-auth')
      return data.user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Auth check failed'
      )
    }
  }
)

// LOGOUT
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/auth/logout')
      return null
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed')
    }
  }
)

// INITIAL STATE
const initialState = {
  user: null,
  emailForOTP: '', // ✅ for OTP page
  isAuthenticated: false,
  loading: false,
  error: null,
}

// SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmailForOTP: (state, action) => {
      state.emailForOTP = action.payload
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.emailForOTP = action.payload.emailId // ✅ used in OTP page
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // VERIFY OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
        state.emailForOTP = ''
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // GOOGLE LOGIN
      .addCase(googleLogin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
        state.error = action.payload
      })

      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.error = action.payload
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.emailForOTP = ''
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null
      })
  },
})

export const { setEmailForOTP, clearAuthError } = authSlice.actions
export default authSlice.reducer
