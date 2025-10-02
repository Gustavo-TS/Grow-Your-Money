import { createApp } from 'vue';
import App from './App.vue'; // Componente raiz que contém o <router-view />
import router from './router'; // Importa o Vue Router

createApp(App).use(router).mount('#app'); // Monta o Vue no elemento com ID "app"