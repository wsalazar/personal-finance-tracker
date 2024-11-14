<template>
  <div class="dashboard">
    <div class="logout-container">
      <button @click="logout">Logout</button>
    </div>
  </div>
  <SidebarMenu />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SidebarMenu from './SidebarMenu.vue';

const router = useRouter();
const user = ref(null);

// Simulate fetching user data (you would typically fetch this from an API)
const fetchUserData = () => {
  const token = localStorage.getItem('token');
  if (token) {
    // Simulate a user object (replace this with an actual API call)
  }
};

// Call the function to fetch user data when the component is mounted
fetchUserData();

const logout = () => {
  // Clear the token and user data
  localStorage.removeItem('token');
  user.value = null;

  // Redirect to the login page
  router.push('/login');
};
</script>

<style scoped>
.dashboard {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  h1 {
    margin-bottom: 1rem;
  }

  .user-info {
    margin-top: 2rem;
    text-align: left;

    ul {
      list-style-type: none;
      padding: 0;

      li {
        margin: 0.5rem 0;
      }
    }
  }

  .logout-container {
    position: absolute; /* Position the container absolutely */
    top: 1rem; /* Adjust the top position */
    right: 1rem; /* Adjust the right position */
  }
  .logout-container button {
    padding: 0.5rem 1rem; /* Adjust padding for the button */
    background-color: #f44336; /* Optional: Change button color */
    color: white; /* Button text color */
    border: none; /* Remove border */
    border-radius: 4px; /* Rounded corners */
    cursor: pointer; /* Pointer cursor on hover */
  }

  .logout-container button:hover {
    background-color: #d32f2f; /* Darker shade on hover */
  }
}
</style>
