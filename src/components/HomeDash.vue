<template>
  <div class="dashboard-container">
    <aside :class="['sidebar', { 'collapsed': isCollapsed }]">
      <div class="logo" @click="toggleSidebar">
        <img :src="logoUrl" class="logo-image" />
      </div>
      
      <nav class="menu">
        <ul>
          <li class="menu-item active">
            <router-link to="/dashboard" class="menu-link">
              <span v-if="!isCollapsed">Your Wallet</span>
              <span v-else>
                <img :src="icons.wallet" alt="Wallet Icon" class="menu-icon" />
              </span>
            </router-link>
          </li>
          <li class="menu-item">
            <router-link to="/transactions" class="menu-link">
              <span v-if="!isCollapsed">Transactions</span>
              <span v-else>
                <img :src="icons.transactions" alt="Transactions Icon" class="menu-icon" />
              </span>
            </router-link>
          </li>
          <li class="menu-item">
            <router-link to="/settings" class="menu-link">
              <span v-if="!isCollapsed">Settings</span>
              <span v-else>
                <img :src="icons.settings" alt="Settings Icon" class="menu-icon" />
              </span>
            </router-link>
          </li>
          <li class="menu-item">
            <router-link to="/help" class="menu-link">
              <span v-if="!isCollapsed">Help / Support</span>
              <span v-else>
                <img :src="icons.help" alt="Help Icon" class="menu-icon" />
              </span>
            </router-link>
          </li>
          <li class="menu-item" @click="showLogoutModal">
            <span v-if="!isCollapsed">Log Out</span>
            <span v-else>
              <img :src="icons.logout" class="menu-icon" />
            </span>
          </li>
        </ul>
      </nav>
      <div class="user-info">
        <div class="user-avatar"></div>
        <div class="user-name" v-if="!isCollapsed">Washington</div>
      </div>
    </aside>
    <div class="main-content-container">
      <main class="main-content">
        <h1>Your Wallet</h1>
        <div class="wallet-summary-container">
          <div class="wallet-summary">
            <div class="summary-item">
              <h2>Balance</h2>
              <p>200,00</p>
            </div>
            <div class="summary-item">
              <h2>Income</h2>
              <p>3000,00</p>
            </div>
            <div class="summary-item">
              <h2>Expenses</h2>
              <p>2800,00</p>
            </div>
          </div>
        </div>
        <div class="monthly-report">
          <h2>Monthly Report</h2>
          <div class="chart">
            <!-- Aqui você pode integrar uma biblioteca de gráficos como Chart.js -->
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
export default {
  name: 'HomeDash',
  data() {
    return {
      isCollapsed: false, // Controla o estado da sidebar
      showModal: false, // Controla a exibição do modal
      logoUrl: require('@/assets/logoGYM.png'), // Referência ao logo na pasta assets
      icons: {
        wallet: 'https://img.icons8.com/?size=100&id=MZAxWHbLSIH0&format=png&color=FFFFFF', // URL do ícone de Wallet
        transactions: 'https://img.icons8.com/?size=100&id=oPnXdgLlrQom&format=png&color=FFFFFF', // URL do ícone de Transactions
        settings: 'https://img.icons8.com/m_rounded/512/FFFFFF/settings.png', // URL do ícone de Settings
        help: 'https://img.icons8.com/?size=100&id=16140&format=png&color=FFFFFF', // URL do ícone de Help 
        logout: 'https://img.icons8.com/?size=100&id=XkH3F3rY34H5&format=png&color=FFFFFF', // URL do ícone de Logout
      },
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed; // Alterna entre expandido e colapsado
    },
    showLogoutModal() {
      this.showModal = true; // Exibe o modal
    },
    hideLogoutModal() {
      this.showModal = false; // Oculta o modal
    },
    logout() {
      this.showModal = false; // Oculta o modal
      this.$router.push('/'); // Redireciona para a tela padrão (login)
    },
  },
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
  height: 90%;
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
  height: 40vh;
  margin-top: 7vh;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.chart {
  height: 31vh;
  background-color: #002b15;
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