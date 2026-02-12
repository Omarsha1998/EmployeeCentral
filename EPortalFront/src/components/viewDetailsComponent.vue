<template>
  <q-table
    v-if="!mobileView"
    style="height: 450px"
    class="custom-scroll"
    :rows="itemDetails"
    :columns="itemColumns"
    row-key="overtimeId"
    virtual-scroll
    :virtual-scroll-item-size="11"
    hide-pagination
    :rows-per-page-options="[0]"
  >
    <template v-slot:header>
      <q-tr class="sticky-thead bg-grey-3 text-black">
        <q-th
          v-for="col in itemColumns"
          :key="col.name"
          :style="{ width: col.width }"
          class="text-center"
        >
          {{ col.name }}
        </q-th>
      </q-tr>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props" :key="props.row.overtimeId">
        <q-td class="text-center" v-for="col in itemColumns" :key="col.name">
          <template v-if="col.name === 'Status'">
            <div
              v-for="(status, index) in leaveModule
                ? getLeaveStatus(props.row, itemApprover)
                : getOvertimeStatus(props.row, itemApprover)"
              :key="index"
              class="q-pb-xs"
            >
              <q-card style="width: 100%">
                <q-card-section
                  :class="`${status.color} text-white text-bold text-center`"
                  style="line-height: 25%"
                >
                  {{ status.label }}
                </q-card-section>
              </q-card>
            </div>
          </template>
          <template
            v-else-if="col.name === (leaveModule ? 'Reason' : 'Work Load')"
          >
            <span
              @click="
                reasonOfLeaveOvertime(
                  leaveModule ? props.row.reasonForLeave : props.row.workLoad,
                  'request',
                )
              "
              class="cursor-pointer text-center text-primary"
              style="
                width: 100%;
                white-space: normal;
                word-break: break-word;
                overflow-wrap: anywhere;
              "
            >
              {{
                (props.row.reasonForLeave || props.row.workLoad)
                  .split(" ")
                  .slice(0, 3)
                  .join(" ")
              }}
              <span
                v-if="
                  (props.row.reasonForLeave || props.row.workLoad).split(' ')
                    .length > 3
                "
              >
                ... See more
              </span>
            </span>

            <!-- <q-btn
              push
              @click="
                reasonOfLeaveOvertime(
                  leaveModule ? props.row.reasonForLeave : props.row.workLoad,
                  'request',
                )
              "
              icon="article"
              color="primary"
              style="width: 50%"
            /> -->
          </template>

          <template v-if="col.label === 'Actions'">
            <q-btn-dropdown
              v-if="props.row.iDCode !== 'TempLeave'"
              push
              icon="settings"
              class="no-dropdown"
              style="width: 40px"
            >
              <q-list class="text-bold">
                <template
                  v-for="(action, index) in getActions(props.row)"
                  :key="index"
                >
                  <component
                    v-if="action.component"
                    :is="action.component"
                    v-bind="action.props"
                  />
                  <q-item
                    v-else
                    clickable
                    v-close-popup
                    class="hoverable-item"
                    @click="action.onClick"
                  >
                    <q-item-section>
                      <q-item-label>{{ action.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <!-- <PrintPDF :entry="props.row" /> -->
              </q-list>
            </q-btn-dropdown>
          </template>
          <template
            v-else-if="leaveModule === true && col.name === 'Leave Type'"
          >
            {{ LeaveTypeLabels[props.row[col.field]] }}
          </template>

          <template v-else>
            <renderCell :row="props.row" :col="col" />
          </template>
        </q-td>
      </q-tr>
    </template>

    <template v-slot:no-data="{ message }">
      <div class="full-width row flex-center text-black text-subtitle2">
        <div>
          <span class="text-black text-subtitle2">
            {{ message }}
          </span>
          <q-icon
            class="text-red"
            size="2em"
            name="sentiment_dissatisfied"
          ></q-icon>
        </div>
      </div>
    </template>
  </q-table>

  <q-table
    v-if="mobileView"
    grid
    flat
    bordered
    card-class="bg-primary text-white"
    :rows="itemDetails"
    :columns="itemColumns"
    row-key="leaveId"
    hide-bottom
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
          :class="{
            'bg-blue-1 text-black': props.rowIndex % 2 !== 1,
          }"
        >
          <q-list dense>
            <q-item
              v-for="col in props.cols.filter((col) => col.name !== 'desc')"
              :key="col.name"
            >
              <q-item-section>
                <q-item-label>{{ col.label + ":" }}</q-item-label>
              </q-item-section>
              <template v-if="col.label === 'Actions'">
                <q-btn-dropdown
                  v-if="props.row.iDCode !== 'TempLeave'"
                  push
                  icon="settings"
                  class="no-dropdown"
                  style="width: 40px"
                >
                  <q-list class="text-bold">
                    <template
                      v-for="(action, index) in getActions(props.row)"
                      :key="index"
                    >
                      <component
                        v-if="action.component"
                        :is="action.component"
                        v-bind="action.props"
                      />
                      <q-item
                        v-else
                        clickable
                        v-close-popup
                        class="hoverable-item"
                        @click="action.onClick"
                      >
                        <q-item-section>
                          <q-item-label>{{ action.label }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-list>
                </q-btn-dropdown>
              </template>
              <template
                v-else-if="col.name === (leaveModule ? 'Reason' : 'Work Load')"
              >
                <q-btn
                  push
                  @click="
                    reasonOfLeaveOvertime(
                      leaveModule
                        ? props.row.reasonForLeave
                        : props.row.workLoad,
                      'request',
                    )
                  "
                  icon="article"
                  color="primary"
                  style="line-height: 25%"
                />
              </template>
              <template v-else-if="col.name === 'Status'">
                <div
                  v-for="(status, index) in leaveModule
                    ? getLeaveStatus(props.row, itemApprover)
                    : getOvertimeStatus(props.row, itemApprover)"
                  :key="index"
                  class="q-pb-xs"
                >
                  <q-card style="width: 100%">
                    <q-card-section
                      :class="`${status.color} text-white text-bold text-center`"
                      style="line-height: 25%"
                    >
                      {{ status.label }}
                    </q-card-section>
                  </q-card>
                </div>
              </template>
              <template v-else>
                <renderCell :row="props.row" :col="col" />
              </template>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>
  </q-table>

  <q-dialog v-model="workLoadDialog">
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
          {{
            cancel
              ? leaveModule
                ? "Leave Cancel Reason"
                : "Overtime Cancel Reason"
              : rejection
              ? leaveModule
                ? "Leave Rejection Reason"
                : "Overtime Rejection Reason"
              : leaveModule
              ? "Leave Reason"
              : "Overtime Work Load"
          }}
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
      <q-card-section class="q-pt-xm text-justify text-subtitle1">
        {{ reason }}
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="editDialog">
    <q-card
      :class="[
        'bold-text',
        $q.screen.name + '-text',
        $q.screen.name + '-width',
        $q.screen.name + '-min-height',
      ]"
      class="rounded"
    >
      <q-card-section
        rd-section
        class="bg-primary text-white text-center"
        horizontal:class="['bold-text', $q.screen.name + '-text']"
      >
        Edit {{ leaveModule ? "Leave" : "Overtime" }} Form
      </q-card-section>

      <q-card-section>
        <filingForm
          :overtimeModule="this.leaveModule ? false : true"
          :editView="true"
          :editLeaveID="editId"
          :LeaveTypesOptions="LeaveTypesOptions"
          @cancelEditEmit="cancelEditEmit"
          @successEditEmit="successEditEmit"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="cancelDialog">
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
        <div class="text-white text-bold">
          Reason For Canceling {{ leaveModule ? "Leave" : "Overtime" }}
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
          v-model="reasonForCancelation"
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
            @click="cancelCancelation"
          />
          <q-btn
            class="bg-primary text-white text-subtitle1"
            push
            label="confirm"
            @click="confirmCancel"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="accomplishDialog">
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
        <div class="text-white text-bold">Accomplishment</div>
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
          outlined
          v-model="workHours"
          label="Work Hours"
          label-color="primray"
          type="number"
          style="margin-bottom: 5px"
        />

        <q-input
          outlined
          v-model="TimeFrom"
          label="Time From"
          label-color="primray"
          @click="showPopup('TimeFromPopup')"
          style="margin-bottom: 5px"
        >
          <template v-slot:append>
            <q-icon name="schedule" class="cursor-pointer">
              <q-popup-proxy ref="TimeFromPopup" :breakpoint="1440" cover>
                <div class="q-date-container">
                  <q-time v-model="TimeFrom" mask="h:mm A" />
                  <q-btn
                    push
                    icon="close"
                    class="bg-white absolute-top-right"
                    round
                    padding="xs"
                    @click="hidePopup('TimeFromPopup')"
                    style="margin: 10px"
                  />
                </div>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- Time To -->
        <q-input
          outlined
          v-model="TimeTo"
          label="Time To"
          label-color="primray"
          @click="showPopup('TimeToPopup')"
          style="margin-bottom: 5px"
        >
          <template v-slot:append>
            <q-icon name="schedule" class="cursor-pointer">
              <q-popup-proxy ref="TimeToPopup" :breakpoint="1440" cover>
                <div class="q-date-container">
                  <q-time v-model="TimeTo" mask="h:mm A" />
                  <q-btn
                    push
                    icon="close"
                    class="bg-white absolute-top-right"
                    round
                    padding="xs"
                    @click="hidePopup('TimeToPopup')"
                    style="margin: 10px"
                  />
                </div>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          outlined
          v-model="Reason"
          label="Accomplishment"
          label-color="primray"
          type="textarea"
          class="q-mb-md"
          :rows="8"
        />
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
            @click="cancelAccomplish"
          />
          <q-btn
            class="bg-primary text-white text-subtitle1"
            push
            label="confirm"
            @click="confirmAccomplish"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import renderCell from "./helpers/renderCell.vue";
import filingForm from "src/components/filingForm.vue";
import { QSpinnerIos } from "quasar";
import helperMethods from "src/helperMethods";
import PrintPDF from "./GeneratePDF.vue";

export default {
  emits: ["cancelEditEmit", "emitSuccessEditing"],

  data() {
    return {
      reason: "",
      request: false,
      rejection: false,
      cancel: false,
      workLoadDialog: false,
      editId: null,
      editDialog: false,
      cancelDialog: false,
      cancelId: null,
      reasonForCancelation: "",
      accomplishmentOvertimeId: null,
      accomplishDialog: false,
      workHours: null,
      Reason: "",
      TimeFrom: null,
      TimeTo: null,
    };
  },

  props: {
    itemDetails: Array,
    itemColumns: Array,
    itemApprover: Array,
    LeaveTypeLabels: Object,
    leaveModule: Boolean,
    LeaveTypesOptions: Array,
    mobileView: Boolean,
  },

  components: {
    renderCell,
    filingForm,
    PrintPDF,
  },

  computed: {},

  methods: {
    showPopup(refName) {
      this.$refs[refName].show();
    },

    hidePopup(refName) {
      this.$refs[refName].hide();
    },

    getLeaveStatus(row, itemApprover) {
      const level1 = itemApprover?.some((item) => item.lvl === 1);
      const level2 = itemApprover?.some((item) => item.lvl === 2);
      const rules = [
        {
          condition:
            row.status === "Approved" && row.cancelledStatusOrig === null,
          label: "LEAVE APPROVED",
          color: "bg-green-8",
        },
        {
          condition: row.status === "RejectedByLevel1",
          label: "REJECTED BY LEVEL 1",
          color: "bg-negative",
        },
        {
          condition: row.status === "RejectedByLevel2",
          label: "REJECTED BY LEVEL 2",
          color: "bg-negative",
        },
        {
          condition: row.status === "PendingLevel2" && level1,
          label: "LEVEL 1 APPROVED",
          color: "bg-green-8",
        },
        {
          condition: row.status === "Pending" && level1,
          label: "PENDING LEVEL 1",
          color: "bg-yellow-10",
        },
        {
          condition:
            level2 &&
            row.approvedByLevel2 === null &&
            row.status !== "RejectedByLevel1" &&
            row.status !== "RejectedByLevel2" &&
            row.status !== "CANCELLED",
          label: "PENDING LEVEL 2",
          color: "bg-yellow-10",
        },
        {
          condition:
            row.status === "CANCELLED" &&
            row.cancelledByLevel1 &&
            row.cancelledByLevel2,
          label: "CANCELED APPROVED",
          color: "bg-negative",
        },
        {
          condition:
            row.status === "CANCELLED" &&
            (!row.cancelledByLevel1 || !row.cancelledByLevel2),
          label: "CANCELED",
          color: "bg-negative",
        },
        {
          condition: row.cancelledStatusOrig === "RejectedByLevel1",
          label: "CANCEL REJECTED BY LEVEL 1",
          color: "bg-negative",
        },
        {
          condition: row.cancelledStatusOrig === "RejectedByLevel2",
          label: "CANCEL REJECTED BY LEVEL 2",
          color: "bg-negative",
        },
        {
          condition: row.cancelledStatusOrig === "PendingLevel2" && level1,
          label: "LEVEL 1 CANCEL APPROVED",
          color: "bg-green-8",
        },
        {
          condition: row.cancelledStatusOrig === "PendingLevel" && level1,
          label: "PENDING CANCEL LEVEL 1",
          color: "bg-yellow-10",
        },
        {
          condition:
            (row.cancelledStatusOrig === "PendingLevel" ||
              row.cancelledStatusOrig === "PendingLevel2") &&
            level2,
          label: "PENDING CANCEL LEVEL 2",
          color: "bg-yellow-10",
        },
      ];

      return rules
        .filter((rule) => rule.condition)
        .map(({ label, color }) => ({ label, color }));
    },

    getOvertimeStatus(row, itemApprover) {
      const level1 = itemApprover?.some((item) => item.lvl === 1);
      const level2 = itemApprover?.some((item) => item.lvl === 2);
      const rules = [
        {
          condition: row.status === "Approved",
          label: "OVERTIME APPROVED",
          color: "bg-green-8",
        },
        {
          condition: row.status === "Paid",
          label: "Paid",
          color: "bg-green-8",
        },
        {
          condition: row.status === "For Payment",
          label: "FOR PAYMENT",
          color: "bg-yellow-10",
        },
        {
          condition: row.status === "PendingAccomplishment",
          label: "PENDING ACCOMPLISHMENT",
          color: "bg-yellow-10",
        },
        {
          condition: row.status === "PendingAccomplishApproval",
          label: "ACCOMPLISHMENT REVIEW",
          color: "bg-yellow-10",
        },
        {
          condition: row.status === "PendingHrd",
          label: "PENDING HRD",
          color: "bg-yellow-10",
        },
        {
          condition: row.status === "RejectedByLevel1",
          label: "REJECTED BY LEVEL 1",
          color: "bg-negative",
        },

        {
          condition: row.status === "RejectedByLevel2",
          label: "REJECTED BY LEVEL 2",
          color: "bg-negative",
        },
        {
          condition: row.status === "RejectedByHrd",
          label: "REJECTED BY HRD",
          color: "bg-negative",
        },
        {
          condition: row.status === "RejectedAccomplishment",
          label: "REJECTED ACCOMPLISHMENT",
          color: "bg-negative",
        },
        {
          condition: row.status === "PendingLevel2" && level1,
          label: "LEVEL 1 APPROVED",
          color: "bg-green-8",
        },
        {
          condition: row.status === "Pending" && level1,
          label: "PENDING LEVEL 1",
          color: "bg-yellow-10",
        },
        {
          condition:
            level2 &&
            row.approvedByLevel2 === null &&
            row.status !== "RejectedByLevel1" &&
            row.status !== "RejectedByLevel2" &&
            row.status !== "RejectedCancelByLevel1" &&
            row.status !== "RejectedCancelByLevel2" &&
            row.status !== "CANCELLED",
          label: "PENDING LEVEL 2",
          color: "bg-yellow-10",
        },
        {
          condition:
            row.status === "CANCELLED" &&
            row.cancelApprovedByLevel1 &&
            row.cancelApprovedByLevel2,
          label: "CANCELED APPROVED",
          color: "bg-negative",
        },
        {
          condition:
            row.status === "CANCELLED" &&
            (!row.cancelApprovedByLevel1 || !row.cancelApprovedByLevel2),
          label: "CANCELED",
          color: "bg-negative",
        },
        {
          condition: row.status === "RejectedCancelByLevel1",
          label: "CANCEL REJECTED BY LEVEL 1",
          color: "bg-negative",
        },
        {
          condition: row.status === "RejectedCancelByLevel2",
          label: "CANCEL REJECTED BY LEVEL 2",
          color: "bg-negative",
        },
        {
          condition: row.status === "PendingCancelLevel2" && level1,
          label: "LEVEL 1 CANCEL APPROVED",
          color: "bg-green-8",
        },
        {
          condition: row.status === "PendingCancel" && level1,
          label: "PENDING CANCEL LEVEL 1",
          color: "bg-yellow-10",
        },
        {
          condition:
            (row.status === "PendingCancel" ||
              row.status === "PendingCancelLevel2") &&
            level2,
          label: "PENDING CANCEL LEVEL 2",
          color: "bg-yellow-10",
        },
      ];

      return rules
        .filter((rule) => rule.condition)
        .map(({ label, color }) => ({ label, color }));
    },

    getActions(row) {
      const level1Approved = row.approvedByLevel1 !== null;
      const actions = [
        {
          label: `${this.leaveModule ? "Edit Leave" : "Edit Overtime"}`,
          show: row.status === "PendingLevel2" || row.status === "Pending",
          onClick: () =>
            this.editLeaveOvertime(
              this.leaveModule ? row.leaveId : row.overtimeId,
            ),
        },
        {
          label: "Submit Accomplishment",
          show: !this.leaveModule && row.status === "PendingAccomplishment",
          onClick: () => this.accomplishmentDia(row),
        },
        {
          label: `${this.leaveModule ? "Cancel Leave" : "Cancel Overtime"}`,
          show:
            row.status === "PendingLevel2" ||
            row.status === "Pending" ||
            row.status === "PendingHrd" ||
            row.status === "Approved" ||
            (level1Approved && row.status === "PendingLevel2"),
          onClick: () =>
            this.cancelLeaveOvertime(
              this.leaveModule ? row.leaveId : row.overtimeId,
            ),
        },
        {
          label: "Reason of Rejection",
          show:
            row.status === "RejectedByLevel1" ||
            row.status === "RejectedByLevel2" ||
            row.status === "RejectedAccomplishment",
          onClick: () =>
            this.reasonOfLeaveOvertime(
              this.leaveModule ? row.reasonForRejection : row.rejectedReason,
              "reject",
            ),
        },
        {
          label: "Reason of Cancelation",
          show: this.leaveModule
            ? row.reasonForCancel !== null
            : row.canceledReason !== null,
          onClick: () =>
            this.reasonOfLeaveOvertime(
              this.leaveModule ? row.reasonForCancel : row.canceledReason,
              "cancel",
            ),
        },
        {
          label: "Print PDF",
          show: true,
          component: "PrintPDF",
          props: { entry: row, type: "overtime" },
        },
      ];

      return actions.filter((action) => action.show);
    },

    reasonOfLeaveOvertime(reason, stringValue) {
      this.workLoadDialog = true;
      this.reason = reason;
      this.request = false;
      this.cancel = false;
      this.rejection = false;

      if (stringValue === "request") {
        this.request = true;
      } else if (stringValue === "cancel") {
        this.cancel = true;
      } else if (stringValue === "reject") {
        this.rejection = true;
      }
    },

    editLeaveOvertime(editId) {
      this.editDialog = true;
      this.editId = editId;
    },

    cancelEditEmit() {
      this.editDialog = false;
    },

    successEditEmit() {
      this.editDialog = false;
      this.$emit("emitSuccessEditing");
    },

    cancelLeaveOvertime(cancelId) {
      this.cancelDialog = true;
      this.cancelId = cancelId;
    },

    cancelCancelation() {
      this.reasonForCancelation = "";
      this.cancelDialog = false;
      this.cancelId = "";
    },

    async confirmCancel() {
      if (this.reasonForCancelation.length === 0) {
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
      const cancelData = {
        [this.leaveModule ? "LeaveId" : "overtimeId"]: this.cancelId,
        reason: this.reasonForCancelation,
      };

      this.$q
        .dialog({
          title: "Warning",
          message: `Are you sure you want to cancel your ${
            this.leaveModule ? "leave" : "overtime"
          }?`,
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
          this.cancelDialog = false;
          this.$q.loading.show({
            spinner: QSpinnerIos,
            message: `Cancelling ${
              this.leaveModule ? "leave" : "overtime"
            } request`,
            messageColor: "primary",
            backgroundColor: "grey-1",
            spinnerColor: "primary",
            customClass: "custom-loading-style",
            spinnerSize: "7em",
          });

          try {
            await helperMethods.delay(500);

            const action = this.leaveModule
              ? "leaveModule/cancelLeave"
              : "overtimeModule/cancelOvertime";
            await this.$store.dispatch(action, cancelData);
            // await this.$store.dispatch(
            //   "overtimeModule/cancelOvertime",
            //   cancelData,
            // );
            this.$emit("emitSuccessEditing");
            this.$q.loading.hide();
            this.cancelDialog = false;
            this.reasonForCancelation = "";
            this.cancelId = null;
            this.$q.notify({
              color: "green-8",
              position: "center",
              message: `Success Cancel of ${
                this.leaveModule ? "leave" : "overtime"
              } request, Wait For The Approval`,
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            helperMethods.disablePointerEvents(2000);
          } catch (error) {
            this.cancelId = null;
            this.$q.loading.hide();
            this.reasonForCancelation = "";
            this.cancelDialog = false;
            this.$q.notify({
              color: "negative",
              position: "center",
              message: `Error cancel of ${
                this.leaveModule ? "leave" : "overtime"
              } request`,
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          }
        })
        .onDismiss(() => {});
    },

    accomplishmentDia(row) {
      if (!row.schedIn || !row.schedOut) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message:
            "Please do kindly check your Daily Time Record on this overtime date and fix if there is a missing time record, Kindly contact HRD.",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });

        return;
      }
      this.workHours = row.approvedHours;
      this.accomplishmentOvertimeId = row.overtimeId;
      this.accomplishDialog = true;
    },

    updateTimeTo() {
      if (this.TimeFrom && this.workHours) {
        this.TimeTo = helperMethods.calculateTimeTo(
          this.TimeFrom,
          this.workHours,
        );
      }
    },

    updateWorkHours() {
      if (this.TimeFrom && this.TimeTo) {
        this.workHours = helperMethods.calculateWorkHours(
          this.TimeFrom,
          this.TimeTo,
        );
      }
    },

    cancelAccomplish() {
      this.workHours = null;
      this.Reason = "";
      this.TimeFrom = null;
      this.TimeTo = null;
      this.accomplishDialog = false;
      this.accomplishmentOvertimeId = null;
    },

    async confirmAccomplish() {
      if (this.workHours < 0 || this.workHours === 0) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message:
            "Hours must be a whole number or a number with decimal places of 0.5",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      if (!this.workHours || !this.TimeFrom || !this.TimeTo || !this.Reason) {
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

      const data = {
        workHours: this.workHours,
        workLoad: this.Reason,
        timeFrom: this.TimeFrom,
        timeTo: this.TimeTo,
        overtimeId: this.accomplishmentOvertimeId,
      };

      try {
        this.$q.loading.show({
          spinner: QSpinnerIos,
          message: "Submitting Overtime Request",
          messageColor: "primary",
          backgroundColor: "blue-1",
          spinnerColor: "primary",
          customClass: "custom-loading-style",
          spinnerSize: "7em",
        });
        this.editDialog = false;
        await helperMethods.delay(500);
        await this.$store.dispatch("overtimeModule/submitAccomplishment", data);
        this.$emit("emitSuccessEditing");
        this.accomplishDialog = false;
        this.$q.loading.hide();
        this.workHours = null;
        this.TimeFrom = null;
        this.TimeTo = null;
        this.Reason = null;
        helperMethods.disablePointerEvents(2000);
        this.$q.notify({
          color: "green-8",
          position: "center",
          message: "Success submitting overtime accomplishment",
          icon: "check",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
      } catch (error) {
        console.error("Error submitting overtime accomplishment");
        this.workHours = null;
        this.TimeFrom = null;
        this.TimeTo = null;
        this.Reason = null;
        this.$q.loading.hide();
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Error submitting overtime accomplishment",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
      }
    },
  },

  watch: {
    workHours(newVal) {
      if (newVal && this.TimeFrom) {
        this.updateTimeTo();
      }
    },
    TimeFrom(newVal) {
      if (newVal && this.workHours) {
        this.updateTimeTo();
      }
    },
    TimeTo(newVal) {
      if (newVal && this.TimeFrom) {
        this.updateWorkHours();
      }
    },
  },
};
</script>
