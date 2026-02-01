<script setup>
import { ref, onMounted } from 'vue'

const homeData = ref({
  imageAccueil: '',
  lienGoodies: '',
  lienAdhesion: '',
})
const loading = ref(true)

// --- CONFIGURATION SHEET ---
const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQTgrzvu5X2EjJYjVNUQ9r2gs9jk3LP_CzGu_zZPS6KXDAiGubNFMKVXgbOuT8d5VP6Hzs5IrsmCHwv/pub?gid=203903673&single=true&output=csv`

const fixDriveLink = (url) => {
  if (!url || !url.includes('drive.google.com')) return url
  const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(?:&|$)/)
  const id = match ? match[1] : null
  return id ? `https://lh3.googleusercontent.com/d/${id}=w1200` : url
}

const loadHomeData = async () => {
  try {
    const response = await fetch(url)
    const csvRaw = await response.text()

    // On récupère la ligne 2 (la première ligne de données après l'entête)
    const lines = csvRaw
      .split(/\r?\n(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .filter((l) => l.trim().length > 0)
    const dataRow = lines[1] // Ligne 1 = Entête, Ligne 2 = Données

    if (dataRow) {
      const col = dataRow
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((c) => c.trim().replace(/^"|"$/g, ''))
      homeData.value = {
        imageAccueil: fixDriveLink(col[0]),
        lienGoodies: col[1],
        lienAdhesion: col[2],
      }
    }
  } catch (err) {
    console.error('Erreur chargement Accueil', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadHomeData)
</script>

<template>
  <div class="home-container">
    <section class="hero-banner">
      <img
        :src="homeData.imageAccueil || '@/assets/img/photo-accueil.jpeg'"
        alt="Lo Testut"
        class="banner-img"
        referrerpolicy="no-referrer"
      />
      <div class="hero-overlay">
        <h1>Bienvenue chez Lo Testut</h1>
        <p class="hero-description">
          Le poulain de Montblanc association culturelle et traditionnelle
        </p>
      </div>
    </section>

    <div class="main-content">
      <section class="traditions">
        <article class="legende-card">
          <div class="card-decoration"></div>
          <h2>La légende du Poulain</h2>
          <div class="text-content">
            <p style="text-indent: 2em">
              A partir du 28 janvier 1226, la deuxième croisade contre l'hérésie cathare fut menée
              par le roi Louis VIII. L'armée capétienne arriva en Languedoc en juin 1226. L'annonce
              de cette croisade provoqua un séisme en Languedoc et beacoup de féodaux et de villes
              se soumirent au nouveau pouvoir sans livrer bataille. Ce fut le cas de beaucoup de
              villes et seigneuries de notre région. Les habitants de Languedoc en avaient assez de
              la guerre et louis VIII fut souvent accueilli en pacificateur.
            </p>
            <p style="text-indent: 2em">
              Le roi Louis VIII, avec son armée, passa à Pézenas, Servian, Montblanc et Béziers en
              cet été 1226. Sa jument tomba malade, fut recueillie et soignée par les deux consuls
              de Pézenas. L'animal guérit et mit au monde un poulain. Quand Louis VIII, malade,
              repassa par notre région, constata que sa jument était guérie, qu'un poulain était là,
              bien vivant...et les habitants de Pézenas et des villages environnants construisirent
              un poulain en bois pour perpétuer la mémoire de cet heureux événement. C'est ce
              poulain appartenant au roi Louis VIII qui est devenu l'animal totémique de
              Pézenas...et de Montblanc.
            </p>
          </div>
        </article>

        <article class="legende-card">
          <div class="card-decoration"></div>
          <h2>La Légende du Garrigot</h2>
          <div class="text-content">
            <p style="text-indent: 2em">
              Il était une fois, au début du siècle dernier, un petit mulet, maigre comme un clou,
              qui s'appelait Ratо́n (prononcer Ratou) et qui appartenait à deux beauxfrères, Elie
              Gargaros et Théophile Amiel.
            </p>
            <p style="text-indent: 2em">
              Il coulait des jours paisaibles à la vigne quand en 1915, la grande guerre arriva et
              le gouvernement militaire décidea de réquisitionner tous les animaux de trait pour
              aller tirer les canons sur le front de l'Est.
            </p>
            <p style="text-indent: 2em">
              Aussi sec, jugeant que la pauvre bête ne survivrait pas sous un tel labeur et sous un
              tel climat, les deux compères décidèrent de relâcher Ratо́n au milieu de la garrigue en
              le recouvrant d'une carapace de branches et de brindilles afin qu'il ne se fasse pas
              repérer.
            </p>
            <p style="text-indent: 2em">
              On raconte qu de temps en temps, quand il sentait qu'une fête se préparait, il
              redecendait au village, flânait dans les ruelles et menait la danse sous les porches
              au rythme des fifres et des tambours. tout le monde le suivait et s'écriait "al cuol
              del muòl ! au cul du mulet ! al cuol del muòl ! (prononcer "al kioul des miol"). Puis
              un jour, il disparut définitivement.
            </p>
            <p style="text-indent: 2em">
              Un siècle plus tard, ne le voilà-t-il pas à nouveau parmi nous pour festoyer et boire
              un coup avec tous ces amis montblanais, toujours sous sa carapace de branches de la
              garrigue ...
            </p>
            <p style="text-indent: 2em">
              Il sait maintenant qu'il est immortel et il amie bien quand on l'appelle "lo Garrigot"
              et qu'on le suive au cri de "Totes al cuol del muòl !!!".
            </p>
          </div>
        </article>
      </section>

      <section class="actions">
        <div class="action-card goodies">
          <h3>Boutique de l'Association</h3>
          <p>Commandez vos goodies et habillez-vous Lo Testut !</p>
          <a :href="homeData.lienGoodies" target="_blank" class="btn">Commander des goodies</a>
        </div>

        <div class="action-card adhesion">
          <h3>Nous rejoindre</h3>
          <p>Soutenez l'association en adhérant pour l'année.</p>
          <a :href="homeData.lienAdhesion" target="_blank" class="btn">Adhérer sur HelloAsso</a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Reset de base pour que l'image colle aux bords */
.home-container {
  background-color: #fff6f0; /* Beige plus doux */
  min-height: 100vh;
}

/* --- BANDEAU HERO PLEIN ÉCRAN --- */
.hero-banner {
  position: relative;
  width: 100%;
  height: 60vh; /* Hauteur du bandeau (60% de l'écran) */
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* L'image remplit tout sans se déformer */
  display: block;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
}

.hero-overlay h1 {
  font-size: 3.5rem;
  color: #ffd700; /* Titre en Or sur l'image */
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  margin-bottom: 10px;
}

/* --- CONTENU PRINCIPAL --- */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* --- CARTES DES LÉGENDES --- */
.traditions {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Deux colonnes côte à côte */
  gap: 30px;
  margin-bottom: 60px;
}

.legende-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-top: 5px solid #d32f2f; /* Rappel du rouge */
  position: relative;
}

.legende-card h2 {
  font-size: 1.8rem;
  color: #d32f2f;
  margin-bottom: 25px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.text-content p {
  line-height: 1.7;
  margin-bottom: 15px;
  text-align: justify;
  color: #444;
}

/* --- SECTION ACTIONS --- */
.actions {
  display: flex;
  gap: 30px;
}

.action-card {
  flex: 1;
  background: #d32f2f;
  color: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
}

.action-card h3 {
  color: #ffd700;
  margin-bottom: 15px;
}

.btn {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 25px;
  background-color: #ffd700;
  color: #d32f2f;
  text-decoration: none;
  border-radius: 30px;
  font-weight: bold;
  box-shadow: 0 4px 0 #b8860b;
}

.btn:active {
  transform: translateY(3px);
  box-shadow: none;
}

/* Adaptabilité Mobile */
@media (max-width: 850px) {
  .traditions,
  .actions {
    grid-template-columns: 1fr;
    flex-direction: column;
  }
  .hero-overlay h1 {
    font-size: 2.2rem;
  }
}
</style>
