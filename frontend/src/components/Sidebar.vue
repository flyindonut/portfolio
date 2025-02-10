<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { Home, FolderKanban, FileText, Mail, Github, Linkedin, FileDown, Layers, Menu, X } from "lucide-vue-next";
import { useAuth0 } from "@auth0/auth0-vue";
import { useAuthStore } from "@/stores/auth";
import { useMotion } from "@vueuse/motion";

const { t, locale } = useI18n();
const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

const githubLink = "https://github.com/flyindonut";
const linkedinLink = "https://www.linkedin.com/in/de-bo-huang-a14a7b199/";

const cvLink = computed(() => `/cv/DeboHuang_CV_${locale.value.toUpperCase()}.pdf`);
const returnToUrl = window.location.origin;

const toggleLanguage = () => {
  locale.value = locale.value === "en" ? "fr" : "en";
  localStorage.setItem("selectedLanguage", locale.value);
};

onMounted(() => {
  const storedLang = localStorage.getItem("selectedLanguage");
  if (storedLang) {
    locale.value = storedLang;
  }
});

const viewAndDownloadCV = () => {
  const newTab = window.open(cvLink.value, "_blank");

  if (newTab) {
    setTimeout(() => {
      const downloadLink = document.createElement("a");
      downloadLink.href = cvLink.value;
      downloadLink.download = "DeboHuang_CV.pdf";
      downloadLink.click();
    }, 1000);
  }
};

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.hasRole("Admin"));
</script>

<template>
  <aside>
    <!-- Profile Info -->
    <div>
      <h1 class="hidden text-lg font-bold text-white md:flex">{{ t("name") }}</h1>
      <p class="hidden text-gray-400 text-sm md:flex">{{ t("title") }}</p>
    </div>

    <!-- Public Navigation Links -->
    <nav class="flex flex-col mt-20 space-y-3 lg:mt-6">
      <router-link 
        to="/"
        @click="$emit('closeMobileMenu')"
        class="flex items-center px-4 py-4 rounded-lg text-white transition-all duration-200 bg-[#343a40] hover:bg-[#374151] hover:scale-101 lg:py-2"
        active-class="bg-[#495057] border-l-4 border-white pl-3"
      >
        <Home class="w-5 h-5 mr-2" /> {{ t("home") }}
      </router-link>
      <router-link 
        to="/projects" 
        @click="$emit('closeMobileMenu')"
        class="flex items-center px-4 py-4 rounded-lg text-white transition-all duration-200 bg-[#343a40] hover:bg-[#374151] hover:scale-101 lg:py-2"
        active-class="bg-[#495057] border-l-4 border-white pl-3"
      >
        <FolderKanban class="w-5 h-5 mr-2" /> {{ t("projects") }}
      </router-link>
      <router-link
        to="/comments" 
        @click="$emit('closeMobileMenu')"
        class="flex items-center px-4 py-4 rounded-lg text-white transition-all duration-200 bg-[#343a40] hover:bg-[#374151] hover:scale-101 lg:py-2"
        active-class="bg-[#495057] border-l-4 border-white pl-3"
      >
        <FileText class="w-5 h-5 mr-2" /> {{ t("comments") }}
      </router-link>
      <router-link
        to="/contact"
        @click="$emit('closeMobileMenu')"
        class="flex items-center px-4 py-4 rounded-lg text-white transition-all duration-200 bg-[#343a40] hover:bg-[#374151] hover:scale-101 lg:py-2"
        active-class="bg-[#495057] border-l-4 border-white pl-3"
      >
        <Mail class="w-5 h-5 mr-2" /> {{ t("contact") }}
      </router-link>
    </nav>

    <div v-if="isAdmin">
      <!-- Separator -->
      <hr
        v-motion
        :initial="{ opacity: 0, y: 0 }"
        :enter="{ opacity: 1, y: 0 }"
        :duration="500" 
        class="border-gray-600 my-6" 
      />

      <!-- Admin Navigation Links -->
      <nav
        v-motion
        :initial="{ opacity: 0, y: 5 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="500"
        :duration="500" 
      class="flex flex-col space-y-3"
      >
        <router-link 
          to="/icons"
          @click="$emit('closeMobileMenu')"
          class="flex items-center px-4 py-4 rounded-lg text-white transition-all duration-200 bg-[#343a40] hover:bg-[#374151] hover:scale-101 lg:py-2"
          active-class="bg-[#495057] border-l-4 border-white pl-3"
        >
          <Layers class="w-5 h-5 mr-2" /> {{ t("manageIcons") }}
        </router-link>
      </nav>
    </div>

    <!-- Social Icons -->
    <div class="flex justify-center space-x-4 mt-auto">
      <a :href="githubLink" target="_blank" class="social-icon">
        <Github class="w-6 h-6" />
      </a>
      <a :href="linkedinLink" target="_blank" class="social-icon">
        <Linkedin class="w-6 h-6" />
      </a>
      <button @click="viewAndDownloadCV" class="social-icon">
        <FileDown class="w-6 h-6" />
      </button>
    </div>

    <!-- Separator -->
    <hr class="border-gray-600 mt-6 mb-4" />

    <!-- Footer Buttons -->
    <div class="flex flex-row space-x-2">
      <button class="flex-1 px-4 py-2 rounded-lg bg-[#343a40] text-white transition-all duration-200 hover:bg-[#374151] hover:scale-101">
        {{ t("other") }}
      </button>
      <button 
        class="flex-1 px-4 py-2 rounded-lg bg-[#343a40] text-white transition-all duration-200 hover:bg-[#374151] hover:scale-101"
        @click="toggleLanguage"
      >
        {{ t("language") }}
      </button>
    </div>

    <!-- Auth Buttons -->
    <div class="flex flex-row space-x-2 mt-4">
      <button 
        v-if="isLoading" 
        disabled
        class="flex-1 px-4 py-2 rounded-lg bg-gray-500 text-white opacity-50 cursor-not-allowed"
      >
        {{ t("loading") }}
      </button>

      <button 
        v-else-if="isAuthenticated" 
        @click="logout({ logoutParams: { returnTo: returnToUrl } })" 
        class="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white transition-all duration-200 hover:bg-red-700"
      >
        {{ t("logout") }}
      </button>
      
      <button 
        v-else 
        @click="() => loginWithRedirect()" 
        class="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white transition-all duration-200 hover:bg-blue-700"
      >
        {{ t("login") }}
      </button>
    </div>
  </aside>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

/* Social Icons */
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  background-color: #343a40;
  transition: all 0.2s ease-in-out;
  color: white;
}

.social-icon:hover {
  background-color: #495057;
  transform: scale(1.1);
}
</style>