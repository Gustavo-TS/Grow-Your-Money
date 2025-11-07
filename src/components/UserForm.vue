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
      <div class="form-card-wrapper">
        <div class="form-card">
          <form class="tx-form" @submit.prevent="submit">
            <h2 class="title">{{ isEdit ? 'Edit User' : 'New User' }}</h2>

            <div class="row two-cols">
              <div class="col">
                <div class="float-group" :class="fgClass(form.name, focus.name)">
                  <input
                    type="text"
                    v-model.trim="form.name"
                    maxlength="120"
                    @focus="focus.name = true"
                    @blur="focus.name = false"
                    required
                  />
                  <label>Name</label>
                </div>
              </div>
              <div class="col">
                <div class="float-group" :class="fgClass(form.email, focus.email)">
                  <input
                    type="email"
                    v-model.trim="form.email"
                    @focus="focus.email = true"
                    @blur="focus.email = false"
                    required
                  />
                  <label>Email</label>
                </div>
              </div>
            </div>

            <div class="row" v-if="!isEdit">
              <div class="float-group" :class="fgClass(form.password, focus.password)">
                <input
                  type="password"
                  v-model="form.password"
                  minlength="6"
                  @focus="focus.password = true"
                  @blur="focus.password = false"
                  required
                />
                <label>Password</label>
              </div>
            </div>
            <div class="actions">
              <button type="submit" class="save" :disabled="loading">
                {{ isEdit ? 'Save' : 'Create' }}
              </button>
              <button type="button" class="cancel" @click="onCancel">Cancel</button>
            </div>
          </form>
        </div>
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
  </div>
</template>

<script>
import api from '@/services/apis';
import SidebarNav from '@/components/SideBar.vue';

export default {
  name: 'UserForm',
  components: { SidebarNav },
  props: { id: { type: [String, Number], default: null } },
  data() {
    return {
      // layout/sidebar
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

      // form
      loading: false,
      form: {
        name: '',
        email: '',
        password: '' // only used on create
      },
      focus: { name: false, email: false, password: false }
    };
  },
  computed: {
    isEdit() { return !!this.id; }
  },
  watch: {
    // 1. CORREÇÃO ESSENCIAL: Observa a prop 'id'
    id: {
      immediate: true, // Garante que seja chamado na montagem se o id existir
      handler(newId) {
        if (newId) {
          this.load(newId);
        } else {
          // Limpa o formulário se estiver no modo "New User"
          this.form = { name: '', email: '', password: '' };
        }
      }
    }
  },
  methods: {
    fgClass(value, isFocus) {
      const hasVal = value !== null && value !== undefined && value !== '';
      return { 'has-value': hasVal, 'is-focus': isFocus };
    },

    onCancel() {
      this.$router.push('/users'); // Navega para a lista de usuários
    },

    // sidebar (mantido)
    toggleSidebar() { this.isCollapsed = !this.isCollapsed; },
    showLogoutModal() { this.showModal = true; },
    hideLogoutModal() { this.showModal = false; },
    logout() {
      localStorage.removeItem('jwt_token');
      this.showModal = false;
      this.$router.push('/');
    },

    // 2. Método load() melhorado
    async load(id) {
      if (!id) return;
      try {
        this.loading = true;
        
        // Limpa o formulário antes de carregar novos dados
        this.form = { name: '', email: '', password: '' };
        
        const { data } = await api.get(`/usuarios/${id}`);
        
        const name = (data && data.nome) || (data && data.name) || '';

        this.form.name = name;
        this.form.email = (data && data.email) || '';
        // Não carrega a senha no formulário de edição
      } catch (e) {
        console.error('Failed to load user:', e);
        alert('Failed to load user.');
        this.onCancel(); // Retorna à lista em caso de erro
      } finally {
        this.loading = false;
      }
    },

    async submit() {
      try {
        this.loading = true;

        if (!this.form.email) {
          alert('Email is required.');
          this.loading = false;
          return;
        }
        if (!this.isEdit && !this.form.password) {
          alert('Password is required.');
          this.loading = false;
          return;
        }

        if (this.isEdit) {
          // Edição (PUT)
          const payload = {
            email: this.form.email,
            nome: this.form.name
          };
          await api.put(`/usuarios/${this.id}`, payload);
        } else {
          // Criação (POST)
          const payload = {
            email: this.form.email,
            senha: this.form.password,
            nome: this.form.name
          };
          await api.post('/usuarios', payload);
        }

        // 3. CORREÇÃO: Navega para a lista de usuários após sucesso
        this.$router.push('/users'); 
      } catch (e) {
        console.error('Failed to save user:', e);
        const msg =
          (e && e.response && (e.response.data && (e.response.data.message || e.response.data.error))) ||
          'Failed to save';
        alert(msg);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Layout */
.dashboard-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
}
.main-content-container {
  flex: 1;
  background: #e0e0e0;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Card */
.form-card-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: #f1f5f9;
  padding: 0;
  border-radius: 16px;
  box-shadow: 0 8px 24px -8px rgba(0,0,0,.25);
}
.form-card {
  background: linear-gradient(135deg, #004322 0%, #006b3d 100%);
  padding: 32px 36px 28px;
  border-radius: 16px;
  color: #ffffff;
}
.title {
  margin: 0 0 20px;
  font-size: 1.9rem;
  font-weight: 900;
  letter-spacing: .5px;
}

/* Form */
.tx-form { display: grid; gap: 28px; width: 100%; }
.row { display: grid; gap: 8px; width: 100%; }
.row.two-cols {
  grid-template-columns: 1fr 1fr;
  /* AJUSTE 1: Aumentamos o gap horizontal entre os campos */
  gap: 55px; 
  width: 98%;
}

/* Floating group */
.float-group { position: relative; width: 96%; }
.float-group select,
.float-group input {
  width: 100%;
  padding: 14px 14px 8px 14px;
  background: #ffffff;
  border: 2px solid #ffffff;
  border-radius: 10px;
  font-size: .95rem;
  font-weight: 500;
  line-height: 1.2;
  transition: border .18s, box-shadow .18s, background .18s;
  box-shadow: 0 2px 4px rgba(0,0,0,.08);
  appearance: none;
  color: #0f172a;
}
.float-group select:focus,
.float-group input:focus {
  outline: none;
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.35);
  background: #f8fffb;
}
.float-group label {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  font-size: .80rem;
  font-weight: 700;
  letter-spacing: .7px;
  color: #0f5132;
  pointer-events: none;
  transition: all .18s ease;
  text-transform: uppercase;
  padding: 0 4px;
  background: transparent;
  border-radius: 4px;
}
.float-group.has-value label,
.float-group.is-focus label,
.float-group select:focus + label,
.float-group input:focus + label {
  font-size: .58rem;
  top: 6px;
  transform: translateY(0);
  color: #22c55e;
  background: #ffffff;
}

/* Actions */
.actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 4px;
}
.save, .cancel {
  cursor: pointer;
  font-weight: 700;
  letter-spacing: .5px;
  border-radius: 10px;
  padding: 12px 22px;
  font-size: .85rem;
  border: 0;
  transition: background .18s, transform .18s, box-shadow .18s;
}
.save {
  background: #ffffff;
  color: #052e16;
  box-shadow: 0 3px 6px rgba(0,0,0,.25);
}
.save:hover:not(:disabled) { background: #16a34a; color:#fff; transform: translateY(-2px); }
.save:disabled { background: #86efac; cursor: not-allowed; transform: none; box-shadow: none; color:#064e1c; }
.cancel {
  background: #f1f5f9;
  color: #0f172a;
  box-shadow: 0 3px 6px rgba(0,0,0,.18);
}
.cancel:hover { background: #fc4a4a; color:#fff; transform: translateY(-2px); }

/* Modal (mantido) */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display:flex; justify-content:center; align-items:center;
}
.modal {
  background:#fff; padding:20px; border-radius:10px; text-align:center;
  box-shadow:0 4px 10px rgba(0,0,0,0.2);
}
.modal-actions { margin-top: 14px; display:flex; gap:10px; justify-content:center; }
.confirm-button, .cancel-button {
  border:none; border-radius:8px; padding:10px 16px; cursor:pointer; font-weight:700;
}
.confirm-button { background:#004322; color:#fff; }
.confirm-button:hover { background:#002513; }
.cancel-button { background:#ccc; color:#000; }
.cancel-button:hover { background:#aaa; }

/* Responsive (mantido) */
@media (max-width: 900px) {
  .form-card { padding: 28px 28px 24px; }
  .row.two-cols { gap: 18px; grid-template-columns: 1fr; }
}
</style>