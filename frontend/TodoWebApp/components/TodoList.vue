<template>
  <v-list>
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @edit="editTodo"
      @delete="deleteTodo"
      @toggle="toggleTodo"
    />
  </v-list>
</template>

<script>
import TodoItem from './TodoItem.vue';

export default {
  components: { TodoItem },
  props: {
    todos: {
      type: Array,
      required: true,
    },
  },
  methods: {
    editTodo(todo) {
      this.$emit('edit', todo);
    },
    deleteTodo(id) {
      this.$emit('delete', id);
    },
    toggleTodo(id) {
      this.$emit('toggle', id);
    },
  },
};
</script>
