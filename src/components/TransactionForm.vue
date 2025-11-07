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
            <h2 class="title">{{ isEdit ? 'Editar Transação' : 'Nova Transação' }}</h2>

            <div class="row">
              <div class="float-group"
                  :class="fgClass(form.categoriaId, focus.categoria)">
                <select
                  v-model="form.categoriaId"
                  @change="syncTipoFromCategoria"
                  :disabled="catsLoading"
                  @focus="focus.categoria = true"
                  @blur="focus.categoria = false"
                  required
                >
                  <option value="" disabled></option>
                  <option v-for="c in categories" :key="c.id" :value="String(c.id)">
                    {{ c.descricao }}
                  </option>
                </select>
                <label>Categoria</label>
              </div>
              <small v-if="catsLoading">Carregando categorias...</small>
              <small v-else-if="catsError" class="error">{{ catsError }}</small>
            </div>

            <div class="row two-cols">
              <div class="col col-valor">
                <div class="float-group"
                      :class="fgClass(form.valor, focus.valor)">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    inputmode="decimal"
                    v-model.number="form.valor"
                    @focus="focus.valor = true"
                    @blur="focus.valor = false"
                    required
                  />
                  <label>Valor</label>
                </div>
              </div>
              <div class="col col-date">
                <div class="float-group"
                      :class="fgClass(form.data, focus.data)">
                  <input
                    type="date"
                    v-model="form.data"
                    @focus="focus.data = true"
                    @blur="focus.data = false"
                    required
                  />
                  <label>Data</label>
                </div>
              </div>
            </div>

            <div class="row row-desc">
              <div class="float-group"
                  :class="fgClass(form.descricao, focus.descricao)">
                <input
                  type="text"
                  v-model="form.descricao"
                  maxlength="120"
                  @focus="focus.descricao = true"
                  @blur="focus.descricao = false"
                />
                <label>Descrição</label>
              </div>
            </div>
            
            <div class="actions">
              <button type="submit" class="save" :disabled="loading || catsLoading">
                {{ isEdit ? 'Salvar' : 'Criar' }}
              </button>
              <button type="button" class="cancel" @click="$emit('cancel')">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Confirmar Logout</h2>
        <p>Deseja sair da sua conta?</p>
        <div class="modal-actions">
          <button class="confirm-button" @click="logout">Sim</button>
          <button class="cancel-button" @click="hideLogoutModal">Não</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/apis';
import SidebarNav from '@/components/SideBar.vue';

export default {
  name: 'TransactionForm',
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
      catsLoading: false,
      catsError: '',
      categories: [],
      form: {
        tipo: 'gasto',
        valor: '',
        descricao: '',
        data: '',          // 'YYYY-MM-DD'
        categoriaId: ''    // string no select; converter para número no submit
      },
        focus: { categoria: false, valor: false, data: false, descricao: false } // controle floating
    };
  },
  computed: {
    isEdit() { return !!this.id; },
    selectedCategory() {
      const idNum = Number(this.form.categoriaId);
      return this.categories.find(c => c.id === idNum) || null;
    }
  },
  watch: {
    'form.categoriaId'() {
      this.syncTipoFromCategoria();
    }
  },
  async mounted() {
    await this.fetchCategories();
    if (this.isEdit) await this.load();
  },
  methods: {
      fgClass(value, isFocus) {
      const hasVal = value !== null && value !== undefined && value !== '';
      return { 'has-value': hasVal, 'is-focus': isFocus }; },
    // sidebar
    toggleSidebar() { this.isCollapsed = !this.isCollapsed; },
    showLogoutModal() { this.showModal = true; },
    hideLogoutModal() { this.showModal = false; },
    logout() {
      localStorage.removeItem('jwt_token');
      this.showModal = false;
      this.$router.push('/');
    },

    // form
    displayTipo(t) {
      const s = String(t || '').toLowerCase();
      if (s.includes('ganho') || s.includes('income')) return 'Ganho';
      if (s.includes('gastos') || s.includes('despesa') || s.includes('expense')) return 'Gasto';
      return '—';
    },
    async fetchCategories() {
      try {
        this.catsLoading = true;
        this.catsError = '';
        const { data } = await api.get('/categorias');
        const list = Array.isArray(data) ? data : (data && data.content) || [];
        this.categories = list
          .map(c => ({
            id: Number(c.id),
            descricao: c.descricao || c.nome || `Categoria ${c.id}`,
            tipo: c.tipo || ''
          }))
          .sort((a, b) => a.descricao.localeCompare(b.descricao));
      } catch (e) {
        console.error('Falha ao carregar categorias:', e);
        this.catsError = 'Não foi possível carregar as categorias.';
      } finally {
        this.catsLoading = false;
      }
    },
    syncTipoFromCategoria() {
      const cat = this.selectedCategory;
      if (cat && cat.tipo) {
        const t = String(cat.tipo).toLowerCase();
        this.form.tipo = (t.includes('ganho') || t.includes('income')) ? 'ganho' : 'gasto';
      }
    },
    async load() {
      try {
        this.loading = true;
        const idNum = Number(this.id);
        const { data } = await api.get('/transacoes');
        const list = Array.isArray(data) ? data : (data && data.content) || [];
        const tx = list.find(t => Number(t.id) === idNum);

        if (!tx) {
          alert('Transação não encontrada.');
          return;
        }

        const valor = (typeof tx.valor !== 'undefined') ? tx.valor : tx.amount;
        const dataRaw = tx.data || tx.date || '';
        // pega só YYYY-MM-DD independente de timezone
        let dateStr = '';
        if (typeof dataRaw === 'string') {
          if (dataRaw.includes('T')) dateStr = dataRaw.split('T')[0];
          else dateStr = dataRaw.slice(0, 10);
        } else if (dataRaw instanceof Date) {
          const yyyy = dataRaw.getFullYear();
          const mm = String(dataRaw.getMonth() + 1).padStart(2, '0');
          const dd = String(dataRaw.getDate()).padStart(2, '0');
          dateStr = `${yyyy}-${mm}-${dd}`;
        }

        const catId = tx.categoria && tx.categoria.id ? tx.categoria.id : '';

        this.form.valor = Number(valor) || '';
        this.form.descricao = tx.descricao || tx.motivo || tx.reason || '';
        this.form.data = dateStr;
        this.form.categoriaId = catId ? String(catId) : '';

        this.syncTipoFromCategoria();
      } catch (e) {
        console.error('Falha ao carregar transação:', e);
        alert('Falha ao carregar transação.');
      } finally {
        this.loading = false;
      }
    },
    async submit() {
      try {
        this.loading = true;
        const categoriaIdNum = this.form.categoriaId ? Number(this.form.categoriaId) : null;
        if (!categoriaIdNum) {
          alert('Selecione uma categoria.');
          this.loading = false;
          return;
        }

        const payload = {
          valor: Number(this.form.valor) || '',
          descricao: this.form.descricao || '',
          data: this.form.data,
          categoria: { id: categoriaIdNum }
        };

        if (this.isEdit) {
          await api.put(`/transacoes/${this.id}`, payload);
        } else {
          await api.post('/transacoes', payload);
        }
        this.$emit('saved');
      } catch (e) {
        console.error('Falha ao salvar transação:', e);
        const msg = (e && e.response && (e.response.data && (e.response.data.message || e.response.data.error))) || 'Falha ao salvar';
        alert(msg);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>


<style scoped>
/* ----- Layout com sidebar ----- */
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
  justify-content: center;    /* centro horizontal */
  align-items: center;        /* centro vertical */
}

/* ----- Cartão ----- */
.form-card-wrapper {
  width: 100%;
  max-width: 1200px;            /* limite de largura do retângulo verde */
  margin: 0 auto;
  background: #f1f5f9;
  padding: 0;                   /* tiramos padding aqui; fica no .form-card */
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

/* ----- Formulário ----- */
.tx-form {
  display: grid;
  gap: 28px;
  width: 100%;
}
.row { display: grid; gap: 8px; width: 100%; }

/* Valor & Data: cada um 50% (1fr 1fr) */
.row.two-cols {
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  width: 97%; 
}

.row.two-cols .col,
.row.two-cols .col .float-group { width: 100%; }


/* Descrição ocupa 100% */
.row-desc .float-group { width: 97%; }

/* Floating groups - PADRONIZADO */
.float-group {
  position: relative;
  width: 100%;
}
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

/* CORREÇÕES PARA CAMPO DE DATA: Garante alinhamento esquerdo e oculta placeholder quando vazio/sem foco */
.col-date .float-group input[type="date"] {
  padding-right: 14px; /* Garante padding normal */
  text-align: left;    /* Alinhamento padrão */
}

/* Oculta o texto nativo da data (o "dd/mm/aaaa") quando não há valor/foco */
.col-date .float-group:not(.has-value):not(.is-focus) input[type="date"]::-webkit-datetime-edit {
  color: transparent;
}
/* Garante que o texto volte a ser visível quando em foco ou com valor */
.col-date .float-group.is-focus input[type="date"]::-webkit-datetime-edit,
.col-date .float-group.has-value input[type="date"]::-webkit-datetime-edit {
  color: #0f172a;
}


/* Mensagens de erro */
small.error { color: #ffffffb5; font-size: .70rem; }
.row small.error { margin-top: 2px; display: block; }

/* Ações */
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
.save:disabled {
  background: #86efac;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  color:#064e1c;
}
.cancel {
  background: #f1f5f9;
  color: #0f172a;
  box-shadow: 0 3px 6px rgba(0,0,0,.18);
}
.cancel:hover { background: #fc4a4a; color:#fff; transform: translateY(-2px); }

/* Modal logout */
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

/* Responsivo */
@media (max-width: 900px) {
  .form-card { padding: 28px 28px 24px; }
  .row.two-cols { gap: 18px; }
}
@media (max-width: 640px) {
  .main-content-container { align-items: flex-start; }
  .row.two-cols { grid-template-columns: 1fr; }
  .row-desc .float-group { width: 100%; }
}
</style>