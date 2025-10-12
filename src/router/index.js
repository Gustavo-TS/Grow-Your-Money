import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue'; // Caminho ajustado
import HomeDash from '@/components/HomeDash.vue'; // Componente do dashboard
import TransactionsPage from '@/views/TransactionsPage.vue'; // Caminho ajustado

const routes = [
  { path: '/', component: Login }, // Rota para o login
  { path: '/dashboard', component: HomeDash }, // Rota para o dashboard
  { path: '/transactions', component: TransactionsPage }, // Rota para a página de transações
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;