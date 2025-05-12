<template>
  <div class="flex">
    <SidebarMenu />
    <main class="flex-1 p4">
      <div class="dashboard">
        <div class="logout-container">
          <ProfileDropdown v-if="user.firstName" :user="user" />
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
const user = ref({});
console.log('hah');

// const arr = [5, 2, 7, 1, 9, 3, 4];
// function sort(arr: number[]) {
//   for (let i = 0; i < arr.length; i++) {
//     setTimeout(() => console.log(arr[i]), arr[i]);
//   }
// }
// sort(arr);
// // function sort(arr: number[]) {
// //   for (var i = 0; i < arr.length; i++) {
// //     (function (i) {
// //       setTimeout(() => console.log(arr[i]), arr[i]);
// //     })(i);
// //   }
// // }
// // sort(arr);

// for (var j = 0; j < 3; j++) {
//   setTimeout(() => console.log(j), 1000);
// }

// console.log('Start');

// setTimeout(() => {
//   console.log('Timeout executed');
// }, 1000);

// console.log('End');

onMounted(() => {
  const loggedInUser = localStorage.getItem('user');
  if (loggedInUser && typeof loggedInUser === 'string') {
    user.value = JSON.parse(loggedInUser);
    api.get(`tracker/${user.value.userId}`).then((data) => console.log(data));
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
