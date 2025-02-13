<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { fetchVerifiedComments, createVerifiedComment, deleteComment, updateCommentContent, fetchGuestComments, addGuestComments } from "@/api/commentApi";
import type { Comment } from "@/types/Comment";
import { useAuth0 } from "@auth0/auth0-vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { Plus, Trash, Edit, CheckCircle, ChevronDown } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from 'vue-i18n';

const { t, d } = useI18n();
const { isAuthenticated, user } = useAuth0();
const authStore = useAuthStore();
const commentCreator = computed(() => authStore.userId);
const verifiedComments = ref<Comment[]>([]);
const guestComments = ref<Comment[]>([]);
const errorMessage = ref<string | null>(null);
const showModal = ref(false);
const showDeleteModal = ref(false);
const showModifyModal = ref(false);
const newCommentContent = ref<string>("");
const firstName = ref<string>("");
const lastName = ref<string>("");
const commentToModify = ref<Comment | null>(null);
const commentToDelete = ref<Comment | null>(null);
const successMessage = ref<string | null>(null);
const filterUserComments = ref<string>("ALL");
const emit = defineEmits(["showGoBack", "hideMobileButtons", "showMobileButtons", "closeCommentsMenu"]);

const fetchAllComments = async () => {
  try {
    const [verifiedResponse, guestResponse] = await Promise.all([fetchVerifiedComments(), fetchGuestComments()]);
    verifiedComments.value = verifiedResponse.filter(comment => comment.commentStatus === 'APPROVED');
    guestComments.value = guestResponse.filter(comment => comment.commentStatus === 'APPROVED');
  } catch (error) {
    errorMessage.value = t('showCommentsPage.errorMessage');
  }
};

const handleCreateComment = async () => {
  if (isAuthenticated.value && user.value) {
    const newComment = {
      content: newCommentContent.value,
      firstName: user.value.given_name,
      lastName: user.value.family_name,
      auth0UserId: user.value.sub,
      auth0Avatar: user.value.picture,
    };
    try {
      await createVerifiedComment(newComment);
      newCommentContent.value = "";
      successMessage.value = t('showCommentsPage.successMessage');
      fetchAllComments();
    } catch (error) {
      errorMessage.value = t('showCommentsPage.createError');
    }
  } else {
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
      successMessage.value = t('showCommentsPage.successMessage');
      fetchAllComments();
    } catch (error) {
      errorMessage.value = t('showCommentsPage.createError');
    }
  }
};

const handleDeleteComment = async () => {
  if (commentToDelete.value) {
    try {
      await deleteComment(commentToDelete.value.commentId);
      showDeleteModal.value = false;
      emit('showMobileButtons')
      commentToDelete.value = null;
      fetchAllComments();
    } catch (error) {
      errorMessage.value = t('showCommentsPage.deleteError');
    }
  }
};

const handleModifyComment = async () => {
  if (commentToModify.value) {
    try {
      await updateCommentContent(commentToModify.value.commentId, newCommentContent.value);
      successMessage.value = t('showCommentsPage.modifySuccess');
      fetchAllComments();
    } catch (error) {
      errorMessage.value = t('showCommentsPage.modifyError');
    }
  }
};

const filteredComments = computed(() => {
  let allComments = [...verifiedComments.value, ...guestComments.value];
  allComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (filterUserComments.value === "USER") {
    return allComments.filter(comment => comment.auth0UserId === commentCreator.value);
  } else if (filterUserComments.value === "VERIFIED") {
    return verifiedComments.value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (filterUserComments.value === "GUEST") {
    return guestComments.value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return allComments;
});

onMounted(() => {
  emit("closeCommentsMenu")
  fetchAllComments();
});
</script>

<template>
  <div class="flex h-dvh overflow-y-scroll">
    <div
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0 }"
      :delay="100"
      :duration="500"
      class="flex-1 flex flex-col p-10 md:p-20 mx-auto max-w-4xl text-[var(--text-color)] mt-14 md:mt-0"
    >

      <!-- Breadcrumb Navigation -->
      <Breadcrumb
        @showGoBack="$emit('showGoBack')"
      />

      <div class="mb-6 flex flex-col sm:flex-row justify-between items-center">
        <h1 class="font-bold text-3xl md:text-5xl">{{ t('showCommentsPage.title') }}</h1>
        <div class="flex space-x-4 mt-4 md:mt-0">
          <div class="relative">
            <select v-model="filterUserComments" class="bg-[var(--item)] text-[var(--text-color)] p-2 rounded-md appearance-none pr-10">
              <option value="ALL">{{ t('showCommentsPage.allComments') }}</option>
              <option value="VERIFIED">{{ t('showCommentsPage.verifiedComments') }}</option>
              <option value="GUEST">{{ t('showCommentsPage.guestComments') }}</option>
              <option v-if="isAuthenticated" value="USER">{{ t('showCommentsPage.myComments') }}</option>
            </select>
            <ChevronDown class="absolute top-1/2 right-2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-color)] pointer-events-none" />
          </div>
          <button @click="showModal = true, $emit('hideMobileButtons')" class="text-[var(--text-color)] hover:text-[var(--text-3-color)] transition">
            <Plus class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <p v-if="errorMessage" class="text-[var(--text-color)] bg-red-500/90 border border-red-700 p-3 rounded-md mt-6">
        {{ errorMessage }}
      </p>

      <div v-if="!errorMessage && filteredComments.length === 0" class="text-[var(--text-2-color)]">
        <div class="h-[3px] bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] rounded-full mb-7"></div>
        {{ t('showCommentsPage.noComments') }}
      </div>
      
      <!-- Comments List -->
      <div v-if="filteredComments.length > 0">
        <div class="h-[3px] bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] rounded-full mb-7"></div>
        <div v-for="comment in filteredComments" :key="comment.commentId" :class="{'border-blue-500 border-2': commentCreator === comment.auth0UserId}" class="p-6 rounded-lg shadow-md backdrop-blur-md relative mb-4 bg-[var(--bg-color)]">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 rounded-full overflow-hidden">
              <div v-if="!comment.auth0Avatar" class="bg-[#3b82f6] w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-color)] font-bold">
                {{ comment.firstName.charAt(0).toUpperCase() }}{{ comment.lastName.charAt(0).toUpperCase() }}
              </div>
              <img 
                v-show="comment.auth0Avatar"
                :src="comment.auth0Avatar" 
                alt="Avatar" 
                class="w-full h-full object-cover" 
                @load="comment.auth0Avatar = comment.auth0Avatar"
                @error="comment.auth0Avatar = ''"
              />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-bold">{{ comment.firstName.charAt(0).toUpperCase() + comment.firstName.slice(1) }} {{ comment.lastName.charAt(0).toUpperCase() + comment.lastName.slice(1) }}</h3>
              <p class="text-[var(--text-2-color)] text-sm">{{ new Date(comment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
            </div>
          </div>
          <p class="text-[var(--text-3-color)]">{{ comment.content }}</p>
          <p class="text-[var(--text-2-color)] text-sm absolute bottom-2 right-2">{{ new Date(comment.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}</p>
          <CheckCircle v-if="comment.auth0UserId && commentCreator !== comment.auth0UserId" class="w-5 h-5 text-blue-500 absolute top-2 right-2" />
          <div v-if="commentCreator === comment.auth0UserId" class="absolute top-2 right-2 flex space-x-2">
            <Edit class="text-yellow-500 hover:text-yellow-700 transition" @click="commentToModify = comment; newCommentContent = comment.content; showModifyModal = true, $emit('hideMobileButtons')" />
            <Trash class="text-red-500 hover:text-red-700 transition" @click="commentToDelete = comment; showDeleteModal = true, $emit('hideMobileButtons')" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Comment Modal -->
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md z-50">
    <div class="bg-[var(--bg-color)] p-6 rounded-xl shadow-2xl border border-gray-700 text-[var(--text-color)] w-full max-w-md mx-4 overflow-y-auto max-h-[80vh]">
      <h2 class="text-xl font-bold mb-4">{{ isAuthenticated ? t('showCommentsPage.addVerifiedComment') : t('showCommentsPage.addGuestComment') }}</h2>
      <form v-if="!successMessage" @submit.prevent="handleCreateComment" class="space-y-4">
        
        <!-- First and Last Name Inputs for Guest -->
        <div v-if="!isAuthenticated" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-[var(--text-3-color)]">{{ t('showCommentsPage.firstName') }}</label>
            <input v-model="firstName" type="text" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-[var(--text-3-color)]">{{ t('showCommentsPage.lastName') }}</label>
            <input v-model="lastName" type="text" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500" required />
          </div>
        </div>

        <!-- Content Input -->
        <div>
          <label class="block text-sm font-medium text-[var(--text-3-color)]">{{ t('showCommentsPage.content') }}</label>
          <textarea v-model="newCommentContent" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500 min-h-48 field-sizing-content" required></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <button type="button" @click="showModal = false, $emit('showMobileButtons')" class="bg-gray-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-500-gray">{{ t('showCommentsPage.cancel') }}</button>
          <button type="submit" class="bg-blue-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-blue-700">{{ t('showCommentsPage.post') }}</button>
        </div>
      </form>

      <!-- Success Message -->
      <div v-if="successMessage" class="space-y-4">
        <p class="text-green-500">{{ successMessage }}</p>
        <div class="flex justify-end">
          <button type="button" @click="showModal = false; successMessage = null, $emit('showMobileButtons')" class="bg-gray-600 text-[var(--text-color)] py-2 px-3 rounded-md transition duration-200 hover:bg-[var(--item)]">{{ t('showCommentsPage.close') }}</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md z-50">
    <div class="bg-[var(--bg-color)] p-6 rounded-xl shadow-2xl border border-gray-700 text-[var(--text-color)] w-full max-w-md m-4">
      <h2 class="text-xl font-bold mb-4">{{ t('showCommentsPage.confirmDeletion') }}</h2>
      <p>{{ t('showCommentsPage.confirmDeletionMessage') }}</p>
      <div class="flex justify-end space-x-3 mt-4">
        <button type="button" @click="showDeleteModal = false, $emit('showMobileButtons')" class="bg-gray-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-gray-500">{{ t('showCommentsPage.cancel') }}</button>
        <button type="button" @click="handleDeleteComment" class="bg-red-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-red-700">{{ t('showCommentsPage.delete') }}</button>
      </div>
    </div>
  </div>

  <!-- Modify Comment Modal -->
  <div v-if="showModifyModal" class="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md z-50">
    <div class="bg-[var(--bg-color)] p-6 rounded-xl shadow-2xl border border-gray-700 text-[var(--text-color)] w-full max-w-md m-4 overflow-y-auto max-h-[80vh]">
      <h2 class="text-xl font-bold mb-4">{{ t('showCommentsPage.modifyComment') }}</h2>
      <form v-if="!successMessage" @submit.prevent="handleModifyComment" class="space-y-4">
        
        <!-- Content Input -->
        <div>
          <label class="block text-sm font-medium text-[var(--text-3-color)]">{{ t('showCommentsPage.content') }}</label>
          <textarea v-model="newCommentContent" class="w-full bg-[var(--input-color)] text-[var(--text-color)] border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500 min-h-48 field-sizing-content" required></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <button type="button" @click="showModifyModal = false, $emit('showMobileButtons')" class="bg-gray-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-gray-500">{{ t('showCommentsPage.cancel') }}</button>
          <button type="submit" class="bg-blue-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-blue-700">{{ t('showCommentsPage.save') }}</button>
        </div>
      </form>

      <!-- Success Message -->
      <div v-if="successMessage" class="space-y-4">
        <p class="text-green-500">{{ successMessage }}</p>
        <div class="flex justify-end">
          <button type="button" @click="showModifyModal = false; successMessage = null, $emit('showMobileButtons')" class="bg-gray-600 text-[var(--text-color)] py-2 px-3 rounded-md transition duration-200 hover:bg-[var(--item)]">{{ t('showCommentsPage.close') }}</button>
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