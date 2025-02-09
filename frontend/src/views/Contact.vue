<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { submitContactForm } from "@/api/contactApi";
import { Mail, Loader } from "lucide-vue-next";

const { t } = useI18n();

const form = ref({
  name: "",
  email: "",
  message: "",
});

const errors = ref<{ name?: string; email?: string; message?: string }>({});
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const isLoading = ref(false);

const validateForm = () => {
  errors.value = {};

  if (!form.value.name.trim()) errors.value.name = t("contactPage.validation.nameRequired");
  if (!form.value.email.trim()) {
    errors.value.email = t("contactPage.validation.emailRequired");
  } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
    errors.value.email = t("contactPage.validation.emailInvalid");
  }
  if (!form.value.message.trim()) errors.value.message = t("contactPage.validation.messageRequired");

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  successMessage.value = null;
  errorMessage.value = null;

  try {
    const response = await submitContactForm(form.value);
    if (response.success) {
      successMessage.value = t("contactPage.success");
      form.value = { name: "", email: "", message: "" };
    } else {
      errorMessage.value = t("contactPage.error");
    }
  } catch (error) {
    errorMessage.value = t("contactPage.error");
  } finally {
    isLoading.value = false;
  }
};

const isAnimating = ref(true);

onMounted(() => {
  setTimeout(() => {
    isAnimating.value = false;
  }, 500);
});
</script>

<template>
  <section class="flex items-center justify-center min-h-screen p-6" :class="{ 'overflow-hidden': isAnimating }">
    <div
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0 }"
      :duration="500"
      class="p-6 w-full max-w-lg bg-[#161a1d] rounded-xl shadow-2xl border border-gray-700 text-white mt-16 md:mt-0"
    >
      <h1 class="text-3xl font-bold mb-4 flex items-center gap-2">
        <Mail class="w-6 h-6" />
        {{ t("contactPage.heading") }}
      </h1>
      <p class="text-gray-400 mb-6">{{ t("contactPage.description") }}</p>

      <!-- Success / Error Messages -->
      <p v-if="successMessage" class="text-green-500 bg-green-800 p-3 rounded-md">{{ successMessage }}</p>
      <p v-if="errorMessage" class="text-red-500 bg-red-800 p-3 rounded-md">{{ errorMessage }}</p>

      <!-- Contact Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Name Input -->
        <div>
          <label class="block text-gray-300 text-sm mb-1">{{ t("contactPage.nameLabel") }}</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <!-- Email Input -->
        <div>
          <label class="block text-gray-300 text-sm mb-1">{{ t("contactPage.emailLabel") }}</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <!-- Message Input -->
        <div>
          <label class="block text-gray-300 text-sm mb-1">{{ t("contactPage.messageLabel") }}</label>
          <textarea
            v-model="form.message"
            rows="4"
            class="w-full bg-[#212529] text-white border border-gray-600 rounded-lg p-2 focus:ring focus:ring-gray-500"
            :class="{ 'border-red-500': errors.message }"
          ></textarea>
          <p v-if="errors.message" class="text-red-500 text-sm mt-1">{{ errors.message }}</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading"
        >
          <Loader v-if="isLoading" class="w-5 h-5 animate-spin" />
          <span>{{ isLoading ? t("contactPage.sending") : t("contactPage.sendButton") }}</span>
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap');

* {
  font-family: 'Nunito', sans-serif;
}
</style>
