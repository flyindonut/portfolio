import { watch } from 'vue';
import { useRoute } from 'vue-router';

export function useTitle() {
  const route = useRoute();

  watch(
    () => route.meta.title,
    (newTitle) => {
      if (newTitle) {
        document.title = newTitle as string;
      }
    },
    { immediate: true }
  );
}