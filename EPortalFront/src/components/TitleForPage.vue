<template>
  <q-item-section avatar class="items-center" style="margin: 0 10px">
    <h4 class="text-center">
      <q-icon :name="this.icon" />
      {{ this.title }}
    </h4>
  </q-item-section>
</template>

<script>
export default {
  name: "TitleForPage",
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
};
</script>