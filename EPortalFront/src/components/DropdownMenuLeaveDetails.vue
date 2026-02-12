<template>
  <q-btn-dropdown
    push
    :style="{ width: $q.screen.gt.xs ? '200px' : '100%' }"
    class="text-black bg-white"
    icon="sort"
    label="Filter Details"
  >
    <q-list class="text-bold bg-grey-2">
      <q-item
        v-for="item in menuItems"
        :key="item.label"
        class="hoverable-item"
        clickable
        v-close-popup
        @click="onItemClick(item.action)"
      >
        <q-item-section>
          <q-item-label>{{ item.label }}</q-item-label>
        </q-item-section>
      </q-item>
      <PrintPDF :entry="items" :multiple="true" />
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import PrintPDF from "../components/GeneratePDF.vue";
export default {
  props: {
    items: Array,
  },

  data() {
    return {
      menuItems: [
        { label: "Leave History", action: "SHOW_LEAVE_HISTORY" },
        { label: "Leave Ledger", action: "SHOW_LEAVE_LEDGER" },
        { label: "Leave Approvers", action: "SHOW_LEAVE_APPROVERS" },
      ],
    };
  },
  components: {
    PrintPDF,
  },

  methods: {
    onItemClick(selectedItem) {
      if (selectedItem === "SHOW_LEAVE_HISTORY") {
        this.$emit("show-leave-history");
      } else if (selectedItem === "SHOW_LEAVE_LEDGER") {
        this.$emit("show-leave-ledger");
      } else if (selectedItem === "SHOW_LEAVE_APPROVERS") {
        this.$emit("show-leave-approvers");
      }
    },
  },
};
</script>
