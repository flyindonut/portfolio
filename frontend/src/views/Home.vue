<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Code, Database, Server, Shield, Terminal, Globe, ChevronRight } from "lucide-vue-next";

const { t } = useI18n();

// Skills list
const skills = [
  { icon: Code, name: "homePage.skills.fullstack" },
  { icon: Database, name: "homePage.skills.database" },
  { icon: Server, name: "homePage.skills.backend" },
  { icon: Shield, name: "homePage.skills.security" },
  { icon: Terminal, name: "homePage.skills.devops" },
  { icon: Globe, name: "homePage.skills.cloud" }
];

// Technologies list
const technologies = [
  { name: "Vue.js", icon: "/icons/vue.svg" },
  { name: "React", icon: "/icons/react.svg" },
  { name: "TypeScript", icon: "/icons/typescript.svg" },
  { name: "JavaScript", icon: "/icons/javascript.svg" },
  { name: "Spring Boot", icon: "/icons/spring.svg" },
  { name: ".NET Core", icon: "/icons/dotnet.svg" },
  { name: "MongoDB", icon: "/icons/mongodb.svg" },
  { name: "SQL Server", icon: "/icons/sqlserver.svg" },
  { name: "Docker", icon: "/icons/docker.svg" },
  { name: "Linux", icon: "/icons/linux.svg" }
];

const getFontSize = (text: string) => {
  if (text.length > 29) return 'text-xs';
  if (text.length > 27) return 'text-sm';
  return 'text-base';
};
</script>

<template>
  <section
    v-motion
    :initial="{ opacity: 0, y: 30 }"
    :enter="{ opacity: 1, y: 0 }"
    :duration="500"
    class="p-10 md:p-20 mx-auto max-w-5xl text-white"
  >
    <!-- Hero Section -->
    <div class="mb-10">
      <h1 class="text-5xl font-bold">Debo Huang</h1>
      <h2 class="text-xl text-gray-400">{{ t("title") }}</h2>
      <div class="mt-4 h-[3px] bg-gradient-to-r from-[#b7c3d7] to-white rounded-full"></div>
      <p class="mt-4 text-gray-300">
        {{ t("homePage.intro") }}
      </p>
    </div>

    <!-- Skills Section -->
    <div class="mt-10">
      <h3 class="text-2xl font-bold">{{ t("homePage.skillsTitle") }}</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        <div 
          v-for="skill in skills" 
          :key="skill.name" 
          class="flex items-center backdrop-blur-md bg-[#ffffff15] border border-[#ffffff22] p-4 rounded-xl shadow-md hover:bg-[#ffffff25] transition"
        >
          <component :is="skill.icon" class="w-6 h-6 text-white mr-3" />
          <span :class="getFontSize(t(skill.name))" class="text-white">{{ t(skill.name) }}</span>
        </div>
      </div>
    </div>

    <!-- Technologies Section -->
    <div class="mt-12">
      <h3 class="text-2xl font-bold">{{ t("homePage.techTitle") }}</h3>
      <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
        <div 
          v-for="tech in technologies" 
          :key="tech.name" 
          class="flex flex-col items-center backdrop-blur-[10px] bg-[#ffffff15] border border-[#ffffff22] p-4 rounded-xl shadow-md hover:bg-[#ffffff25] transition"
        >
          <img :src="tech.icon" :alt="tech.name" class="w-12 h-12">
          <span class="mt-2 text-white text-sm">{{ tech.name }}</span>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="mt-12 text-center">
      <router-link 
        to="/projects" 
        class="inline-flex items-center bg-blue-600 px-6 py-3 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
      >
        {{ t("homePage.exploreProjects") }}
        <ChevronRight class="ml-2 w-5 h-5" />
      </router-link>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap');

* {
  font-family: 'Nunito', sans-serif;
}
</style>
