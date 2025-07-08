<!-- Login.vue -->
<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card max-width="500" width="100%" elevation="3" class="login-card">
      <div class="login-header">
        <v-icon large color="primary" class="mr-2">mdi-account-circle</v-icon>
        <v-card-title class="text-h5 font-weight-bold">Welcome Back</v-card-title>
      </div>
      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-alert v-if="error" type="error" dense class="mb-4">
          {{ error }}
        </v-alert>

        <v-form ref="form" @submit.prevent="onLogin">
          <v-text-field
            v-model="email"
            label="Email Address"
            prepend-inner-icon="mdi-email"
            outlined
            rounded
            required
            :rules="emailRules"
            placeholder="your@email.com"
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            prepend-inner-icon="mdi-lock"
            outlined
            rounded
            required
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            :rules="passwordRules"
            placeholder="••••••••"
            class="mb-1"
          ></v-text-field>

          <div class="d-flex justify-end mb-4">
            <v-btn text small color="primary" class="px-0">Forgot Password?</v-btn>
          </div>

          <v-btn
            color="primary"
            type="submit"
            :loading="loading"
            block
            large
            rounded
            depressed
          >
            <v-icon left>mdi-login</v-icon>
            Sign In
          </v-btn>
        </v-form>

        <v-divider class="my-6"></v-divider>

        <div class="text-center">
          <p class="mb-2">Or continue with</p>
          <div class="d-flex justify-center">
            <v-btn icon large class="mr-2">
              <v-icon color="#DB4437">mdi-google</v-icon>
            </v-btn>
            <v-btn icon large class="mr-2">
              <v-icon color="#4267B2">mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon large>
              <v-icon color="#1DA1F2">mdi-twitter</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="px-6 py-3">
        <span class="text-caption">Don't have an account?</span>
        <v-spacer></v-spacer>
        <NuxtLink to="/register" class="text-decoration-none">
          <v-btn color="primary" text small>Create Account</v-btn>
        </NuxtLink>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    email: '',
    password: '',
    showPassword: false,
    loading: false,
    error: null,
    emailRules: [
      v => !!v || 'Email is required',
      v => /.+@.+\..+/.test(v) || 'Valid email required',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 6) || 'Min 6 characters',
    ]
  }),
  methods: {
    async onLogin() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      this.error = null;

      try {
        await this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        });
        this.$router.push('/');
      } catch (err) {
        this.error = 'Login failed: ' + (err.response?.data?.message ||
                     'Invalid credentials. Please try again.');
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.login-card {
  border-radius: 12px;
  overflow: hidden;
}
.login-header {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background-color: #f8f9fa;
}
</style>
