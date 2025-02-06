import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './i18n'
import { setAuthToken } from './api/axiosInstance'
import App from './App.vue'
import router from './router'
import auth0 from './plugins/auth0'
import { MotionPlugin } from '@vueuse/motion'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(MotionPlugin)
app.use(i18n)
app.use(auth0)

app.mount('#app')

app.config.globalProperties.$auth = auth0;
setAuthToken(() => auth0.getAccessTokenSilently());