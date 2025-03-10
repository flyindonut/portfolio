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

<template>
  <aside>
    <h2 class="text-[var(--text-color)] text-2xl mt-6 md:mt-4 lg:mt-0 lg:text-lg font-bold mb-4">{{ t('iconsSidebar.title') }}</h2>

    <!-- Icons List -->
    <div class="flex flex-col space-y-4 mt-6 lg:mt-0">
      <router-link
        v-for="item in iconsItems"
        :key="item.slug"
        :to="`/icons/${item.slug}`"
        @click="$emit('closeIconsMenu')"
        class="flex items-center px-5 py-4 md:py-3 rounded-lg text-[var(--text-color)] transition-all duration-200 bg-[var(--item)] hover:bg-[var(--item-hover)] hover:scale-101"
        active-class="bg-[var(--item-active)] border-l-4 border-[var(--border-color)] pl-4"
      >
        <div class="flex flex-col justify-center w-full">
          <h3 :class="getFontSizeClass(t(`iconsSidebar.${item.slug}`))" class="text-[var(--text-color)] font-medium truncate">
            {{ t(`iconsSidebar.${item.slug}`) }}
          </h3>
        </div>
        <ChevronRight class="text-[var(--text-2-color)] ml-auto w-6 h-6" />
      </router-link>
    </div>
  </aside>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}
</style>