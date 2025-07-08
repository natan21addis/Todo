<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>Vue To-Do App</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text @click="logout">Logout</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/auth');
    },
  },
};
</script>
