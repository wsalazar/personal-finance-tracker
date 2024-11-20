<template>
  <SidebarMenu />
  <form @submit.prevent="handleSubmit" class="expense-form">
    <ExpenseInput
      :form="expenseData"
      :isDirty="isDirty"
      @submit="handleIncomingExpense"
    />
  </form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { api } from '@/services/api';
import SidebarMenu from '@/views/SidebarMenu.vue';
import ExpenseInput from './ExpenseInput.vue';
import { useRoute, useRouter } from 'vue-router';
import { formatDateForEdit } from '@/helpers/utils';
const expenseData = reactive({ description: '', date: '', amount: 0 });

const isDirty = ref(false);
const router = useRouter();
const route = useRoute();
const form = reactive({
  amount: 0,
  description: '',
  date: new Date().toISOString().split('T')[0],
});

interface ExpenseData {
  amount: number;
  description: string;
  date: string;
}

const handleIncomingExpense = (expenseData: ExpenseData) => {
  form.amount = expenseData.amount;
  form.date = expenseData.date;
  form.description = expenseData.description;
};

onMounted(async () => {
  const id = route.params.id;
  if (id) {
    isDirty.value = true;
    const result = await api.get(`/expenses/${id}`);

    const date = formatDateForEdit(result?.data.date);
    Object.assign(expenseData, {
      ...result?.data,
      date: date,
    });
  }
});

const handleSubmit = async () => {
  try {
    if (isDirty.value) {
      await api.put(`/expenses/${route.params.id}`, form);
    } else {
      await api.post('/expenses', form);
    }
    // Reset form
    form.amount = 0;
    form.description = '';
    form.date = new Date().toISOString().split('T')[0];
    router.push({ name: 'ExpenseList' });
  } catch (error) {
    console.error('Failed to add expense:', error);
  }
};
</script>

<style scoped lang="scss">
.expense-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;

  .form-group {
    margin-bottom: 1rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
    }

    input,
    select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  }

  .btn {
    width: 100%;
    padding: 0.75rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #c82333;
    }
  }
}
</style>
