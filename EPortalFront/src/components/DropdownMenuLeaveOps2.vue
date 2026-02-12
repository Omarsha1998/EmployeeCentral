<template>
  <q-btn-dropdown
    push
    class="text-black bg-white"
    icon="sort"
    label="Filter Details"
    :style="{ width: $q.screen.gt.xs ? '200px' : '100%' }"
  >
    <q-list
      v-if="pendingLeave === true || cancelLeave === true"
      class="text-bold bg-grey-2"
    >
      <q-item
        class="hoverable-item"
        clickable
        v-close-popup
        @click="onItemClick('SHOW_APPROVED_LEAVES')"
      >
        <q-item-section>
          <q-item-label
            >{{ cancelLeave ? "Approved Canceled" : "Approved" }}
            {{ overtimeModule ? "Overtime" : "Leave" }}</q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item
        class="hoverable-item"
        clickable
        v-close-popup
        @click="onItemClick('SHOW_REJECTED_LEAVES')"
      >
        <q-item-section>
          <q-item-label
            >{{ cancelLeave ? "Rejected Canceled" : "Rejected" }}
            {{ overtimeModule ? "Overtime" : "Leave" }}</q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>

    <!-- <q-list v-if="cancelLeave === true" class="text-bold bg-grey-2">
      <q-item class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_APPROVED_LEAVES')">
        <q-item-section>
          <q-item-label>Approved Canceled</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_REJECTED_LEAVES')">
        <q-item-section>
          <q-item-label>Rejected Canceled</q-item-label>
        </q-item-section>
      </q-item>
    </q-list> -->
  </q-btn-dropdown>
</template>

<script>
import overtimeModule from "src/store/modules/overtimeModule";

export default {
  props: {
    cancelLeave: Boolean,
    pendingLeave: Boolean,
    overtimeModule: Boolean,
  },

  methods: {
    onItemClick(selectedItem) {
      if (selectedItem === "SHOW_APPROVED_LEAVES") {
        this.$emit("show-approved-leaves");
      } else {
        this.$emit("show-rejected-leaves");
      }
    },
  },
};
</script>
