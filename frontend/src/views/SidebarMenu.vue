<template>
  <div class="sidebar">
    <ul>
      <li><router-link to="/income">Income</router-link></li>
      <li>
        <router-link to="/expenses">Expenses</router-link>
      </li>
      <li>
        <router-link to="/goals" :class="{ disabled: isGoalsDisabled }"
          >Goals</router-link
        >
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { api } from '@/services/api';
import { ref } from 'vue';

const isGoalsDisabled = ref(true);

const shouldGoalsBeEnabled = async () => {
  try {
    const result = await api.get('goal/income/expense/verification');
    console.log(result);
    isGoalsDisabled.value = !result.data;
  } catch (err) {
    console.log(err);
  }
};

shouldGoalsBeEnabled();
/**
 * make a request to the server to check if income and expenses are set. If so
 * make isGoalsDisabled false
 */
</script>

<style scoped>
.sidebar {
  width: 250px; /* Set the width of the sidebar */
  background-color: #f4f4f4; /* Background color */
  padding: 1rem; /* Padding around the content */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* Optional shadow for depth */
}

.sidebar h2 {
  margin-bottom: 1rem; /* Space below the heading */
}

.sidebar ul {
  list-style-type: none; /* Remove default list styling */
  padding: 0; /* Remove default padding */
}

.sidebar li {
  margin: 0.5rem 0; /* Space between list items */
}

.sidebar a {
  text-decoration: none; /* Remove underline from links */
  color: #333; /* Link color */
  padding: 0.5rem; /* Padding for clickable area */
  display: block; /* Make the link fill the list item */
  border-radius: 4px; /* Rounded corners */
}

.sidebar a:hover {
  background-color: #e0e0e0; /* Change background on hover */
}

.disabled {
  pointer-events: none;
  color: #ccc;
  text-decoration: none;
}
</style>
