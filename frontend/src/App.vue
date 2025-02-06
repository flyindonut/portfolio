<script setup lang="ts">
import Sidebar from "./components/Sidebar.vue";
</script>

<template>
  <div class="flex h-screen text-light relative">
    <!-- Background Effects -->
    <div class="fixed inset-0 z-0 bg-gradient-to-br from-[#121417] via-[#191b1f] to-[#22252a]">
      <div class="absolute inset-0 bg-grid-pattern"></div>
      <div class="absolute inset-0 animated-aurora"></div>
    </div>

    <!-- Sidebar -->
    <Sidebar class="relative z-10" />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto relative z-10 bg-transparent">
      <div class="relative">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Animated Grid Pattern */
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.20;
  filter: drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.05));
  animation: gridFade 3s infinite alternate ease-in-out;
}

/* Grid Opacity Animation */
@keyframes gridFade {
  0% {
    opacity: 0.25;
  }
  100% {
    opacity: 0.40;
  }
}

/* Darker Aurora Gradient */
.animated-aurora {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: 
    radial-gradient(circle at 30% 40%, rgba(0, 100, 255, 0.1), transparent 60%),
    radial-gradient(circle at 70% 80%, rgba(180, 0, 255, 0.1), transparent 60%),
    radial-gradient(circle at 50% 50%, rgba(0, 200, 150, 0.08), transparent 60%);
  animation: auroraMove 12s infinite alternate ease-in-out;
  pointer-events: none;
}

@keyframes auroraMove {
  0% {
    clip-path: circle(75% at 50% 50%);
    filter: blur(35px);
  }
  100% {
    clip-path: circle(85% at 50% 50%);
    filter: blur(50px);
  }
}
</style>
