<template>
  <div class="flex">
    <SidebarMenu />
    <main class="flex-1 p4">
      <div class="logout-container">
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
              <th class="w-1/4 p-2 border border-gray-300">Edit</th>
              <th class="w-1/4 p-2 border border-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="income in incomeList" :key="income._id">
              <td class="p-0.5 border border-gray-300 w-20">
                {{ income.incomeSource }}
              </td>
              <td class="p-0.5 border border-gray-300 w-20">
                ${{ income.amount }}
              </td>
              <td class="p-0.5 border border-gray-300 w-20">
                {{ formatDateForList(income.date) }}
              </td>
              <td
                class="flex items-center justify-center p-2 border border-gray-150 w-30"
                @click="editIncome(income._id)"
              >
                <PencilSquareIcon
                  className=" text-gray-500"
                  style="width: 30px; height: 30px; cursor: pointer"
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
const user = ref<User | null>(null);

const editIncome = async (id: string) => {
  router.push({ name: 'IncomeEdit', params: { id: id } });
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
      incomeList.value.forEach((v) => {
        totalAmount.value += v.amount;
      });
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
<style scoped>
.logout-container {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
.logout-container button {
  padding: 0.5rem 1rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-container button:hover {
  background-color: #d32f2f;
}
</style>
