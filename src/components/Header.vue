<script setup></script>

<template>
  <header class="main-header">
    <div class="logo-container">
      <img src="@/assets/img/logo-lo-testut.png" alt="logo de Lo Testut" class="logo" />
    </div>

    <nav class="navigation">
      <ul>
        <li><router-link to="/">🏠 Accueil</router-link></li>
        <li><router-link to="/galerie">🖼️ Galerie</router-link></li>
        <li><router-link to="/evenements">📅 Événements</router-link></li>
        <li><router-link to="/contact">✉️ Contact</router-link></li>
        <li><router-link to="/sponsors">🤝 Sponsors</router-link></li>
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
  background-color: #fff6f0; /* Fond beige [cite: 13] */
  border-bottom: 2px solid #ffd700; /* Ligne de séparation jaune  */
}

.logo {
  height: 80px; /* Taille ajustable selon votre logo */
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
  flex-direction: column; /* Symbole au dessus du texte pour le style */
  align-items: center;
  font-size: 0.9rem;
  transition: color 0.3s;
}

/* Nuances entre jaune et rouge pour les liens  */
.navigation a:hover {
  color: #d32f2f; /* Rouge au survol */
}

/* Style spécifique pour le lien actif */
.router-link-active {
  color: #d32f2f !important;
  border-bottom: 2px solid #d32f2f;
}
</style>
