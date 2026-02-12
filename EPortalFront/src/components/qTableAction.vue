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
          style="border: 0.5px solid grey"
        >
          <q-list dense>
            <q-item
              v-for="col in props.cols.filter((col) => col.name !== 'desc')"
              :key="col.name"
            >
              <q-item-section>
                <q-item-label>{{ col.label + ":" }}</q-item-label>
              </q-item-section>
              <template v-if="col.name === 'Actions'">
                <q-item-section side>
                  <div class="insideCard">
                    <q-card style="width: 100%">
                      <q-btn
                        push
                        @click="approveLeave(props.row.leaveId)"
                        icon="check_circle"
                        color="green"
                        label="Approve"
                        class="q-mr-xs"
                        style="width: 100%"
                      />
                    </q-card>
                    <q-card style="width: 100%; margin-top: 5px">
                      <q-btn
                        push
                        @click="rejectLeaveDia(props.row.leaveId)"
                        icon="cancel"
                        color="negative"
                        label="Reject"
                        style="width: 100%"
                      />
                    </q-card>
                  </div>
                </q-item-section>
              </template>
              <template v-else>
                <q-item-section side>
                  <q-item-label
                    class="text-bold text-black"
                    caption
                    style="padding-top: 2px"
                  >
                    {{
                      col.field === "dateLeavedFrom" ||
                      col.field === "dateLeavedTo"
                        ? formatDateTime(props.row[col.field])
                        : col.field === "leaveType"
                        ? LeaveTypeLabels[props.row[col.field]]
                        : props.row[col.field]
                    }}
                  </q-item-label>
                </q-item-section>
              </template>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>
  </q-table>

  <q-dialog v-model="rejectDialog">
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
        <div class="text-h6 text-white text-bold">
          Reason For Rejecting Leave(s)
        </div>
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
      <q-card-section class="q-pt-xm">
        <q-input
          filled
          v-model="reasonForRejection"
          placeholder="Type here"
          type="textarea"
        ></q-input>
      </q-card-section>
      <q-card-actions
        style="display: flex; justify-content: right"
        class="q-pr-md"
      >
        <div style="display: flex; justify-content: center; gap: 10px">
          <q-btn
            class="bg-negative text-white text-subtitle1"
            push
            label="cancel"
            @click="cancelReject"
          />
          <q-btn
            class="bg-primary text-white text-subtitle1"
            push
            label="confirm"
            @click="rejectLeave"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { QSpinnerIos } from "quasar";
import helperMethods from "../helperMethods.js";

export default {
  props: {
    items: Array,
    columns: Array,
    LeaveTypeLabels: Object,
    fetchapprovedLeaves: Function,
    fetchrejectedLeaves: Function,
    fetchpendingLeaves: Function,
    fetchUserApprovedLeaves: Function,
    fetchUserRejectedLeaves: Function,
  },

  data() {
    return {
      rejectId: "",
      rejectDialog: false,
      reasonForRejection: "",
    };
  },

  computed: {},

  methods: {
    formatDateTime(dateTimeString) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString(undefined, options);
    },

    rejectLeaveDia(leaveId) {
      this.rejectDialog = true;
      this.rejectId = leaveId;
    },

    cancelReject() {
      this.reasonForRejection = "";
      this.rejectDialog = false;
    },

    async approveLeave(leaveId) {
      let isMultiple = false;

      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure you want to approve ${
            isMultiple ? "these leaves?" : "this leave?"
          }`,
          cancel: true,
          persistent: true,
          ok: {
            push: true,
            color: "primary",
            label: "Confirm",
            class: "text-subtitle1",
          },
          cancel: {
            push: true,
            color: "negative",
            label: "Cancel",
            class: "text-subtitle1",
          },
          titleClass: "custom-title-class",
        })
        .onOk(async () => {
          try {
            let leaveIds;
            if (Array.isArray(leaveId)) {
              leaveIds = leaveId.map((item) => item.leaveId);
              isMultiple = leaveIds.length > 1;
            } else {
              leaveIds = [leaveId];
            }

            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Approving Leave Request",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });

            await helperMethods.delay(500);
            await this.$store.dispatch("leaveModule/approveLeaves", leaveIds);
            this.selectedItems = [];
            await this.fetchapprovedLeaves();
            await this.fetchpendingLeaves();
            await this.fetchUserApprovedLeaves();
            this.$q.loading.hide();
            helperMethods.disablePointerEvents(2000);
            this.$q.notify({
              color: "positive",
              position: "center",
              message: `Success Approving Leave Request${
                isMultiple ? "s" : ""
              }`,
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            this.selectAllLevel1 = false;
            this.selectAllLevel2 = false;
          } catch (error) {
            if (error.status === 405) {
              this.$q.loading.hide();
              console.error("Error Approving Leave Request");
              this.$q.notify({
                color: "negative",
                position: "center",
                message: "You Are Not Allowed/Authorized To Approve This Leave",
                icon: "report_problem",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
              return;
            }
            this.$q.loading.hide();
            console.error("Error Approving Leave Request");
            this.$q.notify({
              color: "negative",
              position: "center",
              message: "Failed Approving Leave",
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          }
        })
        .onDismiss(() => {});
    },

    async rejectLeave() {
      let isMultiple = false;

      if (!this.reasonForRejection) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Input the Required Field",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure you want to reject ${
            isMultiple ? "these leaves?" : "this leave?"
          }`,
          cancel: true,
          persistent: true,
          ok: {
            push: true,
            color: "primary",
            label: "Confirm",
            class: "text-subtitle1",
          },
          cancel: {
            push: true,
            color: "negative",
            label: "Cancel",
            class: "text-subtitle1",
          },
        })
        .onOk(async () => {
          try {
            let leaveIds;
            const reason = this.reasonForRejection;

            if (reason.length === 0) {
              this.$q.notify({
                color: "negative",
                position: "center",
                message: "Input the Required Field (Reason)",
                icon: "report_problem",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
              return;
            }

            if (Array.isArray(this.rejectId)) {
              leaveIds = this.rejectId.map((item) => item.leaveId);
              isMultiple = leaveIds.length > 1;
            } else {
              leaveIds = [this.rejectId];
            }
            const rejectData = {
              LeaveID: leaveIds,
              reason: reason,
              Status: "Rejected",
            };

            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Rejecting Leave Request",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });

            this.rejectDialog = false;
            await helperMethods.delay(500);
            await this.$store.dispatch("leaveModule/rejectLeaves", rejectData);
            this.selectedItems = [];
            await this.fetchUserRejectedLeaves();
            await this.fetchpendingLeaves();
            await this.fetchrejectedLeaves();
            this.$q.loading.hide();
            helperMethods.disablePointerEvents(2000);
            this.reasonForRejection = "";
            this.$q.notify({
              color: "positive",
              position: "center",
              message: `Success Rejecting Leave Request${
                isMultiple ? "s" : ""
              }`,
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            this.selectAllLevel1 = false;
            this.selectAllLevel2 = false;
          } catch (error) {
            if (error.response.status === 405) {
              this.$q.loading.hide();
              this.reasonForRejection = "";
              console.error("Error Approving Leave Request");
              this.$q.notify({
                color: "negative",
                position: "center",
                message: "You Are Not Allowed/Authorized To Reject This Leave",
                icon: "report_problem",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
              return;
            }
            this.$q.loading.hide();
            this.reasonForRejection = "";
            console.error("Error Rejecting Leave Request");
            this.$q.notify({
              color: "negative",
              position: "center",
              message: "Failed Rejecting Leave Request",
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          }
        })
        .onDismiss(() => {});
    },
  },
};
</script>

<style>
/* Add any additional styles here */
</style>
