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
        <div class="users-header">
          <h1>Users</h1>
          <button class="new-user-btn" @click="goNewUser">
            New User
          </button>
        </div>
        <table class="users-table">
          <thead>
            <tr>
              <th class="user-name-header">Name</th>
              <th class="user-email-header">Email</th>
              <th class="user-actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.id">
              <td class="user-name-cell">{{ u.name }}</td>
              <td class="user-email-cell">{{ u.email }}</td>
              <td class="user-actions-cell">
                <button class="edit-button" @click="editUser(u.id)">Edit</button>
                <button class="delete-button" @click="deleteUser(u.id)">Delete</button>
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
      <p>Do you really want to sign out?</p>
      <div class="modal-actions">
        <button class="confirm-button" @click="logout">Yes</button>
        <button class="cancel-button" @click="hideLogoutModal">No</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/apis';
import SidebarNav from '@/components/SideBar.vue';

export default {
  name: 'UsersPage',
  components: { SidebarNav },
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
      user: { name: '', username: '', id: null },
      users: [],
      loading: false,
      loadError: ''
    };
  },
  methods: {
    toggleSidebar() { this.isCollapsed = !this.isCollapsed; },
    showLogoutModal() { this.showModal = true; },
    hideLogoutModal() { this.showModal = false; },
    logout() {
      // Remover o token para logout completo
      localStorage.removeItem('jwt_token'); 
      this.showModal = false;
      this.$router.push('/');
    },

    goNewUser() {
      this.$router.push('/users/new');
    },
    editUser(id) {
      this.$router.push({ name: 'users-edit', params: { id } });
    },

    async fetchUsers() {
      try {
        this.loading = true;
        this.loadError = '';
        const resp = await api.get('/usuarios');
        const list = Array.isArray(resp.data) ? resp.data : (resp.data && resp.data.content) || [];
        this.users = list.map(u => ({
          id: u.id,
          name: u.nome || u.name || '',
          email: u.email || ''
        }));
      } catch (err) {
        console.error('Failed to load users:', err);
        this.loadError =
          (err && err.response && (err.response.data && (err.response.data.message || err.response.data.error))) ||
          err.message ||
          'Failed to load';
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id) {
      try {
        const ok = window.confirm('Are you sure you want to delete this user?');
        if (!ok) return;
        await api.delete(`/usuarios/${id}`);
        this.users = this.users.filter(u => u.id !== id);
      } catch (err) {
        console.error('Failed to delete user:', err);
        alert((err && err.response && (err.response.data && (err.response.data.message || err.response.data.error))) || 'Failed to delete');
      }
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
/* Estilos gerais... */
.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.new-user-btn {
  background: #004322;
  color: #fff;
  border: 0;
  padding: 12px 22px;
  font-weight: 600;
  font-size: 20px;
  letter-spacing: .5px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0,0,0,.18);
  transition: background .18s, transform .18s, box-shadow .18s;
}
.new-user-btn:hover {
  background: #00582c;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px -4px rgba(0,0,0,.28);
}
.new-user-btn:active {
  transform: translateY(0);
  box-shadow: 0 3px 8px rgba(0,0,0,.18);
}

.menu-link { text-decoration: none; color: inherit; }

.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: 'Roboto', sans-serif;
}
.main-content-container {
  flex-grow: 1;
  background-color: #e0e0e0;
  padding: 20px;
}
.main-content {
  background-color: #f9f9f9;
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

/* Tabela de usuários */
.users-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.users-table th, .users-table td {
  border: 1px solid #ddd;
  padding: 16px;
  /* CORREÇÃO: Centraliza texto por padrão em todas as células */
  text-align: center; 
  font-size: 16px;
  font-weight: bold;
}
.users-table th {
  background-color: #004322;
  color: white;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.users-table td { background-color: #fff; }

/* Ajustes de Largura das Colunas */

/* Coluna de Email (TH e TD) - Maior */
.user-email-header,
.user-email-cell {
    width: 55%; 
    /* Sobrescreve para alinhar o texto do email à esquerda (mais natural) */
    text-align: left; 
}

/* Coluna de Ações (TH e TD) - Menor e à Direita */
.user-actions-header,
.user-actions-cell {
    width: 15%; 
    white-space: nowrap; 
    text-align: center; 
}

/* Coluna Name (TH e TD) */
.user-name-header,
.user-name-cell {
    /* Ocupa o restante (30%) */
    text-align: left; /* Alinha o nome à esquerda */
}


/* CORREÇÃO: Aumento do tamanho dos botões de ação */
.edit-button, .delete-button {
  background-color: #004322;
  color: white;
  border: none;
  border-radius: 8px; /* Levemente mais arredondado */
  padding: 10px 16px; /* Aumenta o padding */
  cursor: pointer;
  margin: 0 6px; /* Aumenta a margem entre eles */
  font-weight: bold;
  font-size: 14px; /* Aumenta o tamanho da fonte */
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.edit-button:hover {
  background-color: #00582c;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.delete-button { background-color: #dc3545; }
.delete-button:hover {
  background-color: #b30000;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
}
.modal {
  background-color: #fff;
  padding: 20px; border-radius: 10px; text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.modal-actions { margin-top: 20px; }
.confirm-button {
  background-color: #004322; color: #fff; border: none;
  border-radius: 5px; padding: 10px 20px; cursor: pointer; margin-right: 10px; font-weight: bold;
}
.confirm-button:hover { background-color: #00582c; }
.cancel-button {
  background-color: #ccc; color: #000; border: none;
  border-radius: 5px; padding: 10px 20px; cursor: pointer; font-weight: bold;
}
.cancel-button:hover { background-color: #aaa; }
</style>