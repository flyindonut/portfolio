<script setup lang="ts">
import { computed } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import Sidebar from "./components/Sidebar.vue";

const { isAuthenticated, isLoading } = useAuth0();

const isAuthStatusDefined = computed(() => !isLoading.value);
</script>

<template>
  <div class="flex h-screen text-light relative">
    <!-- Background Effects -->
    <div class="fixed inset-0 z-0 bg-gradient-to-br from-[#121417] via-[#191b1f] to-[#22252a]">
      <div class="absolute inset-0 bg-grid-pattern"></div>
      <div class="absolute inset-0 animated-aurora"></div>
    </div>

    <!-- Sidebar -->
    <Sidebar class="relative z-10" />

    <!-- Loading Indicator -->
    <div v-if="!isAuthStatusDefined" class="flex-1 flex flex-col items-center justify-center">
      <div class="border-6 border-white/30 border-t-white rounded-full w-8 h-8 animate-spin"></div>
    </div>

    <!-- Main Content -->
    <main v-else class="flex-1 overflow-y-auto relative z-10 bg-transparent">
      <div class="relative">
        <router-view />
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