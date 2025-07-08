import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client/core';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';

// Server-safe fetch implementation
const fetch = process.server ? require('node-fetch') : window.fetch;

export default ({ app, store }, inject) => {
  // Create authentication middleware
  const authMiddleware = new ApolloLink((operation, forward) => {
    const token = store.state.auth.token;

    if (token) {
      operation.setContext({
        headers: {
          ...operation.getContext().headers,
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return forward(operation);
  });

  // Create HTTP link with proper fetch implementation
  const httpLink = new HttpLink({
    uri: 'http://localhost:8080/v1/graphql',
    fetch,
  });

  // Create batched HTTP link
  const batchLink = new BatchHttpLink({
    uri: 'http://localhost:8080/v1/graphql',
    fetch,
  });

  // Create Apollo Client
  const apolloClient = new ApolloClient({
    link: ApolloLink.from([authMiddleware, batchLink]),
    cache: new InMemoryCache(),
    ssrMode: process.server, // Enable SSR mode
  });

  // Load dev messages in development
  if (process.env.NODE_ENV !== 'production') {
    loadDevMessages();
    loadErrorMessages();
  }

  // Inject Apollo Client into Nuxt
  inject('apollo', apolloClient);
};
