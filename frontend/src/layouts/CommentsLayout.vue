<template>
  <div class="flex h-dvh">
    <!-- Sidebar  -->
    <CommentsSidebar
      v-motion
      :initial="sidebarInitial"
      :enter="sidebarEnter"
      :duration="sidebarDuration"
      :class="{ 'hidden': !isCommentsMenuOpen, 'flex': isCommentsMenuOpen }"
      class="w-full h-dvh bg-[#161a1d] p-4 flex flex-col border-r border-gray-600 md:w-72 md:flex"
      @closeCommentsMenu="toggleCommentsMenu"
      @showCommentsMenu="isCommentsMenuOpen = true"
    />

    <!-- Page Content -->
    <div class="flex-1 overflow-y-auto">
      <router-view 
        :key="$route.fullPath" 
        @showGoBack="$emit('showGoBack')"
      />
    </div>
  </div>
</template>
  
<script setup lang="ts">
import CommentsSidebar from "@/components/CommentsSidebar.vue";
import { ref, computed } from "vue";

const isCommentsMenuOpen = ref(false);

const toggleCommentsMenu = () => {
  isCommentsMenuOpen.value = !isCommentsMenuOpen.value;
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