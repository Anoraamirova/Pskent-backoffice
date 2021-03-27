import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import goTo from 'vuetify/es5/services/goto'
import store from '../store/index'
import roles from '../utils/AccessRoleList/GlobalRoles'
Vue.use(VueRouter)
const routes = [
  {
    path: '',
    component: () => import('../Layouts/Main.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        redirect: '/statistika',
        component: Home,
        meta: {
          accessControl: true,
          roles: roles.Reports.roles
        }
      },
      {
        path: '/',
        name: 'reports',
        component: () => import('../views/Reports/Reports.vue'),
        meta: {
          accessControl: true,
          roles: roles.Reports.admin
        }
      },
      {
        path: '/sozlamalar/mahalla',
        name: 'Mahalla',
        component: () => import('../components/Settings/MahallaList.vue'),
        meta: {
          accessControl: true,
          roles: roles.Reports.roles
        }
      },
      {
        path: '/statistika/:id',
        props: true,
        name: 'reportss',
        component: () => import('../components/Reports/Report.vue'),
        meta: {
          accessControl: true,
          roles: roles.Reports.roles
        }
      },
      {
        path: '/profil',
        name: 'Profile',
        component: () => import('../Layouts/Profile.vue'),
        meta: {
          accessControl: true,
          roles: roles.Reports.roles
        }
      },
      {
        path: '/sozlamalar',
        name: 'Settings',
        component: () => import('../views/Settings/Settings.vue'),
        meta: {
          accessControl: true,
          roles: roles.Reports.roles
        }
      },
      {
        path: '/sozlamalar/tashkilotlar',
        name: 'Tashkilotlar',
        component: () => import('../views/Settings/Organization.vue'),
        meta: {
          accessControl: true,
          roles: roles.Reports.roles
        }
      },
      {
        path: '/sozlamalar/tashkilotlar/:id',
        name: 'Users',
        props: true,
        component: () => import('../components/Settings/OrganizationEmployees.vue'),
        meta: {
          accessControl: true,
          roles: roles.Reports.roles
        }
      },
      {
        path: '/sozlamalar/kategoriya',
        name: 'Kategoriya',
        component: () => import('../components/Settings/CategoryList.vue'),
        meta: {
          accessControl: true,
          roles: roles.Reports.roles
        }
      },
      {
        path: '/statistika',
        name: 'Statistics',
        component: () => import('../views/Statistics/Statistics.vue'),
        meta: {
          accessControl: true,
          roles: roles.Reports.roles
        }
      },
      {
        path: '/fuqarolarroyxati',
        name: 'Citizenlist',
        component: () => import('../views/Citizens/Citizenlist.vue'),
        meta: {
          accessControl: true,
          roles: roles.Reports.roles
        }
      },
      {
        path: '/muloqot',
        name: 'Muloqot',
        component: () => import('../components/chat/Muloqot.vue'),
        meta: {
          accessControl: true,
          roles: roles.Reports.roles
        }
      }
    ]
  },
  {
    path: '',
    component: () => import('../views/Pages/Login.vue'),
    children: [
      {
        path: '/pages/login',
        name: 'page-login',
        component: () => import('../views/Pages/Login.vue')
      }
    ]
  },

  {
    path: '*',
    name: '404-login',
    component: () => import('../views/Pages/NotFound.vue')
  }
]
const router = new VueRouter({
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0

    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }

    return goTo(scrollTo)
  },
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(access => access.meta.accessControl)) {
    if (!(store.state.user.token)) {
      next('/pages/login')
    } else {
      if (to.meta.roles.find(el => el.id === store.state.user.roles[0].id)) next()
      else next('/home')
    }
  } else {
    next()
  }
})

export default router
