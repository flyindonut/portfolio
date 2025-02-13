<template>
  <nav class="text-[var(--text-2-color)] text-sm mb-6">
    <ul class="flex space-x-2">
      <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center">
        <router-link 
          v-if="crumb.path" 
          :to="crumb.path" 
          @click="$emit('showGoBack')"
          class="hover:text-[var(--text-color)] transition duration-200"
        >
          {{ crumb.label }}
        </router-link>
        <span v-else class="text-[var(--text-color)]">{{ crumb.label }}</span>
        <span v-if="index !== breadcrumbs.length - 1" class="mx-2 text-gray-500">›</span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const breadcrumbs = computed(() => {
  const paths = route.path.split("/").filter(Boolean);
  const breadcrumbList: { label: string; path: string | null }[] = [{ label: "Home", path: "/" }];

  paths.forEach((segment, index) => {
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    const path = `/${paths.slice(0, index + 1).join("/")}`;
    
    breadcrumbList.push({ label, path: index < paths.length - 1 ? path : null });
  });

  return breadcrumbList;
});
</script>