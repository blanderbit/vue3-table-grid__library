import { ref } from 'vue'

export default function useLoader (isLoaderHard, isLoading) {
  const isMainBodyOfTableVisible = ref(null)

  if (isLoaderHard && isLoading) {
    isMainBodyOfTableVisible.value = false
  } else {
    isMainBodyOfTableVisible.value = true
  }

  const isLoader = ref(true)
  setTimeout(() => {
    isLoader.value = false
    isMainBodyOfTableVisible.value = true
  }, 1000)

  return {
    isMainBodyOfTableVisible,
    isLoader
  }
}
