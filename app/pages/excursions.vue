<template>
  <section class="content-wrapper hiking">
    <AppBar>{{ hikesPage.title }}</AppBar>
    <div class="content main content--mq">
      <section class="hiking__list">
        <SpHike v-for="item in hikes" :key="item.title" :item="item" />
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { seoHead } from '~/data/seo';
import { hikes, hikesPage } from '~/data/hikes';

useHead(seoHead('/excursions'));
</script>

<style lang="scss" scoped>
.hiking {
  &__list {
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }
}
</style>
