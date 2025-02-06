import { defineStore } from "pinia";
import { useAuth0 } from "@auth0/auth0-vue";
import { ref, watch, onMounted } from "vue";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const roles = ref<string[]>([]);

  const fetchUserRoles = async () => {
    try {
      const token = await getAccessTokenSilently();
      const decodedToken: any = jwtDecode(token);
      roles.value = decodedToken["your_name_space/roles"] || [];
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  onMounted(() => {
    if (isAuthenticated.value) {
      fetchUserRoles();
    }
  });

  watch(isAuthenticated, (newVal) => {
    if (newVal) {
      fetchUserRoles();
    }
  });

  const hasRole = (role: string) => roles.value.includes(role);

  return { roles, hasRole, fetchUserRoles };
});