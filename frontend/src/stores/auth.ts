import { defineStore } from "pinia";
import { useAuth0 } from "@auth0/auth0-vue";
import { ref, watch, onMounted } from "vue";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const roles = ref<string[]>([]);
  const userId = ref<string | null>(null);

  const fetchUserRoles = async () => {
    try {
      const token = await getAccessTokenSilently();
      const decodedToken: any = jwtDecode(token);
      roles.value = decodedToken["your_name_space/roles"] || [];
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchUserId = async () => {
    try {
      const token = await getAccessTokenSilently();
      const decodedToken: any = jwtDecode(token);
      userId.value = decodedToken.sub || null;
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  onMounted(() => {
    if (isAuthenticated.value) {
      fetchUserRoles();
      fetchUserId();
    }
  });

  watch(isAuthenticated, (newVal) => {
    if (newVal) {
      fetchUserRoles();
      fetchUserId();
    }
  });

  const hasRole = (role: string) => roles.value.includes(role);

  return { roles, hasRole, fetchUserRoles, userId, fetchUserId };
});