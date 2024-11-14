<template>
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
          <td id="edit-icon" @click="editIncome(income._id)">Edit</td>
          <td id="delete-icon" @click="deleteIncome(income._id)">Delete</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { api } from '@/services/api';
import { onMounted, ref } from 'vue';
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
