<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card max-width="400">
      <v-card-title>Register</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="onRegister">
          <v-text-field v-model="email" label="Email" required />
          <v-text-field v-model="password" label="Password" type="password" required />
          <v-btn color="primary" type="submit" :loading="loading" block>Register</v-btn>
        </v-form>
        <div class="text-center mt-3">
          <span>Already have an account?</span>
          <NuxtLink to="/login">Login</NuxtLink>
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
    async onRegister() {
      this.loading = true;
      try {
        console.log("🚀 Registering user:", this.email);

        const response = await this.$store.dispatch('register', {
          email: this.email,
          password: this.password,
        });

        console.log("✅ Registration successful:", response);
        this.$router.push('/');
      } catch (err) {
        console.error("❌ Registration error:", err);

        let errorMessage = "Registration failed";

        // Backend error message
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }

        alert(errorMessage);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
