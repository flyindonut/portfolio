<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import ProjectsSidebar from "@/components/ProjectsSidebar.vue";
import CreateProject from "@/components/CreateProject.vue";
import ModifyProject from "@/components/ModifyProject.vue";
import type { Project } from "@/types/Project";

const showCreateProjectModal = ref(false);
const showModifyProjectModal = ref(false);
const selectedProject = ref<Project | null>(null);

const route = useRoute();

const handleCreateProjectModalClose = () => {
  showCreateProjectModal.value = false;
};

const handleModifyProjectModalClose = () => {
  showModifyProjectModal.value = false;
};

const handleShowModifyProjectModal = (project: Project) => {
  selectedProject.value = project;
  showModifyProjectModal.value = true;
};

const handleRefreshProjects = () => {
  const event = new Event("refreshProjects");
  window.dispatchEvent(event);
};

const isProjectsMenuOpen = ref(false);

const toggleProjectsMenu = () => {
  isProjectsMenuOpen.value = !isProjectsMenuOpen.value;
};

const windowSize = ref(window.innerWidth);

const sidebarInitial = computed(() => {
  return windowSize.value >= 768 ? { x: -288 } : { opacity: 0, x: 0 };
});

const sidebarEnter = computed(() => {
  return windowSize.value >= 768 ? { x: 0 } : { opacity: 1, x: 0 };
});

const sidebarDuration = computed(() => {
  return windowSize.value >= 768 ? 500 : 750;
});

const updateWindowSize = () => {
  windowSize.value = window.innerWidth;
};

window.addEventListener('resize', updateWindowSize);

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize);
});

watch(route, () => {
  handleModifyProjectModalClose();
  handleCreateProjectModalClose();
});
</script>

<template>
  <div class="flex h-dvh">

    <!-- Sidebar -->
    <ProjectsSidebar 
      v-motion
      :initial="sidebarInitial"
      :enter="sidebarEnter"
      :duration="sidebarDuration"
      :class="{ 'hidden': !isProjectsMenuOpen, 'flex': isProjectsMenuOpen }"
      class="h-dvh w-full bg-[var(--bg-color)] p-4 flex-col border-r border-gray-600 overflow-y-auto md:w-72 md:flex"
      @showCreateProjectModal="showCreateProjectModal = true"
      @refreshProjects="handleRefreshProjects"
      @closeProjectsMenu="toggleProjectsMenu"
      @showProjectsMenu="isProjectsMenuOpen = true"
      @hideMenuButton="$emit('hideMenuButton')"
    />

    <!-- Page Content -->
    <div class="flex-1 overflow-y-auto">
      <router-view 
        :key="$route.fullPath" 
        @showModifyProjectModal="handleShowModifyProjectModal" 
        @refreshProjects="handleRefreshProjects"
        @closeProjectsMenu="isProjectsMenuOpen = false"
        @hideMobileButtons="$emit('hideMobileButtons')"
        @showMobileButtons="$emit('showMobileButtons')"
      />
    </div>

    <!-- Create Project Modal Form -->
    <CreateProject
      v-if="showCreateProjectModal" 
      @close="handleCreateProjectModalClose" 
      @refreshProjects="handleRefreshProjects"
      @showMenuButton="$emit('showMenuButton')"
    />

    <!-- Modify Project Modal -->
    <ModifyProject
      v-if="showModifyProjectModal && selectedProject" :project="selectedProject" 
      @close="handleModifyProjectModalClose"
      @refreshProjects="handleRefreshProjects"
      @showMobileButtons="$emit('showMobileButtons')"
    />

  </div>
</template>