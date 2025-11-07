<template>
  <div class="dashboard-container">
    <SidebarNav
      :collapsed="isCollapsed"
      :user="user"
      :icons="icons"
      :logoUrl="logoUrl"
      @toggle="toggleSidebar"
      @logout-click="showLogoutModal"
    />
    <div class="main-content-container">
      <main class="main-content">
        <h1>Your Wallet</h1>
        <div class="wallet-summary-container">
          <div class="wallet-summary">
            <div class="summary-item">
              <h2>Balance</h2>
              <p>{{ formatNumber(summary.balance) }}</p>
            </div>
            <div class="summary-item">
              <h2>Income</h2>
              <p>{{ formatNumber(summary.income) }}</p>
            </div>
            <div class="summary-item">
              <h2>Expenses</h2>
              <p>{{ formatNumber(summary.expense) }}</p>
            </div>
          </div>
        </div>
        <div class="monthly-report">
          <h2>Monthly Report</h2>
          <div class="chart">
            <GraficoDespesas :month="9" :year="2025" />
          </div>
        </div>
      </main>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to log out?</p>
        <div class="modal-actions">
          <button class="confirm-button" @click="logout">Yes</button>
          <button class="cancel-button" @click="hideLogoutModal">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api, { getAuthToken } from '@/services/apis';
import GraficoDespesas from '@/components/GraficoDespesas.vue';
import SidebarNav from '@/components/SideBar.vue';

export default {
  name: 'HomeDash',
   components: { GraficoDespesas, SidebarNav },
  data() {
    return {
      isCollapsed: false,
      showModal: false,
      logoUrl: require('@/assets/logoGYM.png'),
      icons: {
        wallet: 'https://img.icons8.com/?size=100&id=MZAxWHbLSIH0&format=png&color=FFFFFF',
        transactions: 'https://img.icons8.com/?size=100&id=oPnXdgLlrQom&format=png&color=FFFFFF',
        settings: 'https://img.icons8.com/m_rounded/512/FFFFFF/settings.png',
        help: 'https://img.icons8.com/?size=100&id=16140&format=png&color=FFFFFF',
        logout: 'https://img.icons8.com/?size=100&id=XkH3F3rY34H5&format=png&color=FFFFFF',
      },
      user: {
        name: '',
        username: '',
        id: null
      },
      summary: {
        balance: 0,
        income: 0,
        expense: 0
      }
    };
  },
mounted() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      this.$router.push('/');
      return;
    }
    this.fetchSummary();
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
    showLogoutModal() {
      this.showModal = true;
    },
    hideLogoutModal() {
      this.showModal = false;
    },
    logout() {
      localStorage.removeItem('jwt_token');
      this.showModal = false;
      this.$router.push('/');
    },

    async fetchSummary() {
          try {
            const token = getAuthToken() || localStorage.getItem('jwt_token');
            if (!token) {
              this.$router.push('/');
              return;
            }
            // Opcional: printa o token (masquei para debug)
            const masked = token.length > 12 ? token.slice(0,6) + '...' + token.slice(-6) : token;
            console.log('[DEBUG] Token em uso:', masked);

            // Header agora é injetado pelo interceptor
            const { data } = await api.get('/transacoes/resumo');
            this.summary.balance = data.balance || 0;
            this.summary.income = data.income || 0;
            this.summary.expense = data.expense || 0;
          } catch (err) {
            console.error('Erro ao carregar resumo:', err);
          }
        },

    formatNumber(value) {
      try {
        return Number(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } catch {
        return '0,00';
      }
    }
  }
};
</script>


<style scoped>


.menu-link {
  text-decoration: none;
  color: inherit; /* Mantém a cor do texto */
}


.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: 'Roboto', sans-serif;
}


.sidebar {
  width: 250px;
  background-color: #004322;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  transition: width 0.3s ease; /* Animação para retrair/expandir */
}


.sidebar.collapsed {
  width: 80px; /* Largura da sidebar quando colapsada */
}
.logo-image {
  max-width: 80%; /* Define a largura máxima como 80% da sidebar */
  height: auto; /* Mantém a proporção da altura */
  margin: 0 auto; /* Centraliza a logo horizontalmente */
  display: block; /* Garante que a logo seja tratada como um bloco */
}
.sidebar.collapsed .logo-image {
  max-width: 160%; /* Aumenta a largura da logo quando a sidebar está minimizada */
  margin-left:-8px;
  margin-bottom:20px;
  margin-top:35px
}


.logo {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  cursor: pointer; /* Adiciona cursor para indicar que é clicável */
}


.menu {
  flex-grow: 1;
}


.menu ul {
  list-style: none; /* Remove as bolinhas */
  padding: 0; /* Remove o padding padrão */
}


.menu-item {
  margin: 35px 0; /* Aumenta o espaçamento entre os links */
  font-size: 22px; /* Aumenta o tamanho dos links */
  margin-left: 20px;
  cursor: pointer;
}


.menu-item.active {
  font-weight: bold; /* Deixa o link ativo em bold */
}


.menu-icon {
  width: 30px;
  height: 30px;
  display: block; /* Garante que os ícones sejam tratados como blocos */


}


.user-info {
  display: flex;
  align-items: center;
  margin-top: 20px;
}


.user-avatar {
  width: 50px;
  height: 50px;
  background-color: #fff;
  border-radius: 50%;
  margin-right: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.sidebar.collapsed .user-avatar
{
 margin-left: 12px;
}


.user-name {
  font-size: 18px;
  font-weight: bold;
}


.main-content-container {
  flex-grow: 1;
  background-color: #e0e0e0; /* Fundo cinza envolvendo o conteúdo principal */
  padding: 20px;
}


.main-content {
  background-color: #f9f9f9; /* Fundo interno do conteúdo principal */
  padding: 40px;
  border-radius: 10px;
  height: 92%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}


h1 {
  font-size: 50px;
  font-weight: bold;
  margin-top: -10px;
  color: #004322;
}


.wallet-summary-container {
  margin-bottom: 30px;
}


.wallet-summary {
  display: flex;
  justify-content: space-between;
}


.summary-item {
  background-color: #004322;
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  height: 20vh;
  width: 25%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}


.summary-item:hover {
  transform: scale(1.05);
}


.summary-item h2 {
  margin-top: -1px;
  font-size: 30px;
}


.summary-item p {
  text-align: center; /* Alinha os valores ao centro */
  font-size: 50px;
  font-weight: bold;
}


.monthly-report {
  background-color: #004322;
  color: #fff;
  padding: 20px;
  height: 45vh;
  margin-top: 7vh;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}


.chart {
  height: 37vh;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}


.modal {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}


.modal-actions {
  margin-top: 20px;
}


.confirm-button {
  background-color: #004322;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  margin-right: 10px;
}


.confirm-button:hover {
  background-color: #002513;
}


.cancel-button {
  background-color: #ccc;
  color: #000;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}


.cancel-button:hover {
  background-color: #aaa;
}
</style>

