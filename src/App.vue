<template>
  <component :is="layoutComponent">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAppDataStore } from '@/stores/appData'

const route = useRoute()
const appData = useAppDataStore()

const layoutComponent = computed(() =>
  route.meta.layout === 'auth' ? AuthLayout : MainLayout,
)

onMounted(() => {
  void appData.init()
})
</script>
