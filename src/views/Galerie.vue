<script setup>
import { ref, computed, onMounted } from 'vue'

const allPhotos = ref([])
const loading = ref(true)

// Navigation
const selectedYear = ref(null)
const selectedEvent = ref(null)

// --- CONFIGURATION SHEET ---
const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQTgrzvu5X2EjJYjVNUQ9r2gs9jk3LP_CzGu_zZPS6KXDAiGubNFMKVXgbOuT8d5VP6Hzs5IrsmCHwv/pub?gid=1596239471&single=true&output=csv  `

const fixDriveLink = (url) => {
  if (!url || !url.includes('drive.google.com')) return url
  const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(?:&|$)/)
  const id = match ? match[1] : null
  return id ? `https://lh3.googleusercontent.com/d/${id}=w1000` : url
}

const loadGalerie = async () => {
  try {
    const response = await fetch(url)
    const csvRaw = await response.text()

    // Ton nettoyage robuste
    const lines = csvRaw
      .split(/\r?\n(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .filter((l) => l.trim().length > 0)
    const dataRows = lines.slice(1)

    allPhotos.value = dataRows.map((row) => {
      const col = row
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((c) => c.trim().replace(/^"|"$/g, ''))
      return {
        annee: col[0],
        evenement: col[1],
        url: fixDriveLink(col[2]),
      }
    })
  } catch (err) {
    console.error('Erreur Galerie', err)
  } finally {
    loading.value = false
  }
}

// --- LOGIQUE DE TRI ---
const availableYears = computed(() => {
  const years = [...new Set(allPhotos.value.map((p) => p.annee))]
  return years.sort((a, b) => b - a) // Plus récent en premier
})

const availableEvents = computed(() => {
  if (!selectedYear.value) return []
  const events = allPhotos.value
    .filter((p) => p.annee === selectedYear.value)
    .map((p) => p.evenement)
  return [...new Set(events)]
})

const displayedPhotos = computed(() => {
  return allPhotos.value.filter(
    (p) => p.annee === selectedYear.value && p.evenement === selectedEvent.value,
  )
})

const goBack = () => {
  if (selectedEvent.value) {
    selectedEvent.value = null
  } else {
    selectedYear.value = null
  }
}

//déplacement entres les images en mode gros plan
const selectedIndex = ref(null)
const openLightbox = (index) => {
  selectedIndex.value = index
}
const closeLightbox = () => {
  selectedIndex.value = null
}
const nextImage = () => {
  if (selectedIndex.value < displayedPhotos.value.length - 1) {
    selectedIndex.value++
  } else {
    selectedIndex.value = 0
  }
}
const prevImage = () => {
  if (selectedImage.value > 0) {
    selectedIndex.value--
  } else {
    selectedIndex.value = displayedPhotos.value.length - 1
  }
}

onMounted(loadGalerie)
</script>

<template>
  <div class="galerie-page">
    <header class="galerie-header">
      <h1>Galerie Photos</h1>
      <button v-if="selectedYear" @click="goBack" class="btn-back">
        ← Retour {{ selectedEvent ? 'aux albums' : 'aux années' }}
      </button>
    </header>

    <div v-if="!selectedYear" class="folder-grid">
      <div
        v-for="year in availableYears"
        :key="year"
        @click="selectedYear = year"
        class="folder-card"
      >
        <div class="folder-icon">📂</div>
        <span class="folder-name">{{ year }}</span>
      </div>
    </div>

    <div v-else-if="selectedYear && !selectedEvent" class="folder-grid">
      <div
        v-for="event in availableEvents"
        :key="event"
        @click="selectedEvent = event"
        class="folder-card"
      >
        <div class="folder-icon">🖼️</div>
        <span class="folder-name">{{ event }}</span>
      </div>
    </div>

    <div v-else class="photo-grid">
      <div
        v-for="(photo, index) in displayedPhotos"
        :key="index"
        class="photo-item"
        @click="openLightbox(index)"
      >
        <img :src="photo.url" loading="lazy" referrerpolicy="no-referrer" />
      </div>
    </div>

    <div v-if="selectedIndex !== null" class="lightbox" @click.self="closeLightbox">
      <button class="close-btn" @click="closeLightbox">✕</button>

      <button class="nav-btn prev" @click="prevImage">❮</button>

      <div class="lightbox-content">
        <img :src="displayedPhotos[selectedIndex].url" referrerpolicy="no-referrer" />
        <p class="counter">{{ selectedIndex + 1 }} / {{ displayedPhotos.length }}</p>
      </div>

      <button class="nav-btn next" @click="nextImage">❯</button>
    </div>
  </div>
</template>

<style scoped>
.galerie-page {
  padding: 40px;
  background-color: #fdfaf0;
  min-height: 100vh;
  text-align: center;
}
.galerie-header h1 {
  color: #d32f2f;
  margin-bottom: 20px;
}

.btn-back {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 30px;
}

/* Grille de "Dossiers" */
.folder-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.folder-card {
  background: white;
  width: 180px;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s;
  border: 2px solid transparent;
}

.folder-card:hover {
  transform: translateY(-5px);
  border-color: #ffd700;
}
.folder-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}
.folder-name {
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
}

/* Grille de Photos */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto;
}

.photo-item {
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.photo-item:hover img {
  transform: scale(1.05);
}

/* --- LIGHTBOX STYLES --- */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.lightbox-content {
  position: relative;
  max-width: 85%;
  max-height: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

.counter {
  color: white;
  margin-top: 15px;
  font-weight: bold;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
  z-index: 2100;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 3rem;
  padding: 20px;
  cursor: pointer;
  transition: background 0.3s;
  border-radius: 50%;
  margin: 0 20px;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .nav-btn {
    font-size: 2rem;
    padding: 10px;
    margin: 0 5px;
  }
  .lightbox-content {
    max-width: 95%;
  }
}
</style>
