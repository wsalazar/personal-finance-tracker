<template>
  <div class="auth-form">
    <div class="auth-tabs">
      <button :class="{ active: !isLogin }" @click="isLogin = false">
        Register
      </button>
      <button :class="{ active: isLogin }" @click="isLogin = true">
        Login
      </button>
    </div>

    <div v-if="!isLogin">
      <form @submit.prevent="handleSubmit">
        <RegisterPage
          :form="form"
          :isLogin="!isLogin"
          @handleRegistration="handleRegistrationData"
        />
        <div class="error" v-if="error">{{ error }}</div>

        <button type="submit" :disabled="loading">Register</button>
      </form>
    </div>
    <div v-else>
      <form @submit.prevent="handleSubmit">
        <LoginPage
          :form="form"
          :isLogin="isLogin"
          @handleLogin="handleLoginData"
        />
        <div class="error" v-if="error">{{ error }}</div>

        <button type="submit" :disabled="loading">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { api } from '@/services/api';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import { fetchUser } from '@/services/index';
import LoginPage from './LoginPage.vue';
import RegisterPage from './RegisterPage.vue';

const router = useRouter();
const isLogin = ref(false);
const loading = ref(false);
const error = ref('');

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const handleRegistrationData = (registrationData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  form.firstName = registrationData.firstName;
  form.lastName = registrationData.lastName;
  form.email = registrationData.email;
  form.password = registrationData.password;
  form.confirmPassword = registrationData.confirmPassword;
};

const handleLoginData = (loginData: { email: string; password: string }) => {
  form.email = loginData.email;
  form.password = loginData.password;
};

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
    await api.post(endpoint, {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
    });
    const user = await fetchUser();
    /**
     * todo will use token later
     */
    localStorage.setItem('user', JSON.stringify(user));
    router.push('/');
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
