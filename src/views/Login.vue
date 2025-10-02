<template>
  <div id="login">
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue';

export default {
  name: 'Login',
  components: {
    LoginForm,
  },
  mounted() {
    console.log('Login montado');
  },
};
</script>

<style>
#login {
  background-image: url('../assets/BackGround.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>