<template>
  <div class="dashboard-container">
    <aside :class="['sidebar', { 'collapsed': isCollapsed }]">
      <div class="logo" @click="toggleSidebar">
        <img :src="logoUrl" class="logo-image" />
      </div>
      
      <nav class="menu">
        <ul>
          <li class="menu-item">
            <router-link to="/dashboard" class="menu-link">
              <span v-if="!isCollapsed">Your Wallet</span>
              <span v-else>
                <img :src="icons.wallet" alt="Wallet Icon" class="menu-icon" />
              </span>
            </router-link>
          </li>
          <li class="menu-item active">
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
        <div class="transactions-header">
          <h1>Transactions</h1> 
          <div class="filter-container">
            <div class="filter-group">
              <select 
                id="month-select" 
                v-model="selectedMonth" 
                class="filter-select"
                :class="{ 'has-value': selectedMonth }"
                @focus="onFocus"
                @blur="onBlur"
              >
                <option value="" disabled selected hidden></option>
                <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
              </select>
              <label for="month-select" class="filter-label" :class="{ 'active': selectedMonth || monthFocused }">Month</label>
            </div>
            <div class="filter-group">
              <select 
                id="year-select" 
                v-model="selectedYear" 
                class="filter-select"
                :class="{ 'has-value': selectedYear }"
                @focus="onFocus"
                @blur="onBlur"
              >
                <option value="" disabled selected hidden></option>
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
              <label for="year-select" class="filter-label" :class="{ 'active': selectedYear || yearFocused }">Year</label>
            </div>
            <button @click="filterTransactions" class="filter-button">Filter</button>
          </div>
        </div>
        <table class="transactions-table">
          <thead>
            <tr>
              <th>Transaction Type</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Payment Method</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactions" :key="transaction.id">
              <td :class="{'transaction-type-income': transaction.type === 'Income', 'transaction-type-expense': transaction.type === 'Expense'}">{{ transaction.type }}</td>
              <td :class="{'transaction-amount income': transaction.type === 'Income', 'transaction-amount expense': transaction.type === 'Expense'}">{{ transaction.amount }}</td>
              <td class="transaction-reason">{{ transaction.reason }}</td>
              <td class="transaction-method">{{ transaction.paymentMethod }}</td>
              <td class="transaction-date">{{ transaction.date }}</td>
              <td>
                <button class="edit-button" @click="editTransaction(transaction.id)">Edit</button>
                <button class="delete-button" @click="deleteTransaction(transaction.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
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
</template>


<script>
export default {
  name: "TransactionsPage",
  data() {
    return {
      isCollapsed: false, // Controla o estado da sidebar
      showModal: false, // Controla a exibição do modal
      logoUrl: require('@/assets/logoGYM.png'), // Referência ao logo na pasta assets
      icons: {
        wallet: 'https://img.icons8.com/?size=100&id=MZAxWHbLSIH0&format=png&color=FFFFFF',
        transactions: 'https://img.icons8.com/?size=100&id=oPnXdgLlrQom&format=png&color=FFFFFF',
        settings: 'https://img.icons8.com/m_rounded/512/FFFFFF/settings.png',
        help: 'https://img.icons8.com/?size=100&id=16140&format=png&color=FFFFFF',
        logout: 'https://img.icons8.com/?size=100&id=XkH3F3rY34H5&format=png&color=FFFFFF',
      },
      transactions: [
        {
          id: 1,
          type: "Expense",
          amount: "R$ 150,00",
          reason: "Leisure",
          paymentMethod: "Credit Card",
          date: "2025-06-16",
        },
        {
          id: 2,
          type: "Income",
          amount: "R$ 1050,00",
          reason: "Work",
          paymentMethod: "Bank Transfer",
          date: "2025-06-05",
        },
      ],       filteredTransactions: [],
      selectedMonth: "",
      selectedYear: "",
      monthFocused: false,
      yearFocused: false,
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      years: ["2024", "2025", "2026"],
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed; // Alterna entre expandido e colapsado
    },
    editTransaction(id) {
      alert(`Edit transaction with ID: ${id}`);
      // Implementar lógica de edição
    },
    deleteTransaction(id) {
      alert(`Delete transaction with ID: ${id}`);
      // Implementar lógica de exclusão
    },
    showLogoutModal() {
      this.showModal = true; // Exibe o modal
    },
    hideLogoutModal() {
      this.showModal = false; // Oculta o modal
    },    logout() {
       this.showModal = false; // Oculta o modal
      this.$router.push('/'); // Redireciona para a tela padrão (login)
    },
    onFocus(event) {
      if (event.target.id === 'month-select') {
        this.monthFocused = true;
      } else if (event.target.id === 'year-select') {
        this.yearFocused = true;
      }
    },
    onBlur(event) {
      if (event.target.id === 'month-select') {
        this.monthFocused = false;
      } else if (event.target.id === 'year-select') {
        this.yearFocused = false;
      }
    },
       filterTransactions() {
      this.filteredTransactions = this.transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const transactionMonth = transactionDate.toLocaleString("default", { month: "long" });
        const transactionYear = transactionDate.getFullYear().toString();
        return transactionMonth === this.selectedMonth && transactionYear === this.selectedYear;
      });
    },
  },
    mounted() {
    this.filteredTransactions = this.transactions;
  },
};
</script>

<style scoped>

.transactions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
}

.filter-group {
  position: relative;
  display: flex;
  flex-direction: column;
}

.filter-label {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  font-size: 16px;
  color: #004322;
  font-weight: bold;
  pointer-events: none;
  transition: all 0.3s ease;
  background-color: transparent;
  z-index: 1;
}

.filter-select {
  padding: 18px 30px 12px 0;
  border: none;
  border-bottom: 2px solid #004322;
  border-radius: 0;
  font-size: 15px;
  font-weight: bold;
  width: 150px;
  height: 50px;
  background-color: transparent;
  color: #004322;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
}

.filter-select option[value=""] {
  display: none;
}

.filter-select:focus {
  outline: none;
  border-color: #004322;
}

.filter-select:hover {
  border-color: #888;
}

.filter-label.active {
  top: -17px;
  font-weight: bold;
  font-size: 16px;
  color: #004322;
  transform: translateY(0);
}

.filter-group::after {
  content: '▼';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none;
  font-size: 10px;
  transition: all 0.3s ease;
}

.filter-select:focus + .filter-label + ::after,
.filter-select:hover + .filter-label + ::after {
  color: #004322;
}

.filter-button {
  background-color: #004322;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  height: 48px;
}

.filter-button:hover {
  background-color: #002513;
  transform: translateY(-1px);
}

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
  padding: 25px 40px 40px 40px;
  border-radius: 10px;
  height: 90%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

h1 {
  font-size: 50px;
  font-weight: bold;
  color: #004322;
  margin-top: 15px;
  margin-bottom: 20px;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.transactions-table th, .transactions-table td {
  border: 1px solid #ddd;
  padding: 16px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.transactions-table th {
  background-color: #004322;
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  position: relative;
}
.transactions-table td {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}
.transactions-table tr:hover td {
  background-color: #f5f5f5;
  transition: background-color 0.2s ease;
}
.transactions-table tr:last-child td {
  border-bottom: none;
}
.edit-button, .delete-button {
  background-color: #004322;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  margin: 0 4px;
  font-weight: bold;
  font-size: 13px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.edit-button:hover {
  background-color: #002b15;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.delete-button {
  background-color: #dc3545;
}
.delete-button:hover {
  background-color: #b30000;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
  font-weight: bold;
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
  font-weight: bold;
}

.cancel-button:hover {
  background-color: #aaa;
}

/* Estilos especiais para tipos de transação */
.transaction-type-income {
  color: #28a745;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.transaction-type-expense {
  color: #dc3545;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.transaction-amount {
  font-weight: bold;
  font-size: 18px;
  font-family: 'Courier New', monospace;
}

.transaction-amount.income {
  color: #28a745;
}

.transaction-amount.expense {
  color: #dc3545;
}

.transaction-date {
  color: #000;
  font-size: 16px;
  font-weight: bold;
}

.transaction-method {
  color: #000;
  font-size: 16px;
  font-weight: bold;
}

.transaction-reason {
  color: #000;
  font-size: 16px;
  font-weight: bold;
}
</style>