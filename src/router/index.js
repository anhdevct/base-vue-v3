import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../views/home/index.vue'
import AboutView from '../views/about/index.vue'

const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: HomeView 
  },
  { 
    path: '/about', 
    name: 'About',
    component: AboutView 
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
})

export default router