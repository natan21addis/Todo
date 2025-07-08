<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <!-- Header Card -->
        <v-card class="mb-6 rounded-xl" elevation="2">
          <v-card-title class="px-6 pt-6 pb-3">
            <v-icon left color="primary">mdi-checkbox-marked-circle-outline</v-icon>
            <span class="headline font-weight-bold">My Tasks</span>
            <v-spacer />
            <v-chip color="primary" small>{{ todos.length }}</v-chip>
          </v-card-title>

          <v-card-subtitle class="px-6 pb-3" v-if="userName">
            <span class="body-1">{{ getGreeting() }}, {{ userName }}</span>
          </v-card-subtitle>

          <v-divider />

          <v-card-actions class="px-4 py-3">
            <v-btn
              color="primary"
              depressed
              block
              @click="openDialog(null)"
            >
              <v-icon left>mdi-plus</v-icon>
              Add New Task
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Todo List Card -->
        <v-card class="rounded-xl" elevation="2">
          <!-- Loading State -->
          <v-progress-linear
            v-if="loading"
            indeterminate
            color="primary"
            height="4"
          />

          <!-- Empty State -->
          <div v-if="!loading && !todos.length" class="text-center pa-8">
            <v-icon size="64" color="grey lighten-1">mdi-checkbox-blank-outline</v-icon>
            <h3 class="headline mt-4 mb-2">No tasks yet</h3>
            <p class="body-1 grey--text">Add your first task to get started</p>
            <v-btn color="primary" class="mt-4" @click="openDialog(null)">
              Create First Task
            </v-btn>
          </div>

          <!-- Todo List -->
          <v-list v-else two-line class="py-0">
            <TodoItem
              v-for="todo in todos"
              :key="todo.id"
              :todo="todo"
              @toggle="toggle"
              @edit="openDialog"
              @delete="remove"
            />
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Todo Form Modal -->
    <TodoForm
      :dialog="formDialog"
      :todo="edited"
      @close="closeDialog"
      @save="saveTodo"
    />

    <!-- Notification Toast -->
    <NotificationToast
      :show="showToast"
      :type="toastType"
      :message="toastMessage"
      @close="showToast = false"
    />

    <!-- Loading Overlay -->
    <LoadingOverlay :loading="processing" />
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import TodoItem from '~/components/TodoItem.vue'
import TodoForm from '~/components/TodoForm.vue'
import NotificationToast from '~/components/NotificationToast.vue'
import LoadingOverlay from '~/components/LoadingOverlay.vue'

export default {
  components: {
    TodoItem,
    TodoForm,
    NotificationToast,
    LoadingOverlay
  },

  data() {
    return {
      formDialog: false,
      edited: null,
      processing: false,
      showToast: false,
      toastType: 'success',
      toastMessage: '',
    }
  },

  computed: {
    ...mapGetters(['todos', 'loading', 'isAuthenticated']),

    // SAFE USER ACCESS
    userName() {
      // Check if auth module exists and has user data
      return this.$store.state.auth?.user?.name || 'User'
    }
  },

  async created() {
    if (!this.isAuthenticated) {
      this.$router.push('/login')
    } else {
      await this.$store.dispatch('fetchTodos')
    }
  },

  methods: {
    getGreeting() {
      const hour = new Date().getHours()
      if (hour < 12) return 'Good morning'
      if (hour < 18) return 'Good afternoon'
      return 'Good evening'
    },

    openDialog(todo) {
      this.edited = todo || null
      this.formDialog = true
    },

    closeDialog() {
      this.formDialog = false
      this.edited = null
    },

    async saveTodo(todo) {
      this.processing = true
      try {
        if (this.edited) {
          await this.$store.dispatch('updateTodo', {
            id: todo.id,
            ...(todo.title && { title: todo.title })
          })
          this.showNotification('success', 'Task updated successfully')
        } else {
          await this.$store.dispatch('addTodo', todo.title)
          this.showNotification('success', 'Task added successfully')
        }
      } catch (err) {
        console.error('Error saving todo:', err)
        this.showNotification('error', 'Failed to save task')
      } finally {
        this.processing = false
        this.closeDialog()
      }
    },

    async toggle(todo) {
      this.processing = true
      try {
        await this.$store.dispatch('updateTodo', {
          id: todo.id,
          completed: !todo.completed
        })
        const message = todo.completed ? 'Task marked as incomplete' : 'Task completed!'
        this.showNotification('success', message)
      } catch (err) {
        console.error('Toggle failed:', err)
        this.showNotification('error', 'Failed to update task')
      } finally {
        this.processing = false
      }
    },

    async remove(id) {
      if (!confirm('Are you sure you want to delete this task?')) return

      this.processing = true
      try {
        await this.$store.dispatch('deleteTodo', id)
        this.showNotification('success', 'Task deleted successfully')
      } catch (err) {
        console.error('Delete failed:', err)
        this.showNotification('error', 'Failed to delete task')
      } finally {
        this.processing = false
      }
    },

    showNotification(type, message) {
      this.toastType = type
      this.toastMessage = message
      this.showToast = true

      // Auto-hide after 3 seconds
      setTimeout(() => {
        this.showToast = false
      }, 3000)
    }
  }
}
</script>

<style scoped>
.rounded-xl {
  border-radius: 16px !important;
}

.v-list-item {
  transition: background-color 0.3s;
}

.v-list-item:hover {
  background-color: #f5f7ff;
}
</style>
