<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// Ferme le menu quand on clique sur un lien
const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="main-header">
    <div class="logo-container">
      <img src="@/assets/img/logo-lo-testut.png" alt="logo de Lo Testut" class="logo" />
    </div>

    <button class="hamburger" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav class="navigation" :class="{ 'nav-open': isMenuOpen }">
      <ul>
        <li><router-link to="/" @click="closeMenu">🏠 Accueil</router-link></li>
        <li><router-link to="/galerie" @click="closeMenu">🖼️ Galerie</router-link></li>
        <li><router-link to="/evenements" @click="closeMenu">📅 Événements</router-link></li>
        <li><router-link to="/contact" @click="closeMenu">✉️ Contact</router-link></li>
        <li><router-link to="/sponsors" @click="closeMenu">🤝 Sponsors</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff6f0;
  border-bottom: 2px solid #ffd700;
  position: relative;
  z-index: 1000;
}

.logo {
  height: 80px;
  width: auto;
}

.navigation ul {
  display: flex;
  list-style: none;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.navigation a {
  text-decoration: none;
  font-weight: bold;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.navigation a:hover {
  color: #d32f2f;
}

.router-link-active {
  color: #d32f2f !important;
  border-bottom: 2px solid #d32f2f;
}

/* --- STYLE MOBILE (HAMBURGER) --- */
.hamburger {
  display: none; /* Caché sur ordinateur */
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 25px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1100;
}

.hamburger span {
  width: 30px;
  height: 3px;
  background: #d32f2f;
  border-radius: 10px;
  transition: all 0.3s linear;
}

/* --- MEDIA QUERIES --- */
@media (max-width: 768px) {
  .hamburger {
    display: flex; /* Apparaît sur mobile */
  }

  .navigation {
    position: absolute;
    top: 100%; /* Juste en dessous du header */
    left: 0;
    width: 100%;
    background-color: #fff6f0;
    border-bottom: 2px solid #ffd700;
    max-height: 0; /* Caché par défaut */
    overflow: hidden;
    transition: max-height 0.4s ease-in-out;
  }

  .nav-open {
    max-height: 400px; /* S'ouvre en glissant */
  }

  .navigation ul {
    flex-direction: column;
    padding: 20px 0;
    gap: 15px;
  }

  /* Animation du bouton X quand on clique */
  .hamburger.is-active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  .hamburger.is-active span:nth-child(2) {
    opacity: 0;
  }
  .hamburger.is-active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }
}
</style>
