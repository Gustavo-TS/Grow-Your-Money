import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue'; // Caminho ajustado
import HomeDash from '@/components/HomeDash.vue'; // Componente do dashboard
import TransactionsPage from '@/views/TransactionsPage.vue'; // Caminho ajustado
import TransactionUpsertPage from '@/views/TransactionUpsertPage.vue';
import UsersPage from '@/views/UsersPage.vue';
import UserForm from '@/components/UserForm.vue';


const routes = [
  { path: '/', component: Login }, // Rota para o login
  { path: '/dashboard', component: HomeDash }, // Rota para o dashboard
  { path: '/transactions', component: TransactionsPage }, // Rota para a página de transações
  { path: '/transactions/new', name: 'transactions-new', component: TransactionUpsertPage },
  { path: '/transactions/:id/edit', name: 'transactions-edit', component: TransactionUpsertPage, props: true },
  { path: '/users', component: UsersPage },
  { path: '/users/new', name: 'users-new', component: UserForm },
  { path: '/users/:id/edit', name: 'users-edit', component: UserForm , props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;