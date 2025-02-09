<template>
  <div class="flex h-screen">
    <!-- Sidebar  -->
    <CommentsSidebar
      v-motion
      :initial="{ x: -288 }"
      :enter="{ x: 0 }"
      :duration="500"
      :class="{ 'hidden': !isCommentsMenuOpen, 'flex': isCommentsMenuOpen }"
      class="w-full h-screen bg-[#161a1d] p-4 flex flex-col border-r border-gray-600 md:w-72 md:flex"
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
import { ref } from "vue";

const isCommentsMenuOpen = ref(false);

const toggleCommentsMenu = () => {
  isCommentsMenuOpen.value = !isCommentsMenuOpen.value;
};
</script>