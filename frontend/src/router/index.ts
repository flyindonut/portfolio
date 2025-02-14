import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@auth0/auth0-vue';
import { useTitle } from '@/composables/useTitle';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { title: 'Home - Debo Huang' },
    },
    {
      path: '/projects',
      component: () => import('@/layouts/ProjectsLayout.vue'),
      children: [
        {
          path: '',
          name: 'projects',
          component: () => import('@/views/Projects.vue'),
          meta: { title: 'Projects - Debo Huang' },
        },
        {
          path: ':name',
          name: 'project',
          component: () => import('@/views/Project.vue'),
          meta: { title: 'Project - Debo Huang' },
        },
      ],
    },
    {
      path: '/comments',
      component: () => import('@/layouts/CommentsLayout.vue'),
      children: [
        {
          path: 'show',
          name: 'showcomments',
          component: () => import('@/views/ShowComments.vue'),
          meta: { title: 'Show Comments - Debo Huang' },
        },
        {
          path: 'manage',
          name: 'manage',
          component: () => import('@/views/ManageComments.vue'),
          beforeEnter: authGuard,
          meta: { title: 'Manage Comments - Debo Huang' },
        },
      ],
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/Contact.vue'),
      meta: { title: 'Contact - Debo Huang' },
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
          meta: { title: 'Icons - Debo Huang' },
        },
        {
          path: 'languages',
          name: 'languages',
          component: () => import('@/views/Languages.vue'),
          meta: { title: 'Languages - Debo Huang' },
        },
        {
          path: 'frameworks',
          name: 'frameworks',
          component: () => import('@/views/Frameworks.vue'),
          meta: { title: 'Frameworks - Debo Huang' },
        },
        {
          path: 'technologies',
          name: 'technologies',
          component: () => import('@/views/Technologies.vue'),
          meta: { title: 'Technologies - Debo Huang' },
        },
        {
          path: 'services',
          name: 'services',
          component: () => import('@/views/Services.vue'),
          meta: { title: 'Services - Debo Huang' },
        },
      ],
    },
    // Error Pages
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('@/views/errors/Forbidden.vue'),
      meta: { title: 'Forbidden - Debo Huang' },
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('@/views/errors/Unauthorized.vue'),
      meta: { title: 'Unauthorized - Debo Huang' },
    },
    {
      path: '/internal-server-error',
      name: 'internalservererror',
      component: () => import('@/views/errors/InternalServerError.vue'),
      meta: { title: 'Internal Server Error - Debo Huang' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: () => import('@/views/errors/NotFound.vue'),
      meta: { title: 'Not Found - Debo Huang' },
    },
  ],
});

router.beforeEach((to, from, next) => {
  useTitle();
  next();
});

export default router;