<template>
  <!-- Show a loader until image is ready -->
  <div v-if="!isReady" class="flex items-center justify-center h-screen">
    <q-spinner color="primary" size="40px" />
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import helperMethods from "./helperMethods";
import logoPath from "./assets/images/uerm-hospital-logo.png";

export default {
  name: "App",
  data() {
    return {
      isReady: false, // ✅ will flip once image is loaded
    };
  },
  async mounted() {
    const $q = useQuasar();
    this.$q.dark.set(false);

    await this.$store.dispatch("leaveModule/loadAndConvertToBase64", logoPath);

    let message = helperMethods.getCookie("notify_message");
    let type = helperMethods.getCookie("notify_type");
    if (message && type) {
      $q.notify({ type, message });
      helperMethods.deleteCookie("notify_message");
      helperMethods.deleteCookie("notify_type");
    }

    // ✅ Only then allow app to render
    this.isReady = true;
  },
};
</script>
