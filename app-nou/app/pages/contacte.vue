<template>
  <section class="content-wrapper contact">
    <AppBar>{{ contact.title }}</AppBar>
    <SpText class="contact__subtitle font-medium" :importance="6" size="xs">{{ contact.subtitle }}</SpText>
    <div class="content main content--mq">
      <div class="contact__info">
        <SpText class="font-medium" :importance="6" size="xs">{{ contact.name }}</SpText>
        <SpText class="font-medium" :importance="6" size="xs">
          <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
        </SpText>
        <SpText class="font-medium">
          <a :href="`tel:${contact.phones[0]}`">{{ contact.phones[0] }}</a> /
          <a :href="`tel:${contact.phones[1]}`">{{ contact.phones[1] }}</a>
        </SpText>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { contact } from '~/data/contact';
</script>

<style lang="scss" scoped>
.contact {
  color: white;

  &__subtitle {
    color: white;
    text-align: center;
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 3rem 20%;
    border: 5px solid white;
    border-radius: 200px;
  }
}
</style>
