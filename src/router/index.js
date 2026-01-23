import { createRouter, createWebHistory } from 'vue-router'

import Accueil from '../views/Accueil.vue'
import Galerie from '@/views/Galerie.vue'
import Evenements from '@/views/Evenements.vue'
import Evenement from '@/views/Evenement.vue'
import Contact from '@/views/Contact.vue'
import Sponsors from '@/views/Sponsors.vue'

const routes = [
  {path: '/', name:'Accueil', component: Accueil},
  {path: '/galerie', name: 'Galerie', component: Galerie},
  {path: '/evenements', name:'Evenements', component: Evenements},
  {path: '/evenement/:id', name:'Evenement', component: Evenement},
  {path: '/contact', name: 'Contact', component: Contact},
  {path: '/sponsors', name: 'Sponsors', component: Sponsors},
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
