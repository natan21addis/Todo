require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  hasuraEndpoint: process.env.HASURA_ENDPOINT || 'http://localhost:8080/v1/graphql',
  hasuraAdminSecret: process.env.HASURA_ADMIN_SECRET || 'myadminsecretkey',
  jwtSecret: process.env.JWT_SECRET || 'this-is-a-generic-HS256-secret-key-and-you-should-really-change-it',
  jwtExpireTime: process.env.JWT_EXPIRE_TIME || '15m',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret',
  refreshTokenLife: process.env.REFRESH_TOKEN_LIFE || '7d',
  
  
  axiosInstance: require('axios').create({
    baseURL: process.env.HASURA_ENDPOINT || 'http://localhost:8080/v1/graphql',
    timeout: 5000,
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || 'myadminsecretkey'
    }
  })
};