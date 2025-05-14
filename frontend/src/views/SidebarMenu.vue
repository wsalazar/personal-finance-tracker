<template>
  <aside class="w-1/4 p-4 bg-gray-200">
    <h1 @click="dashboard" class="font-bold" style="cursor: pointer">
      Personal Finance Tracker
    </h1>
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
  </aside>
</template>
<script setup lang="ts">
import { api } from '@/services/api';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isGoalsDisabled = ref(true);

const dashboard = () => {
  router.push('/');
  // router.push({ name: 'DashboardPage' });
};

const shouldGoalsBeEnabled = async () => {
  try {
    const user = localStorage.getItem('user');
    const loggedInUser = user ? JSON.parse(user) : null;
    const result = await api.get(`goals/verification/${loggedInUser.userId}`);
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
  width: 250px;
  background-color: #f4f4f4;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar h2 {
  margin-bottom: 1rem;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  margin: 0.5rem 0;
}

.sidebar a {
  text-decoration: none;
  color: #333;
  padding: 0.5rem;
  display: block;
  border-radius: 4px;
}

.sidebar a:hover {
  background-color: #e0e0e0;
}

.disabled {
  pointer-events: none;
  color: #ccc;
  text-decoration: none;
}
</style>
