<template>
  <aside class="w-72 h-screen bg-[#161a1d] p-4 flex flex-col border-r border-gray-600">
    <h2 class="text-white text-lg font-bold mb-4">{{ t('commentsSidebar.title') }}</h2>

    <!-- Comments List -->
    <div class="flex flex-col space-y-4">
      <router-link
        to="/comments/verified"
        class="flex items-center px-5 py-3 rounded-lg text-white transition-all duration-200 bg-[#343a40] hover:bg-[#374151] hover:scale-101"
        active-class="bg-[#495057] border-l-4 border-white pl-4"
      >
        <div class="flex flex-col justify-center w-full">
          <h3 :class="getFontSizeClass(t('commentsSidebar.verifiedComments'))" class="text-white font-medium truncate">
            {{ t('commentsSidebar.verifiedComments') }}
          </h3>
        </div>
        <ChevronRight class="text-gray-400 ml-auto w-6 h-6" />
      </router-link>
      <router-link
        to="/comments/guest"
        class="flex items-center px-5 py-3 rounded-lg text-white transition-all duration-200 bg-[#343a40] hover:bg-[#374151] hover:scale-101"
        active-class="bg-[#495057] border-l-4 border-white pl-4"
      >
        <div class="flex flex-col justify-center w-full ">
          <h3 :class="getFontSizeClass(t('commentsSidebar.guestComments'))" class="text-white font-medium truncate">
            {{ t('commentsSidebar.guestComments') }}
          </h3>
        </div>
        <ChevronRight class="text-gray-400 ml-auto w-6 h-6" />
      </router-link>

      <!-- Separator -->
      <hr v-if="isAdmin" class="border-gray-600 mt-2 mb-6" />

      <!-- Admin Only Comments -->
      <router-link
        v-if="isAdmin"
        to="/comments/manage"
        class="flex items-center px-5 py-3 rounded-lg text-white transition-all duration-200 bg-[#343a40] hover:bg-[#374151] hover:scale-101"
        active-class="bg-[#495057] border-l-4 border-white pl-4"
      >
        <div class="flex flex-col justify-center w-full">
          <h3 :class="getFontSizeClass(t('commentsSidebar.manageComments'))" class="text-white font-medium truncate">
            {{ t('commentsSidebar.manageComments') }}
          </h3>
        </div>
        <ChevronRight class="text-gray-400 ml-auto w-6 h-6" />
      </router-link>
    </div>

    <!-- Login to leave a verified comment -->
    <p v-if="!isAuthenticated" class="mt-6 text-sm text-gray-400 text-center">
      {{ t('commentsSidebar.loginToComment') }}
    </p>
  </aside>
</template>
  
<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";
import { useI18n } from 'vue-i18n';
import { useAuth0 } from '@auth0/auth0-vue';

const { t } = useI18n();

const { isAuthenticated } = useAuth0();
const authStore = useAuthStore();
const isAdmin = computed(() => authStore.hasRole("Admin"));

const getFontSizeClass = (text: string) => {
  return text.length > 20 ? 'text-sm' : 'text-base';
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}
</style>