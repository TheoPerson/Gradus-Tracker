
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// Views
import HomeView from '../views/HomeView.vue'
import TechDashboard from '../views/TechDashboard.vue'
import ChallengesView from '../views/ChallengesView.vue'
import ChampionsView from '../views/ChampionsView.vue'
import SkinsView from '../views/SkinsView.vue'
import ItemsView from '../views/ItemsView.vue'
import RunesView from '../views/RunesView.vue'
import EmotesView from '../views/EmotesView.vue'
import IconsView from '../views/IconsView.vue'
import WardsView from '../views/WardsView.vue'
import SpellsView from '../views/SpellsView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/challenges',
    name: 'challenges',
    component: ChallengesView
  },
  {
    path: '/champions',
    name: 'champions',
    component: ChampionsView
  },
  {
    path: '/skins',
    name: 'skins',
    component: SkinsView
  },
  {
    path: '/items',
    name: 'items',
    component: ItemsView
  },
  {
    path: '/runes',
    name: 'runes',
    component: RunesView
  },
  {
    path: '/emotes',
    name: 'emotes',
    component: EmotesView
  },
  {
    path: '/icons',
    name: 'icons',
    component: IconsView
  },
  {
    path: '/wards',
    name: 'wards',
    component: WardsView
  },
  {
    path: '/spells',
    name: 'spells',
    component: SpellsView
  },
  {
    path: '/admin',
    name: 'admin',
    component: TechDashboard
  },
  // Redirect catch-all
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
