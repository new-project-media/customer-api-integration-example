const axios = require('axios')

function createApiClient(config, tokenManager) {
  // Authenticates with username/password and returns a new access token
  async function authenticate() {
    try {
      const response = await axios({
        method: 'post',
        url: `${config.apiBaseUrl}/auth/login`,
        data: {
          username: config.username,
          password: config.password,
        },
      })
      tokenManager.update(response.data)
      return tokenManager.getAccessToken()
    } catch (error) {
      throw new Error(`Authentication failed: ${error.response?.data?.message || error.message}`)
    }
  }

  // Uses a refresh token to obtain a new access token without re-authenticating
  async function refreshToken() {
    const refreshToken = tokenManager.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await axios({
        method: 'post',
        url: `${config.apiBaseUrl}/auth/refresh`,
        data: { refreshToken },
      })
      tokenManager.update(response.data)
      return tokenManager.getAccessToken()
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.response?.data?.message || error.message}`)
    }
  }

  // Ensures a valid access token is available, refreshing or re-authenticating if necessary
  async function getValidToken() {
    if (!tokenManager.getAccessToken()) {
      tokenManager.load()
    }

    if (!tokenManager.isValid()) {
      return tokenManager.getRefreshToken() ? await refreshToken() : await authenticate()
    }

    return tokenManager.getAccessToken()
  }

  // Makes an authenticated API call to the specified endpoint
  async function call(endpoint, queryParams = {}) {
    try {
      const token = await getValidToken()
      const response = await axios({
        method: 'post',
        url: `${config.apiBaseUrl}/${endpoint}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: queryParams,
      })
      return response.data
    } catch (error) {
      throw new Error(`API call failed: ${error.response?.data?.message || error.message}`)
    }
  }

  return { call }
}

module.exports = createApiClient 