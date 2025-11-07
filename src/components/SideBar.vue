<template>
  <aside :class="['sidebar', { collapsed }]">
    <div class="logo" @click="$emit('toggle')">
      <img :src="logoUrl" class="logo-image" />
    </div>

    <nav class="menu">
      <ul>
        <li class="menu-item" :class="{ active: isActive('/dashboard') }">
          <router-link to="/dashboard" class="menu-link">
            <span v-if="!collapsed">Your Wallet</span>
            <span v-else>
              <img :src="icons.wallet" alt="Wallet" class="menu-icon" />
            </span>
          </router-link>
        </li>
        <li class="menu-item" :class="{ active: isActive('/transactions') }">
          <router-link to="/transactions" class="menu-link">
            <span v-if="!collapsed">Transactions</span>
            <span v-else>
              <img :src="icons.transactions" alt="Transactions" class="menu-icon" />
            </span>
          </router-link>
        </li>
        <li class="menu-item" :class="{ active: isActive('/Users') }">
          <router-link to="/Users" class="menu-link">
            <span v-if="!collapsed">Users</span>
            <span v-else>
              <img :src="icons.settings" alt="Users" class="menu-icon" />
            </span>
          </router-link>
        </li>
        <li class="menu-item" :class="{ active: isActive('/help') }">
          <router-link to="/help" class="menu-link">
            <span v-if="!collapsed">Help / Support</span>
            <span v-else>
              <img :src="icons.help" alt="Help" class="menu-icon" />
            </span>
          </router-link>
        </li>
        <li class="menu-item" @click="$emit('logout-click')">
          <span v-if="!collapsed">Log Out</span>
          <span v-else>
            <img :src="icons.logout" class="menu-icon" alt="Logout" />
          </span>
        </li>
      </ul>
    </nav>

    <div class="user-info">
      <div class="user-avatar"></div>
      <div class="user-name" v-if="!collapsed">{{ user.name }}</div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'SidebarNav',
  props: {
    collapsed: { type: Boolean, default: false },
    user: { type: Object, default: () => ({}) },
    icons: { type: Object, required: true },
    logoUrl: { type: String, required: true }
  },
  methods: {
    isActive(path) {
      return this.$route.path.startsWith(path);
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #004322;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  box-shadow: 2px 0 10px rgba(0,0,0,0.2);
  transition: width .3s ease;
}
.sidebar.collapsed { width: 80px; }

.logo-image {
  max-width: 80%;
  height: auto;
  margin: 0 auto;
  display: block;
}
.sidebar.collapsed .logo-image {
  max-width: 160%;
  margin-left: -8px;
  margin-bottom: 20px;
  margin-top: 35px;
}

.logo {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  cursor: pointer;
}

.menu { flex-grow: 1; }
.menu ul { list-style: none; padding: 0; margin: 0; }
.menu-item {
  margin: 35px 0;
  font-size: 22px;
  margin-left: 20px;
  cursor: pointer;
  transition: opacity .2s;
}
.menu-item.active { font-weight: bold; }
.menu-item:hover { opacity: .85; }

.menu-link {
  text-decoration: none;
  color: inherit;
}

.menu-icon {
  width: 30px;
  height: 30px;
  display: block;
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
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.sidebar.collapsed .user-avatar { margin-left: 12px; }
.user-name { font-size: 18px; font-weight: bold; }
</style>