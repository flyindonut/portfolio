<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchLanguages, createLanguage, deleteLanguage } from "@/api/languageApi";
import type { Language } from "@/types/Language";
import { Plus, Trash } from "lucide-vue-next";
import Breadcrumb from "@/components/Breadcrumb.vue";

const languages = ref<Language[]>([]);
const newLanguage = ref<Language>({ name: "", slug: "", icon: "" });
const errorMessage = ref<string | null>(null);
const showModal = ref(false);
const showDeleteModal = ref(false);
const languageToDelete = ref<Language | null>(null);

const emit = defineEmits(["closeIconsMenu", "hideMobileButtons", "showMobileButtons"]);

const fetchAllLanguages = async () => {
  try {
    const response = await fetchLanguages();
    languages.value = response;
  } catch (error) {
    errorMessage.value = "Failed to fetch languages.";
  }
};

const newlyAddedSlug = ref<string | null>(null);

const handleCreateLanguage = async () => {
  try {
    const response = await createLanguage(newLanguage.value);
    newlyAddedSlug.value = response.slug;

    newLanguage.value = { name: "", slug: "", icon: "" };
    uploadedFileName.value = null;
    showModal.value = false;
    emit('showMobileButtons')
    fetchAllLanguages();
    
    setTimeout(() => {
      newlyAddedSlug.value = null;
    }, 1000);
  } catch (error) {
    errorMessage.value = "Failed to create language.";
  }
};

const handleDeleteLanguage = async () => {
  if (languageToDelete.value) {
    try {
      await deleteLanguage(languageToDelete.value.slug);
      showDeleteModal.value = false;
      emit('showMobileButtons')
      languageToDelete.value = null;
      fetchAllLanguages();
    } catch (error) {
      errorMessage.value = "Failed to delete language.";
    }
  }
};

onMounted(() => {
  emit("closeIconsMenu");
  fetchAllLanguages();
});

const uploadedFileName = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  if (fileInput.value) fileInput.value.click();
};

const handleIconUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    if (file.type !== "image/svg+xml") {
      errorMessage.value = "Please upload an SVG file.";
      return;
    }
    uploadedFileName.value = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      newLanguage.value.icon = reader.result as string;
    };
    reader.readAsText(file);
  }
};
</script>

<template>
  <div class="flex h-dvh overflow-y-scroll">
    <div
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0 }"
      :delay="100"
      :duration="500"
      class="flex-1 flex flex-col p-10 lg:p-20 mx-auto max-w-4xl text-[var(--text-color)] mt-14 lg:mt-0"
    >

      <!-- Breadcrumb Navigation -->
      <Breadcrumb />

      <div class="flex justify-between items-center">
        <h1 class="text-4xl md:text-5xl font-bold">Languages</h1>
        <button @click="showModal = true, $emit('hideMobileButtons')" class="text-[var(--text-color)] hover:text-[var(--text-3-color)] transition">
          <Plus class="w-6 h-6" />
        </button>
      </div>
      <div class="h-[3px] bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] rounded-full mt-6"></div>

      <!-- Error Message -->
      <p v-if="errorMessage" class="text-[var(--text-color)] bg-red-500/90 border border-red-700 p-3 rounded-md mt-6">
        {{ errorMessage }}
      </p>

      <!-- No Languages Message -->
      <p v-if="!errorMessage && languages.length === 0" class="text-[var(--text-2-color)] mt-6">No languages available.</p>

      <!-- Languages List with Transition -->
      <transition-group
        tag="div"
        name="fade"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6"
      >
        <div
          v-for="language in languages"
          :key="language.slug"
          v-motion="{
            initial: language.slug === newlyAddedSlug ? { opacity: 0, y: 0 } : {},
            enter: language.slug === newlyAddedSlug ? { opacity: 1, y: 0 } : {},
          }"
          class="relative flex flex-col items-center bg-[var(--skill-item)] border border-[var(--border-color)] p-4 rounded-xl shadow-md hover:bg-[var(--skill-item-hover)] transition"
        >
          <div v-html="language.icon" class="w-12 h-12 language-icon"></div>
          <span class="mt-2 text-[var(--text-color)] text-sm">{{ language.name }}</span>
          
          <button @click="languageToDelete = language; showDeleteModal = true, $emit('hideMobileButtons')" 
            class="absolute bottom-2 right-2 text-red-500 hover:text-red-700 transition">
            <Trash class="w-5 h-5" />
          </button>
        </div>
      </transition-group>
    </div>
  </div>

  <!-- Add Language Modal -->
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md z-50">
    <div class="bg-[var(--bg-color)] p-6 rounded-xl shadow-2xl border border-gray-700 text-[var(--text-color)] w-full max-w-md mx-4">
      <h2 class="text-xl font-bold mb-4">Add New Language</h2>
      <form @submit.prevent="handleCreateLanguage" class="space-y-4">
        
        <!-- Name Input -->
        <div>
          <label class="block text-sm font-medium text-[var(--text-3-color)]">Name</label>
          <input v-model="newLanguage.name" type="text" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
        </div>

        <!-- Icon Upload Input -->
        <div>
          <label class="block text-sm font-medium text-[var(--text-3-color)] mb-2">Icon (SVG Only)</label>
          <div class="relative flex items-center space-x-3">
            
            <!-- Hidden File Input -->
            <input type="file" accept=".svg" @change="handleIconUpload" ref="fileInput" class="hidden" />
            
            <!-- Custom Button -->
            <button type="button" @click="triggerFileInput" class="bg-gray-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-gray-500 flex items-center space-x-2">
              <Plus class="w-5 h-5" />
              <span>Select File</span>
            </button>
        
            <!-- Confirmation Message -->
            <span v-if="uploadedFileName" class="text-green-400 flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ uploadedFileName }}</span>
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <button type="button" @click="showModal = false, $emit('showMobileButtons')" class="bg-gray-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-gray-500">Cancel</button>
          <button type="submit" class="bg-blue-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-blue-700">Add</button>
        </div>
      </form>
    </div>
  </div>

<!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md z-50">
    <div class="bg-[var(--bg-color)] p-6 rounded-xl shadow-2xl border border-gray-700 text-[var(--text-color)] w-full max-w-md mx-4">
      <h2 class="text-xl font-bold mb-4">Confirm Deletion</h2>
      <p>Are you sure you want to delete this language?</p>
      <div class="flex justify-end space-x-3 mt-4">
        <button type="button" @click="showDeleteModal = false, $emit('showMobileButtons')" class="bg-gray-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-gray-500">Cancel</button>
        <button type="button" @click="handleDeleteLanguage" class="bg-red-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-red-700">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap');

* {
  font-family: 'Nunito', sans-serif;
}

:deep(.language-icon svg) {
  width: 100% !important;
  height: 100% !important;
}
</style>