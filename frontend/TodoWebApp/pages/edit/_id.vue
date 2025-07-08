<template>
  <v-container>
    <Header />
    <TodoForm :todo="todo" :isEdit="true" @submit="updateTodo" />
  </v-container>
</template>

<script>
import Header from '~/components/Header.vue';
import TodoForm from '~/components/TodoForm.vue';

export default {
  components: { Header, TodoForm },
  async asyncData({ params, store }) {
    const todo = store.state.todos.todos.find((t) => t.id === params.id);
    return { todo };
  },
  methods: {
    async updateTodo(updatedTodo) {
      await this.$store.dispatch('todos/updateTodo', updatedTodo);
      this.$router.push('/');
    },
  },
};
</script>
