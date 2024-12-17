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
      @input="emitChange"
    />
  </div>

  <div class="form-group">
    <label for="description">Name</label>
    <input
      id="name"
      v-model="localForm.name"
      type="text"
      required
      class="form-control"
      @input="emitChange"
    />
  </div>

  <div class="form-group">
    <label for="date">Date </label>
    <input
      id="date"
      v-model="localForm.date"
      type="date"
      required
      class="form-control"
      @input="emitChange"
    />
  </div>

  <button @click="submitGoal">
    {{ isDirty ? 'Edit Goal' : 'Add Goal' }}
  </button>
  <button @click="backToList">Back to Goal List</button>
</template>
<script setup lang="ts">
import { reactive, defineProps, defineEmits, watch } from 'vue';
import { useRouter } from 'vue-router';

const emits = defineEmits(['submit']);
const router = useRouter();

const emitChange = () => {
  emits('submit', localForm);
};

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
  router.push({ name: 'GoalList' });
};

const submitGoal = () => {
  emits('submit', { ...localForm });
};
</script>
