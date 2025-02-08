<template>
  <aside>
    <div class="flex justify-between items-center">
      <h2 class="text-white text-2xl mt-6 md:text-lg md:mt-0 font-bold mb-4">{{ t("projects") }}</h2>
      <!-- Create Project Button -->
      <button v-if="isAdmin" @click="$emit('showCreateProjectModal')" class="text-white hover:text-gray-300 transition mb-4">
        <Plus class="w-6 h-6" />
      </button>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>

    <!-- Project List -->
    <nav v-else class="flex flex-col space-y-4 mt-6 lg:mt-0">
      <router-link
        v-for="project in projects"
        :key="project.slug"
        :to="`/projects/${project.slug}`"
        @click="$emit('closeProjectsMenu')"
        class="flex items-center px-5 py-3 rounded-lg text-white transition-all duration-200 bg-[#343a40] hover:bg-[#374151] hover:scale-101"
        active-class="bg-[#495057] border-l-4 border-white pl-4"
      >
        <div class="flex flex-col justify-center w-full">
          <h3 class="text-white font-medium truncate">
            {{ trimName(project.translations[locale as "en" | "fr"]?.name) }}
          </h3>
          <p class="text-gray-400 text-sm">
            {{ formatDate(project.startDate) }} – {{ formatDate(project.endDate) }}
          </p>
        </div>
        <ChevronRight class="text-gray-400 ml-auto w-6 h-6" />
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { fetchProjects } from "@/api/projectApi";
import type { Project } from "@/types/Project";
import { ChevronRight, Plus } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { useRoute } from "vue-router";

const { t, locale } = useI18n();

const projects = ref<Project[]>([]);
const errorMessage = ref<string>("");

const monthNames: Record<"en" | "fr", string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  fr: ["Janv", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"]
};

const formatDate = (dateStr: string): string => {
  const [month, year] = dateStr.split("/").map(Number);
  if (!month || !year || month < 1 || month > 12) {
    return "Invalid Date";
  }
  return `${monthNames[locale.value as "en" | "fr"][month - 1]} ${year}`;
};

const fetchAllProjects = async () => {
  const response = await fetchProjects() as Project[] | { message: string };
  if (Array.isArray(response)) {
    projects.value = response;
  } else {
    errorMessage.value = response.message;
  }
};


const emit = defineEmits(["showProjectsMenu", "closeProjectsMenu", "showCreateProjectModal"])
onMounted(() => {
  emit("showProjectsMenu");
  fetchAllProjects();

  window.addEventListener("refreshProjects", fetchAllProjects);
});

onUnmounted(() => {
  window.removeEventListener("refreshProjects", fetchAllProjects);
});

const trimName = (name: string): string => {
  return name.length > 20 ? name.slice(0, 20) + '...' : name;
};

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.hasRole("Admin"));

const route = useRoute();

watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/projects") {
      emit('showProjectsMenu')
    }
  },
  { immediate: true }
);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}
</style>