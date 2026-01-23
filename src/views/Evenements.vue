<script setup>
import { ref, computed, onMounted } from 'vue'

const events = ref([])
const selectedEvent = ref(null)
// Image par défaut (grise) quand aucun événement n'est trouvé
const defaultPoster = "https://placehold.co/600x800/e0e0e0/999999?text=Pas+d'événement"

// --- FONCTION POUR LES IMAGES DRIVE ---
const fixDriveLink = (url) => {
  if (!url || !url.includes('drive.google.com')) return url

  // Cette Regex est plus précise pour attraper l'ID peu importe le format du lien
  const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(?:&|$)/)
  const id = match ? match[1] : null

  if (id) {
    // On utilise l'URL de miniature de Google, en demandant une grande taille (w1000)
    // C'est la méthode la plus stable pour contourner les blocages d'affichage direct
    return `https://lh3.googleusercontent.com/d/${id}=w1000`
  }
  return url
}

// --- CHARGEMENT DES DONNÉES ---
const loadEvents = async () => {
  const url =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQTgrzvu5X2EjJYjVNUQ9r2gs9jk3LP_CzGu_zZPS6KXDAiGubNFMKVXgbOuT8d5VP6Hzs5IrsmCHwv/pub?gid=0&single=true&output=csv'

  try {
    const response = await fetch(url)
    const csvRaw = await response.text()

    // --- 1. NETTOYAGE ROBUSTE ---
    let csvText = ''
    let inQuotes = false
    for (let i = 0; i < csvRaw.length; i++) {
      let char = csvRaw[i]

      // On bascule l'état "dans les guillemets"
      if (char === '"') inQuotes = !inQuotes

      // Si on trouve un saut de ligne
      if (char === '\n' || char === '\r') {
        if (inQuotes) {
          csvText += ' ' // On remplace par espace si on est DANS une cellule
        } else {
          csvText += '\n' // On garde le saut de ligne si on est en FIN de ligne
        }
      } else {
        csvText += char
      }
    }

    // --- 2. DÉCOUPAGE ---
    // On utilise un split simple sur le \n qu'on a préservé uniquement en fin de ligne
    const lines = csvText.split('\n').filter((line) => line.trim().length > 0)

    // On ignore l'entête
    const dataRows = lines.slice(1)

    console.log('Nombre de lignes de données détectées :', dataRows.length)

    events.value = dataRows.map((row, index) => {
      const cleanCol = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((c) => {
        return c ? c.trim().replace(/^"|"$/g, '').trim() : ''
      })

      console.log(`Ligne ${index + 1} chargée :`, cleanCol[0])

      return {
        id: index + 2,
        titre: cleanCol[0] || '',
        affiche: fixDriveLink(cleanCol[1]),
        dateDebut: new Date(cleanCol[2]),
        dateFin: new Date(cleanCol[3]),
        programme: cleanCol[4] || '',
        lien: cleanCol[5] || '',
        lieu: cleanCol[6] || '',
      }
    })

    // --- 3. SÉLECTION DE L'ÉVÉNEMENT ---
    const today = new Date().setHours(0, 0, 0, 0)
    // On trie par date pour être sûr
    const sorted = [...events.value].sort((a, b) => a.dateDebut - b.dateDebut)

    // On cherche le premier qui n'est pas encore fini, sinon le premier tout court
    selectedEvent.value = sorted.find((e) => e.dateFin >= today) || sorted[0]
  } catch (err) {
    console.error('Erreur :', err)
  }
}

// --- CONFIGURATION CALENDRIER ---
const attributes = computed(() => {
  return events.value
    .filter((event) => !isNaN(event.dateDebut.getTime()) && !isNaN(event.dateFin.getTime()))
    .map((event) => {
      // 1. Nettoyage : on enlève les espaces et on met TOUT en minuscules
      const lieuNettoye = event.lieu ? event.lieu.trim().toLowerCase() : ''

      // 2. Comparaison : on compare avec 'montblanc' TOUT EN MINUSCULES
      const estMontblanc = lieuNettoye === 'montblanc'

      return {
        key: event.titre,
        highlight: {
          // Utilise bg-red si le lieu est montblanc, sinon bg-yellow
          contentClass: estMontblanc ? 'bg-red' : 'bg-yellow',
        },
        dates: { start: event.dateDebut, end: event.dateFin },
        popover: {
          label: event.titre,
          visibility: 'hover',
        },
      }
    })
})

const handleDayClick = (day) => {
  const clickedDate = new Date(day.date).setHours(0, 0, 0, 0)

  const found = events.value.find((e) => {
    const start = new Date(e.dateDebut).setHours(0, 0, 0, 0)
    const end = new Date(e.dateFin).setHours(0, 0, 0, 0)
    return clickedDate >= start && clickedDate <= end
  })

  if (found) {
    selectedEvent.value = found
  } else {
    // Si on ne trouve rien, on affiche l'état "vide"
    selectedEvent.value = {
      titre: 'Aucun événement prévu',
      affiche: defaultPoster,
      programme: '',
      isEmpty: true, // On ajoute un marqueur pour cacher le bouton "Détails"
    }
  }
}

onMounted(loadEvents)
</script>

<template>
  <div class="events-container">
    <div class="calendar-section">
      <v-calendar expanded :attributes="attributes" @dayclick="handleDayClick" :rows="2" />
    </div>

    <div class="event-sidebar" v-if="selectedEvent">
      <div class="poster-card">
        <img
          :src="selectedEvent.affiche"
          :key="selectedEvent.titre"
          alt="Affiche"
          class="event-poster"
          referrerpolicy="no-referrer"
        />
        <div class="poster-footer">
          <h2 class="mini-title">{{ selectedEvent.titre }}</h2>

          <router-link
            v-if="!selectedEvent.isEmpty"
            :to="'/evenement/' + selectedEvent.id"
            class="btn-more"
          >
            Voir plus de détails
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.events-container {
  display: flex;
  gap: 20px;
  background-color: #f5f5dc; /* Fond beige */
  padding: 20px;
  /* Force la hauteur sur la taille de l'écran moins les éventuelles marges */
  height: calc(100vh - 40px);
  box-sizing: border-box;
  overflow: hidden; /* Empêche le scroll global de la page */
}

.calendar-section {
  flex: 1;
  height: 100%;
  display: flex;
}

/* On force le calendrier V-Calendar à prendre toute la place de son parent */
:deep(.vc-container) {
  width: 100% !important;
  height: 100% !important;
  display: flex;
  flex-direction: column;
  border: none !important;
}

:deep(.vc-weeks) {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

:deep(.vc-week) {
  flex-grow: 1;
}

:deep(.vc-day) {
  min-height: 50px; /* Sécurité pour ne pas être trop petit */
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-sidebar {
  flex: 1; /* Même poids que le calendrier pour avoir la même largeur */
  height: 100%;
}

.poster-card {
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 3px solid #ffd700;
  border-radius: 8px;
  overflow: hidden;
}

.event-poster {
  width: 100%;
  /* On lui donne 70% de la hauteur max, le reste est pour le texte/bouton */
  height: 70%;
  object-fit: contain;
  background-color: #f0f0f0;
  border-bottom: 2px solid #ffd700;
}

.poster-footer {
  flex-grow: 1; /* Prend le reste de la place (30%) */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centre le titre et le bouton verticalement */
  padding: 15px;
}

.mini-title {
  font-size: 1.2rem;
  color: #d32f2f;
  margin: 0 0 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* Coupe le texte proprement s'il est trop long */
  text-align: center;
}

.btn-more {
  display: block;
  background-color: #d32f2f;
  color: white;
  padding: 12px;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: transform 0.2s;
  text-align: center;
}

.btn-more:hover {
  transform: scale(1.02);
}

/* Couleurs du calendrier */
:deep(.bg-red) {
  background-color: #d32f2f !important;
  color: white !important;
  border-radius: 50%;
}

:deep(.bg-yellow) {
  background-color: #ffd700 !important;
  color: black !important;
  border-radius: 50%;
}
</style>
