<template>
  <v-snackbar
    v-model="show"
    :timeout="3000"
    :color="type === 'success' ? 'success' : 'error'"
    bottom
    right
    elevation="6"
  >
    <v-icon left>{{ type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
    {{ message }}

    <template v-slot:action="{ attrs }">
      <v-btn
        icon
        v-bind="attrs"
        @click="$emit('close')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'NotificationToast',
  props: {
    show: Boolean,
    type: {
      type: String,
      default: 'success',
      validator: value => ['success', 'error', 'info'].includes(value)
    },
    message: String
  },
  emits: ['close']
}
</script>
