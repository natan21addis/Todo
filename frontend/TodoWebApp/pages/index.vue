<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <h1>Todo List</h1>
        <v-btn color="primary" @click="openDialog()">Add Todo</v-btn>

        <v-progress-linear v-if="loading" indeterminate color="primary" class="my-2" />

        <v-list two-line>
          <TodoItem
            v-for="todo in todos"
            :key="todo.id"
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
      @close="closeDialog"
      @save="saveTodo"
    />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import TodoItem from '~/components/TodoItem.vue'
import TodoForm from '~/components/TodoForm.vue'

export default {
  components: { TodoItem, TodoForm },

  data() {
    return {
      formDialog: false,
      edited: null
    }
  },

  computed: {
    ...mapGetters(['todos', 'loading', 'isAuthenticated'])
  },

  async created() {
    if (!this.isAuthenticated) {
      this.$router.push('/login')
    } else {
      await this.$store.dispatch('fetchTodos')
    }
  },

  methods: {
    openDialog(todo) {
      this.edited = todo || null
      this.formDialog = true
    },

    closeDialog() {
      this.formDialog = false
      this.edited = null
    },

    async saveTodo(todo) {
      try {
        if (this.edited) {
          await this.$store.dispatch('updateTodo', {
            id: todo.id,
            ...(todo.title && { title: todo.title })
          })
        } else {
          await this.$store.dispatch('addTodo', todo.title)
        }
      } catch (err) {
        console.error('❌ Error saving todo:', err)
      } finally {
        this.closeDialog()
      }
    },

    async toggle(todo) {
      try {
        await this.$store.dispatch('updateTodo', {
          id: todo.id,
          completed: !todo.completed
        })
      } catch (err) {
        console.error('❌ Toggle failed:', err)
      }
    },

    async remove(id) {
      try {
        await this.$store.dispatch('deleteTodo', id)
      } catch (err) {
        console.error('❌ Delete failed:', err)
      }
    }
  }
}
</script>
