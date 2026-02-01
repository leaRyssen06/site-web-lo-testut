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

      <div class="legal-info">
        <p><strong>LO TESTUT</strong> - Association déclarée</p>
        <p>SIRET : 817 944 812 00012 | RNA : W341007234</p>
        <p>Siège : Rue de la République, 34290 Montblanc</p>
      </div>

      <div class="credits">
        <p>© 2026 Lo Testut - Tous droits réservés</p>
        <p class="author">
          Site réalisé par
          <strong>
            <a
              href="https://learyssen06.github.io/portfolio-vue/"
              target="_blank"
              class="portfolio-link"
            >
              RYSSEN Léa
            </a>
          </strong>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.main-footer {
  background-color: #fff6f0;
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
  border-top: 1px solid rgba(255, 215, 0, 0.3);
  padding-top: 15px;
  max-width: 300px;
  margin: 0 auto;
}

.author {
  margin-top: 5px;
  color: #333;
}

.legal-info {
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 15px;
  line-height: 1.4;
}

.legal-info p {
  margin: 2px 0;
}

.portfolio-link {
  color: #d32f2f;
  text-decoration: none;
  position: relative;
  padding: 2px 5px;
  transition: all 0.3s ease;
  border-bottom: 2px solid #ffd700;
}

.portfolio-link:hover {
  background-color: #ffd700;
  color: #333;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(211, 47, 47, 0.2);
}

.portfolio-link::after {
  content: ' ↗';
  font-size: 0.7rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.portfolio-link:hover::after {
  opacity: 1;
}
</style>
