<template>
  <q-btn-dropdown
    push
    class="text-black bg-white"
    icon="sort"
    label="Filter Details"
    :style="{ width: $q.screen.gt.xs ? '200px' : '100%' }"
  >
    <q-list v-if="pendingLeave === true" class="text-bold bg-grey-2">
      <q-item
        v-if="showHeadDept"
        class="hoverable-item"
        clickable
        v-close-popup
        @click="onItemClick('SHOW_HEAD_APPROVE')"
      >
        <q-item-section>
          <q-item-label
            >Pending {{ overtimeModule ? "Overtime" : "Leaves" }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item
        v-if="overtimeModule"
        class="hoverable-item"
        clickable
        v-close-popup
        @click="onItemClick('SHOW_ACCOMPLISHMENT_APPROVE')"
      >
        <q-item-section>
          <q-item-label>Pending Accomplishment</q-item-label>
        </q-item-section>
      </q-item>
      <!-- <q-item v-if="showSupervisor" class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_SUPERVISOR_APPROVE')">
        <q-item-section>
          <q-item-label>Supervisor/Level2 Pending Leaves</q-item-label>
        </q-item-section>
      </q-item> -->
      <q-item
        class="hoverable-item"
        clickable
        v-close-popup
        @click="onItemClick('SHOW_FILTERED_LEAVES')"
      >
        <q-item-section>
          <q-item-label>Filter By Department</q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        class="hoverable-item"
        clickable
        v-close-popup
        @click="onItemClick('SHOW_MY_APPROVED')"
      >
        <q-item-section>
          <q-item-label
            >My Approved
            {{ overtimeModule ? "Overtime" : "Leaves" }}</q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item
        class="hoverable-item"
        clickable
        v-close-popup
        @click="onItemClick('SHOW_MY_REJECTED')"
      >
        <q-item-section>
          <q-item-label
            >My Rejected
            {{ overtimeModule ? "Overtime" : "Leaves" }}</q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>

    <q-list v-if="cancelLeave === true" class="text-bold bg-grey-2">
      <q-item
        v-if="showHeadDept"
        class="hoverable-item"
        clickable
        v-close-popup
        @click="onItemClick('SHOW_HEAD_APPROVE')"
      >
        <q-item-section>
          <q-item-label
            >Pending Canceled
            {{ overtimeModule ? "Overtime" : "Leaves" }}</q-item-label
          >
        </q-item-section>
      </q-item>
      <!-- <q-item v-if="showSupervisor" class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_SUPERVISOR_APPROVE')">
        <q-item-section>
          <q-item-label>Supervisor/Level2 Pending Leaves</q-item-label>
        </q-item-section>
      </q-item> -->
      <q-item
        class="hoverable-item"
        clickable
        v-close-popup
        @click="onItemClick('SHOW_FILTERED_LEAVES')"
      >
        <q-item-section>
          <q-item-label>Filter By Department</q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        class="hoverable-item"
        clickable
        v-close-popup
        @click="onItemClick('SHOW_MY_APPROVED')"
      >
        <q-item-section>
          <q-item-label
            >My Approved Canceled
            {{ overtimeModule ? "Overtime" : "Leaves" }}</q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item
        class="hoverable-item"
        clickable
        v-close-popup
        @click="onItemClick('SHOW_MY_REJECTED')"
      >
        <q-item-section>
          <q-item-label
            >My Rejected Canceled
            {{ overtimeModule ? "Overtime" : "Leaves" }}</q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>

    <q-list v-if="empDetails" class="text-bold bg-grey-2">
      <q-item
        class="hoverable-item"
        clickable
        v-close-popup
        @click="onItemClick2('SHOW_LEAVE_DETAILS')"
      >
        <q-item-section>
          <q-item-label>Leave Details</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        class="hoverable-item"
        clickable
        v-close-popup
        @click="onItemClick2('SHOW_PENDING_LEAVE')"
      >
        <q-item-section>
          <q-item-label>Filed Leaves</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        class="hoverable-item"
        clickable
        v-close-popup
        @click="showApproverDialog = true"
      >
        <q-item-section>
          <q-item-label>Approver</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>

  <q-dialog v-model="showApproverDialog">
    <q-card
      :class="[
        'bold-text',
        $q.screen.name + '-text',
        $q.screen.name + '-min-height',
        $q.screen.name + '-min-width',
      ]"
      class="rounded"
    >
      <q-card-section
        class="bg-primary row items-center q-pb-md"
        style="min-width: 400px"
      >
        <div class="bg-primary text-white text-bold">Approvers by Level</div>
        <q-space></q-space>
        <q-btn
          class="bg-white"
          icon="close"
          push
          round
          dense
          v-close-popup
        ></q-btn>
      </q-card-section>
      <q-card-section class="text-subtitle1">
        <q-table
          flat
          bordered
          :rows="approversDetails"
          :columns="approversCol"
          row-key="Level"
          hide-bottom
          style="max-height: 400px; overflow-y: auto"
          class="virtual-scroll"
          :pagination="{ rowsPerPage: 0 }"
          hide-pagination
        >
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import overtimeModule from "src/store/modules/overtimeModule";

export default {
  props: {
    showHeadDept: {
      type: Boolean,
      default: false,
    },
    pendingLeave: Boolean,
    cancelLeave: Boolean,
    empDetails: Boolean,
    sortedApproversDetails: Array,
    overtimeModule: Boolean,
  },

  emits: [
    "head-approve",
    "accomplish-approve",
    "filter-leaves",
    "my-approved",
    "my-rejected",
    "leave-details",
    "pending-leave",
  ],

  data() {
    return {
      showApproverDialog: false,
      approversDetails: this.sortedApproversDetails,
      approversCol: [
        { name: "Level", label: "Level", align: "center", field: "Level" },
        {
          name: "Approver Name",
          label: "Approver Name",
          align: "center",
          field: "EmployeeName",
          width: "130px",
        },
      ],
    };
  },

  methods: {
    onItemClick(selectedItem) {
      if (selectedItem === "SHOW_HEAD_APPROVE") {
        this.$emit("head-approve");
      } else if (selectedItem === "SHOW_ACCOMPLISHMENT_APPROVE") {
        this.$emit("accomplish-approve");
      } else if (selectedItem === "SHOW_FILTERED_LEAVES") {
        this.$emit("filter-leaves");
      } else if (selectedItem === "SHOW_MY_APPROVED") {
        this.$emit("my-approved");
      } else if (selectedItem === "SHOW_MY_REJECTED") {
        this.$emit("my-rejected");
      }
    },

    onItemClick2(selectedItem) {
      if (selectedItem === "SHOW_LEAVE_DETAILS") {
        this.$emit("leave-details");
      } else if (selectedItem === "SHOW_PENDING_LEAVE") {
        this.$emit("pending-leave");
      }
    },
  },
};
</script>
