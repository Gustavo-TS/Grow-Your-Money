<template>
  <div class="dashboard-container">
    <aside class="sidebar">
      <div class="logo">Grow Your Money</div>
      <nav class="menu">
        <ul>
          <li class="menu-item active">Your Wallet</li>
          <li class="menu-item">Transactions</li>
          <li class="menu-item">Settings</li>
          <li class="menu-item">Help / Support</li>
        </ul>
      </nav>
      <div class="user-info">
        <div class="user-avatar"></div>
        <div class="user-name">Washington</div>
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
  </div>
</template>

<script>
export default {
  name: 'HomeDash',
};
</script>

<style scoped>
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
}

.logo {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.menu {
  flex-grow: 1;
}

.menu-item {
  margin: 10px 0;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.menu-item:hover {
  color: #a8ffb1;
}

.menu-item.active {
  text-decoration: underline;
  font-weight: bold;
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
  height:90%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

h1 {
  font-size: 50px;
  font-weight: bold;
  margin-top: -10px;
  color: #000000;
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
  text-align: left;
  height: 20vh;
  width: 25%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.summary-item:hover {
  transform: scale(1.05);
}

.summary-item h2 {
  font-size: 22px;
  margin-bottom: 10px;
}

.summary-item p {
  font-size: 28px;
  font-weight: bold;
}

.monthly-report {
  background-color: #004322;
  color: #fff;
  padding: 20px;
  height: 40vh ;
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
</style>