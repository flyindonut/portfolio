<template>
  <div class="hidden h-dvh lg:flex">
    <div
      v-motion
      :initial="{ opacity: 0, y: 0 }"
      :enter="{ opacity: 1, y: 0 }"
      :delay="500"
      :duration="1000"
      class="flex-1 flex flex-col items-center justify-center text-gray-300 text-lg"
    >
      <h1 class="text-3xl font-bold mb-4">Projects</h1>
      <p class="text-gray-400 mb-6">Please select a project to view details</p>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap');

* {
  font-family: 'Nunito', sans-serif;
}
</style>