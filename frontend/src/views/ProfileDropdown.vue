<template>
  <div class="dropdown" @click="toggleDropdown">
    <button class="w-full dropdown-button">
      Hello {{ user.firstName }} {{ user.lastName }}!
    </button>
    <div v-if="isOpen" class="dropdown-content">
      <a class="cursor-pointer" @click="goToProfile">Profile</a>
      <a class="cursor-pointer" @click="logout">Logout</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, reactive } from 'vue';
import { useRouter } from 'vue-router';

const isOpen = ref(false);
const router = useRouter();

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const goToProfile = () => {
  /**
   *  There is no route or page for profile page but there might be
   */
  // router.push({ name: 'ProfilePage' });
};

const logout = () => {
  localStorage.clear();
  // localStorage.setItem('user', JSON.stringify(user));
  localStorage.removeItem('user'); // Clear user data
  // props.user.firstName = null;
  // props.user.lastName = null;

  router.push('/login'); // Redirect to login page
};
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-button {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dropdown-content {
  display: block;
  position: absolute;
  right: 0;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 10px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}
</style>
