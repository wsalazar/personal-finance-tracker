<template>
  <div class="flex">
    <SidebarMenu />
    <main class="flex-1 p4">
      <div class="absolute top-4 right-4">
        <ProfileDropdown v-if="user && user.firstName" :user="user" />
      </div>
      <button
        class="px-4 py-2 mt-5 font-semibold text-white transition duration-200 bg-blue-500 rounded add-expense hover:bg-blue-600"
        @click="addExpense"
      >
        Add Expense
      </button>
      <div id="expense-list" class="mt-20">
        <table
          class="min-w-full border border-collapse border-gray-300 table-auto"
        >
          <thead>
            <tr>
              <th class="w-1/4 p-2 border border-gray-300">Name</th>
              <th class="w-1/4 p-2 border border-gray-300">Amount</th>
              <th class="w-1/4 p-2 border border-gray-300">Date</th>
              <th class="w-1/4 p-2 border border-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in expenseList" :key="expense._id">
              <td
                class="p-0.5 border border-gray-300 w-20"
                @click="
                  editExpenseCell(
                    expense.description,
                    'description',
                    expense._id,
                  )
                "
              >
                <InlineEditing
                  :data="expense"
                  editingField="description"
                  @save="handleUpdate"
                  @cancel="cancelEdit"
                  :isEditing="
                    editingId === expense._id && editingField === 'description'
                  "
                  :editingId="expense._id"
                  inputType="text"
                  v-model:editingValue="editingValue"
                />
              </td>
              <td
                class="p-0.5 border border-gray-300 w-20"
                @click="editExpenseCell(expense.amount, 'amount', expense._id)"
              >
                <InlineEditing
                  :data="expense"
                  editingField="amount"
                  @save="handleUpdate"
                  @cancel="cancelEdit"
                  :isEditing="
                    editingId === expense._id && editingField === 'amount'
                  "
                  :editingId="expense._id"
                  inputType="text"
                  v-model:editingValue="editingValue"
                />
              </td>
              <td
                class="p-0.5 border border-gray-300 w-20"
                @click="editExpenseCell(expense.date, 'date', expense._id)"
              >
                <InlineEditing
                  :data="expense"
                  editingField="date"
                  @save="handleUpdate"
                  @cancel="cancelEdit"
                  :isEditing="
                    editingId === expense._id && editingField === 'date'
                  "
                  :editingId="expense._id"
                  inputType="date"
                  v-model:editingValue="editingValue"
                />
              </td>
              <td
                class="w-20 p-2 font-bold border border-gray-300 cursor-pointer text-rose-600"
                @click="deleteExpense(expense._id)"
              >
                X
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>{{ formattedTotalAmount }}</td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { api } from '@/services/api';
import { onMounted, ref } from 'vue';
import SidebarMenu from '@/views/SidebarMenu.vue';
import { formatDateForList } from '@/helpers/utils';
import ProfileDropdown from '@/views/ProfileDropdown.vue';
import InlineEditing from '../InlineEditing.vue';
const editingId = ref<string | null>(null);
const editingValue = ref('');
const editingField = ref('');

interface Expense {
  amount: number;
  description: string;
  _id: string;
  date: Date;
}

interface User {
  firstName: string;
  userId: string;
}

const expenseList = ref<Expense[]>([]);
const user = ref<User | null>(null);
let totalAmount = ref(0);
const formattedTotalAmount = ref('');
const editExpenseCell = (
  fieldValue: string | number | Date,
  field: string,
  id: string,
) => {
  editingId.value = id;
  if (field === 'date') {
    const date = new Date(fieldValue);
    editingValue.value = date.toISOString().split('T')[0];
  } else {
    editingValue.value =
      fieldValue instanceof Date
        ? formatDateForList(fieldValue)
        : fieldValue.toString();
  }
  editingField.value = field;
};

const handleUpdate = async (id: string) => {
  try {
    await api.patch(`/expenses/${id}`, {
      [editingField.value]: editingValue.value,
    });
    editingId.value = null;
    await fetchExpenseList();
  } catch (err) {
    console.error('Error updating description:', err);
  }
};

const cancelEdit = (expense?: Expense) => {
  editingId.value = null;
  editingValue.value = '';
  if (editingField.value === 'date' && expense) {
    editingValue.value = new Date(expense.date).toISOString().split('T')[0];
  }
};

const deleteExpense = async (id: string) => {
  try {
    await api.delete('/expenses/' + id);
    fetchExpenseList();
  } catch (err) {
    /**
     * todo add toaster
     */
    console.error(err);
  }
};
const fetchExpenseList = async () => {
  try {
    if (user.value && user.value.userId) {
      const response = await api.get(`/expenses/${user.value.userId}`);
      expenseList.value = response.data;
      totalAmount.value = 0;
      expenseList.value.forEach((v) => (totalAmount.value += v.amount));
      formattedTotalAmount.value = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(totalAmount.value);
    } else {
      console.error('User ID is not available');
    }
  } catch (err) {
    /**
     * todo add toaster
     */
    console.error('Error fetching data');
  }
};
onMounted(() => {
  const loggedInUser = localStorage.getItem('user');
  user.value = loggedInUser ? JSON.parse(loggedInUser) : null;
  fetchExpenseList();
});

const addExpense = () => {
  router.push({ name: 'ExpenseForm' });
};
</script>
