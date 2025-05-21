<template>
  <div class="flex">
    <SidebarMenu />
    <main class="flex-1 p4">
      <div class="absolute top-4 right-4">
        <ProfileDropdown v-if="user && user.firstName" :user="user" />
      </div>
      <button
        class="px-4 py-2 mt-5 font-semibold text-white transition duration-200 bg-blue-500 rounded add-expense hover:bg-blue-600"
        @click="addGoal"
      >
        Add Goal
      </button>
      <div id="goal-list" class="mt-20">
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
            <tr v-for="goal in goalList" :key="goal._id">
              <td
                class="p-0.5 border border-gray-300 w-20"
                @click="editGoalCell(goal.name, 'name', goal._id)"
              >
                <InlineEditing
                  :data="goal"
                  editingField="name"
                  @save="handleUpdate"
                  @cancel="cancelEdit"
                  :isEditing="editingId === goal._id && editingField === 'name'"
                  :editingId="goal._id"
                  inputType="text"
                  v-model:editingValue="editingValue"
                />
              </td>
              <td
                class="p-0.5 border border-gray-300 w-20"
                @click="editGoalCell(goal.amount, 'amount', goal._id)"
              >
                <InlineEditing
                  :data="goal"
                  editingField="amount"
                  @save="handleUpdate"
                  @cancel="cancelEdit"
                  :isEditing="
                    editingId === goal._id && editingField === 'amount'
                  "
                  :editingId="goal._id"
                  inputType="text"
                  v-model:editingValue="editingValue"
                />
              </td>
              <td
                class="p-0.5 border border-gray-300 w-20"
                @click="editGoalCell(goal.date, 'date', goal._id)"
              >
                <InlineEditing
                  :data="goal"
                  editingField="date"
                  @save="handleUpdate"
                  @cancel="cancelEdit"
                  :isEditing="editingId === goal._id && editingField === 'date'"
                  :editingId="goal._id"
                  inputType="date"
                  v-model:editingValue="editingValue"
                />
              </td>
              <td
                class="w-20 p-2 font-bold border border-gray-300 cursor-pointer text-rose-600"
                @click="deleteGoal(goal._id)"
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
const editingId = ref<string | null>('');
const editingField = ref('');
const editingValue = ref<string | number | Date>('');

interface User {
  firstName: string;
  _id: string;
  userId: string;
}

interface Goal {
  amount: number;
  _id: string;
  date: Date;
  name: string;
}

const user = ref<User | null>(null);
let totalAmount = ref(0);
const formattedTotalAmount = ref('');
const isEditing = ref(false);

const goalList = ref<Goal[]>([]);

const editGoalCell = (
  value: string | number | Date,
  field: string,
  id: string,
) => {
  editingField.value = field;
  if (field === 'date') {
    editingValue.value = new Date(value).toISOString().split('T')[0];
  } else {
    editingValue.value = value.toString();
  }
  editingId.value = id;
  isEditing.value = true;
};

const handleUpdate = async (id: string) => {
  try {
    await api.patch(`/goals/${id}`, {
      [editingField.value]: editingValue.value,
    });

    editingId.value = null;
    await fetchGoalList();
  } catch (err) {
    // console.error(err);
  }
};

const cancelEdit = () => {
  editingId.value = null;
  editingValue.value = '';
};

const deleteGoal = async (id: string) => {
  try {
    await api.delete('/goal/' + id);
    fetchGoalList();
  } catch (err) {
    /**
     * todo Add toaster instead of having a console log
     */
    // console.error(err);
  }
};

const fetchGoalList = async () => {
  try {
    if (user.value && user.value.userId) {
      const response = await api.get(`/goals/${user.value.userId}`);
      goalList.value = response.data;
      totalAmount.value = 0;
      goalList.value.forEach((v) => (totalAmount.value += v.amount));
      formattedTotalAmount.value = new Intl.NumberFormat('en-US', {
        currency: 'USD',
        style: 'currency',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(totalAmount.value);
    }
  } catch (err) {
    // console.error('Error fetching data');
  }
};
onMounted(() => {
  const loggedInUser = localStorage.getItem('user');
  user.value = loggedInUser ? JSON.parse(loggedInUser) : null;
  fetchGoalList();
});

const addGoal = () => {
  router.push({ name: 'GoalForm' });
};
</script>
