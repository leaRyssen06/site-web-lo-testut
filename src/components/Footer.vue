<script setup>
import { faFacebook, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons'
</script>

<template>
  <footer class="main-footer">
    <div class="footer-content">
      <div class="social-links">
        <a
          href="https://www.instagram.com/lo.testut?igsh=MTIxenVtNW5zMTB6Yw=="
          target="_blank"
          aria-label="Instagram"
        >
          <font-awesome-icon :icon="faInstagram" /> Instagram
        </a>
        <a href="https://www.facebook.com/share/1DccrbXmFz/" target="_blank" aria-label="Facebook">
          <font-awesome-icon :icon="faFacebook" /> Facebook
        </a>
        <a
          href="https://www.tiktok.com/@lo.testut?_r=1&_t=ZN-93G1UXYtT9i"
          target="_blank"
          aria-label="Tiktok"
        >
          <font-awesome-icon :icon="faTiktok" /> Tiktok
        </a>
      </div>

      <hr class="separator" />

      <div class="credits">
        <p>© 2026 Lo Testut - Tous droits réservés</p>
        <p class="author">Site réalisé par <strong>RYSSEN Léa</strong></p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.main-footer {
  background-color: #f5f5dc; /* Fond beige  */
  padding: 30px 20px;
  margin-top: 50px;
  border-top: 1px solid #ddd;
  text-align: center;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
}

.social-links a {
  text-decoration: none;
  color: #d32f2f; /* Nuance de rouge pour les liens [cite: 14] */
  font-weight: bold;
  transition: color 0.3s;
}

.social-links a:hover {
  color: #ffd700; /* Passage au jaune au survol [cite: 14] */
}

.social-links svg {
  font-size: 1.5rem; /* Agrandit l'icône */
  vertical-align: middle;
  margin-right: 8px;
}

.separator {
  width: 50px;
  border: 1px solid #ffd700;
  margin: 20px auto;
}

.credits {
  font-size: 0.85rem;
  color: #666;
}

.author {
  margin-top: 5px;
  color: #333;
}
</style>
