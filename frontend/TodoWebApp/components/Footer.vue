<template>
  <v-footer color="primary" padless>
    <v-col class="text-center white--text">
      &copy; {{ new Date().getFullYear() }} Vue To-Do App
    </v-col>
  </v-footer>
</template>

<script>
export default {};
</script>

<style scoped>
.v-footer {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
