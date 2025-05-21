<template>
  <template v-if="isEditing">
    <input
      class="w-full border border-blue-500 rounded pl-28 focus:caret-blue-500 cursor-text"
      :type="inputType"
      autofocus
      @keyup.enter="handleSave"
      @keyup.esc="emit('cancel')"
      :value="editingValue"
      @input="handleInput"
    />
  </template>
  <template v-else>
    {{ local }}
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  editingField: {
    type: String,
    required: true,
  },
  isEditing: {
    type: Boolean,
    required: true,
  },
  editingId: {
    type: String,
    required: true,
  },
  inputType: {
    type: String,
    required: true,
  },
  editingValue: {
    type: [String, Number, Date],
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'save', data: string): void;
  (e: 'cancel'): void;
  (e: 'update:editingValue', value: string | number | Date): void;
}>();

const handleSave = () => {
  emit('save', localValue.value.data._id);
  localStorage.isEditing = false;
};

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update:editingValue', target.value);
};
const localValue = ref(props);
const local = ref<string | number | Date>('');

type FieldType = 'date' | 'amount' | string;
type FieldValue = string | number | Date;

const formatters = {
  date: (value: Date) => new Date(value).toISOString().split('T')[0],
  amount: (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value),
  default: (value: string) => value,
};

const formatFieldValue = (
  fieldType: FieldType,
  fieldValue: FieldValue,
): string => {
  // console.log(fieldType, fieldValue instanceof Date);
  if (fieldType === 'date') {
    const date = new Date(fieldValue);
    return formatters.date(date);
  }
  if (fieldType === 'amount' && typeof fieldValue === 'number') {
    return formatters.amount(fieldValue);
  }
  return formatters.default(String(fieldValue));
};

local.value = formatFieldValue(
  localValue.value.editingField,
  localValue.value?.data[localValue.value.editingField],
);
</script>
