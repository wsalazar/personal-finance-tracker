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
import { formatDateForList } from '@/helpers/utils';
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
  (e: 'save', data: any): void;
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

type fieldType = 'date' | 'amount' | string;

const fieldFormatters: Record<
  fieldType,
  (value: any) => string | number | Date
> = {
  date: (value: Date) => formatDateForList(value),
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
  fieldType: string,
  fieldValue: string | number | Date,
): string | number | Date => {
  const formatter = fieldFormatters[fieldType] || fieldFormatters.default;
  return formatter(fieldValue);
};

local.value = formatFieldValue(
  localValue.value.editingField,
  localValue.value?.data[localValue.value.editingField],
);
</script>
