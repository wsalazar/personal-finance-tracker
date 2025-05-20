<template>
  <div class="flex">
    <SidebarMenu />
    <main class="flex-1 p4">
      <div class="absolute top-4 right-4">
        <ProfileDropdown v-if="user && user.firstName" :user="user" />
      </div>
      <button
        class="px-4 py-2 mt-5 font-semibold text-white transition duration-200 bg-blue-500 rounded add-income hover:bg-blue-600"
        @click="addIncome"
      >
        Add Income
      </button>
      <div id="income-list" class="mt-20">
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
            <tr v-for="income in incomeList" :key="income._id">
              <td
                class="p-0.5 border border-gray-300 w-20"
                @click="
                  editIncomeCell(
                    income.incomeSource,
                    'incomeSource',
                    income._id,
                  )
                "
              >
                <InlineEditing
                  :data="income"
                  editingField="incomeSource"
                  @save="handleUpdate"
                  @cancel="cancelEdit"
                  :isEditing="
                    editingId === income._id && editingField === 'incomeSource'
                  "
                  :editingId="income._id"
                  inputType="text"
                  v-model:editingValue="editingValue"
                />
              </td>
              <td
                class="p-0.5 border border-gray-300 w-20"
                @click="editIncomeCell(income.amount, 'amount', income._id)"
              >
                <InlineEditing
                  :data="income"
                  editingField="amount"
                  @save="handleUpdate"
                  @cancel="cancelEdit"
                  :isEditing="
                    editingId === income._id && editingField === 'amount'
                  "
                  :editingId="income._id"
                  inputType="text"
                  v-model:editingValue="editingValue"
                />
              </td>
              <td
                class="p-0.5 border border-gray-300 w-20"
                @click="editIncomeCell(income.date, 'date', income._id)"
              >
                <InlineEditing
                  :data="income"
                  editingField="date"
                  @save="handleUpdate"
                  @cancel="cancelEdit"
                  :isEditing="
                    editingId === income._id && editingField === 'date'
                  "
                  :editingId="income._id"
                  inputType="date"
                  v-model:editingValue="editingValue"
                />
              </td>

              <td
                class="w-20 p-2 font-bold border border-gray-300 cursor-pointer text-rose-600"
                @click="deleteIncome(income._id)"
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
import ProfileDropdown from '@/views/ProfileDropdown.vue';
import InlineEditing from '../InlineEditing.vue';

interface Income {
  _id: string;
  incomeSource: string;
  amount: number;
  date: Date;
}

interface User {
  userId: string;
  firstName: string;
}

const incomeList = ref<Income[]>([]);
const totalAmount = ref(0);
const formattedTotalAmount = ref('');
const user = ref<User | null>(null);
const editingField = ref('');
const editingValue = ref<string | number | Date>('');
const editingId = ref<string | null>('');
const isEditing = ref(false);

const handleUpdate = async (id: string) => {
  try {
    await api.patch(`/income/${id}`, {
      [editingField.value]: editingValue.value,
    });
    editingId.value = null;
    await fetchIncomeList();
  } catch (err) {
    console.error(err);
  }
};

const cancelEdit = () => {
  editingId.value = null;
  editingValue.value = '';
};

const editIncomeCell = (
  value: string | number | Date,
  field: string,
  id: string,
) => {
  editingField.value = field;
  if (field === 'date') {
    const date = new Date(value);
    editingValue.value = date.toISOString().split('T')[0];
  } else {
    editingValue.value = value.toString();
  }
  editingId.value = id;
  isEditing.value = true;
};

const deleteIncome = async (id: string) => {
  try {
    await api.delete('/income/' + id);
    fetchIncomeList();
  } catch (err) {
    console.error(err);
  }
};

const fetchIncomeList = async () => {
  try {
    if (user.value && user.value.userId) {
      const response = await api.get(`/income/user/${user.value.userId}`);
      incomeList.value = response.data;
      incomeList.value.forEach((v) => (totalAmount.value += v.amount));
      formattedTotalAmount.value = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(totalAmount.value);
    }
  } catch (err) {
    console.error('Error fetching data');
  }
};
onMounted(() => {
  const loggedInUser = localStorage.getItem('user');
  user.value = loggedInUser ? JSON.parse(loggedInUser) : null;
  fetchIncomeList();
});

const addIncome = () => {
  router.push({ name: 'IncomeForm' });
};
</script>
