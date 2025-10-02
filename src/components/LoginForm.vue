<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" v-model="username" type="text" placeholder="Enter your username" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-container">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              required
            />
            <span class="password-dot" @click="togglePasswordVisibility"></span>
          </div>
        </div>
        <div class="form-group reset-group">
          <a href="#" class="reset-password">Reset Password</a>
        </div>
        <div class="button-container">
          <button type="submit">Enter</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false // Estado para alternar visibilidade da senha
    };
  },
  methods: {
  handleLogin() {
  console.log('Login iniciado'); // Adicione este log para verificar se o método está sendo chamado
  console.log('Username:', this.username);
  console.log('Password:', this.password);

  // Simula o sucesso do login
  this.$router.push('/dashboard'); // Certifique-se de que esta rota existe
},
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
  }
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
  font-family: 'Arial', sans-serif; /* Troca a fonte */
}

.login-box {
  background-color: #fff;
  padding: 40px; /* Aumenta o espaçamento interno */
  border-radius: 20px; /* Bordas mais arredondadas */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Sombra mais suave */
  text-align: left; /* Alinha os textos à esquerda */
  width: 600px; /* Mantém o tamanho da largura */
  height: 600px; /* Mantém o tamanho da altura */
}

h2 {
  margin-bottom: 70px; /* Aumenta a distância entre o título e os inputs */
  font-size: 50px; /* Tamanho maior do título */
  font-weight: 900; /* Deixa o texto do botão mais gordinho */
  text-align: center; /* Mantém o título centralizado */
}

.form-group {
  margin-bottom: 50px; /* Espaçamento entre os campos */
}

label {
  display: block;
  margin-bottom: 10px; /* Espaçamento entre a label e o campo */
  font-size: 20px; /* Tamanho maior da label */
  font-weight: 900; /* Deixa a label mais gordinha */
}

.password-container {
  position: relative; /* Define o contêiner como relativo */
}

input {
  display: block;
  width: 95%; /* Centraliza os inputs */
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  background-color: #f9f9f9;
  outline: none;
}

input:focus {
  border-color: #004d00;
  box-shadow: 0 0 5px #004d00;
}

.password-dot {
  position: absolute; /* Define a bolinha como absoluta */
  top: 50%; /* Centraliza verticalmente */
  right: 15px; /* Ajusta a posição para ficar dentro do input */
  transform: translateY(-50%); /* Ajusta para centralização perfeita */
  width: 15px;
  height: 15px;
  background-color: black; /* Cor da bolinha */
  border-radius: 50%; /* Faz a bolinha ser circular */
  cursor: pointer; /* Adiciona cursor de clique */
}

.password-dot:hover {
  background-color: #333; /* Cor mais clara ao passar o mouse */
}

.reset-group {
  text-align: left; /* Alinha o link à esquerda */
  margin-top: -35px; /* Reduz a distância entre o link e o último input */
}

.reset-password {
  font-size: 14px;
  color: #004d00;
  text-decoration: none;
  font-weight: 800; /* Deixa o texto mais gordinho */
}

.reset-password:hover {
  text-decoration: underline;
}

.button-container {
  display: flex;
  justify-content: center; /* Centraliza o botão horizontalmente */
  margin-top: 80px; /* Aumenta o espaçamento acima do botão */
}

button {
  width: 35%;
  padding: 12px;
  background-color: #004d00;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 900; /* Deixa o texto do botão mais gordinho */
  text-align: center; /* Mantém o botão centralizado */
}

button:hover {
  background-color: #006600;
}
</style>