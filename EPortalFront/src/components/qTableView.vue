<template>
  <q-table
    grid
    flat
    bordered
    card-class="bg-primary text-white"
    :rows="items"
    :columns="columns"
    row-key="leaveId"
    style="max-height: 450px; overflow-y: auto"
    class="virtual-scroll"
    :pagination="{ rowsPerPage: 0 }"
    hide-pagination
  >
    <template v-slot:item="props">
      <div class="q-pa-xs col-12 grid-style-transition">
        <q-card
          bordered
          flat
          :class="{ 'bg-blue-1 text-black': props.rowIndex % 2 !== 1 }"
        >
          <q-list dense style="border: 0.5px solid grey">
            <q-item
              v-for="col in props.cols.filter((col) => col.name !== 'desc')"
              :key="col.name"
            >
              <q-item-section>
                <q-item-label>{{ col.label + ":" }}</q-item-label>
              </q-item-section>
              <template v-if="col.name === 'Employee Name'">
                <div class="text-right">
                  <div class="text-bold">
                    {{ props.row.EmployeeName }}
                  </div>
                  <div style="font-size: 11px">
                    {{ props.row.deptDescription }}
                  </div>
                </div>
              </template>
              <template v-else-if="col.name === 'Reason'">
                <q-item-section side>
                  <q-btn
                    push
                    @click="reasonLeave(props.row.reasonForLeave)"
                    icon="article"
                    color="primary"
                    style="width: 50%"
                  />
                </q-item-section>
              </template>
              <template v-else-if="col.name === 'Actions'">
                <q-item-section side>
                  <template
                    v-if="
                      cancelLeave
                        ? props.row.cancelledStatusOrig === 'Approved'
                        : props.row.status === 'Approved'
                    "
                  >
                    <div class="insideCard">
                      <q-card style="width: 100%; margin-bottom: 5px">
                        <q-card-section
                          class="bg-positive text-white text-h6 text-center"
                          style="line-height: 0.5"
                        >
                          Approved
                        </q-card-section>
                      </q-card>
                    </div>
                  </template>
                  <template
                    v-else-if="
                      cancelLeave
                        ? props.row.cancelledStatusOrig ===
                            'RejectedByLevel1' ||
                          props.row.cancelledStatusOrig === 'RejectedByLevel2'
                        : props.row.status === 'RejectedByLevel1' ||
                          props.row.status === 'RejectedByLevel2'
                    "
                  >
                    <q-card style="width: 100%; margin-bottom: 5px">
                      <q-card-section
                        class="bg-negative text-white text-h6 text-center"
                        style="line-height: 0.5"
                      >
                        Rejected
                      </q-card-section>
                    </q-card>
                  </template>
                </q-item-section>
              </template>
              <template v-else>
                <q-item-section side>
                  <q-item-label
                    class="text-bold text-black"
                    caption
                    style="padding-top: 2px"
                  >
                    {{ renderCell(props.row, col) }}
                  </q-item-label>
                </q-item-section>
              </template>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>
  </q-table>

  <q-dialog v-model="reasonDialog">
    <q-card
      :class="[
        'bold-text',
        $q.screen.name + '-text',
        $q.screen.name + '-width',
        $q.screen.name + '-min-height',
      ]"
      class="rounded"
    >
      <q-card-section class="bg-primary row items-center q-pb-sm">
        <div class="text-h6 text-white text-bold">Leave Request Reason</div>
        <q-space></q-space>
        <q-btn
          class="bg-white"
          icon="close"
          push
          round
          dense
          padding="xs"
          v-close-popup
        ></q-btn>
      </q-card-section>
      <q-card-section class="q-pt-xm text-justify text-subtitle1">
        {{ reasonForLeave }}
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    items: Array,
    columns: Array,
    LeaveTypeLabels: Object,
    cancelLeave: Boolean,
    approveLeave: Boolean,
  },
  data() {
    return {
      reasonForLeave: "",
      reasonDialog: false,
    };
  },

  computed: {
    ...mapGetters({
      userCode: "user_module/employee_id",
    }),
  },

  methods: {
    renderCell(row, col) {
      if (col.field === "leaveType" && this.LeaveTypeLabels) {
        return this.LeaveTypeLabels[row[col.field]];
      } else if (col.field === "tIME_FROM" || col.field === "tIME_TO") {
        return this.formatTimeTo12Hours(row[col.field]);
      } else if (
        col.field === "dateLeavedFrom" ||
        col.field === "dateLeavedTo" ||
        col.field === "transDate"
      ) {
        return this.formatDateTime(row[col.field]);
      } else if (col.name === "Date Approved") {
        if (
          row.approvedByLevel1 !== null &&
          row.approvedByLevel1 == this.userCode
        ) {
          return this.formatDateTime(row.approvedByLevel1DateTime);
        } else if (
          row.approvedByLevel2 !== null &&
          row.approvedByLevel2 == this.userCode
        ) {
          return this.formatDateTime(row.approvedByLevel2DateTime);
        } else {
          return row[col.field];
        }
      } else if (col.name === "Date Rejected") {
        if (
          row.rejectedByLevel1 !== null &&
          row.rejectedByLevel1 == this.userCode
        ) {
          return this.formatDateTime(row.rejectedByLevel1DateTime);
        } else if (
          row.rejectedByLevel2 !== null &&
          row.rejectedByLevel2 == this.userCode
        ) {
          return this.formatDateTime(row.rejectedByLevel2DateTime);
        } else {
          return row[col.field];
        }
      } else {
        return row[col.field];
      }
    },

    formatDateTime(dateTimeString) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString(undefined, options);
    },

    formatTimeTo12Hours(Time) {
      const dateObj = new Date(Time);
      if (isNaN(dateObj)) {
        return "";
      }
      return dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    },

    reasonLeave(reasonForLeave) {
      this.reasonDialog = true;
      this.reasonForLeave = reasonForLeave;
    },
  },
};
</script>
