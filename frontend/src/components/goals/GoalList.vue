<template>
  <div class="flex">
    <SidebarMenu />
    <main class="flex-1 p4">
      <div id="goal-list">
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
        </table>
        <button
          class="px-4 py-2 mt-20 font-semibold text-white transition duration-200 bg-blue-500 rounded add-goal hover:bg-blue-600"
          @click="addGoal"
        >
          Add Goal
        </button>
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

const goalList = ref([]);

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
    const response = await api.get('/goal');
    goalList.value = response.data;
  } catch (err) {
    console.error('Error fetching data');
  }
};
onMounted(() => {
  fetchGoalList();
});

const addGoal = () => {
  router.push({ name: 'GoalForm' });
};
</script>
