<template>
  <form @submit.prevent="handleSubmit" class="income-form">
    <IncomeInput :form="incomeData" @submit="handleIncomeSubmit" />
  </form>
</template>

<script setup lang="ts">
import { reactive, defineEmits, onMounted, ref } from 'vue';
import { api } from '@/services/api';
import IncomeInput from '@/views/IncomeInput.vue';
const emit = defineEmits(['add-income']);
import { useRoute, useRouter } from 'vue-router';
const incomeData = reactive({ incomeSource: '', date: '', amount: 0 });
const isDirty = ref(false);
const router = useRouter();
const route = useRoute();
const form = reactive({
  amount: 0,
  incomeSource: '',
  date: new Date().toISOString().split('T')[0],
});

interface IncomeData {
  amount: number;
  incomeSource: string;
  date: string;
}

const handleIncomeSubmit = (incomeData: IncomeData) => {
  console.log(incomeData);
  form.amount = incomeData.amount;
  form.incomeSource = incomeData.incomeSource;
  form.date = incomeData.date;
};

onMounted(async () => {
  const id = route.params.id;
  if (id) {
    isDirty.value = true;
    const response = await fetchIncomeById(id);
    const newDate = new Date(response?.data.date);
    let month = String(newDate.getMonth() + 1);
    if (String(newDate.getMonth()).length < 2) {
      month = String(newDate.getMonth() + 1).padStart(2, '0');
    }
    let date = String(newDate.getDate());
    if (String(newDate.getDate()).length < 2) {
      date = String(newDate.getDate()).padStart(2, '0');
    }

    Object.assign(incomeData, {
      ...response?.data,
      date: newDate.getFullYear() + '-' + month + '-' + date,
    });
  }
});

const fetchIncomeById = async (id: string) => {
  try {
    return await api.get('/income/' + id);
  } catch (err) {
    console.error(err);
  }
};
const handleSubmit = async () => {
  try {
    if (isDirty.value) {
      await api.put(`/income/${route.params.id}`, form);
    } else {
      await api.post('/income', form);
    }

    form.amount = 0;
    form.incomeSource = '';
    form.date = new Date().toISOString().split('T')[0];
    emit('add-income');
    router.push({ name: 'IncomeList' });
  } catch (error) {
    console.error('Failed to add income:', error);
  }
};
</script>

<style scoped lang="scss">
.income-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;

  .form-group {
    margin-bottom: 1rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
    }

    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  }

  .btn {
    width: 100%;
    padding: 0.75rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #45a049;
    }
  }
}
</style>
