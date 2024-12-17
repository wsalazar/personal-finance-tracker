<template>
  <div class="auth-page">
    <h1>Welcome to the Real Time Spending</h1>
    <AuthForm />
  </div>
</template>

<script setup lang="ts">
import AuthForm from '@/components/auth/AuthForm.vue';
import { useStore } from 'vuex';
</script>

<style scoped lang="scss">
.auth-page {
  padding: 2rem;
  text-align: center;

  h1 {
    margin-bottom: 2rem;
    color: #333;
  }
}
</style>
