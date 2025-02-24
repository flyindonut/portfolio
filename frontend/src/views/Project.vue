<script setup lang="ts">
import { ref, watch, onMounted, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { fetchProjectBySlug, deleteProject } from "@/api/projectApi";
import { fetchLanguages } from "@/api/languageApi";
import { fetchFrameworks } from "@/api/frameworkApi";
import { fetchTechnologies } from "@/api/technologyApi";
import type { Project } from "@/types/Project";
import type { Language } from "@/types/Language";
import type { Framework } from "@/types/Framework";
import type { Technology } from "@/types/Technology";
import { useAuthStore } from "@/stores/auth";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { Edit, Trash2 } from "lucide-vue-next";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { X } from "lucide-vue-next";

type Locale = 'en' | 'fr';

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const emit = defineEmits(["showModifyProjectModal", "refreshProjects", "closeProjectsMenu", "showGoBack", "hideMobileButtons", "showMobileButtons"]);

const authStore = useAuthStore();
const isAdmin = ref(authStore.hasRole('Admin'));

const isLoading = ref(true);
const project = ref<Project | null>(null);
const errorMessage = ref<string | null>(null);
const isDeleting = ref(false);
const isAnimating = ref(true);

const languages = ref<Language[]>([]);
const frameworks = ref<Framework[]>([]);
const technologies = ref<Technology[]>([]);

const showDeleteModal = ref(false);

const fetchProject = async (slug: string) => {
  try {
    const [projectResponse, languagesResponse, frameworksResponse, technologiesResponse] = await Promise.all([
      fetchProjectBySlug(slug),
      fetchLanguages(),
      fetchFrameworks(),
      fetchTechnologies()
    ]);

    if (projectResponse) {
      project.value = projectResponse;
      languages.value = languagesResponse;
      frameworks.value = frameworksResponse;
      technologies.value = technologiesResponse;
    } else {
      errorMessage.value = "Project not found.";
    }
  } catch (error) {
    errorMessage.value = "Failed to fetch project.";
  } finally {
    isLoading.value = false;
  }
};

const handleDelete = async () => {
  if (!project.value) return;
  isDeleting.value = true;
  try {
    await deleteProject(project.value.slug);
    emit("refreshProjects");
    router.push("/projects");
  } catch (error) {
    errorMessage.value = "Failed to delete project.";
  } finally {
    isDeleting.value = false;
    showDeleteModal.value = false;
  }
};

watch(
  () => route.params.name,
  (newSlug) => {
    if (newSlug) {
      fetchProject(newSlug as string);
    }
  },
  { immediate: true }
);

watch(
  () => authStore.hasRole('Admin'),
  (newIsAdmin) => {
    isAdmin.value = newIsAdmin;
  },
  { immediate: true }
);

onMounted(() => {
  emit("closeProjectsMenu")
  setTimeout(() => {
    isAnimating.value = false;
  }, 500);
});

const showImageModal = ref(false);
const selectedImage = ref<string | null>(null);

const openImageModal = (image: string) => {
  selectedImage.value = image;
  showImageModal.value = true;
};

const windowSize = ref(window.innerWidth);

const swiperNavigationSize = computed(() => {
  return windowSize.value >= 768 ? '50px' : '20px';
});

const updateWindowSize = () => {
  windowSize.value = window.innerWidth;
};

window.addEventListener('resize', updateWindowSize);

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize);
});
</script>

<template>
  <div class="h-dvh overflow-y-scroll">
    <div
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0 }"
      :delay="500"
      :duration="500"
      class="p-10 lg:p-20 mt-14 lg:mt-0 mx-auto mx-w-dvw xl:max-w-4xl text-[var(--text-color)]"
    >
      <div v-if="isLoading" class="flex justify-center items-center h-dvh">
        <div class="border-6 border-[var(--border-color)]/30 border-t-white rounded-full w-8 h-8 animate-spin"></div>
      </div>

      <div v-else>
        <!-- Breadcrumb Navigation -->
        <Breadcrumb
          @showGoBack="$emit('showGoBack')"
        />

        <div v-if="errorMessage" class="text-red-500 bg-red-800 p-3 rounded-md">{{ errorMessage }}</div>
        <div v-else-if="project" class="space-y-6">
          <div class="flex justify-between items-center">
            <h1 class="text-4xl xl:text-5xl font-bold capitalize">{{ project.translations[locale as Locale].name }}</h1>
            <button v-if="isAdmin" @click="$emit('showModifyProjectModal', project), $emit('hideMobileButtons')" class="text-[var(--text-color)] hover:text-[var(--text-3-color)] transition">
              <Edit class="w-6 h-6" />
            </button>
          </div>
          <div class="mt-4 h-[3px] bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] rounded-full"></div>
          <p class="text-[var(--text-2-color)] mt-2">{{ project.translations[locale as Locale].description }}</p>

          <!-- Image Carousel Section -->
          <div v-if="project.images.length" class="mt-10">
            <h3 class="text-2xl font-bold mb-4">Images</h3>
            
            <swiper
              :style="{'--swiper-navigation-size': swiperNavigationSize}"
              :modules="[Navigation, Pagination, Autoplay]"
              :slides-per-view="1"
              :loop="true"
              :autoplay="{ delay: 3000, disableOnInteraction: false }"
              :pagination="{ clickable: true }"
              :navigation="true"
              class="w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg"
            >
              <swiper-slide v-for="(image, index) in project.images" :key="index">
                <img
                  :src="image"
                  :alt="project.translations[locale as Locale].name"
                  class="w-full h-[200px] sm:h-[400px] md:h-[500px] lg:h-[300px] xl:h-[400px] object-cover rounded-lg"
                  @click="openImageModal(image)"
                />
              </swiper-slide>
            </swiper>
          </div>

          <!-- Languages -->
          <div v-if="project.languages.length" class="mt-10">
            <h3 class="text-2xl font-bold">{{ t('projectPage.languages') }}</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              <div
                v-for="language in project.languages"
                :key="language"
                class="relative flex flex-col items-center bg-[var(--skill-item)] border border-[var(--border-color)] p-4 rounded-xl shadow-md hover:bg-[var(--skill-item-hover)] transition"
              >
                <div v-html="languages.find(l => l.slug === language)?.icon" class="w-12 h-12"></div>
                <span class="mt-2 text-[var(--text-color)] text-sm">{{ languages.find(l => l.slug === language)?.name }}</span>
              </div>
            </div>
          </div>

          <!-- Frameworks -->
          <div v-if="project.frameworks.length" class="mt-10">
            <h3 class="text-2xl font-bold">Frameworks</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              <div
                v-for="framework in project.frameworks"
                :key="framework"
                class="relative flex flex-col items-center bg-[var(--skill-item)] border border-[var(--border-color)] p-4 rounded-xl shadow-md hover:bg-[var(--skill-item-hover)] transition"
              >
                <div v-html="frameworks.find(f => f.slug === framework)?.icon" class="w-12 h-12"></div>
                <span class="mt-2 text-[var(--text-color)] text-sm">{{ frameworks.find(f => f.slug === framework)?.name }}</span>
              </div>
            </div>
          </div>

          <!-- Technologies -->
          <div v-if="project.technologies.length" class="mt-10">
            <h3 class="text-2xl font-bold">Technologies</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              <div
                v-for="technology in project.technologies"
                :key="technology"
                class="relative flex flex-col items-center bg-[var(--skill-item)] border border-[var(--border-color)] p-4 rounded-xl shadow-md hover:bg-[var(--skill-item-hover)] transition"
              >
                <div v-html="technologies.find(t => t.slug === technology)?.icon" class="w-12 h-12"></div>
                <span class="mt-2 text-[var(--text-color)] text-sm">{{ technologies.find(t => t.slug === technology)?.name }}</span>
              </div>
            </div>
          </div>

          <!-- Project Timeline -->
          <div class="mt-10">
            <h3 class="text-2xl font-bold">Project Timeline</h3>
            <p class="text-[var(--text-3-color)] mt-2">{{ project.startDate }} - {{ project.endDate }}</p>
          </div>

          <!-- Project Link -->
          <div class="my-10">
            <h3 class="text-2xl font-bold">Project Link</h3>
            <a :href="project.link" target="_blank" class="text-blue-500 hover:underline break-words">{{ project.link }}</a>
          </div>

          <!-- Delete Project Button -->
          <div v-if="isAdmin" class="mb-10 flex justify-end">
            <button 
              @click="showDeleteModal = true, $emit('hideMobileButtons')" 
              class="text-red-500 hover:text-red-700 transition"
            >
              <Trash2 class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md z-50">
    <div class="bg-[var(--bg-color)] p-6 rounded-xl shadow-2xl border border-gray-700 text-[var(--text-color)] w-full max-w-md m-4">
      <h2 class="text-xl font-bold mb-4">Confirm Deletion</h2>
      <p>Are you sure you want to delete this project?</p>
      <div class="flex justify-end space-x-3 mt-4">
        <button type="button" @click="showDeleteModal = false, $emit('showMobileButtons')" class="bg-gray-600 text-[var(--text-color)] py-2 px-3 rounded-md transition duration-200 hover:bg-[var(--item)]">Cancel</button>
        <button type="button" @click="handleDelete" class="bg-red-600 text-[var(--text-color)] py-2 px-3 rounded-md transition duration-200 hover:bg-red-700">Delete</button>
      </div>
    </div>
  </div>

  <!-- Fullscreen Image Modal -->
  <div v-if="showImageModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md z-50" @click.self="showImageModal = false">
    <div class="relative p-4">
      <img :src="selectedImage ?? ''" class="max-w-full max-h-[90vh] rounded-lg shadow-lg" />
      <div class="flex justify-center mt-4">
        <button @click="showImageModal = false" class="bg-gray-800 text-red-600 rounded-full p-2 hover:text-red-800 transition">
          <X class="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap');

* {
  font-family: 'Nunito', sans-serif;
}

/* Customize the Swiper pagination dots */
:deep(.swiper-pagination-bullet) {
  background: #ffffff;
  opacity: 0.6;
}

:deep(.swiper-pagination-bullet-active) {
  background: #1d9bf0;
  opacity: 1;
}

/* Customize the Swiper navigation buttons */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  color: white;
}

:deep(svg) {
  width: 100% !important;
  height: 100% !important;
}
</style>