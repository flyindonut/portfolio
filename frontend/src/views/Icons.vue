<template>
  <div class="flex h-screen">
    <div
      v-motion
      :initial="{ opacity: 0, y: 0 }"
      :enter="{ opacity: 1, y: 0 }"
      :delay="500"
      :duration="1000"
      class="flex-1 flex flex-col items-center justify-center text-gray-300 text-lg"
    >
      <h1 class="text-3xl font-bold mb-4">{{ t('iconsPage.title') }}</h1>
      <p class="text-gray-400 mb-6">{{ t('iconsPage.description') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap');

* {
  font-family: 'Nunito', sans-serif;
}
</style>