<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { fetchComments, updateCommentStatus, deleteComment } from "@/api/commentApi";
import type { Comment } from "@/types/Comment";
import { Check, X, Clock, Trash, ChevronDown } from "lucide-vue-next";
import Breadcrumb from "@/components/Breadcrumb.vue";

const comments = ref<Comment[]>([]);
const errorMessage = ref<string | null>(null);
const filterStatus = ref<string>("PENDING");
const userStatusFilter = ref<string>("ALL");
const showDeleteModal = ref(false);
const commentToDelete = ref<Comment | null>(null);

const fetchAllComments = async () => {
  try {
    const response = await fetchComments();
    comments.value = response;
  } catch (error) {
    errorMessage.value = "Failed to fetch comments.";
  }
};

const approveComment = async (id: string) => {
  try {
    await updateCommentStatus(id, 'APPROVED');
    fetchAllComments();
  } catch (error) {
    errorMessage.value = "Failed to update comment status.";
  }
};

const rejectComment = async (id: string) => {
  try {
    await updateCommentStatus(id, 'REJECTED');
    fetchAllComments();
  } catch (error) {
    errorMessage.value = "Failed to update comment status.";
  }
};

const pendingComment = async (id: string) => {
  try {
    await updateCommentStatus(id, 'PENDING');
    fetchAllComments();
  } catch (error) {
    errorMessage.value = "Failed to update comment status.";
  }
};

const handleDeleteComment = async () => {
  if (commentToDelete.value) {
    try {
      await deleteComment(commentToDelete.value.commentId);
      showDeleteModal.value = false;
      commentToDelete.value = null;
      fetchAllComments();
    } catch (error) {
      errorMessage.value = "Failed to delete comment.";
    }
  }
};

const filteredComments = computed(() => {
  let filtered = comments.value;
  if (filterStatus.value !== "ALL") {
    filtered = filtered.filter(comment => comment.commentStatus === filterStatus.value);
  }
  if (userStatusFilter.value !== "ALL") {
    filtered = filtered.filter(comment => comment.userStatus === userStatusFilter.value);
  }
  if (filterStatus.value === "PENDING") {
    return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
});

onMounted(() => {
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
      class="flex-1 flex flex-col p-10 lg:p-20 mx-auto max-w-dvw xl:max-w-4xl text-[var(--text-color)] mt-14 lg:mt-0"
    >

      <!-- Breadcrumb Navigation -->
      <Breadcrumb />

      <!-- Title -->
      <div class="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 justify-between items-left sm:items-center">
        <h1 class="text-3xl xl:text-4xl 2xl:text-5xl font-bold">Manage Comments</h1>
        <div class="flex space-x-4">
          <div class="relative">
            <select v-model="filterStatus" class="bg-[var(--item)] text-[var(--text-color)] p-2 rounded-md appearance-none pr-10">
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <ChevronDown class="absolute top-1/2 right-2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-color)] pointer-events-none" />
          </div>
          <div class="relative">
            <select v-model="userStatusFilter" class="bg-[var(--item)] text-[var(--text-color)] p-2 rounded-md appearance-none pr-10">
              <option value="ALL">All Users</option>
              <option value="VERIFIED">Verified Users</option>
              <option value="GUEST">Guest Users</option>
            </select>
            <ChevronDown class="absolute top-1/2 right-2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-color)] pointer-events-none" />
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <p v-if="errorMessage" class="text-[var(--text-color)] bg-red-500/90 border border-red-700 p-3 rounded-md mt-6">
        {{ errorMessage }}
      </p>

      <!-- No Comments Message -->
      <div v-if="!errorMessage && filteredComments.length === 0" class="text-[var(--text-2-color)]">
        <div class="h-[3px] bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] rounded-full mb-7"></div>
        No comments available.
      </div>

      <!-- Comments List -->
      <div v-if="filteredComments.length > 0">
        <div class="h-[3px] bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] rounded-full mb-7"></div>
        <div v-for="comment in filteredComments" :key="comment.commentId" class="bg-[var(--bg-color)] p-6 rounded-lg shadow-md backdrop-blur-md relative mb-4">
          <div class="flex items-center mb-4 mt-4 md:mt-0">
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
          <div class="absolute top-2 right-2 flex space-x-2">
            <Check :class="{'text-green-500': comment.commentStatus === 'APPROVED', 'text-gray-500 hover:text-green-500': comment.commentStatus !== 'APPROVED'}" @click="approveComment(comment.commentId)" />
            <X :class="{'text-red-500': comment.commentStatus === 'REJECTED', 'text-gray-500 hover:text-red-500': comment.commentStatus !== 'REJECTED'}" @click="rejectComment(comment.commentId)" />
            <Clock :class="{'text-blue-500': comment.commentStatus === 'PENDING', 'text-gray-500 hover:text-blue-500': comment.commentStatus !== 'PENDING'}" @click="pendingComment(comment.commentId)" />
            <Trash class="text-gray-500 hover:text-red-700 transition" @click="commentToDelete = comment; showDeleteModal = true" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md z-50">
    <div class="bg-[var(--bg-color)] p-6 rounded-xl shadow-2xl border border-gray-700 text-[var(--text-color)] w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Confirm Deletion</h2>
      <p>Are you sure you want to delete this comment?</p>
      <div class="flex justify-end space-x-3 mt-4">
        <button type="button" @click="showDeleteModal = false" class="bg-gray-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-gray-500">Cancel</button>
        <button type="button" @click="handleDeleteComment" class="bg-red-600 text-white py-2 px-3 rounded-md transition duration-200 hover:bg-red-700">Delete</button>
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