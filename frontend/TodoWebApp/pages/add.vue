<template>
  <v-container>
    <Header />
    <TodoForm @submit="createTodo" />
  </v-container>
</template>

<script>
import Header from '~/components/Header.vue';
import TodoForm from '~/components/TodoForm.vue';

export default {
  components: { Header, TodoForm },
  methods: {
    async createTodo(todo) {
      await this.$store.dispatch('todos/createTodo', todo);
      this.$router.push('/');
    },
  },
};
</script>
