const path = require('path')
const createTokenManager = require('./services/token-manager')
const createApiClient = require('./services/api-client')

const config = {
  username: process.env.API_USERNAME,
  password: process.env.API_PASSWORD,
  apiBaseUrl: 'https://api.dev.npmedia.net/customer-api',
  tokenFile: path.join(__dirname, '.token-data.json'),
}

function createClient() {
  const tokenManager = createTokenManager(config.tokenFile)
  return createApiClient(config, tokenManager)
}

async function main() {
  try {
    const api = createClient()
    const data = await api.call('entities/queues', {
      queryType: 'getItemsQuery',
      queryParams: {
        filters: [
          {
            field: 'status',
            value: 'Operational',
            operator: 'eq',
          },
        ],
      },
    })
    console.log('API Response:', JSON.stringify(data, null, 2).substring(0, 500) + '...')
  } catch (error) {
    console.error('Error:', error.message)
  }
}

main()