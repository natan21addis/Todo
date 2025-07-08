<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card max-width="400">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="onLogin">
          <v-text-field v-model="email" label="Email" required />
          <v-text-field v-model="password" label="Password" type="password" required />
          <v-btn color="primary" type="submit" :loading="loading" block>Login</v-btn>
        </v-form>
        <div class="text-center mt-3">
          <span>Don't have an account?</span>
          <NuxtLink to="/register">Register</NuxtLink>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    email: '',
    password: '',
    loading: false,
  }),
  methods: {
    async onLogin() {
      this.loading = true
      try {
        await this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        })
        this.$router.push('/')
      } catch (err) {
        alert('Login failed: ' + (err.response?.data?.message || err.message))
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
