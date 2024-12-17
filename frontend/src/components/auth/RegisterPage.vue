<template>
  <div class="form-group">
    <label for="firstName">First Name</label>
    <input
      id="firstName"
      v-model="form.firstName"
      type="text"
      required
      placeholder="Enter your First Name"
      @input="emitRegistration"
    />
  </div>
  <div class="form-group">
    <label for="email">Last Name</label>
    <input
      id="lastName"
      v-model="form.lastName"
      type="text"
      required
      placeholder="Enter your Last Name"
      @input="emitRegistration"
    />
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input
      id="email"
      v-model="form.email"
      type="email"
      required
      placeholder="Enter your email"
      @input="emitRegistration"
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
      @input="emitRegistration"
    />
  </div>

  <!-- Show only for registration -->
  <div class="form-group" v-if="isLogin">
    <label for="confirmPassword">Confirm Password</label>
    <input
      id="confirmPassword"
      v-model="form.confirmPassword"
      type="password"
      required
      placeholder="Confirm your password"
      min="8"
      max="16"
      @input="emitRegistration"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, defineEmits } from 'vue';

const emits = defineEmits(['handleRegistration']);

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
const form = reactive({ ...props.form });
const emitRegistration = () => {
  emits('handleRegistration', { ...form });
};
</script>
