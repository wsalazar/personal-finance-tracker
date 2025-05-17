<template>
  <div class="flex">
    <SidebarMenu />
    <main class="flex-1 p4">
      <div class="absolute top-4 right-4">
        <ProfileDropdown v-if="user && user.firstName" :user="user" />
      </div>
      <button
        class="px-4 py-2 mt-5 font-semibold text-white transition duration-200 bg-blue-500 rounded add-expense hover:bg-blue-600"
        @click="addGoal"
      >
        Add Goal
      </button>
      <div id="goal-list" class="mt-20">
        <table
          class="min-w-full border border-collapse border-gray-300 table-auto"
        >
          <thead>
            <tr>
              <th class="w-1/4 p-2 border border-gray-300">Name</th>
              <th class="w-1/4 p-2 border border-gray-300">Amount</th>
              <th class="w-1/4 p-2 border border-gray-300">Date</th>
              <th class="w-1/4 p-2 border border-gray-300">Edit</th>
              <th class="w-1/4 p-2 border border-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="goal in goalList" :key="goal._id">
              <td class="p-0.5 border border-gray-300 w-20">{{ goal.name }}</td>
              <td class="p-0.5 border border-gray-300 w-20">
                ${{ goal.amount }}
              </td>
              <td class="p-0.5 border border-gray-300 w-20">
                {{ formatDateForList(goal.date) }}
              </td>
              <td
                class="flex items-center justify-center p-2 border border-gray-150 w-30"
                @click="editGoal(goal._id)"
              >
                <PencilSquareIcon
                  className=" text-gray-500"
                  style="width: 30px; height: 30px; cursor: pointer"
                />
              </td>
              <td
                class="w-20 p-2 font-bold border border-gray-300 cursor-pointer text-rose-600"
                @click="deleteGoal(goal._id)"
              >
                X
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>${{ totalAmount }}</td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { api } from '@/services/api';
import { onMounted, ref } from 'vue';
import { formatDateForList } from '@/helpers/utils';
import { PencilSquareIcon } from '@heroicons/vue/16/solid';
import SidebarMenu from '@/views/SidebarMenu.vue';
import ProfileDropdown from '@/views/ProfileDropdown.vue';

interface User {
  firstName: string;
  _id: string;
  userId: string;
}

interface Goal {
  amount: number;
  _id: string;
  date: Date;
  name: string;
}

const user = ref<User | null>(null);
let totalAmount = ref(0);

const goalList = ref<Goal[]>([]);

const editGoal = async (id: string) => {
  router.push({ name: 'GoalEdit', params: { id: id } });
};

const deleteGoal = async (id: string) => {
  try {
    await api.delete('/goal/' + id);
    fetchGoalList();
  } catch (err) {
    /**
     * todo Add toaster instead of having a console log
     */
    console.error(err);
  }
};

const fetchGoalList = async () => {
  try {
    if (user.value && user.value.userId) {
      const response = await api.get(`/goals/${user.value.userId}`);
      goalList.value = response.data;
      goalList.value.forEach((v) => (totalAmount.value += v.amount));
    }
  } catch (err) {
    console.error('Error fetching data');
  }
};
onMounted(() => {
  const loggedInUser = localStorage.getItem('user');
  user.value = loggedInUser ? JSON.parse(loggedInUser) : null;
  fetchGoalList();
});

const addGoal = () => {
  router.push({ name: 'GoalForm' });
};
</script>
