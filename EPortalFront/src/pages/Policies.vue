<template>
  <q-layout>
    <q-page>
      <q-page-container>
        <div class="containermainn">
          <div class="row" style="width: 95%">
            <div class="col-12" v-show="isLoading">
              <q-skeleton class="q-mt-sm" style="height: 800px; width: 100%" />
            </div>

            <div class="col-12 iframe-container" v-show="!isLoading">
              <iframe
                :src="docuwareUrl"
                frameborder="0"
                allowfullscreen
                class="docuware-iframe"
                title="DocuWare Portal"
                @load="onIframeLoad"
              ></iframe>
            </div>
          </div>
        </div>
      </q-page-container>
    </q-page>
  </q-layout>
</template>

<script>
export default {
  name: "DocuWareView",
  data() {
    return {
      docuwareUrl:
        "https://uerm.docuware.cloud/DocuWare/Platform/WebClient/Client/Search?sed=4d842769-7777-4fca-a611-9c15f7e1071f&intgParams=JmVwPTBnbldDSVdxcGVVcFdHY0dpMXh1a2UwY2pmMDJfSWZBQk4yVnJYLTdlMmctd1VmWlk1SWVHV1lSOERfenpnTUY4U0hldzBYdjhrRDFwT3RseUZraFpULWQxV1JOQ0JRYlh1MjJRb0UwcFJEd011aVpFc1A5anFpNnVnRzh0ajE0MA2&_auth=l6l3iGqmG2-hIXKsbPjB7bMZPUWX-2K9iXaP1vwvLc2SwaF-ZXKTUBurc9QwURQSdciegABCrSB9sw8KKhPiJQmr3URHKiNxEB3MuMf6caLfBDB_IXgHiejE9w_fmY7YbXcJdW_TFNkoetkZ82okAZXNYDtwiBTfI-W9Pnzzn4NvyYfIhZA8qsbPh5Qsqm9Lf3CMVA1af8hvq4T5Cmeyrjs_a5IWnVYQwRAA607RbakQiP5HT-RC5Ch_lJD7nhG8_DeOU6AqgkBxLq7FaIb-09UiIdTKnoEGvjuYUCX6yqCgf4FckPC9Mmpz05l0De7pHt1IbVyHzonxIBeVIwhWhpy2VnGmHlFfG0dox8kPbuNiSZov8NYt6XaqZlXDzqUZ0ZqIiKAnKn7M-_-DoRfnNv8cqYpv7hze8KWcublmF32v4RI4c9Jg8v0QHTVBM0Ze47wCcdN3wIzugk_zHIwwUk3l08Dcd0T1s5I-n4NOqcJBSkhTcOAtL3rOG7cP3V-IaQAqoIpSmPdW1L9W0Vx_j59obIh3B_gdPzjeH7wjDZson5UON2VBEWyTVkRc-EApnADFdeKItJdyLA-zVpRZx9plBTQqht9Vt6kqynnOrdgV92Zlc1KmLLk94ZEZIzjzc16p6WZBNTimUtJWzZWqt3vrw0mCucjVE4JrlaqwQF01",
      isLoading: true,
      loadTimeout: null,
    };
  },

  mounted() {
    this.loadTimeout = setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
      }
    }, 5000);
  },

  methods: {
    onIframeLoad() {
      this.isLoading = false;
      clearTimeout(this.loadTimeout);
    },
  },
};
</script>

<style scoped>
.iframe-container {
  width: 100%;
  height: 85vh;
  position: relative;
}

.docuware-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
