<template>
  <div class="flex h-dvh">
    <!-- Sidebar  -->
    <IconsSidebar
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
import IconsSidebar from "@/components/IconsSidebar.vue";
</script>
