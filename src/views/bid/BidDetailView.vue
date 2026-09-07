<template>
  <div>
    <div class="mb-5">
      <h2 class="page-title">招标公告详情</h2>
      <p class="page-subtitle">公开标讯信息 · 仅供技术研究与学习参考</p>
    </div>

    <article class="page-card max-w-4xl">
      <header class="border-b border-slate-100 pb-4">
        <el-tag type="primary" size="small">竞争性谈判</el-tag>
        <h1 class="mt-3 text-xl font-bold text-slate-900 md:text-2xl">{{ bid.title }}</h1>
        <div class="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
          <span>发包方：{{ bid.publisher }}</span>
          <span>项目编号：{{ bid.id }}</span>
          <span>发布时间：{{ bid.publishDate }}</span>
          <span>预算：{{ bid.budget }}</span>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <el-tag v-for="kw in bid.keywords" :key="kw" size="small" effect="plain">{{ kw }}</el-tag>
        </div>
      </header>

      <section class="mt-5">
        <h3 class="mb-2 text-base font-semibold text-slate-800">摘要</h3>
        <p class="text-sm leading-7 text-slate-600">{{ bid.summary }}</p>
      </section>

      <section class="mt-5">
        <h3 class="mb-2 text-base font-semibold text-slate-800">技术要点</h3>
        <ol class="list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600">
          <li v-for="(t, i) in bid.techPoints" :key="i">{{ t }}</li>
        </ol>
      </section>

      <section class="mt-5">
        <h3 class="mb-2 text-base font-semibold text-slate-800">技术创新性</h3>
        <ol class="list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600">
          <li v-for="(t, i) in bid.innovations" :key="i">{{ t }}</li>
        </ol>
      </section>

      <section class="mt-6 rounded-lg bg-amber-50 p-4 text-xs leading-6 text-amber-900">
        <strong>免责声明：</strong>
        本页内容基于互联网公开标讯信息进行算法推演与参考实现展示，不构成正式招标文件，亦不保证完整性与准确性。
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import { BID_DETAIL } from '@/data/mock'

const bid = BID_DETAIL
</script>
