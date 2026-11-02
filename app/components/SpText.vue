<template>
  <section class="sp-text" :class="size ? `size--${size}` : ''">
    <component :is="tag">
      <slot />
    </component>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ importance?: number; size?: string }>(), {
  importance: 0,
  size: undefined,
});

const tag = computed(() => (props.importance >= 1 && props.importance <= 6 ? `h${props.importance}` : 'span'));
</script>

<style lang="scss" scoped>
// Mides de lletra per interval de pantalla i per mida (abans, una classe per interval de nuxt-mq).
$sizes: (
  xs: (
    xs: 1rem,
    sm: 1.15rem,
    md: 1.3rem,
    lg: 1.45rem,
    xl: 1.6rem,
    xxl: 4rem,
  ),
  sm: (
    xs: 1.25rem,
    sm: 1.5rem,
    md: 1.75rem,
    lg: 2rem,
    xl: 2.25em,
    xxl: 6rem,
  ),
  md: (
    xs: 1.5rem,
    sm: 2rem,
    md: 2.5rem,
    lg: 3rem,
    xl: 3.5rem,
    xxl: 8rem,
  ),
  lg: (
    xs: 1.75rem,
    sm: 2.5rem,
    md: 3.25rem,
    lg: 4rem,
    xl: 4.75rem,
    xxl: 10rem,
  ),
  xl: (
    xs: 2rem,
    sm: 3rem,
    md: 4rem,
    lg: 5rem,
    xl: 6rem,
    xxl: 12rem,
  ),
);

.sp-text {
  font-size: 1.5rem;

  &.size--xxs {
    font-size: 1rem;
  }

  @each $range-name, $sizes-by-name in $sizes {
    @include screen($range-name) {
      @each $name, $value in $sizes-by-name {
        &.size--#{$name} {
          font-size: $value;
        }
      }
    }
  }
}
</style>
