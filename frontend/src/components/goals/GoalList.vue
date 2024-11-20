<template>
  <SidebarMenu />
  <div id="goal-list">
    <button class="add-goal" @click="addGoal">Add Goal</button>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="goal in goalList" :key="goal._id">
          <td>{{ goal.name }}</td>
          <td>${{ goal.amount }}</td>
          <td>{{ formatDateForList(goal.date) }}</td>
          <td class="cursor-pointer" @click="editGoal(goal._id)">
            <PencilSquareIcon className="h-5 w-5 text-gray-500" />
          </td>
          <td
            class="cursor-pointer text-rose-600 font-bold"
            @click="deleteGoal(goal._id)"
          >
            X
          </td>
        </tr>
      </tbody>
    </table>
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
