<template>
  <v-list-item>
    <v-list-item-content class="d-flex align-center">
      <v-checkbox
        :input-value="todo.completed"
        @change="$emit('toggle', todo)"
        class="mr-2"
      />
      <span :class="{ done: todo.completed }">{{ todo.title }}</span>
    </v-list-item-content>

    <v-list-item-action>
      <v-btn icon @click="$emit('edit', todo)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('delete', todo.id)">
        <v-icon color="red">mdi-delete</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  props: ['todo']
}
</script>

<style>
.done {
  text-decoration: line-through;
}
</style>
