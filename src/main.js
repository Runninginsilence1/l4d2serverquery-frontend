import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Antd from 'ant-design-vue';
import App from './App.vue'
import 'ant-design-vue/dist/reset.css';
import router from './router'
import Lew from "lew-ui";
import "lew-ui/style";
// 全局导入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// mock
// import "@/mockjs"


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Lew)
app.use(ElementPlus)
app.use(Antd)

app.mount('#app')
