<template>
  <section class="sp-photo-text">
    <sp-text class="sp-photo-text__title font-titles" :importance="4" size="lg">{{ title }}</sp-text>
    <div class="sp-photo-text__image" :style="{ backgroundImage: `url(${imageUrl})` }" />
    <div class="sp-photo-text__overlay">
      <div class="sp-photo-text__overlay-background"></div>
      <div class="sp-photo-text__overlay-text">
        <slot name="overlay"></slot>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import Component, { mixins } from 'nuxt-class-component';
import { Prop } from 'vue-property-decorator';
import ScreenSizes from '@/modules/core/mixins/screen-sizes';

@Component
export default class SpPhotoText extends mixins(ScreenSizes) {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  imageUrl!: string;
}
</script>

<style lang="scss" scoped>
.sp-photo-text {
  display: flex;
  position: relative;
  overflow: hidden;

  box-sizing: border-box;
  max-width: 100%;

  &:hover,
  &:focus,
  &:active {
    .sp-photo-text__image {
      transform: scale(1.2);
    }

    .sp-photo-text__overlay {
      opacity: 1;
    }
  }

  &__title {
    position: absolute;
    color: white;
    top: 0;
    bottom: 0;
    text-align: center;
    align-items: center;
    justify-content: center;
    display: flex;
    width: 100%;

    .mobile & {
      font-size: 3rem;
    }
  }

  &__image {
    // width: 100%;
    // height: 750px;

    width: 100%;
    padding-bottom: 75%;
    background-position: center;
    background-size: cover;
    transition: transform 0.3s;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    transition: opacity 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;

    &-text {
      z-index: 1;
      font-size: 3vw;
    }

    &-background {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: var(--color-primary);
      opacity: 0.5;
    }
  }
}
</style>
