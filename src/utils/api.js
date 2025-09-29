import axios from 'axios'

const login = (payload) => {
  return axios.post('/api/login', payload)
}

const signup = (payload) => {
  return axios.post('/api/signup', payload)
}

const authMe = () => {
  return axios.get('/api/auth-me')
}

const logout = () => {
  return axios.get('/api/logout')
}

const chatHistory = (requestPayload) => {
  const data = {
    params: requestPayload,
  };
  
  return axios.get('/api/chat-history', data)
}

const stripePayment = (requestPayload) => {
  const data = {
    params: requestPayload,
  };
  
  return axios.post('/api/stripe-payment', data)
}

const subscriptionPrice = (requestPayload) => {
  const data = {
    params: requestPayload,
  };

  return axios.get('/api/subscription-price', data)
}

const signInWithGoogle = (requestPayload) => {
  const data = {
    params: requestPayload,
  };
  
  return axios.get('/api/google', data)
}

const changePassword = (payload) => {
  return axios.post('/api/change-password', payload)
}

export default {
  login,
  signup,
  authMe,
  logout,
  chatHistory,
  stripePayment,
  subscriptionPrice,
  signInWithGoogle,
  changePassword
}