<template>
  <div class="flex h-screen">

    <!-- Sidebar -->
    <ProjectsSidebar 
      v-motion
      :initial="{ x: -288 }"
      :enter="{ x: 0 }"
      :duration="500"
      @showCreateProjectModal="showCreateProjectModal = true"
      @refreshProjects="handleRefreshProjects"
    />

    <!-- Page Content -->
    <div class="flex-1 overflow-y-auto">
      <router-view 
        :key="$route.fullPath" 
        @showModifyProjectModal="handleShowModifyProjectModal" 
        @refreshProjects="handleRefreshProjects"
      />
    </div>

    <!-- Create Project Modal Form -->
    <CreateProject
      v-if="showCreateProjectModal" 
      @close="handleCreateProjectModalClose" 
      @refreshProjects="handleRefreshProjects"
    />

    <!-- Modify Project Modal -->
    <ModifyProject
      v-if="showModifyProjectModal && selectedProject" :project="selectedProject" 
      @close="handleModifyProjectModalClose" 
      @refreshProjects="handleRefreshProjects"
    />

  </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ProjectsSidebar from "@/components/ProjectsSidebar.vue";
import CreateProject from "@/components/CreateProject.vue";
import ModifyProject from "@/components/ModifyProject.vue";
import { fetchProjects } from "@/api/projectApi";
import type { Project } from "@/types/Project";

const showCreateProjectModal = ref(false);
const showModifyProjectModal = ref(false);
const selectedProject = ref<Project | null>(null);
const projects = ref<Project[]>([]);
const errorMessage = ref<string>("");
const router = useRouter();

const handleCreateProjectModalClose = () => {
  showCreateProjectModal.value = false;
};

const handleModifyProjectModalClose = () => {
  showModifyProjectModal.value = false;
};

const handleShowModifyProjectModal = (project: Project) => {
  router.push("/projects");
  selectedProject.value = project;
  showModifyProjectModal.value = true;
};

const handleRefreshProjects = () => {
  const event = new Event("refreshProjects");
  window.dispatchEvent(event);
};
</script>