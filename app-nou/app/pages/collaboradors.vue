<template>
  <section class="content-wrapper collaborators">
    <AppBar>{{ collaboratorsPage.title }}</AppBar>
    <SpText class="collaborators__subtitle font-medium" :importance="6" size="xs">{{
      collaboratorsPage.subtitle
    }}</SpText>
    <div class="content main content--mq">
      <section class="collaborators__list">
        <SpCollaborator v-for="item in collaborators" :key="item.title" :item="item" />
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { collaborators, collaboratorsPage } from '~/data/collaborators';
</script>

<style lang="scss" scoped>
.collaborators {
  &__subtitle {
    color: white;
    text-align: center;
  }

  .main {
    justify-content: stretch;
  }

  &__list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }
}
</style>
