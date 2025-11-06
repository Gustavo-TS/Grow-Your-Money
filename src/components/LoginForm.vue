<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <div class="input-group">
            <input
              id="username"
              v-model="username"
              type="text"
              class="floating-input"
              :class="{ 'has-value': username }"
              autocomplete="username"
              spellcheck="false"
              @focus="onUsernameFocus"
              @blur="onUsernameBlur"
              required
            />
            <label for="username" class="floating-label" :class="{ 'active': username || usernameFocused }">Username</label>
          </div>
        </div>
        <div class="form-group">
          <div class="input-group password-container">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="floating-input"
              :class="{ 'has-value': password }"
              autocomplete="current-password"
              spellcheck="false"
              @focus="onPasswordFocus"
              @blur="onPasswordBlur"
              required
            />
            <label for="password" class="floating-label" :class="{ 'active': password || passwordFocused }">Password</label>
            <span class="password-dot" @click="togglePasswordVisibility"></span>
          </div>
        </div>
        <div class="form-group reset-group">
          <button type="button" class="reset-password" @click="showResetModal">Reset Password</button>
        </div>
        <div class="button-container">
          <button type="submit" class="enter-button">Enter</button>
        </div>
      </form>
    </div>


    <!-- Modal de Reset Password -->
    <div v-if="showResetPasswordModal" class="modal-overlay" @click="closeResetModal">
      <div class="modal" @click.stop>
        <h3>Reset Password</h3>
        <div class="form-group">
          <div class="input-group">
            <input
              id="reset-email"  
              v-model="resetEmail"
              type="email"
              class="floating-input"
              :class="{ 'has-value': resetEmail }"
              autocomplete="email"
              spellcheck="false"
              @focus="onEmailFocus"
              @blur="onEmailBlur"
            />
            
            <label for="reset-email" class="floating-label" :class="{ 'active': resetEmail || emailFocused }">Email Address</label>
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="confirm-button" @click="submitReset">Send Reset Link</button>
          <button type="button" class="cancel-button" @click="closeResetModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import api, { setAuthToken } from '@/services/apis';

export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      showResetPasswordModal: false,
      resetEmail: '',
      emailFocused: false,
      usernameFocused: false,
      passwordFocused: false
    };
  },
  methods: {
  async handleLogin() {
    if (this.showResetPasswordModal) return;
    try {
      const { data } = await api.post('/auth/login', {
        email: this.username,
        senha: this.password
      });
      setAuthToken(data.token);
      localStorage.setItem('jwt_token', data.token); // adiciona persistência
      this.$router.push('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      const msg =
        (error && error.response && error.response.data && (error.response.data.message || error.response.data.error))
        || 'Usuário ou senha inválidos';
      alert(msg);
    }
  },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    showResetModal() {
      this.showResetPasswordModal = true;
    },
    closeResetModal() {
      this.showResetPasswordModal = false;
      this.resetEmail = '';
      this.emailFocused = false;
    },
    submitReset() {
      this.$emit('reset-password', this.resetEmail);
      this.closeResetModal();
    },
    onEmailFocus() { this.emailFocused = true; },
    onEmailBlur() { this.emailFocused = false; },
    onUsernameFocus() { this.usernameFocused = true; },
    onUsernameBlur() { this.usernameFocused = false; },
    onPasswordFocus() { this.passwordFocused = true; },
    onPasswordBlur() { this.passwordFocused = false; }
  }
};
</script>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover;
  background-position: center;
  margin: 0;
  font-family: 'Arial', sans-serif;
}


.login-box {
  background-color: #fff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  text-align: left;
  width: 600px;
  height: 600px;
  /* textos do conteúdo em verde */
  color: #004d00;
}


h2 {
  margin-bottom: 70px;
  font-size: 50px;
  font-weight: 900;
  text-align: center;
  /* título em verde */
  color: #004d00;
}


.form-group {
  margin-bottom: 50px;
}


.input-group {
  position: relative;
  display: flex;
  flex-direction: column;
}


.floating-label {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  font-size: 18px;
  font-weight: bold;
  pointer-events: none;
  transition: all 0.3s ease;
  background-color: transparent;
  z-index: 1;
  /* label sempre verde */
  color: #004d00;
}


.floating-label.active {
  top: -15px;
  left: 0;
  font-size: 16px;
  color: #004d00;
  transform: translateY(0);
  font-weight: bold;
}


.floating-input {
  width: 100%;
  padding: 18px 24px 12px 0;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  border-radius: 0;
  font-size: 18px;
  font-weight: bold;
  background-color: transparent !important; /* sem fundo em qualquer estado */
  color: #004d00; /* texto do input verde */
  cursor: text;
  transition: all 0.3s ease;
  box-shadow: none;
}


.floating-input:focus {
  outline: none;
  border-color: #004d00;
  box-shadow: 0 0 0 3px rgba(0, 77, 0, 0.1);
  background-color: transparent !important; /* garante sem fundo */
}


.floating-input:hover {
  border-color: #004d00;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
  background-color: transparent !important; /* garante sem fundo */
}


/* remove o fundo aplicado quando há valor */
.floating-input.has-value {
  border-color: #004d00;
  background-color: transparent !important;
}


.password-container {
  position: relative;
}


.password-dot {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  background-color: #004d00;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
}


.password-dot:hover {
  background-color: #013001;
}


.reset-group {
  text-align: left;
  margin-top: -35px;
}


.reset-password {
  font-size: 14px;
  color: #004d00;
  background: none !important;
  border: none;
  padding: 0;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
  width: auto !important;
  text-align: left;
}


.reset-password:hover {
  text-decoration: underline;
  background-color: transparent !important;
}


.button-container {
  display: flex;
  justify-content: center;
  margin-top: 80px;
}


.enter-button {
  width: 35%;
  padding: 12px;
  background-color: #004d00;
  color: #fff; /* mantém contraste do botão */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 900;
  text-align: center;
}


.enter-button:hover {
  background-color: #006600;
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
  z-index: 9999;
}


.modal {
  background-color: #fff;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  width: 400px;
  max-width: 90%;
  /* textos dentro do modal em verde */
  color: #004d00;
}


.modal h3 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #004d00;
}


.modal .form-group {
  margin-bottom: 30px;
  text-align: left;
}


.modal-actions {
  margin-top: 25px;
  display: flex;
  gap: 15px;
  justify-content: center;
}


.confirm-button {
  background-color: #004d00;
  color: #fff;
  border: none;
  width: auto;
  border-radius: 8px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}


.confirm-button:hover {
  background-color: #006600;
}


.cancel-button {
  background-color: #ccc;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}


.cancel-button:hover {
  background-color: #aaa;
}
</style>


<!-- Correção do autofill (não escopada para garantir que o WebKit aplique) -->
<style>
/* Chrome/Safari/Edge (WebKit) */
.floating-input:-webkit-autofill,
.floating-input:-webkit-autofill:hover,
.floating-input:-webkit-autofill:focus {
  -webkit-text-fill-color: #004d00 !important; /* texto verde mesmo no autofill */
  caret-color: #004d00;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important; /* remove fundo azul/amarelo */
  box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent !important; /* reforço */
  transition: background-color 9999s ease-out 0s;
  border-bottom: 2px solid #004d00 !important; /* borda verde no autofill */
}


/* Firefox */
.floating-input:-moz-autofill {
  box-shadow: 0 0 0px 1000px transparent inset !important;
  -moz-text-fill-color: #004d00 !important;
  background-color: transparent !important; /* sem fundo no autofill */
  border-bottom: 2px solid #004d00 !important;
}
</style>



