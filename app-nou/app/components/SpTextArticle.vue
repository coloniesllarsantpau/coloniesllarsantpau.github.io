<template>
  <section class="sp-text-article" :class="{ 'sp-text-article--nogap': !gap }">
    <div class="left" :class="{ highlight: highlight === 'left' }">
      <slot name="left" />
    </div>
    <div class="right" :class="{ highlight: highlight === 'right' }">
      <slot name="right" />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ gap?: boolean; highlight?: string }>(), {
  gap: true,
  highlight: '',
});
</script>

<style lang="scss" scoped>
.sp-text-article {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-direction: column;

  // Abans, classes .desktop i sp-text-article--{lg,xl} (només hi havia pantalla ampla a lg i xl).
  @include large-screen {
    flex-direction: row;
    gap: 2rem;
  }

  @include screen(lg) {
    gap: 8rem;
    font-size: 1.75rem;
  }

  @include screen(xl) {
    gap: 10rem;
    font-size: 2rem;
  }

  // Després de les mides: ha de guanyar-les.
  @include large-screen {
    &--nogap {
      gap: 0;
    }
  }

  .left {
    flex: 1;
  }

  .right {
    flex: 1;
  }

  .right,
  .left {
    display: flex;
    flex-direction: column;

    &.highlight {
      flex: 3;
    }

    &:not(.highlight) {
      flex: 2;
    }
  }

  img {
    align-self: center;
  }
}
</style>
