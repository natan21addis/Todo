import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

Vue.use(VueApollo)

export default (_, inject) => {
  const authHeader = () => {
    const token = localStorage.getItem('token')
    return token ? `Bearer ${token}` : ''
  }

  const link = new HttpLink({
    uri: process.env.GRAPHQL_HTTP,
    headers: { Authorization: authHeader() }
  })

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    connectToDevTools: true
  })

  const provider = new VueApollo({ defaultClient: client })
  inject('apollo', client)
  Vue.prototype.$apolloProvider = provider
}
