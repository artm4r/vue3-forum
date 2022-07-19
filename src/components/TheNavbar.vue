<template>
  <header class="header" id="header"
          v-click-outside="() => mobileMenuOpen = false"
          v-page-scroll="() => mobileMenuOpen = false"
  >

    <router-link :to="{name: 'Home'}" class="logo">
      <img src="../assets/svg/vueschool-logo.svg" >
    </router-link>

    <div class="btn-hamburger" @click="mobileMenuOpen = !mobileMenuOpen">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar" :class="{ 'navbar-open': mobileMenuOpen }">
      <ul>
        <li v-if="authUser" class="navbar-user">
          <a
              @click.prevent="userDropdownOpen = !userDropdownOpen"
              v-click-outside="() => { userDropdownOpen = false }"
          >
            <AppAvatarImage class="avatar-small" :src="authUser.avatar" />
            <span>
              {{ authUser.name }}
              <img class="icon-profile" src="../assets/svg/arrow-profile.svg" alt="arrow">
            </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" :class="{'active-drop': userDropdownOpen}">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item"><router-link :to="{name: 'PageProfile'}">View profile</router-link></li>
              <li class="dropdown-menu-item"><router-link :to="{ name: 'Home' }" @click.prevent="$store.dispatch('auth/userSignOut'), mobileMenuOpen = false">SignOut</router-link></li>
            </ul>
          </div>
        </li>
        <li v-if="!authUser" class="navbar-item"><router-link :to="{ name: 'Login', query: { redirectTo: $route.path }}">Sign In</router-link></li>
        <li v-if="!authUser" class="navbar-item"><router-link :to="{ name: 'Registration'}">Register</router-link></li>
        <li v-if="authUser" class="navbar-mobile-item"><router-link :to="{name: 'PageProfile'}">View profile</router-link></li>
        <li v-if="authUser" class="navbar-mobile-item"><router-link :to="{ name: 'Home' }" @click.prevent="$store.dispatch('auth/userSignOut'), mobileMenuOpen = false">SignOut</router-link></li>
      </ul>

<!--      <ul>-->
<!--        <li class="navbar-item">-->
<!--          <a href="index.html">Home</a>-->
<!--        </li>-->
<!--        <li class="navbar-item">-->
<!--          <a href="category.html">Category</a>-->
<!--        </li>-->
<!--        <li class="navbar-item">-->
<!--          <a href="forum.html">Forum</a>-->
<!--        </li>-->
<!--        <li class="navbar-item">-->
<!--          <a href="thread.html">Thread</a>-->
<!--        </li>-->
<!--        &lt;!&ndash; Show these option only on mobile&ndash;&gt;-->
<!--        <li class="navbar-item mobile-only">-->
<!--          <a href="profile.html">My Profile</a>-->
<!--        </li>-->
<!--        <li class="navbar-item mobile-only">-->
<!--          <a href="#">Logout</a>-->
<!--        </li>-->
<!--      </ul>-->
    </nav>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "TheNavbar",
  data() {
    return {
      userDropdownOpen: false,
      mobileMenuOpen: false
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
  },
  created() {
    this.$router.beforeEach(() => {
      this.mobileMenuOpen = false
    })
  }
}
</script>

<style scoped>

</style>