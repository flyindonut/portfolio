<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import Sidebar from "./components/Sidebar.vue";
import { ChevronLeft, Menu, X } from "lucide-vue-next";
import { useRouter, useRoute } from "vue-router";

const { isLoading } = useAuth0();

const isAuthStatusDefined = computed(() => !isLoading.value);

const isMobileMenuOpen = ref(false);
const route = useRoute();

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const isGoBackVisible = ref(false);

const router = useRouter();

const goBack = () => {
  router.go(-1);
};

const isMobileMenuVisible = ref(true);

const showGoBackButton = () => {
  isGoBackVisible.value = true
}

const hideGoBackButton = () => {
  isGoBackVisible.value = false;
}

const showMenuButton = () => {
  isMobileMenuVisible.value = true;
}

const hideMenuButton = () => {
  isMobileMenuVisible.value = false;
}

watch([isMobileMenuOpen, () => route.path], ([newIsMobileMenuOpen, newPath]) => {
  if (newIsMobileMenuOpen) {
    isGoBackVisible.value = false;
  }

  if (newPath == "/projects" || newPath === "/comments" || newPath === "/icons" || newPath === "/") {
    isMobileMenuVisible.value = true;
    isGoBackVisible.value = false;
  } else if (newPath.startsWith("/projects/") || newPath.startsWith("/comments/") || newPath.startsWith("/icons/")) {
    if (!newIsMobileMenuOpen) {
      isGoBackVisible.value = true;
      isMobileMenuVisible.value = true;
    }
  }
});

</script>

<template>
  <div class="flex h-dvh text-light relative">
    <!-- Background Effects -->
    <div class="fixed inset-0 z-0 bg-gradient-to-br from-[#121417] via-[#191b1f] to-[#22252a]">
      <div class="absolute inset-0 bg-grid-pattern"></div>
      <div class="absolute inset-0 animated-aurora"></div>
    </div>

    <!-- Mobile Menu -->
    <div 
      @click="toggleMobileMenu"
      :class="{ 'hidden': !isMobileMenuVisible, 'flex': isMobileMenuVisible }"
      class="border-gray-600 bg-[#343a40]/5 absolute top-8 right-4 z-50 rounded-lg border p-2 backdrop-blur lg:hidden"
    >
      <div tabindex="0">
        <component :is="isMobileMenuOpen ? X : Menu" class="w-6 h-6 text-white"/>
      </div>
    </div>

    <!-- Mobile Go Back -->
    <div 
      @click="goBack"
      :class="{ 'hidden': !isGoBackVisible, 'flex': isGoBackVisible }"
      class="border-gray-600 bg-[#343a40]/5 absolute top-8 left-4 z-50 rounded-lg border p-2 backdrop-blur lg:hidden"
    >
      <div tabindex="0">
        <ChevronLeft class="w-6 h-6 text-white"/>
      </div>
    </div>
    
    <!-- Sidebar -->
    <Sidebar
      @closeMobileMenu="isMobileMenuOpen = false"
      :class="{ 'hidden': !isMobileMenuOpen, 'flex': isMobileMenuOpen }"
      class="relative z-10 w-full h-dvh bg-[#161a1d] p-4 flex-col border-r border-gray-600 md:flex lg:w-60 xl:w-72 xl:flex xl:w-72" 
    />

    <!-- Loading Indicator -->
    <div v-if="!isAuthStatusDefined" class="flex-1 flex flex-col items-center justify-center">
      <div class="border-6 border-white/30 border-t-white rounded-full w-8 h-8 animate-spin"></div>
    </div>

    <!-- Main Content -->
    <main v-else class="flex-1 overflow-y-auto relative z-10 bg-transparent">
      <div class="relative">
        <router-view
          @showMobileButtons="showGoBackButton(), showMenuButton()"
          @hideMobileButtons="hideGoBackButton(), hideMenuButton()"
          @hideMenuButton="hideMenuButton"
          @showMenuButton="showMenuButton"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Simplified Grid Pattern */
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.20;
  filter: drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.05));
}

/* Simplified Aurora Gradient */
.animated-aurora {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: 
    radial-gradient(circle at 30% 40%, rgba(0, 100, 255, 0.1), transparent 60%),
    radial-gradient(circle at 70% 80%, rgba(180, 0, 255, 0.1), transparent 60%),
    radial-gradient(circle at 50% 50%, rgba(0, 200, 150, 0.08), transparent 60%);
  pointer-events: none;
}
</style>