<template>
  <SidebarMenu />
  <div id="income-list">
    <button class="add-income" @click="addIncome">Add Income</button>
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
        <tr v-for="income in incomeList" :key="income._id">
          <td>{{ income.incomeSource }}</td>
          <td>${{ income.amount }}</td>
          <td>{{ new Date(income.date).toLocaleString() }}</td>
          <td class="cursor-pointer" @click="editIncome(income._id)">
            <PencilSquareIcon className="h-5 w-5 text-gray-500" />
          </td>
          <td
            class="cursor-pointer text-rose-600 font-bold"
            @click="deleteIncome(income._id)"
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
import { PencilSquareIcon } from '@heroicons/vue/16/solid';
import SidebarMenu from '@/views/SidebarMenu.vue';

const incomeList = ref([]);

const editIncome = async (id: string) => {
  router.push({ name: 'IncomeEdit', params: { id: id } });
};

const deleteIncome = async (id: string) => {
  try {
    await api.delete('/income/' + id);
    fetchIncomeList();
  } catch (err) {
    console.error(err);
  }
};

const fetchIncomeList = async () => {
  try {
    const response = await api.get('/income');
    incomeList.value = response.data;
  } catch (err) {
    console.error('Error fetching data');
  }
};
onMounted(() => {
  fetchIncomeList();
});

const addIncome = () => {
  router.push({ name: 'IncomeForm' });
};
</script>
<style scoped></style>
