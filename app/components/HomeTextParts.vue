<template>
  <template v-for="(part, index) in parts" :key="index">
    <template v-if="typeof part === 'string'">{{ part }}</template>
    <strong v-else :class="{ 'color-secondary': part.secondary }">{{ part.strong }}</strong>
  </template>
</template>

<script setup lang="ts">
import type { TextPart } from '~/data/home';

defineProps<{ parts: TextPart[] }>();
</script>
