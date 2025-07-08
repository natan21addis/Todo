<template>
  <v-container class="text-center">
    <v-card class="mx-auto" max-width="600">
      <v-card-title>404 - Page Not Found</v-card-title>
      <v-card-text>
        Sorry, the page you are looking for doesn't exist.
      </v-card-text>
      <v-btn color="primary" @click="$router.push('/')">Go to Home</v-btn>
    </v-card>
  </v-container>
</template>
