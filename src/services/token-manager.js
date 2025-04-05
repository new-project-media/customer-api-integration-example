const fs = require('fs')

function createTokenManager(tokenFile) {
  // Buffer time before token expiry (5 minutes in milliseconds)
  const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000

  let tokenData = {
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  }

  // Loads token data from file storage and returns whether a valid token was loaded
  function load() {
    try {
      if (fs.existsSync(tokenFile)) {
        const data = JSON.parse(fs.readFileSync(tokenFile, 'utf8'))
        tokenData = { ...tokenData, ...data }
        return isValid()
      }
    } catch (error) {
      console.error('Error loading token data:', error.message)
    }
    return false
  }

  // Persists current token data to file storage
  function save() {
    try {
      fs.writeFileSync(tokenFile, JSON.stringify(tokenData, null, 2))
    } catch (error) {
      console.error('Error saving token data:', error.message)
    }
  }

  // Checks if the current access token exists and hasn't expired (with 5 min buffer)
  function isValid() {
    return (
      tokenData.accessToken &&
      tokenData.expiresAt &&
      Date.now() + TOKEN_EXPIRY_BUFFER_MS < tokenData.expiresAt
    )
  }

  // Updates token data with a new response from the auth server and saves it
  function update(response) {
    tokenData = {
      ...tokenData,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresAt: Date.now() + response.expiresIn * 1000,
    }
    save()
  }

  return {
    load,
    update,
    isValid,
    getAccessToken: () => tokenData.accessToken,
    getRefreshToken: () => tokenData.refreshToken,
  }
}

module.exports = createTokenManager 