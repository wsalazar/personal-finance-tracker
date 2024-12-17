<template>
  <div class="income-section">
    <div class="form-group">
      <label for="income">Income source:</label>
      <input
        type="text"
        id="income-source"
        v-model="localForm.incomeSource"
        placeholder="Income source"
        @input="emitChange"
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
        @input="emitChange"
      />
    </div>

    <div class="form-group">
      <label for="amount">Amount</label>
      <input
        id="amount"
        v-model.number="localForm.amount"
        type="number"
        step="0.01"
        required
        class="form-control"
        @input="emitChange"
      />
    </div>
    <button @click="submitIncome">
      {{ isDirty ? 'Edit Income' : 'Add Income' }}
    </button>
    <button @click="backToList">Back to Income List</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

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
const emit = defineEmits(['submit']);

const emitChange = () => {
  emit('submit', localForm);
};

watch(
  () => props.form,
  (newForm) => {
    Object.assign(localForm, newForm);
  },
  { deep: true },
);

const backToList = () => {
  router.push({ name: 'IncomeList' });
};

const submitIncome = () => {
  emit('submit', { ...localForm });
};
</script>

<style scoped>
.income-input {
  margin-top: 2rem;
  text-align: left;
}

.income-input label {
  display: block;
  margin-bottom: 0.5rem;
}

.income-input input {
  padding: 0.5rem;
  width: 100%;
  margin-bottom: 0.5rem;
}

.income-input button {
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.income-input button:hover {
  background-color: #45a049;
}
</style>
