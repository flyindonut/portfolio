<template>
  <div class="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md z-50">
    <div class="bg-[#161a1d] p-6 rounded-xl shadow-2xl border border-gray-700 text-white w-full max-w-4xl m-4 overflow-y-auto max-h-[80vh]">
      <h2 class="text-xl font-bold mb-4">Modify Project</h2>
      <form @submit.prevent="modifyProject" class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- English Name Input -->
        <div>
          <label class="block text-sm font-medium text-gray-300">Project Name (EN)</label>
          <input v-model="projectNameEn" type="text" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
        </div>

        <!-- French Name Input -->
        <div>
          <label class="block text-sm font-medium text-gray-300">Project Name (FR)</label>
          <input v-model="projectNameFr" type="text" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
        </div>

        <!-- English Description Input -->
        <div>
          <label class="block text-sm font-medium text-gray-300">Project Description (EN)</label>
          <textarea v-model="projectDescriptionEn" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required></textarea>
        </div>

        <!-- French Description Input -->
        <div>
          <label class="block text-sm font-medium text-gray-300">Project Description (FR)</label>
          <textarea v-model="projectDescriptionFr" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required></textarea>
        </div>

        <!-- Start & End Date Inputs -->
        <div>
          <label class="block text-sm font-medium text-gray-300">Start Date</label>
          <input v-model="startDate" type="month" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300">End Date</label>
          <input v-model="endDate" type="month" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
        </div>

        <!-- Dropdown Fields -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-1 md:col-span-2">
          
          <!-- Languages Dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-300">Languages</label>
            <div class="flex items-center space-x-2">
              <select v-model="selectedLanguage" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500">
                <option v-for="language in languages" :key="language.slug" :value="language.slug">{{ language.name }}</option>
              </select>
              <button type="button" @click="addLanguage" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Add</button>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span v-for="language in projectLanguages" :key="language" class="bg-gray-700 text-white py-1 px-3 rounded-full flex items-center space-x-2">
                {{ language }}
                <button @click="removeLanguage(language)" class="text-red-500 hover:text-red-700 ml-2">&times;</button>
              </span>
            </div>
          </div>

          <!-- Frameworks Dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-300">Frameworks</label>
            <div class="flex items-center space-x-2">
              <select v-model="selectedFramework" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500">
                <option v-for="framework in frameworks" :key="framework.slug" :value="framework.slug">{{ framework.name }}</option>
              </select>
              <button type="button" @click="addFramework" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Add</button>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span v-for="framework in projectFrameworks" :key="framework" class="bg-gray-700 text-white py-1 px-3 rounded-full flex items-center space-x-2">
                {{ framework }}
                <button @click="removeFramework(framework)" class="text-red-500 hover:text-red-700 ml-2">&times;</button>
              </span>
            </div>
          </div>

          <!-- Technologies Dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-300">Technologies</label>
            <div class="flex items-center space-x-2">
              <select v-model="selectedTechnology" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500">
                <option v-for="technology in technologies" :key="technology.slug" :value="technology.slug">{{ technology.name }}</option>
              </select>
              <button type="button" @click="addTechnology" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Add</button>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span v-for="technology in projectTechnologies" :key="technology" class="bg-gray-700 text-white py-1 px-3 rounded-full flex items-center space-x-2">
                {{ technology }}
                <button @click="removeTechnology(technology)" class="text-red-500 hover:text-red-700 ml-2">&times;</button>
              </span>
            </div>
          </div>

        </div>

        <!-- Images Input -->
        <div class="col-span-1 md:col-span-2">
          <label class="block text-sm font-medium text-gray-300">Images</label>
          <div class="flex items-center space-x-2">
            <input v-model="imageUrl" type="text" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500 break-all" placeholder="Image URL" />
            <button type="button" @click="addImage" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Add</button>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <span v-for="image in projectImages" :key="image" 
              class="bg-gray-700 text-white py-1 px-3 rounded-md md:rounded-full flex items-end space-x-2 break-words text-sm md:text-base">
              <span class="break-words whitespace-normal max-w-[60vw] md:max-w-full">{{ image }}</span>
              <button @click="removeImage(image)" class="text-red-500 hover:text-red-700 ml-2">&times;</button>
            </span>
          </div>
        </div>


        <!-- Link Input -->
        <div class="col-span-1 md:col-span-2">
          <label class="block text-sm font-medium text-gray-300">Project Link</label>
          <input v-model="link" type="text" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" placeholder="Project Link" required />
        </div>

        <!-- Action Buttons -->
        <div class="col-span-1 md:col-span-2 flex justify-end space-x-3">
          <button type="button" @click="returnToProject" class="bg-gray-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-gray-700">Cancel</button>
          <button type="submit" class="bg-blue-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-blue-700">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchLanguages } from "@/api/languageApi";
import { fetchFrameworks } from "@/api/frameworkApi";
import { fetchTechnologies } from "@/api/technologyApi";
import { updateProject } from "@/api/projectApi";
import type { Language } from "@/types/Language";
import type { Framework } from "@/types/Framework";
import type { Technology } from "@/types/Technology";
import type { Project } from "@/types/Project";

const props = defineProps<{ project: Project }>();
const emit = defineEmits(['close', 'refreshProjects']);
const router = useRouter();

const projectNameEn = ref(props.project.translations.en.name);
const projectDescriptionEn = ref(props.project.translations.en.description);
const projectNameFr = ref(props.project.translations.fr.name);
const projectDescriptionFr = ref(props.project.translations.fr.description);

const formatDateForInput = (date: string) => {
  const [month, year] = date.split("/");
  return `${year}-${month}`;
};

const startDate = ref(formatDateForInput(props.project.startDate));
const endDate = ref(formatDateForInput(props.project.endDate));
const link = ref(props.project.link);

const languages = ref<Language[]>([]);
const frameworks = ref<Framework[]>([]);
const technologies = ref<Technology[]>([]);

const selectedLanguage = ref<string>("");
const selectedFramework = ref<string>("");
const selectedTechnology = ref<string>("");

const projectLanguages = ref<string[]>(props.project.languages);
const projectFrameworks = ref<string[]>(props.project.frameworks);
const projectTechnologies = ref<string[]>(props.project.technologies);
const projectImages = ref<string[]>(props.project.images);
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

const returnToProject = () => {
  router.go(-1);
  emit('close');
};

const modifyProject = async () => {
  const formatDate = (date: string) => {
    const [year, month] = date.split("-");
    return `${month}/${year}`;
  };

  const updatedProject = {
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

  const response = await updateProject(props.project.slug, updatedProject);
  emit('refreshProjects');
  emit('close');
  router.push(`/projects/${response.slug}`);
};

onMounted(() => {
  fetchAllData();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap');

* {
  font-family: 'Nunito', sans-serif;
}
</style>