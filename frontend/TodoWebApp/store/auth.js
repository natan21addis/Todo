export const state = () => ({
  token: null,
  user: null,
});

export const mutations = {
  setToken(state, token) {
    state.token = token;
  },
  setUser(state, user) {
    state.user = user;
  },
  logout(state) {
    state.token = null;
    state.user = null;
  },
};

export const actions = {
  login({ commit }, { token, user }) {
    commit('setToken', token);
    commit('setUser', user);
  },
  logout({ commit }) {
    commit('logout');
  },
};
