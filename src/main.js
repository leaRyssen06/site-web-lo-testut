import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {faInstagram, faFacebook, faTiktok} from '@fortawesome/free-brands-svg-icons'

import VCalendar from "v-calendar"
import 'v-calendar/dist/style.css'

library.add(faInstagram, faFacebook, faTiktok)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(VCalendar, {})

app.use(createPinia())
app.use(router)

app.mount('#app')
