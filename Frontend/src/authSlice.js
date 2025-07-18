import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from './utils/axiosClient'

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/user/register', userData)
      return response.data.user
    } catch (error) {
      return rejectWithValue(error.response.data.message)
    }
  }
)
export const googleLogin = createAsyncThunk(
  'auth/google-login',
  async (token, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/auth/google-login', { token })

      return res.data.user
    } catch (error) {
      return rejectWithValue(error.response.data.message)
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/login', credentials)
      return response.data.user
    } catch (error) {
      return rejectWithValue(error.response.data.message)
    }
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/auth/check-auth')

      return data.user
    } catch (error) {
      return rejectWithValue(error.response.data.message)
    }
  }
)
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/auth/logout')
      return null
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,

    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    //Register User case
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = !!action.payload // if action.payload->null = false else true
        state.user = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Something went wrong'
        state.isAuthenticated = false
        state.user = null
      })

      //Login User Case
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = !!action.payload
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Something went wrong'
        state.isAuthenticated = false
        state.user = null
      })
      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = !!action.payload
        state.user = action.payload
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Something went wrong'
        state.isAuthenticated = false
        state.user = null
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

        state.error = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Something went wrong'
        state.isAuthenticated = false
        state.user = null
      })
      //google-login
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
        state.error = action.payload?.message || 'Google login failed'
      })
  },
})

export default authSlice.reducer
