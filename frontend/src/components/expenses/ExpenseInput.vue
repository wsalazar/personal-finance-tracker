<template>
  <div class="form-group">
    <label for="amount">Amount</label>
    <input
      id="amount"
      v-model.number="localForm.amount"
      type="number"
      step="0.01"
      required
      class="form-control"
    />
  </div>

  <!-- possibly add category -->
  <!-- <div class="form-group">
    <label for="category">Category</label>
    <select id="category" v-model="form.category" required class="form-control">
      <option value="food">Food</option>
      <option value="transport">Transport</option>
      <option value="utilities">Utilities</option>
      <option value="entertainment">Entertainment</option>
      <option value="other">Other</option>
    </select>
  </div> -->

  <div class="form-group">
    <label for="description">Description</label>
    <input
      id="description"
      v-model="localForm.description"
      type="text"
      required
      class="form-control"
    />
  </div>

  <div class="form-group">
    <label for="date">Date</label>
    <input
      id="date"
      v-model="localForm.date"
      type="date"
      required
      class="form-control"
    />
  </div>

  <button @click="submitExpense">
    {{ isDirty ? 'Edit Expense' : 'Add Expense' }}
  </button>
  <button @click="backToList">Back to Expense List</button>
</template>
<script setup lang="ts">
import { reactive, defineProps, defineEmits, watch } from 'vue';
import { useRouter } from 'vue-router';

const emits = defineEmits(['submit']);
const router = useRouter();

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  isDirty: {
    type: Boolean,
    required: false,
  },
});
const localForm = reactive({ ...props.form });
watch(
  () => props.form,
  (newForm) => {
    Object.assign(localForm, newForm);
  },
  { deep: true },
);

const backToList = () => {
  router.push({ name: 'ExpenseList' });
};

const submitExpense = () => {
  emits('submit', { ...localForm });
};
</script>
