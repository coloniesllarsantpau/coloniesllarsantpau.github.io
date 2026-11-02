<template>
  <NuxtLink :to="item.url" :class="{ home: item.url === '/' }" class="main-navigation-item">
    <div class="main-navigation-item__content">
      <img v-if="item.imageUrl" :src="item.imageUrl" />
      <span v-else>{{ item.name }}</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ item: { name: string; url: string; imageUrl?: string } }>();
</script>

<style lang="scss" scoped>
$transition-duration: 0.15s;
$color: white;

$color-hover: var(--color-secondary);

.main-navigation-item {
  display: flex;
  color: $color;

  @include small-screen {
    justify-content: center;
    font-size: 30px;

    span {
      padding: 30px;
    }
  }

  &__content {
    display: flex;
    align-items: center;
    text-transform: uppercase;

    img {
      height: 100%;
    }
  }

  &.router-link-exact-active:not(.home),
  &.router-link-active:not(.home) {
    .main-navigation-item__content {
      color: $color-hover;
    }
  }

  &:not(.router-link-exact-active):not(.router-link-active):hover {
    .main-navigation-item__content {
      color: $color-hover;
    }
  }
}
</style>
