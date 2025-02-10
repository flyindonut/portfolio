<template>
  <aside>
    <h2 class="text-white text-2xl mt-6 md:mt-0 md:text-lg font-bold mb-4">{{ t('iconsSidebar.title') }}</h2>

    <!-- Icons List -->
    <div class="flex flex-col space-y-4 mt-6 md:mt-0">
      <router-link
        v-for="item in iconsItems"
        :key="item.slug"
        :to="`/icons/${item.slug}`"
        @click="$emit('closeIconsMenu')"
        class="flex items-center px-5 py-4 md:py-3 rounded-lg text-white transition-all duration-200 bg-[#343a40] hover:bg-[#374151] hover:scale-101"
        active-class="bg-[#495057] border-l-4 border-white pl-4"
      >
        <div class="flex flex-col justify-center w-full">
          <h3 :class="getFontSizeClass(t(`iconsSidebar.${item.slug}`))" class="text-white font-medium truncate">
            {{ t(`iconsSidebar.${item.slug}`) }}
          </h3>
        </div>
        <ChevronRight class="text-gray-400 ml-auto w-6 h-6" />
      </router-link>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { ChevronRight } from "lucide-vue-next";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const iconsItems = ref([
  { name: "Languages", slug: "languages" },
  { name: "Frameworks", slug: "frameworks" },
  { name: "Technologies", slug: "technologies" },
  { name: "Services", slug: "services" }
]);

const getFontSizeClass = (text: string) => {
  return text.length > 20 ? 'text-sm' : 'text-base';
};

const emit = defineEmits(["closeIconsMenu", "showIconsMenu"]);
const route = useRoute();

watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/icons") {
      emit("showIconsMenu")
    }
  },
  { immediate: true }
);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}
</style>