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
                <template
                  v-if="
                    editingId === expense._id && editingField === 'description'
                  "
                >
                  <input
                    v-model="editingValue"
                    @blur="saveEdit(expense._id)"
                    @keyup.enter="saveEdit(expense._id)"
                    @keyup.esc="cancelEdit()"
                    class="w-full border border-blue-500 rounded pl-28 focus:caret-blue-500 cursor-text"
                    ref="editInput"
                    autofocus
                    type="text"
                  />
                </template>
                <template v-else>
                  {{ expense.description }}
                </template>
              </td>
              <td
                class="p-0.5 border border-gray-300 w-20"
                @click="editExpenseCell(expense.amount, 'amount', expense._id)"
              >
                <template
                  v-if="editingId == expense._id && editingField == 'amount'"
                >
                  <input
                    v-model="editingValue"
                    @blur="saveEdit(expense._id)"
                    @keyup.enter="saveEdit(expense._id)"
                    @keyup.esc="cancelEdit()"
                    class="w-full border border-blue-500 rounded pl-28 focus:caret-blue-500 cursor-text"
                    ref="editInput"
                    autofocus
                    type="text"
                  />
                </template>
                <template v-else> ${{ expense.amount }} </template>
              </td>
              <td
                class="p-0.5 border border-gray-300 w-20"
                @click="editExpenseCell(expense.date, 'date', expense._id)"
              >
                <template
                  v-if="editingId === expense._id && editingField === 'date'"
                >
                  <input
                    class="w-full border border-blue-500 rounded pl-28 focus:caret-blue-500 cursor-text"
                    @blur="saveEdit(expense._id)"
                    @keyup.enter="saveEdit(expense._id)"
                    @keyup="cancelEdit(expense)"
                    autofocus
                    v-model="editingValue"
                    type="date"
                  />
                </template>
                <template v-else>
                  {{ formatDateForList(expense.date) }}
                </template>
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
              <td>${{ totalAmount }}</td>
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
import { PencilSquareIcon } from '@heroicons/vue/16/solid';
import SidebarMenu from '@/views/SidebarMenu.vue';
import { formatDateForList } from '@/helpers/utils';
import ProfileDropdown from '@/views/ProfileDropdown.vue';
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

const saveEdit = async (id: string) => {
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

const editExpense = async (id: string) => {
  router.push({ name: 'ExpenseEdit', params: { id: id } });
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
