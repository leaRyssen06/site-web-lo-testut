<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const event = ref(null)
const loading = ref(true)

// --- FONCTION DRIVE ---
const fixDriveLink = (url) => {
  if (!url || !url.includes('drive.google.com')) return url
  const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(?:&|$)/)
  const id = match ? match[1] : null
  return id ? `https://lh3.googleusercontent.com/d/${id}=w1000` : url
}

const loadDetail = async () => {
  const url =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQTgrzvu5X2EjJYjVNUQ9r2gs9jk3LP_CzGu_zZPS6KXDAiGubNFMKVXgbOuT8d5VP6Hzs5IrsmCHwv/pub?gid=0&single=true&output=csv'

  try {
    const response = await fetch(url)
    const csvRaw = await response.text()

    let csvText = ''
    let inQuotes = false
    for (let i = 0; i < csvRaw.length; i++) {
      let char = csvRaw[i]
      if (char === '"') inQuotes = !inQuotes
      // On garde les sauts de ligne même dans les guillemets pour traiter les listes
      csvText += char
    }

    const lines = csvText
      .split(/\r?\n(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .filter((l) => l.trim().length > 0)
    const dataRows = lines.slice(1)

    const targetIndex = parseInt(route.params.id) - 2
    const row = dataRows[targetIndex]

    if (row) {
      const col = row
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((c) => (c ? c.trim().replace(/^"|"$/g, '').trim() : ''))

      event.value = {
        titre: col[0],
        affiche: fixDriveLink(col[1]),
        dateDebut: col[2],
        dateFin: col[3],
        programme: col[4],
        lienRaw: col[5],
        lieu: col[6],
      }
    }
  } catch (err) {
    console.error('Erreur', err)
  } finally {
    loading.value = false
  }
}

// --- LOGIQUE POUR LES LIENS MULTIPLES ---
const eventLinks = computed(() => {
  if (!event.value?.lienRaw) return []

  const cleanRaw = event.value.lienRaw.replace(/^"|"$/g, '').trim()

  // 2. On sépare par ligne
  return cleanRaw
    .split(/\r?\n/)
    .map((line) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return null

      // 3. On cherche le séparateur |
      // On utilise une regex pour être plus souple sur les espaces autour du |
      const parts = trimmedLine.split(/\s*\|\s*/)

      if (parts.length >= 2) {
        return {
          label: parts[0].replace(/^"|"$/g, '').trim(), // Nettoyage extra du label
          url: parts[1].replace(/^"|"$/g, '').trim(), // Nettoyage extra de l'URL
        }
      } else if (trimmedLine.startsWith('http')) {
        return {
          label: 'En savoir plus',
          url: trimmedLine,
        }
      }
      return null
    })
    .filter((link) => link !== null && link.url.startsWith('http'))
})

// --- LOGIQUE POUR LE PROGRAMME ---
const formattedProgramme = computed(() => {
  if (!event.value?.programme) return []

  // On sépare le texte par ligne (en gérant les différents types de sauts de ligne)
  return event.value.programme
    .split(/\r?\n/)
    .map((line) => {
      const trimmedLine = line.trim()

      // Si la ligne commence par un tiret
      if (trimmedLine.startsWith('-')) {
        return {
          type: 'list',
          // On enlève le tiret du début pour ne pas l'avoir en double avec la puce CSS
          content: trimmedLine.substring(1).trim(),
        }
      } else {
        return {
          type: 'text',
          content: trimmedLine,
        }
      }
    })
    .filter((line) => line.content !== '') // On ignore les lignes vides
})

onMounted(loadDetail)
</script>

<template>
  <div class="page-detail" v-if="event">
    <router-link to="/evenements" class="back-link">← Retour au calendrier</router-link>

    <div class="detail-card">
      <div class="image-side">
        <img :src="event.affiche" class="big-poster" referrerpolicy="no-referrer" />
      </div>

      <div class="info-side">
        <h1>{{ event.titre }}</h1>
        <div class="meta">
          <p><strong>📍 Lieu :</strong> {{ event.lieu }}</p>
          <p><strong>📅 Dates :</strong> Du {{ event.dateDebut }} au {{ event.dateFin }}</p>
        </div>

        <div class="programme-section">
          <h3>Au programme :</h3>
          <div v-if="formattedProgramme.length" class="programme-content">
            <template v-for="(line, i) in formattedProgramme" :key="i">
              <p v-if="line.type === 'text'" class="prog-text">
                {{ line.content }}
              </p>

              <ul v-else class="prog-list">
                <li>{{ line.content }}</li>
              </ul>
            </template>
          </div>
          <p v-else>Aucun programme détaillé.</p>
        </div>

        <div class="links-section">
          <h3>Liens utiles :</h3>
          <div v-if="eventLinks.length" class="btn-group">
            <a
              v-for="(link, index) in eventLinks"
              :key="index"
              :href="link.url"
              target="_blank"
              class="btn-link"
            >
              {{ link.label }}
            </a>
          </div>
          <p v-else class="no-links">Pas de liens disponibles</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="!loading" class="not-found">Événement introuvable</div>
</template>

<style scoped>
.page-detail {
  padding: 40px;
  background-color: #fff6f0;
  min-height: 100vh;
  font-family: sans-serif;
}
.back-link {
  text-decoration: none;
  color: #d32f2f;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 20px;
}
.detail-card {
  display: flex;
  gap: 40px;
  background: white;
  padding: 30px;
  border-radius: 15px;
  border: 3px solid #ffd700;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}
.big-poster {
  width: 400px;
  border-radius: 10px;
  display: block;
  object-fit: cover;
}

.info-side {
  text-align: left;
  flex: 1;
  display: flex;
  flex-direction: column;
}
h1 {
  color: #d32f2f;
  margin: 0 0 20px 0;
  font-size: 2.5rem;
}
.meta p {
  margin: 5px 0;
  font-size: 1.1rem;
}

.programme-section {
  margin-top: 20px;
  flex-grow: 1;
}

.programme-content {
  line-height: 1.6;
  color: #444;
}

.prog-text {
  margin: 10px 0;
  font-weight: 500; /* Un peu plus épais pour les titres de section */
}

.prog-list {
  list-style: none;
  padding: 0;
  margin: 5px 0 5px 20px; /* Décale les puces vers la droite */
}

.prog-list li {
  position: relative;
  padding-left: 15px;
  margin-bottom: 5px;
}

.prog-list li::before {
  content: '•';
  color: #d32f2f;
  position: absolute;
  left: 0;
  font-weight: bold;
}

.programme-section h3,
.links-section h3 {
  color: #333;
  border-bottom: 2px solid #ffd700;
  padding-bottom: 5px;
  margin-bottom: 15px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
}
li::before {
  content: '•';
  color: #d32f2f;
  position: absolute;
  left: 0;
  font-weight: bold;
}

.links-section {
  margin-top: auto;
  padding-top: 20px;
}
.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.btn-link {
  background-color: #d32f2f;
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.9rem;
  transition: background 0.3s;
}
.btn-link:hover {
  background-color: #a32424;
}
.no-links {
  color: #888;
  font-style: italic;
}

@media (max-width: 900px) {
  .detail-card {
    flex-direction: column;
  }
  .big-poster {
    width: 100%;
  }
}
</style>
