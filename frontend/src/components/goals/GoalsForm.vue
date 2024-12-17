<template>
  <SidebarMenu />
  <form @submit.prevent="handleSubmit" class="goal-form">
    <GoalInput
      :form="goalData"
      :isDirty="isDirty"
      @submit="handleIncomingGoal"
    />
  </form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { api } from '@/services/api';
import SidebarMenu from '@/views/SidebarMenu.vue';
import GoalInput from './GoalInput.vue';
import { formatDateForEdit } from '@/helpers/utils';
import { useRoute, useRouter } from 'vue-router';
const goalData = reactive({ name: '', date: '', amount: 0 });

const isDirty = ref(false);
const router = useRouter();
const route = useRoute();
const form = reactive({
  amount: 0,
  name: '',
  date: new Date().toISOString().split('T')[0],
});

interface GoalData {
  amount: number;
  name: string;
  date: string;
}

const handleIncomingGoal = (goalData: GoalData) => {
  form.amount = goalData.amount;
  form.date = goalData.date;
  form.name = goalData.name;
};

onMounted(async () => {
  const id = route.params.id;
  if (id) {
    isDirty.value = true;
    const response = await api.get(`/goal/${id}`);
    const date = formatDateForEdit(response?.data.date);
    Object.assign(goalData, {
      ...response?.data,
      date: date,
    });
  }
});

const handleSubmit = async () => {
  try {
    if (isDirty.value) {
      await api.put(`/goal/${route.params.id}`, form);
    } else {
      await api.post('/goal', form);
    }
    form.amount = 0;
    form.name = '';
    form.date = new Date().toISOString().split('T')[0];
    router.push({ name: 'GoalList' });
  } catch (error) {
    console.error('Failed to add goal:', error);
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
