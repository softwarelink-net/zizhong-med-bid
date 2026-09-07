<template>
  <div class="sticky-banner" role="banner">
    <span>获取网站源码，请访问：</span>
    <a
      href="https://github.com/softwarelink-net/zizhong-med-bid"
      target="_blank"
      rel="noopener noreferrer"
    >https://github.com/softwarelink-net/zizhong-med-bid</a>
  </div>
</template>

<script setup lang="ts">
/* Always-visible global top banner — must not collapse */
</script>

<style scoped>
.sticky-banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background-color: #1d4ed8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.sticky-banner a {
  color: #bfdbfe;
  text-decoration: underline;
  margin-left: 8px;
}
</style>
