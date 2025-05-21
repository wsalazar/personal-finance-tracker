<template>
  <div class="form-group">
    <label for="email">Email</label>
    <input
      id="email"
      v-model="loginData.email"
      type="email"
      required
      placeholder="Enter your email"
      @input="emitLogin"
    />
  </div>

  <div class="form-group">
    <label for="password">Password</label>
    <input
      id="password"
      v-model="loginData.password"
      type="password"
      required
      placeholder="Enter your password"
      min="8"
      max="16"
      @input="emitLogin"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, defineEmits } from 'vue';
const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  isLogin: {
    type: Boolean,
    required: true,
  },
});
const loginData = reactive({ ...props.form });

const emits = defineEmits(['handleLogin']);

const emitLogin = () => {
  emits('handleLogin', loginData);
};
</script>
