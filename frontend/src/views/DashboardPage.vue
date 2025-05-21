<template>
  <div class="flex">
    <SidebarMenu />
    <main class="flex-1 p4">
      <div class="dashboard">
        <div class="logout-container">
          <ProfileDropdown v-if="user" :user="user" />
        </div>
        <div id="tracker-list" class="mt-20">
          <table
            class="min-w-full border border-collapse border-gray-300 table-auto"
          >
            <thead>
              <tr>
                <th class="w-1/4 p-2 border border-gray-300">Name</th>
                <th class="w-1/4 p-2 border border-gray-300">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="track in tracker" :key="track.id">
                <td class="p-0.5 border border-gray-300 w-20">
                  {{ track.goalName }}
                </td>
                <td class="p-0.5 border border-gray-300 w-20">
                  <div class="progress">
                    <div
                      class="progress-done"
                      :style="{ width: `${track.percentage}%` }"
                    >
                      {{ Math.ceil(track.percentage) }}%
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SidebarMenu from './SidebarMenu.vue';
import ProfileDropdown from './ProfileDropdown.vue';

import { api } from '@/services/api';

interface User {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

const user = ref<User>({
  _id: '',
  userId: '',
  firstName: '',
  lastName: '',
  email: '',
});

interface TrackerItem {
  id: string;
  goalName: string;
  percentage: number;
}
const tracker = ref<TrackerItem[]>([]);

onMounted(async () => {
  const loggedInUser = localStorage.getItem('user');
  if (loggedInUser && typeof loggedInUser === 'string') {
    user.value = JSON.parse(loggedInUser);
    await api
      .get(`tracker/${user.value.userId}`)
      .then((response) => {
        tracker.value = response.data;
      })
      .catch(() => {
        // put notification here
      });
  }
});
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

  .progress {
    background-color: grey;
    border-radius: 20px;
    height: 30px;
    width: 300px;
  }

  .progress-done {
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: repeating-linear-gradient(
      to left,
      #0546e0,
      #1172f9,
      #4892f9
    );
    box-shadow: 0 5px 5px -6px #0546e0, 0 3px 7px #1172f9;
    border-radius: 20px;
    color: #fff;
    height: 100%;
    width: 0;
    transition: 1s ease 0.3s;
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
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
  .logout-container button {
    padding: 0.5rem 1rem;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .logout-container button:hover {
    background-color: #d32f2f;
  }
}
</style>
