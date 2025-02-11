<template>
  <div class="flex h-dvh">
    <!-- Sidebar  -->
    <IconsSidebar
      v-motion
      :initial="sidebarInitial"
      :enter="sidebarEnter"
      :duration="sidebarDuration"
      :class="{ 'hidden': !isIconsMenuOpen, 'flex': isIconsMenuOpen }"
      class="w-full h-dvh bg-[#161a1d] p-4 flex flex-col border-r border-gray-600 md:w-72 md:flex"
      @closeIconsMenu="toggleIconsMenu"
      @showIconsMenu="isIconsMenuOpen = true"
    />

    <!-- Page Content -->
    <div class="flex-1 overflow-y-auto">
      <router-view
        :key="$route.fullPath"
        @closeIconsMenu="isIconsMenuOpen = false"
        @hideMobileButtons="$emit('hideMobileButtons')"
        @showMobileButtons="$emit('showMobileButtons')"
      />
    </div>
  </div>
</template>
  
<script setup lang="ts">
import IconsSidebar from "@/components/IconsSidebar.vue";
import { ref, computed } from "vue";

const isIconsMenuOpen = ref(false);

const toggleIconsMenu = () => {
  isIconsMenuOpen.value = !isIconsMenuOpen.value;
};

const windowSize = ref(window.innerWidth);

const sidebarInitial = computed(() => {
  return windowSize.value >= 768 ? { x: -288 } : { opacity: 0, x: 0 };
});

const sidebarEnter = computed(() => {
  return windowSize.value >= 768 ? { x: 0 } : { opacity: 1, x: 0 };
});

const sidebarDuration = computed(() => {
  return windowSize.value >= 768 ? 500 : 750;
});

window.addEventListener('resize', () => {
  windowSize.value = window.innerWidth;
});
</script>
