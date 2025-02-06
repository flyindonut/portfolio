<template>
  <div class="flex h-screen">
    
    <!-- Sidebar -->
    <ProjectsSidebar 
      v-motion
      :initial="{ x: -288 }"
      :enter="{ x: 0 }"
      :duration="500"
      @showCreateProjectModal="showCreateProjectModal = true"
      @refetchProjects="fetchAllProjects"
    />

    <!-- Page Content -->
    <div class="flex-1 overflow-y-auto">
      <router-view :key="$route.fullPath" @showModifyProjectModal="handleShowModifyProjectModal" />
    </div>

    <!-- Create Project Modal Form -->
    <CreateProject v-if="showCreateProjectModal" @close="handleCreateProjectModalClose" @projectCreated="handleProjectCreated" />

    <!-- Modify Project Modal -->
    <ModifyProject v-if="showModifyProjectModal && selectedProject" :project="selectedProject" @close="handleModifyProjectModalClose" @projectModified="handleProjectModified" />
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

const handleProjectCreated = () => {
  showCreateProjectModal.value = false;
  fetchAllProjects();
};

const handleProjectModified = () => {
  showModifyProjectModal.value = false;
  fetchAllProjects();
};

const handleShowModifyProjectModal = (project: Project) => {
  router.push("/projects");
  selectedProject.value = project;
  showModifyProjectModal.value = true;
};

const fetchAllProjects = async () => {
  try {
    const response = await fetchProjects();
    projects.value = response;
  } catch (error) {
    errorMessage.value = "Failed to fetch projects.";
  }
};

onMounted(fetchAllProjects);
</script>