<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <h1>Todo List</h1>
        <v-btn @click="openDialog()">Add Todo</v-btn>
        <v-progress-linear v-if="loading" indeterminate color="primary" />
        <v-list two-line>
          <TodoItem
            v-for="todo in todos" :key="todo.id"
            :todo="todo"
            @toggle="toggle"
            @edit="openDialog"
            @delete="remove"
          />
        </v-list>
      </v-col>
    </v-row>
  <TodoForm
  :dialog="formDialog"
  :todo="edited"
  @close="formDialog = false"
  @save="saveTodo"
  @update:dialog="formDialog = $event"
/>

  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import TodoItem from '~/components/TodoItem.vue'
import TodoForm from '~/components/TodoForm.vue'

export default {
  components: { TodoItem, TodoForm },
  data: () => ({ formDialog: false, edited: null }),
  computed: mapGetters(['todos','loading','isAuthenticated']),
  async created() {
    if (!this.isAuthenticated) this.$router.push('/login')
    else this.$store.dispatch('fetchTodos')
  },
  methods: {
    openDialog(todo) { this.edited = todo||null; this.formDialog = true },
    closeDialog() { this.formDialog = false },
    async saveTodo(todo) {
      this.edited ?
        this.$store.dispatch('updateTodo', todo) :
        this.$store.dispatch('addTodo', todo.title)
      this.closeDialog()
    },
    toggle(todo) { this.$store.dispatch('updateTodo', {id:todo.id,input:{completed:!todo.completed}}) },
    remove(id) { this.$store.dispatch('deleteTodo', id) }
  }
}
</script>
