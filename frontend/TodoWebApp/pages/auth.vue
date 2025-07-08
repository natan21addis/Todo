<template>
  <v-container>
    <v-card class="mx-auto" max-width="400">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-form v-model="isValid" @submit.prevent="login">
          <v-text-field
            v-model="form.email"
            label="Email"
            :rules="[v => !!v || 'Email is required']"
          />
          <v-text-field
            v-model="form.password"
            label="Password"
            type="password"
            :rules="[v => !!v || 'Password is required']"
          />
          <v-btn color="primary" :disabled="!isValid" block type="submit">
            Login
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      form: { email: '', password: '' },
      isValid: false,
    };
  },
  methods: {
    async login() {
      // Simulate login logic (replace with GraphQL mutation)
      const token = 'fake-token'; // Replace with real token
      this.$store.dispatch('auth/login', { token, user: { email: this.form.email } });
      this.$router.push('/');
    },
  },
};
</script>
