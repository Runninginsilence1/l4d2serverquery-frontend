import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Lew from "lew-ui";
import "lew-ui/style";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Lew)

app.mount('#app')
