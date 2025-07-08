export default {
  ssr: false,
  env: {
    API_URL: process.env.NUXT_ENV_API_URL,
    GRAPHQL_HTTP: process.env.NUXT_ENV_GRAPHQL_HTTP,
  },
  modules: ['@nuxtjs/vuetify'],
  plugins: ['~/plugins/apollo.js'],
  vuetify: { theme: { dark: false } },
}
