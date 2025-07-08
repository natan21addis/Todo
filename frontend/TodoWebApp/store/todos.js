export const state = () => ({
  todos: [],
});

export const mutations = {
  setTodos(state, todos) {
    state.todos = todos;
  },
  addTodo(state, todo) {
    state.todos.push(todo);
  },
  updateTodo(state, updatedTodo) {
    const index = state.todos.findIndex((t) => t.id === updatedTodo.id);
    if (index !== -1) state.todos.splice(index, 1, updatedTodo);
  },
  deleteTodo(state, id) {
    state.todos = state.todos.filter((todo) => todo.id !== id);
  },
};

export const actions = {
  async fetchTodos({ commit }) {
    const { data } = await this.$apollo.query({
      query: gql`
        query GetTodos {
          todos {
            id
            title
            description
            priority
            completed
          }
        }
      `,
    });
    commit('setTodos', data.todos);
  },
  async createTodo({ commit }, todo) {
    const { data } = await this.$apollo.mutate({
      mutation: gql`
        mutation CreateTodo($input: TodoInput!) {
          createTodo(input: $input) {
            id
            title
            description
            priority
            completed
          }
        }
      `,
      variables: { input: todo },
    });
    commit('addTodo', data.createTodo);
  },
  async updateTodo({ commit }, todo) {
    const { data } = await this.$apollo.mutate({
      mutation: gql`
        mutation UpdateTodo($id: ID!, $input: TodoInput!) {
          updateTodo(id: $id, input: $input) {
            id
            title
            description
            priority
            completed
          }
        }
      `,
      variables: { id: todo.id, input: todo },
    });
    commit('updateTodo', data.updateTodo);
  },
  async deleteTodo({ commit }, id) {
    await this.$apollo.mutate({
      mutation: gql`
        mutation DeleteTodo($id: ID!) {
          deleteTodo(id: $id) {
            id
          }
        }
      `,
      variables: { id },
    });
    commit('deleteTodo', id);
  },
};
