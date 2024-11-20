<template>
  <div class="auth-form">
    <div class="auth-tabs">
      <button :class="{ active: isLogin }" @click="isLogin = true">
        Login
      </button>
      <button :class="{ active: !isLogin }" @click="isLogin = false">
        Register
      </button>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="Enter your email"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          placeholder="Enter your password"
          min="8"
          max="16"
        />
      </div>

      <!-- Show only for registration -->
      <div class="form-group" v-if="!isLogin">
        <label for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          required
          placeholder="Confirm your password"
          min="8"
          max="16"
        />
      </div>

      <div class="error" v-if="error">{{ error }}</div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Loading...' : isLogin ? 'Login' : 'Register' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { api } from '@/services/api';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';

const router = useRouter();
const isLogin = ref(true);
const loading = ref(false);
const error = ref('');

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
});

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  try {
    if (!isLogin.value && form.password !== form.confirmPassword) {
      /**
       * todo instead of this add the toaster
       */
      throw new Error('Passwords do not match');
    }

    const endpoint = isLogin.value ? '/auth/login' : '/auth/register';
    const { data } = await api.post(endpoint, {
      email: form.email,
      password: form.password,
    });

    // Store the token
    localStorage.setItem('token', data);

    console.log(data, localStorage.getItem('token'));

    // Update axios default headers
    api.defaults.headers.common['Authorization'] = `Bearer ${data}`;

    // Redirect to dashboard
    router.push('/dashboard');
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      error.value = err.response?.data?.message || 'Uh oh. Something happened.';
    } else if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = 'An unknown error happened.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.auth-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  .auth-tabs {
    display: flex;
    margin-bottom: 2rem;

    button {
      flex: 1;
      padding: 0.75rem;
      border: none;
      background: none;
      cursor: pointer;

      &.active {
        border-bottom: 2px solid #4caf50;
        font-weight: bold;
      }
    }
  }

  .form-group {
    margin-bottom: 1rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;

      &:focus {
        outline: none;
        border-color: #4caf50;
      }
    }
  }

  .error {
    color: #dc3545;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  button[type='submit'] {
    width: 100%;
    padding: 0.75rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
      background-color: #45a049;
    }

    &:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  }
}
</style>
