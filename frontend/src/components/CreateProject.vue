<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchLanguages } from "@/api/languageApi";
import { fetchFrameworks } from "@/api/frameworkApi";
import { fetchTechnologies } from "@/api/technologyApi";
import { createProject as createProjectApi } from "@/api/projectApi";
import type { Language } from "@/types/Language";
import type { Framework } from "@/types/Framework";
import type { Technology } from "@/types/Technology";

const router = useRouter();
const emit = defineEmits(['close', 'refreshProjects', 'showMenuButton']);

const projectNameEn = ref<string>("");
const projectDescriptionEn = ref<string>("");
const projectNameFr = ref<string>("");
const projectDescriptionFr = ref<string>("");
const startDate = ref<string>("");
const endDate = ref<string>("");
const link = ref<string>("");

const languages = ref<Language[]>([]);
const frameworks = ref<Framework[]>([]);
const technologies = ref<Technology[]>([]);

const selectedLanguage = ref<string>("");
const selectedFramework = ref<string>("");
const selectedTechnology = ref<string>("");

const projectLanguages = ref<string[]>([]);
const projectFrameworks = ref<string[]>([]);
const projectTechnologies = ref<string[]>([]);
const projectImages = ref<string[]>([]);
const imageUrl = ref<string>("");

const fetchAllData = async () => {
  languages.value = await fetchLanguages();
  frameworks.value = await fetchFrameworks();
  technologies.value = await fetchTechnologies();
};

const addLanguage = () => {
  if (selectedLanguage.value && !projectLanguages.value.includes(selectedLanguage.value)) {
    projectLanguages.value.push(selectedLanguage.value);
    selectedLanguage.value = "";
  }
};

const addFramework = () => {
  if (selectedFramework.value && !projectFrameworks.value.includes(selectedFramework.value)) {
    projectFrameworks.value.push(selectedFramework.value);
    selectedFramework.value = "";
  }
};

const addTechnology = () => {
  if (selectedTechnology.value && !projectTechnologies.value.includes(selectedTechnology.value)) {
    projectTechnologies.value.push(selectedTechnology.value);
    selectedTechnology.value = "";
  }
};

const addImage = () => {
  if (imageUrl.value && !projectImages.value.includes(imageUrl.value)) {
    projectImages.value.push(imageUrl.value);
    imageUrl.value = "";
  }
};

const removeLanguage = (language: string) => {
  projectLanguages.value = projectLanguages.value.filter(l => l !== language);
};

const removeFramework = (framework: string) => {
  projectFrameworks.value = projectFrameworks.value.filter(f => f !== framework);
};

const removeTechnology = (technology: string) => {
  projectTechnologies.value = projectTechnologies.value.filter(t => t !== technology);
};

const removeImage = (image: string) => {
  projectImages.value = projectImages.value.filter(i => i !== image);
};

const createProject = async () => {
  if (!projectNameFr.value || !projectDescriptionFr.value) {
    alert("Please provide French name and description.");
    return;
  }

  const formatDate = (date: string) => {
    const [year, month] = date.split("-");
    return `${month}/${year}`;
  };

  const newProject = {
    slug: "",
    translations: {
      en: { name: projectNameEn.value, description: projectDescriptionEn.value },
      fr: { name: projectNameFr.value, description: projectDescriptionFr.value }
    },
    startDate: formatDate(startDate.value),
    endDate: formatDate(endDate.value),
    technologies: projectTechnologies.value,
    languages: projectLanguages.value,
    frameworks: projectFrameworks.value,
    images: projectImages.value,
    link: link.value
  };
  const response = await createProjectApi(newProject);
  emit('refreshProjects');
  emit('close');
  router.push(`/projects/${response.slug}`);
};

onMounted(() => {
  fetchAllData();
});
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md z-50">
    <div class="bg-[var(--bg-color)] p-6 rounded-xl shadow-2xl border border-gray-700 text-[var(--text-color)] w-full max-w-4xl m-4 overflow-y-auto max-h-[80vh]">
      <h2 class="text-xl font-bold mb-4">Create Project</h2>
      <form @submit.prevent="createProject" class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- English Name Input -->
        <div>
          <label class="block text-sm font-medium text-[var(--text-3-color)]">Project Name (EN)</label>
          <input v-model="projectNameEn" type="text" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
        </div>

        <!-- French Name Input -->
        <div>
          <label class="block text-sm font-medium text-[var(--text-3-color)]">Project Name (FR)</label>
          <input v-model="projectNameFr" type="text" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
        </div>

        <!-- English Description Input -->
        <div>
          <label class="block text-sm font-medium text-[var(--text-3-color)]">Project Description (EN)</label>
          <textarea v-model="projectDescriptionEn" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500 field-sizing-content" required></textarea>
        </div>

        <!-- French Description Input -->
        <div>
          <label class="block text-sm font-medium text-[var(--text-3-color)]">Project Description (FR)</label>
          <textarea v-model="projectDescriptionFr" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500 field-sizing-content" required></textarea>
        </div>

        <!-- Start & End Date Inputs -->
        <div>
          <label class="block text-sm font-medium text-[var(--text-3-color)]">Start Date</label>
          <input v-model="startDate" type="month" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--text-3-color)]">End Date</label>
          <input v-model="endDate" type="month" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
        </div>

        <!-- Dropdown Fields -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-1 md:col-span-2">
          
          <!-- Languages Dropdown -->
          <div>
            <label class="block text-sm font-medium text-[var(--text-3-color)]">Languages</label>
            <div class="flex items-center space-x-2">
              <select v-model="selectedLanguage" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500">
                <option v-for="language in languages" :key="language.slug" :value="language.slug">{{ language.name }}</option>
              </select>
              <button type="button" @click="addLanguage" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Add</button>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span v-for="language in projectLanguages" :key="language" class="bg-[var(--item)] text-[var(--text-color)] py-1 px-3 rounded-full flex items-center space-x-2">
                {{ language }}
                <button @click="removeLanguage(language)" class="text-red-500 hover:text-red-700 ml-2">&times;</button>
              </span>
            </div>
          </div>

          <!-- Frameworks Dropdown -->
          <div>
            <label class="block text-sm font-medium text-[var(--text-3-color)]">Frameworks</label>
            <div class="flex items-center space-x-2">
              <select v-model="selectedFramework" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500">
                <option v-for="framework in frameworks" :key="framework.slug" :value="framework.slug">{{ framework.name }}</option>
              </select>
              <button type="button" @click="addFramework" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Add</button>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span v-for="framework in projectFrameworks" :key="framework" class="bg-[var(--item)] text-[var(--text-color)] py-1 px-3 rounded-full flex items-center space-x-2">
                {{ framework }}
                <button @click="removeFramework(framework)" class="text-red-500 hover:text-red-700 ml-2">&times;</button>
              </span>
            </div>
          </div>

          <!-- Technologies Dropdown -->
          <div>
            <label class="block text-sm font-medium text-[var(--text-3-color)]">Technologies</label>
            <div class="flex items-center space-x-2">
              <select v-model="selectedTechnology" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500">
                <option v-for="technology in technologies" :key="technology.slug" :value="technology.slug">{{ technology.name }}</option>
              </select>
              <button type="button" @click="addTechnology" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Add</button>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span v-for="technology in projectTechnologies" :key="technology" class="bg-[var(--item)] text-[var(--text-color)] py-1 px-3 rounded-full flex items-center space-x-2">
                {{ technology }}
                <button @click="removeTechnology(technology)" class="text-red-500 hover:text-red-700 ml-2">&times;</button>
              </span>
            </div>
          </div>

        </div>

        <!-- Images Input -->
        <div class="col-span-1 md:col-span-2">
          <label class="block text-sm font-medium text-[var(--text-3-color)]">Images</label>
          <div class="flex items-center space-x-2">
            <input v-model="imageUrl" type="text" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" placeholder="Image URL" />
            <button type="button" @click="addImage" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Add</button>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <span v-for="image in projectImages" :key="image" class="bg-[var(--item)] text-[var(--text-color)] py-1 px-3 rounded-full flex items-center space-x-2">
              {{ image }}
              <button @click="removeImage(image)" class="text-red-500 hover:text-red-700 ml-2">&times;</button>
            </span>
          </div>
        </div>

        <!-- Link Input -->
        <div class="col-span-1 md:col-span-2">
          <label class="block text-sm font-medium text-[var(--text-3-color)]">Project Link</label>
          <input v-model="link" type="text" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" placeholder="Project Link" required />
        </div>

        <!-- Action Buttons -->
        <div class="col-span-1 md:col-span-2 flex justify-end space-x-3">
          <button type="button" @click="$emit('close'), $emit('showMenuButton')" class="bg-gray-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-gray-500">Cancel</button>
          <button type="submit" class="bg-blue-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-blue-700">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap');

* {
  font-family: 'Nunito', sans-serif;
}
</style>