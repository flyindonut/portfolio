<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchGuestComments, addGuestComments } from "@/api/commentApi";
import type { Comment } from "@/types/Comment";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { Plus } from "lucide-vue-next";
import { useI18n } from 'vue-i18n';

const { t, d } = useI18n();

const guestComments = ref<Comment[]>([]);
const errorMessage = ref<string | null>(null);
const showModal = ref(false);
const newCommentContent = ref<string>("");
const firstName = ref<string>("");
const lastName = ref<string>("");
const successMessage = ref<string | null>(null);
const emit = defineEmits(["showGoBack"]);
const fetchAllGuestComments = async () => {
  try {
    const response = await fetchGuestComments();
    guestComments.value = response
      .filter(comment => comment.commentStatus === 'APPROVED')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    errorMessage.value = t('guestCommentsPage.errorMessage');
  }
};

const handleCreateComment = async () => {
  const newComment = {
    content: newCommentContent.value,
    firstName: firstName.value,
    lastName: lastName.value,
    auth0UserId: "",
    auth0Avatar: "",
  };
  try {
    await addGuestComments(newComment);
    newCommentContent.value = "";
    firstName.value = "";
    lastName.value = "";
    successMessage.value = t('guestCommentsPage.successMessage');
    fetchAllGuestComments();
  } catch (error) {
    errorMessage.value = t('guestCommentsPage.createError');
  }
};

onMounted(() => {
  emit("showGoBack");
  fetchAllGuestComments();
});
</script>

<template>
  <div class="flex h-screen overflow-y-scroll">
    <div
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0 }"
      :delay="100"
      :duration="500"
      class="flex-1 flex flex-col p-10 md:p-20 mx-auto max-w-4xl text-white mt-14 md:mt-0"
    >

      <!-- Breadcrumb Navigation -->
      <Breadcrumb
        @showGoBack="$emit('showGoBack')"
      />

      <!-- Title -->
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-3xl md:text-5-xl font-bold">{{ t('guestCommentsPage.title') }}</h1>
        <button @click="showModal = true" class="text-white hover:text-gray-300 transition">
          <Plus class="w-6 h-6" />
        </button>
      </div>

      <!-- Error Message -->
      <p v-if="errorMessage" class="text-white bg-red-500/90 border border-red-700 p-3 rounded-md mt-6">
        {{ errorMessage }}
      </p>

      <!-- No Comments Message -->
      <div v-if="!errorMessage && guestComments.length === 0" class="text-gray-400">
        <div class="h-[3px] bg-gradient-to-r from-[#b7c3d7] to-white rounded-full mb-7"></div>
        {{ t('guestCommentsPage.noComments') }}
      </div>
      <!-- Comments List -->
      <div v-if="guestComments.length > 0">
        <div class="h-[3px] bg-gradient-to-r from-[#b7c3d7] to-white rounded-full mb-7"></div>
        <div v-for="comment in guestComments" :key="comment.commentId" class="bg-[#161a1d] p-6 rounded-lg shadow-md backdrop-blur-md relative mb-4">
          <div class="flex items-center mb-4">
            <div class="bg-[#3b82f6] w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
              {{ comment.firstName.charAt(0).toUpperCase() }}{{ comment.lastName.charAt(0).toUpperCase() }}
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-bold">{{ comment.firstName.charAt(0).toUpperCase() + comment.firstName.slice(1) }} {{ comment.lastName.charAt(0).toUpperCase() + comment.lastName.slice(1) }}</h3>
              <p class="text-gray-400 text-sm">{{ d(new Date(comment.createdAt), 'long') }}</p>
            </div>
          </div>
          <p class="text-gray-300">{{ comment.content }}</p>
          <p class="text-gray-400 text-sm absolute bottom-2 right-2">{{ new Date(comment.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Comment Modal -->
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md z-50">
    <div class="bg-[#161a1d] p-6 rounded-xl shadow-2xl border border-gray-700 text-white w-full max-w-md mx-auto">
      <h2 class="text-xl font-bold mb-4">{{ t('guestCommentsPage.addComment') }}</h2>
      <form v-if="!successMessage" @submit.prevent="handleCreateComment" class="space-y-4">
        
        <!-- First and Last Name Inputs -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300">{{ t('guestCommentsPage.firstName') }}</label>
            <input v-model="firstName" type="text" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300">{{ t('guestCommentsPage.lastName') }}</label>
            <input v-model="lastName" type="text" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
          </div>
        </div>

        <!-- Content Input -->
        <div>
          <label class="block text-sm font-medium text-gray-300">{{ t('guestCommentsPage.content') }}</label>
          <textarea v-model="newCommentContent" class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500 h-48" required></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <button type="button" @click="showModal = false" class="bg-gray-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-gray-700">{{ t('guestCommentsPage.cancel') }}</button>
          <button type="submit" class="bg-blue-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-blue-700">{{ t('guestCommentsPage.post') }}</button>
        </div>
      </form>

      <!-- Success Message -->
      <div v-if="successMessage" class="space-y-4">
        <p class="text-green-500">{{ successMessage }}</p>
        <div class="flex justify-end">
          <button type="button" @click="showModal = false; successMessage = null" class="bg-gray-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-gray-700">{{ t('guestCommentsPage.close') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap');

* {
  font-family: 'Nunito', sans-serif;
}
</style>