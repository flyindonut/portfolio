<template>
  <div class="flex h-screen">
    <!-- Sidebar  -->
    <CommentsSidebar
      v-motion
      :initial="{ x: -288 }"
      :enter="{ x: 0 }"
      :duration="500"
    />

    <!-- Page Content -->
    <div class="flex-1 overflow-y-auto">
      <router-view :key="$route.fullPath" />
    </div>
  </div>
</template>
  
<script setup lang="ts">
import CommentsSidebar from "@/components/CommentsSidebar.vue";
</script>