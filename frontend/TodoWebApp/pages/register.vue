<!-- Register.vue -->
<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card max-width="500" width="100%" elevation="3" class="register-card">
      <div class="register-header">
        <v-icon large color="primary" class="mr-2">mdi-account-plus</v-icon>
        <v-card-title class="text-h5 font-weight-bold">Create Account</v-card-title>
      </div>
      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-alert v-if="error" type="error" dense class="mb-4">
          {{ error }}
        </v-alert>

        <v-form ref="form" @submit.prevent="onRegister">
          <v-text-field
            v-model="name"
            label="Full Name"
            prepend-inner-icon="mdi-account"
            outlined
            rounded
            required
            :rules="nameRules"
            placeholder="John Doe"
            class="mb-3"
          ></v-text-field>

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
            class="mb-3"
            hint="At least 8 characters with a number"
          ></v-text-field>

          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            prepend-inner-icon="mdi-lock-check"
            outlined
            rounded
            required
            :type="showPassword ? 'text' : 'password'"
            :rules="confirmPasswordRules"
            placeholder="••••••••"
            class="mb-4"
          ></v-text-field>

          <v-checkbox
            v-model="terms"
            :rules="[v => !!v || 'You must agree to continue!']"
            label="I agree to the Terms and Privacy Policy"
            required
            dense
            class="mt-0"
          ></v-checkbox>

          <v-btn
            color="primary"
            type="submit"
            :loading="loading"
            block
            large
            rounded
            depressed
          >
            <v-icon left>mdi-account-plus</v-icon>
            Create Account
          </v-btn>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="px-6 py-3">
        <span class="text-caption">Already registered?</span>
        <v-spacer></v-spacer>
        <NuxtLink to="/login" class="text-decoration-none">
          <v-btn color="primary" text small>Sign In</v-btn>
        </NuxtLink>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
    showPassword: false,
    loading: false,
    error: null,
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length >= 2) || 'Min 2 characters'
    ],
    emailRules: [
      v => !!v || 'Email is required',
      v => /.+@.+\..+/.test(v) || 'Valid email required',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 8) || 'Min 8 characters',
      v => /[0-9]/.test(v) || 'Include at least one number'
    ],
  }),
  computed: {
    confirmPasswordRules() {
      return [
        v => !!v || 'Confirmation is required',
        v => v === this.password || 'Passwords do not match'
      ];
    }
  },
  methods: {
    async onRegister() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      this.error = null;

      try {
        console.log("🚀 Registering user:", this.email);
        const response = await this.$store.dispatch('register', {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        console.log("✅ Registration successful:", response);

        // Auto-login after registration
        await this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        });

        this.$router.push('/');
      } catch (err) {
        console.error("❌ Registration error:", err);
        this.error = "Registration failed: " +
                     (err.response?.data?.message ||
                      'Please check your information and try again.');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-card {
  border-radius: 12px;
  overflow: hidden;
}
.register-header {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background-color: #f8f9fa;
}
</style>
