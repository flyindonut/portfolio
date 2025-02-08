<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { ChevronRight, Edit } from "lucide-vue-next";
import { fetchAboutBySlug, updateAbout } from "@/api/aboutApi";
import { fetchServices } from "@/api/serviceApi";
import { fetchLanguages } from "@/api/languageApi";
import { fetchFrameworks } from "@/api/frameworkApi";
import { fetchTechnologies } from "@/api/technologyApi";
import { useAuthStore } from "@/stores/auth";
import type { About } from "@/types/About";
import type { Service } from "@/types/Service";
import type { Language } from "@/types/Language";
import type { Framework } from "@/types/Framework";
import type { Technology } from "@/types/Technology";

const { t, locale } = useI18n();

type Locale = 'en' | 'fr';

const authStore = useAuthStore();
const isAdmin = ref(false);
const isAuthStatusDefined = computed(() => authStore.roles.length > 0);

const about = ref<About | null>(null);
const services = ref<Service[]>([]);
const languages = ref<Language[]>([]);
const frameworks = ref<Framework[]>([]);
const technologies = ref<Technology[]>([]);
const isLoading = ref(true);
const showModal = ref(false);

const aboutFirstName = ref("");
const aboutLastName = ref("");
const aboutTitleEn = ref("");
const aboutTitleFr = ref("");
const aboutDescriptionEn = ref("");
const aboutDescriptionFr = ref("");
const aboutHobbiesEn = ref("");
const aboutHobbiesFr = ref("");
const selectedServices = ref<string[]>([]);
const selectedLanguages = ref<string[]>([]);
const selectedFrameworks = ref<string[]>([]);
const selectedTechnologies = ref<string[]>([]);
const selectedService = ref<string>("");
const selectedLanguage = ref<string>("");
const selectedFramework = ref<string>("");
const selectedTechnology = ref<string>("");

const currentStep = ref(1);

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const getFontSize = (text: string) => {
  if (text.length > 29) return 'text-xs';
  if (text.length > 27) return 'text-sm';
  return 'text-base';
};

const fetchAllData = async () => {
  about.value = await fetchAboutBySlug("debo-huang");
  services.value = await fetchServices();

  if (about.value) {
    const [languagesResponse, frameworksResponse, technologiesResponse] = await Promise.all([
      fetchLanguages(),
      fetchFrameworks(),
      fetchTechnologies()
    ]);

    languages.value = languagesResponse;
    frameworks.value = frameworksResponse;
    technologies.value = technologiesResponse;

    aboutFirstName.value = about.value.firstName;
    aboutLastName.value = about.value.lastName;
    aboutTitleEn.value = about.value.translations.en.title;
    aboutTitleFr.value = about.value.translations.fr.title;
    aboutDescriptionEn.value = about.value.translations.en.description;
    aboutDescriptionFr.value = about.value.translations.fr.description;
    aboutHobbiesEn.value = about.value.translations.en.hobbies;
    aboutHobbiesFr.value = about.value.translations.fr.hobbies;
    selectedServices.value = about.value.services;

    selectedLanguages.value = languages.value.filter(lang => about.value?.technologies.includes(lang.name)).map(lang => lang.name);
    selectedFrameworks.value = frameworks.value.filter(fw => about.value?.technologies.includes(fw.name)).map(fw => fw.name);
    selectedTechnologies.value = technologies.value.filter(tech => about.value?.technologies.includes(tech.name)).map(tech => tech.name);
  }

  isLoading.value = false;
};

onMounted(() => {
  fetchAllData();
});

watch(
  () => authStore.hasRole('Admin'),
  (newIsAdmin) => {
    isAdmin.value = newIsAdmin;
  },
  { immediate: true }
);

const handleUpdateAbout = async () => {
  if (!about.value) return;

  const updatedAbout = {
    ...about.value,
    firstName: aboutFirstName.value,
    lastName: aboutLastName.value,
    services: selectedServices.value,
    translations: {
      en: {
        ...about.value.translations.en,
        title: aboutTitleEn.value,
        description: aboutDescriptionEn.value,
        hobbies: aboutHobbiesEn.value,
      },
      fr: {
        ...about.value.translations.fr,
        title: aboutTitleFr.value,
        description: aboutDescriptionFr.value,
        hobbies: aboutHobbiesFr.value,
      },
    },
    technologies: [
      ...selectedLanguages.value,
      ...selectedFrameworks.value,
      ...selectedTechnologies.value,
    ],
  };

  await updateAbout("debo-huang", updatedAbout);
  showModal.value = false;
  fetchAllData();
  currentStep.value = 1;
};

const addService = () => {
  if (selectedService.value && !selectedServices.value.includes(selectedService.value)) {
    selectedServices.value.push(selectedService.value);
    selectedService.value = "";
  }
};

const removeService = (service: string) => {
  selectedServices.value = selectedServices.value.filter(s => s !== service);
};

const addLanguage = () => {
  if (selectedLanguage.value && !selectedLanguages.value.includes(selectedLanguage.value)) {
    selectedLanguages.value.push(selectedLanguage.value);
    selectedLanguage.value = "";
  }
};

const removeLanguage = (language: string) => {
  selectedLanguages.value = selectedLanguages.value.filter(l => l !== language);
};

const addFramework = () => {
  if (selectedFramework.value && !selectedFrameworks.value.includes(selectedFramework.value)) {
    selectedFrameworks.value.push(selectedFramework.value);
    selectedFramework.value = "";
  }
};

const removeFramework = (framework: string) => {
  selectedFrameworks.value = selectedFrameworks.value.filter(f => f !== framework);
};

const addTechnology = () => {
  if (selectedTechnology.value && !selectedTechnologies.value.includes(selectedTechnology.value)) {
    selectedTechnologies.value.push(selectedTechnology.value);
    selectedTechnology.value = "";
  }
};

const removeTechnology = (technology: string) => {
  selectedTechnologies.value = selectedTechnologies.value.filter(t => t !== technology);
};
</script>

<template>
  <section
    v-motion
    :initial="{ opacity: 0, y: 30 }"
    :enter="{ opacity: 1, y: 0 }"
    :delay="250"
    :duration="500"
    class="p-10 md:p-20 mx-auto max-w-5xl text-white"
  >
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
      <div class="border-6 border-white/30 border-t-white rounded-full w-8 h-8 animate-spin"></div>
    </div>

    <div v-else>
      <!-- Hero Section -->
      <div class="mb-10" v-if="about">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-5xl font-bold">{{ t(about.firstName) }} {{ t(about.lastName) }}</h1>
            <h2 class="text-xl text-gray-400">{{ about.translations[locale as Locale].title }}</h2>
          </div>
          <button v-if="isAuthStatusDefined && isAdmin" @click="showModal = true" class="text-white hover:text-gray-300 transition">
            <Edit class="w-6 h-6" />
          </button>
        </div>
        <div class="mt-4 h-[3px] bg-gradient-to-r from-[#b7c3d7] to-white rounded-full"></div>
        <p class="mt-4 text-gray-300" v-if="about.translations.en.description">
          {{ about.translations[locale as Locale].description }}
        </p>
      </div>

      <!-- Skills Section -->
      <div class="mt-10" v-if="services.length">
        <h3 class="text-2xl font-bold">{{ t("homePage.skillsTitle") }}</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          <div 
            v-for="service in services.filter(service => about?.services.includes(service.translations.en.name))"
            :key="service.slug" 
            class="flex items-center backdrop-blur-md bg-[#ffffff15] border border-[#ffffff22] p-4 rounded-xl shadow-md hover:bg-[#ffffff25] transition"
          >
            <div v-html="service.icon" class="w-6 h-6 text-white mr-3"></div>
            <span :class="getFontSize(service.translations[locale as Locale].name)" class="text-white">{{ service.translations[locale as Locale].name }}</span>
          </div>
        </div>
      </div>

      <!-- Technologies Section -->
      <div class="mt-12" v-if="about && about.technologies.length">
        <h3 class="text-2xl font-bold">{{ t("homePage.techTitle") }}</h3>
        <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
          <div 
            v-for="language in languages.filter(language => about?.technologies.includes(language.name))" 
            :key="language.slug" 
            class="flex flex-col items-center backdrop-blur-[10px] bg-[#ffffff15] border border-[#ffffff22] p-4 rounded-xl shadow-md hover:bg-[#ffffff25] transition"
          >
            <div v-html="language.icon" class="w-12 h-12 language-icon"></div>
            <span class="mt-2 text-white text-sm">{{ language.name }}</span>
          </div>
          <div 
            v-for="framework in frameworks.filter(framework => about?.technologies.includes(framework.name))" 
            :key="framework.slug" 
            class="flex flex-col items-center backdrop-blur-[10px] bg-[#ffffff15] border border-[#ffffff22] p-4 rounded-xl shadow-md hover:bg-[#ffffff25] transition"
          >
            <div v-html="framework.icon" class="w-12 h-12 framework-icon"></div>
            <span class="mt-2 text-white text-sm">{{ framework.name }}</span>
          </div>
          <div 
            v-for="technology in technologies.filter(technology => about?.technologies.includes(technology.name))" 
            :key="technology.slug" 
            class="flex flex-col items-center backdrop-blur-[10px] bg-[#ffffff15] border border-[#ffffff22] p-4 rounded-xl shadow-md hover:bg-[#ffffff25] transition"
          >
            <div v-html="technology.icon" class="w-12 h-12 technology-icon"></div>
            <span class="mt-2 text-white text-sm">{{ technology.name }}</span>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-12 text-center">
        <router-link 
          to="/projects" 
          class="inline-flex items-center bg-blue-600 px-6 py-3 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          {{ t("homePage.exploreProjects") }}
          <ChevronRight class="ml-2 w-5 h-5" />
        </router-link>
      </div>

      <!-- Hobbies Section -->
      <div class="mt-12" v-if="about && about.translations.en.hobbies">
        <h3 class="text-2xl font-bold">{{ t('homePage.hobbiesTitle') }}</h3>
        <p class="mt-4 text-gray-300">{{ about.translations[locale as Locale].hobbies }}</p>
      </div>
    </div>
  </section>

  <!-- Update About Modal -->
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md z-50 overflow-y-auto">
    <div class="bg-[#161a1d] p-6 rounded-xl shadow-2xl border border-gray-700 text-white w-full max-w-2xl mx-auto">
      <h2 class="text-xl font-bold mb-4">Update About</h2>
      <form @submit.prevent="handleUpdateAbout" class="space-y-4">
        <div v-if="currentStep === 1" class="space-y-4">
          <!-- First Name Input -->
          <div>
            <label class="block text-sm font-medium text-gray-300">First Name</label>
            <input v-model="aboutFirstName" type="text" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
          </div>

          <!-- Last Name Input -->
          <div>
            <label class="block text-sm font-medium text-gray-300">Last Name</label>
            <input v-model="aboutLastName" type="text" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
          </div>

          <!-- Title Input -->
          <div>
            <label class="block text-sm font-medium text-gray-300">Title (EN)</label>
            <input v-model="aboutTitleEn" type="text" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300">Title (FR)</label>
            <input v-model="aboutTitleFr" type="text" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between">
            <button type="button" @click="showModal = false" class="bg-gray-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-gray-700">Close</button>
            <button type="button" @click="nextStep" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Next</button>
          </div>
        </div>

        <div v-if="currentStep === 2" class="space-y-4">
          <!-- Description Input -->
          <div>
            <label class="block text-sm font-medium text-gray-300">Description (EN)</label>
            <textarea v-model="aboutDescriptionEn" rows="7" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300">Description (FR)</label>
            <textarea v-model="aboutDescriptionFr" rows="7" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between">
            <button type="button" @click="previousStep" class="bg-gray-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-gray-700">Previous</button>
            <button type="button" @click="nextStep" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Next</button>
          </div>
        </div>

        <div v-if="currentStep === 3" class="space-y-4">
          <!-- Services Dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-300">Services</label>
            <div class="flex items-center space-x-2">
              <select v-model="selectedService" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500">
                <option v-for="service in services.filter(s => !selectedServices.includes(s.translations.en.name))" :key="service.slug" :value="service.translations.en.name">{{ service.translations.en.name }}</option>
              </select>
              <button type="button" @click="addService" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Add</button>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span v-for="service in selectedServices" :key="service" class="bg-gray-700 text-white py-1 px-3 rounded-full flex items-center space-x-2">
                {{ service }}
                <button @click="removeService(service)" class="text-red-500 hover:text-red-700 ml-2">&times;</button>
              </span>
            </div>
          </div>

          <!-- Languages Dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-300">Languages</label>
            <div class="flex items-center space-x-2">
              <select v-model="selectedLanguage" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500">
                <option v-for="language in languages.filter(l => !selectedLanguages.includes(l.name))" :key="language.slug" :value="language.name">{{ language.name }}</option>
              </select>
              <button type="button" @click="addLanguage" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Add</button>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span v-for="language in selectedLanguages" :key="language" class="bg-gray-700 text-white py-1 px-3 rounded-full flex items-center space-x-2">
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
                <option v-for="framework in frameworks.filter(f => !selectedFrameworks.includes(f.name))" :key="framework.slug" :value="framework.name">{{ framework.name }}</option>
              </select>
              <button type="button" @click="addFramework" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Add</button>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span v-for="framework in selectedFrameworks" :key="framework" class="bg-gray-700 text-white py-1 px-3 rounded-full flex items-center space-x-2">
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
                <option v-for="technology in technologies.filter(t => !selectedTechnologies.includes(t.name))" :key="technology.slug" :value="technology.name">{{ technology.name }}</option>
              </select>
              <button type="button" @click="addTechnology" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Add</button>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span v-for="technology in selectedTechnologies" :key="technology" class="bg-gray-700 text-white py-1 px-3 rounded-full flex items-center space-x-2">
                {{ technology }}
                <button @click="removeTechnology(technology)" class="text-red-500 hover:text-red-700 ml-2">&times;</button>
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between">
            <button type="button" @click="previousStep" class="bg-gray-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-gray-700">Previous</button>
            <button type="button" @click="nextStep" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Next</button>
          </div>
        </div>

        <div v-if="currentStep === 4" class="space-y-4">
          <!-- Hobbies Input -->
          <div>
            <label class="block text-sm font-medium text-gray-300">Hobbies (EN)</label>
            <textarea v-model="aboutHobbiesEn" rows="7" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300">Hobbies (FR)</label>
            <textarea v-model="aboutHobbiesFr" rows="7" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between">
            <button type="button" @click="previousStep" class="bg-gray-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-gray-700">Previous</button>
            <button type="submit" class="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-blue-700">Save</button>
          </div>
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

:deep(.framework-icon svg),
:deep(.technology-icon svg),
:deep(.language-icon svg) {
  width: 100% !important;
  height: 100% !important;
}
</style>