import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import AuthPage from '../views/AuthPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import IncomeList from '../components/income/IncomeList.vue';
import ExpenseList from '@/components/expenses/ExpenseList.vue';
import GoalList from '@/components/goals/GoalList.vue';
import IncomeForm from '../components/income/IncomeForm.vue';
import ExpenseForm from '@/components/expenses/ExpenseForm.vue';
import GoalsForm from '@/components/goals/GoalsForm.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: AuthPage,
  },

  {
    path: '/edit/goal/:id',
    name: 'GoalEdit',
    component: GoalsForm,
  },
  {
    path: '/goals',
    name: 'GoalList',
    component: GoalList,
  },
  {
    path: '/income',
    name: 'IncomeList',
    component: IncomeList,
  },
  {
    path: '/edit/income/:id',
    name: 'IncomeEdit',
    component: IncomeForm,
  },
  {
    path: '/add/goal',
    name: 'GoalForm',
    component: GoalsForm,
  },
  {
    path: '/add/income',
    name: 'IncomeForm',
    component: IncomeForm,
  },
  {
    path: '/edit/expense/:id',
    name: 'ExpenseEdit',
    component: ExpenseForm,
  },
  {
    path: '/add/expense',
    name: 'ExpenseForm',
    component: ExpenseForm,
  },
  {
    path: '/expenses',
    name: 'ExpenseList',
    component: ExpenseList,
  },
  {
    path: '/',
    name: 'Home',
    component: DashboardPage,
  },
  {
    path: '/dashboard',
    name: 'DashboardPage',
    component: DashboardPage,
    meta: { requiresAuth: true }, // Mark as protected route
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  /**
   * todo replace user with token later on.
   */
  // const isAuthenticated = !!localStorage.getItem('token'); // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem('user'); // Check if the user is authenticated
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next('/login');
  } else if (
    (to.name === 'Login' && isAuthenticated) ||
    (to.path == '/' && isAuthenticated)
  ) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
