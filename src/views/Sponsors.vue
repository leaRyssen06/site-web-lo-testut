<script setup>
import { ref, onMounted } from 'vue'

const sponsors = ref([])
const loading = ref(true)

const sheetUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQTgrzvu5X2EjJYjVNUQ9r2gs9jk3LP_CzGu_zZPS6KXDAiGubNFMKVXgbOuT8d5VP6Hzs5IrsmCHwv/pub?gid=281786280&single=true&output=csv`

const fixDriveLink = (url) => {
  if (!url || !url.includes('drive.google.com')) return url
  const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(?:&|$)/)
  const id = match ? match[1] : null
  return id ? `https://lh3.googleusercontent.com/d/${id}=w400` : url
}

const loadSponsors = async () => {
  try {
    const response = await fetch(sheetUrl)
    const csvRaw = await response.text()

    // Ton nettoyage robuste habituel
    const lines = csvRaw
      .split(/\r?\n(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .filter((l) => l.trim().length > 0)
    const dataRows = lines.slice(1)

    sponsors.value = dataRows.map((row) => {
      const col = row
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((c) => c.trim().replace(/^"|"$/g, ''))
      return {
        nom: col[0],
        logo: fixDriveLink(col[1]),
        url: col[2],
      }
    })
  } catch (err) {
    console.error('Erreur sponsors', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadSponsors)
</script>

<template>
  <div class="sponsors-page">
    <header class="sponsors-header">
      <h1>Nos Partenaires</h1>
      <div class="divider"></div>
      <p>Ils soutiennent la culture et les traditions de Montblanc. Merci à eux !</p>
    </header>

    <div class="sponsors-container" v-if="!loading">
      <div class="sponsors-grid">
        <a
          v-for="(sponso, index) in sponsors"
          :key="index"
          :href="sponso.url"
          target="_blank"
          class="sponsor-card"
          :title="sponso.nom"
        >
          <div class="logo-wrapper">
            <img :src="sponso.logo" :alt="sponso.nom" referrerpolicy="no-referrer" />
          </div>
          <span class="sponsor-name-tooltip">{{ sponso.nom }}</span>
        </a>
      </div>
    </div>

    <div class="be-sponsor">
      <p>Vous souhaitez soutenir l'association ?</p>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLScISU2q48Yhe3-_Plty1iMCH2v74IC-Oa_a8G2TrusGkNWrsQ/viewform?usp=publish-editor" class="btn-contact">Devenir Sponsor</a>
    </div>
  </div>
</template>

<style scoped>
.sponsors-page {
  padding: 60px 20px;
  background-color: #fdfaf0;
  min-height: 100vh;
  text-align: center;
}

.sponsors-header h1 {
  color: #d32f2f;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.divider {
  width: 80px;
  height: 4px;
  background-color: #ffd700;
  margin: 0 auto 20px;
  border-radius: 2px;
}

.sponsors-header p {
  color: #666;
  font-style: italic;
  margin-bottom: 50px;
}

/* Grille des Sponsors */
.sponsors-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.sponsor-card {
  position: relative;
  background: white;
  width: 220px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-decoration: none;
}

.sponsor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(211, 47, 47, 0.15);
  border: 1px solid #d32f2f;
}

.logo-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-wrapper img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  /* Effet gris par défaut pour l'élégance (optionnel) */
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.4s ease;
}

.sponsor-card:hover img {
  filter: grayscale(0%);
  opacity: 1;
}

/* Nom qui apparaît au survol (Tooltip personnalisé) */
.sponsor-name-tooltip {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.sponsor-card:hover .sponsor-name-tooltip {
  opacity: 1;
}

/* Appel à l'action en bas */
.be-sponsor {
  margin-top: 80px;
  padding: 40px;
  border-top: 1px solid #ddd;
}

.btn-contact {
  display: inline-block;
  margin-top: 15px;
  background-color: #ffd700;
  color: #d32f2f;
  padding: 12px 30px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s;
}

.btn-contact:hover {
  background-color: #d32f2f;
  color: white;
}
</style>
