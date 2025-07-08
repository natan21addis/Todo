import axios from 'axios'

export const state = () => ({
  user: null, token: null,
  todos: [], loading: false
})

export const mutations = {
  SET_USER(state, { user, token }) { state.user = user; state.token = token },
  RESET(state) { state.user = null; state.token = null; },
  SET_TODOS(state, todos) { state.todos = todos },
  SET_LOADING(state, val) { state.loading = val },
  ADD_TODO(state, todo) { state.todos.unshift(todo) },
  UPDATE_TODO(state, t) {
    const i = state.todos.findIndex(x => x.id === t.id)
    if (i !== -1) state.todos.splice(i,1,t)
  },
  DELETE_TODO(state, id) {
    state.todos = state.todos.filter(x => x.id !== id)
  }
}

export const actions = {
  async register({ commit }, payload) {
    const { data } = await axios.post(`${process.env.API_URL}/auth/register`, payload)
    commit('SET_USER', { user: data.data.user, token: data.data.token })
    localStorage.setItem('token', data.data.token)
  },
  async login({ commit }, payload) {
    const { data } = await axios.post(`${process.env.API_URL}/auth/login`, payload)
    commit('SET_USER', { user: data.data.user, token: data.data.token })
    localStorage.setItem('token', data.data.token)
  },
  logout({ commit }) {
    commit('RESET')
    localStorage.removeItem('token')
  },
  async fetchTodos({ commit, state }) {
    if (!state.token) return
    commit('SET_LOADING', true)
    const { data } = await axios.get(`${process.env.API_URL}/todos`, {
      headers: { Authorization: `Bearer ${state.token}` }
    })
    commit('SET_TODOS', data.data)
    commit('SET_LOADING', false)
  },
  async addTodo({ commit, state }, title) {
    const { data } = await axios.post(`${process.env.API_URL}/todos`, { title },{
      headers: { Authorization: `Bearer ${state.token}` }
    })
    commit('ADD_TODO', data.data)
  },
  async updateTodo({ commit, state }, payload) {
    const { data } = await axios.put(`${process.env.API_URL}/todos/${payload.id}`, payload,{
      headers: { Authorization: `Bearer ${state.token}` }
    })
    commit('UPDATE_TODO', data.data)
  },
  async deleteTodo({ commit, state }, id) {
    await axios.delete(`${process.env.API_URL}/todos/${id}`, {
      headers: { Authorization: `Bearer ${state.token}` }
    })
    commit('DELETE_TODO', id)
  }
}
export const getters = {
  isAuthenticated: s => !!s.user,
  todos: s => s.todos,
  loading: s => s.loading
}
