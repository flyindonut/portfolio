<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from 'vue-i18n';
import { useAuth0 } from '@auth0/auth0-vue';

const { t } = useI18n();

const { isAuthenticated } = useAuth0();
const authStore = useAuthStore();
const isAdmin = computed(() => authStore.hasRole("Admin"));

const getFontSizeClass = (text: string) => {
  return text.length > 20 ? 'text-sm' : 'text-base';
};

const route = useRoute();
const emit = defineEmits(["closeCommentsMenu", "showCommentsMenu"]);

watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/comments") {
      emit("showCommentsMenu")
    }
  },
  { immediate: true }
);
</script>

<template>
  <aside>
    <h2 class="text-[var(--text-color)] text-2xl mt-6 md:mt-4 lg:mt-0 lg:text-lg font-bold mb-4">{{ t('commentsSidebar.title') }}</h2>

    <!-- Comments List -->
    <nav class="flex flex-col space-y-4 mt-6 lg:mt-0">
      <router-link
        to="/comments/show"
        @click="$emit('closeCommentsMenu')"
        class="flex items-center px-5 py-4 md:py-3 rounded-lg text-[var(--text-color)] transition-all duration-200 bg-[var(--item)] hover:bg-[var(--item-hover)] hover:scale-101"
        active-class="bg-[var(--item-active)] border-l-4 border-[var(--border-color)] pl-4"
      >
        <div class="flex flex-col justify-center w-full">
          <h3 :class="getFontSizeClass(t('commentsSidebar.showComments'))" class="text-[var(--text-color)] font-medium truncate">
            {{ t('commentsSidebar.showComments') }}
          </h3>
        </div>
        <ChevronRight class="text-[var(--text-2-color)] ml-auto w-6 h-6" />
      </router-link>

      <!-- Separator -->
      <hr v-if="isAdmin" class="border-gray-600 mt-2 mb-6" />

      <!-- Admin Only Comments -->
      <router-link
        v-if="isAdmin"
        to="/comments/manage"
        @click="$emit('closeCommentsMenu')"
        class="flex items-center px-5 py-4 md:py-3 rounded-lg text-[var(--text-color)] transition-all duration-200 bg-[var(--item)] hover:bg-[var(--item-hover)] hover:scale-101"
        active-class="bg-[var(--item-active)] border-l-4 border-[var(--border-color)] pl-4"
      >
        <div class="flex flex-col justify-center w-full">
          <h3 :class="getFontSizeClass(t('commentsSidebar.manageComments'))" class="text-[var(--text-color)] font-medium truncate">
            {{ t('commentsSidebar.manageComments') }}
          </h3>
        </div>
        <ChevronRight class="text-[var(--text-2-color)] ml-auto w-6 h-6" />
      </router-link>
    </nav>

    <!-- Login to leave a verified comment -->
    <p v-if="!isAuthenticated" class="mt-6 text-sm text-[var(--text-2-color)] text-center">
      {{ t('commentsSidebar.loginToComment') }}
    </p>
  </aside>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}
</style>