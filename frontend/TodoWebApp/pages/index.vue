<template>
  <v-container>
    <TodoList
      :todos="todos"
      @edit="editTodo"
      @delete="deleteTodo"
      @toggle="toggleTodo"
    />
    <v-btn color="primary" @click="addTodo">Add Todo</v-btn>
  </v-container>
</template>

<script>
import TodoList from '~/components/TodoList.vue';

export default {
  components: { TodoList },
  computed: {
    todos() {
      return this.$store.state.todos.todos;
    },
  },
  methods: {
    addTodo() {
      this.$router.push('/add');
    },
    editTodo(todo) {
      this.$router.push(`/edit/${todo.id}`);
    },
    deleteTodo(id) {
      this.$store.dispatch('todos/deleteTodo', id);
    },
    toggleTodo(id) {
      const todo = this.todos.find((t) => t.id === id);
      this.$store.dispatch('todos/updateTodo', { ...todo, completed: !todo.completed });
    },
  },
};
</script>
