<template>
  <v-overlay
    :value="loading"
    z-index="1000"
    opacity="0.8"
    class="d-flex align-center justify-center"
  >
    <v-progress-circular
      indeterminate
      size="64"
      width="6"
      color="primary"
    >
      <v-icon size="32" color="primary">mdi-checkbox-marked-circle-outline</v-icon>
    </v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  name: 'LoadingOverlay',
  props: {
    loading: Boolean
  }
}
</script>
