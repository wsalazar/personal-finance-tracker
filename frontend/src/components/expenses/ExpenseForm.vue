<template>
  <form @submit.prevent="handleSubmit" class="expense-form">
    <div class="form-group">
      <label for="amount">Amount</label>
      <input
        id="amount"
        v-model.number="form.amount"
        type="number"
        step="0.01"
        required
        class="form-control"
      />
    </div>

    <div class="form-group">
      <label for="category">Category</label>
      <select
        id="category"
        v-model="form.category"
        required
        class="form-control"
      >
        <option value="food">Food</option>
        <option value="transport">Transport</option>
        <option value="utilities">Utilities</option>
        <option value="entertainment">Entertainment</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <input
        id="description"
        v-model="form.description"
        type="text"
        required
        class="form-control"
      />
    </div>

    <div class="form-group">
      <label for="date">Date</label>
      <input
        id="date"
        v-model="form.date"
        type="date"
        required
        class="form-control"
      />
    </div>

    <button type="submit" class="btn btn-primary">Add Expense</button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { api } from '@/services/api';

const form = reactive({
  amount: 0,
  category: 'other',
  description: '',
  date: new Date().toISOString().split('T')[0],
});

const handleSubmit = async () => {
  try {
    await api.post('/expenses', form);
    // Reset form
    form.amount = 0;
    form.category = 'other';
    form.description = '';
    form.date = new Date().toISOString().split('T')[0];
    // You might want to emit an event to refresh the expense list
    // emit('expense-added')
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
