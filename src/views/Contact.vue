<script setup>
import { ref, onMounted } from 'vue'

const bureau = ref([])
const loading = ref(true)

const sheetUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQTgrzvu5X2EjJYjVNUQ9r2gs9jk3LP_CzGu_zZPS6KXDAiGubNFMKVXgbOuT8d5VP6Hzs5IrsmCHwv/pub?gid=1580965043&single=true&output=csv`

const fixDriveLink = (url) => {
  if (!url || !url.includes('drive.google.com')) return 'https://via.placeholder.com/150?text=Photo'
  const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(?:&|$)/)
  const id = match ? match[1] : null
  return id ? `https://lh3.googleusercontent.com/d/${id}=w400` : url
}

// Fonction pour formater Nom/Prénom
const formatName = (nom, prenom) => {
  const n = nom ? nom.toUpperCase() : ''
  const p = prenom ? prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase() : ''
  return { nom: n, prenom: p }
}

const loadBureau = async () => {
  try {
    const response = await fetch(sheetUrl)
    const csvRaw = await response.text()

    // On réutilise ton système de nettoyage robuste
    const lines = csvRaw
      .split(/\r?\n(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .filter((l) => l.trim().length > 0)
    const dataRows = lines.slice(1) // On ignore l'entête

    bureau.value = dataRows.map((row) => {
      const col = row
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((c) => c.trim().replace(/^"|"$/g, ''))
      const formatted = formatName(col[0], col[1])

      return {
        nom: formatted.nom,
        prenom: formatted.prenom,
        photo: fixDriveLink(col[2]),
        role: col[3],
      }
    })
  } catch (err) {
    console.error('Erreur chargement bureau', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadBureau)
</script>

<template>
  <div class="contact-container">
    <section class="intro-box">
      <h2>Un mot du Bureau</h2>
      <p>
        "Bienvenue sur l'espace contact de Lo Testut. Notre équipe de bénévoles passionnés œuvre
        chaque jour pour faire vivre les traditions de Montblanc. N'hésitez pas à nous contacter
        pour toute question ou pour nous rejoindre !"
      </p>
    </section>

    <section class="bureau-grid" v-if="!loading">
      <div v-for="(membre, index) in bureau" :key="index" class="member-card">
        <div class="photo-container">
          <img :src="membre.photo" :alt="membre.prenom" referrerpolicy="no-referrer" />
        </div>
        <div class="member-info">
          <h3>{{ membre.nom }} {{ membre.prenom }}</h3>
          <p class="role">{{ membre.role }}</p>
        </div>
      </div>
    </section>

    <footer class="contact-footer">
      <p>Pour toute demande officielle :</p>
      <a href="mailto:contact@lotestut.fr" class="mail-link">lotestutmontblanc@gmail.com</a>
    </footer>
  </div>
</template>

<style scoped>
.contact-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #fdfaf0;
  min-height: 100vh;
}

.intro-box {
  background: white;
  border: 2px solid #ffd700;
  padding: 30px;
  border-radius: 15px;
  margin: 0 auto 50px auto; /* Centre le bloc */
  max-width: 800px; /* Limite la largeur du texte pour la lecture */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.intro-box h2 {
  color: #d32f2f;
  margin-bottom: 15px;
}

.intro-box p {
  font-style: italic;
  line-height: 1.6;
  font-size: 1.1rem;
}

/* Grille des membres */
.bureau-grid {
  display: flex; /* On passe en Flex pour mieux contrôler l'alignement */
  flex-wrap: wrap; /* Permet de passer à la ligne */
  justify-content: center; /* Centre les cartes si elles sont peu nombreuses */
  gap: 30px;
  margin-bottom: 60px;
}

.member-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;

  /* --- LIMITATION DE LARGEUR --- */
  width: 280px; /* Largeur fixe "normale" */
  flex-shrink: 0; /* Empêche la carte de rétrécir */
}

.member-card:hover {
  transform: translateY(-10px);
}

.photo-container {
  width: 100%;
  height: 320px; /* Un peu plus haut pour un look portrait élégant */
  overflow: hidden;
  background: #eee;
}

.photo-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-info {
  padding: 20px;
}
.member-info h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  letter-spacing: 0.5px;
}
.role {
  color: #d32f2f;
  font-weight: bold;
  margin-top: 10px;
  text-transform: uppercase;
  font-size: 0.9rem;
}

/* Footer Mail */
.contact-footer {
  text-align: center;
  border-top: 2px dashed #ccc;
  padding-top: 40px;
}
.mail-link {
  font-size: 1.5rem;
  color: #d32f2f;
  text-decoration: none;
  font-weight: bold;
  border-bottom: 2px solid transparent;
  transition: 0.3s;
}
.mail-link:hover {
  border-bottom: 2px solid #d32f2f;
}
</style>
