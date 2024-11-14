import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import AuthPage from '../views/AuthPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import IncomeList from '@/components/income/IncomeList.vue';
import ExpenseList from '@/components/expenses/ExpenseList.vue';
import GoalList from '@/components/goals/GoalList.vue';
import IncomeForm from '@/components/income/IncomeForm.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: AuthPage,
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
    path: '/add/income',
    name: 'IncomeForm',
    component: IncomeForm,
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: ExpenseList,
  },
  {
    path: '/dashboard',
    name: 'DashboardPage',
    component: DashboardPage,
    meta: { requiresAuth: true }, // Mark as protected route
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if the user is authenticated
  console.log(
    isAuthenticated,
    to.meta.requiresGuest,
    to.meta.requiresAuth,
    to,
    from,
    to.matched.some((record) => record.meta.requiresAuth),
  );
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    console.log('auth');
    next('/login');
  } else if (to.name === 'Login' && isAuthenticated) {
    next('/dashboard');
  } else {
    console.log('redirects');
    next();
  }
});

export default router;
