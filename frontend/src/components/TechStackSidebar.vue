<template>
  <aside class="w-72 h-screen bg-[#161a1d] p-4 flex flex-col border-r border-gray-600">
    <h2 class="text-white text-lg font-bold mb-4">Tech Stack</h2>

    <!-- TechStack List -->
    <div class="flex flex-col space-y-4">
      <router-link
        v-for="item in techStackItems"
        :key="item.slug"
        :to="`/techstack/${item.slug}`"
        class="flex items-center px-5 py-3 rounded-lg text-white transition-all duration-200 bg-[#343a40] hover:bg-[#374151] hover:scale-101"
        active-class="bg-[#495057] border-l-4 border-white pl-4"
      >
        <div class="flex flex-col justify-center w-full">
          <h3 class="text-white font-medium truncate">
            {{ item.name }}
          </h3>
        </div>
        <ChevronRight class="text-gray-400 ml-auto w-6 h-6" />
      </router-link>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ChevronRight, Plus } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";

const techStackItems = ref([
  { name: "Languages", slug: "languages" },
  { name: "Frameworks", slug: "frameworks" },
  { name: "Technologies", slug: "technologies" }
]);

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.hasRole("Admin"));
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}
</style>