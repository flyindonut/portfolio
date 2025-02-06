import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Projects from '@/views/Projects.vue'
import Comments from '@/views/Comments.vue'
import Contact from '@/views/Contact.vue'
import Project from '@/views/Project.vue'
import ProjectsLayout from '@/layouts/ProjectsLayout.vue'
import { authGuard } from '@auth0/auth0-vue'
import NotFound from '@/views/errors/NotFound.vue'
import InternalServerError from '@/views/errors/InternalServerError.vue'
import Unauthorized from '@/views/errors/Unauthorized.vue'
import Forbidden from '@/views/errors/Forbidden.vue'
import Technologies from '@/views/Technologies.vue'
import TechStackLayout from '@/layouts/TechStackLayout.vue'
import Languages from '@/views/Languages.vue'
import Frameworks from '@/views/Frameworks.vue'
import TechStack from '@/views/TechStack.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/projects',
      component: ProjectsLayout,
      children: [
        {
          path: '',
          name: 'projects',
          component: Projects,
        },
        {
          path: ':name',
          name: 'project',
          component: Project,
        },
      ],
    },
    {
      path: '/comments',
      name: 'comments',
      component: Comments,
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact,
    },
    {
      path: '/techstack',
      component: TechStackLayout,
      beforeEnter: authGuard,
      children: [
        {
          path: '',
          name: 'techstack',
          component: TechStack,
        },
        {
          path: 'languages',
          name: 'languages',
          component: Languages,
        },
        {
          path: 'frameworks',
          name: 'frameworks',
          component: Frameworks,
        },
        {
          path: 'technologies',
          name: 'technologies',
          component: Technologies,
        },
      ],
    },
    // Error Pages
    {
      path: '/forbidden',
      name: 'forbidden',
      component: Forbidden,
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: Unauthorized,
    },
    {
      path: '/internal-server-error',
      name: 'internalservererror',
      component: InternalServerError,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: NotFound,
    },
  ],
})

export default router
