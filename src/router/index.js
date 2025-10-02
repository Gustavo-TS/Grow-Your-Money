import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue'; // Caminho relativo
import HomeDash from '@/components/HomeDash.vue'; // Componente do dashboard

const routes = [
  { path: '/', component: Login }, // Rota para o login
  { path: '/dashboard', component: HomeDash }, // Rota para o dashboard
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;