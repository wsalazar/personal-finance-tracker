<template>
  <SidebarMenu />
  <div id="expense-list">
    <button class="add-expense" @click="addExpense">Add Expense</button>
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
        <tr v-for="expense in expenseList" :key="expense._id">
          <td>{{ expense.description }}</td>
          <td>${{ expense.amount }}</td>
          <td>{{ formatDateForList(expense.date) }}</td>
          <td class="cursor-pointer" @click="editExpense(expense._id)">
            <PencilSquareIcon className="h-5 w-5 text-gray-500" />
          </td>
          <td
            class="cursor-pointer text-rose-600 font-bold"
            @click="deleteExpense(expense._id)"
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
import { formatDateForList } from '@/helpers/utils';

const expenseList = ref([]);

const editExpense = async (id: string) => {
  router.push({ name: 'ExpenseEdit', params: { id: id } });
};

const deleteExpense = async (id: string) => {
  try {
    await api.delete('/expenses/' + id);
    fetchExpenseList();
  } catch (err) {
    console.error(err);
  }
};

const fetchExpenseList = async () => {
  try {
    const response = await api.get('/expenses');
    expenseList.value = response.data;
  } catch (err) {
    console.error('Error fetching data');
  }
};
onMounted(() => {
  fetchExpenseList();
});

const addExpense = () => {
  router.push({ name: 'ExpenseForm' });
};
</script>
