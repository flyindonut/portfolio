import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@auth0/auth0-vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/projects',
      component: () => import('@/layouts/ProjectsLayout.vue'),
      children: [
        {
          path: '',
          name: 'projects',
          component: () => import('@/views/Projects.vue'),
        },
        {
          path: ':name',
          name: 'project',
          component: () => import('@/views/Project.vue'),
        },
      ],
    },
    {
      path: '/comments',
      component: () => import('@/layouts/CommentsLayout.vue'),
      children: [
        {
          path: '',
          name: 'comments',
          component: () => import('@/views/Comments.vue'),
        },
        {
          path: 'verified',
          name: 'verified',
          component: () => import('@/views/VerifiedComments.vue'),
        },
        {
          path: 'guest',
          name: 'guest',
          component: () => import('@/views/GuestComments.vue'),
        },
        {
          path: 'manage',
          name: 'manage',
          component: () => import('@/views/ManageComments.vue'),
          beforeEnter: authGuard,
        }
      ],
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/Contact.vue'),
    },
    // Only For Me
    {
      path: '/icons',
      component: () => import('@/layouts/IconsLayout.vue'),
      beforeEnter: authGuard,
      children: [
        {
          path: '',
          name: 'Icons',
          component: () => import('@/views/Icons.vue'),
        },
        {
          path: 'languages',
          name: 'languages',
          component: () => import('@/views/Languages.vue'),
        },
        {
          path: 'frameworks',
          name: 'frameworks',
          component: () => import('@/views/Frameworks.vue'),
        },
        {
          path: 'technologies',
          name: 'technologies',
          component: () => import('@/views/Technologies.vue'),
        },
        {
          path: 'services',
          name: 'services',
          component: () => import('@/views/Services.vue'),
        },
      ],
    },
    // Error Pages
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('@/views/errors/Forbidden.vue'),
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('@/views/errors/Unauthorized.vue'),
    },
    {
      path: '/internal-server-error',
      name: 'internalservererror',
      component: () => import('@/views/errors/InternalServerError.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: () => import('@/views/errors/NotFound.vue'),
    },
  ],
})

export default router