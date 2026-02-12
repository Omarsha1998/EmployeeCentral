<template>
  <q-card-section>
    <div class="q-pt-sm">
      <h5 class="text-center text-uppercase q-my-none text-weight-bold">
        {{ this.app_name }}
      </h5>
      <h5 class="text-center text-uppercase q-my-none text-weight-bold">
        {{ this.title }}
      </h5>
    </div>
  </q-card-section>
</template>

<script>
export default {
  name: "TitleWithAppName",
  props: {
    title: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      app_name: process.env.APP_NAME
    };
  },
};
</script>