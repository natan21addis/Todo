<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title :class="{ 'line-through': todo.completed }">
        {{ todo.title }}
      </v-list-item-title>
      <v-list-item-subtitle>{{ todo.description }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn icon @click="$emit('edit', todo)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('delete', todo.id)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('toggle', todo.id)">
        <v-icon>{{ todo.completed ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  props: {
    todo: {
      type: Object,
      required:true,
    },
  },
};
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>

