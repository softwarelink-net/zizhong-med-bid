<template>
  <div class="auth-layout min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50">
    <StickyBanner />
    <main class="flex min-h-[calc(100vh-40px)] items-center justify-center p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import StickyBanner from '@/components/StickyBanner.vue'
</script>
