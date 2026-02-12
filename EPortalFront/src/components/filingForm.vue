<template>
  <q-card-section>
    <!-- Leave Type Selection -->
    <q-select
      v-if="!overtimeModule"
      outlined
      v-model="LeaveType"
      label="Leave Type"
      label-color="primary"
      :options="LeaveTypes"
      use-input
      input-debounce="0"
      fill-input
      hide-selected
      clearable
      behavior="menu"
      @filter="filterFn"
      @clear="clearSelectedLeaveType"
      style="margin-bottom: 5px"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">No results</q-item-section>
        </q-item>
      </template>
    </q-select>

    <!-- Days (for leave) or Work Hours (for overtime) -->
    <q-input
      v-if="!overtimeModule"
      outlined
      v-model="Days"
      label="Days"
      label-color="primary"
      type="number"
      min="0.5"
      step="0.5"
      style="margin-bottom: 5px"
    />

    <q-input
      v-if="overtimeModule"
      outlined
      v-model="workHours"
      label="Work Hours"
      label-color="primary"
      type="number"
      style="margin-bottom: 5px"
    />

    <!-- Date From -->
    <q-input
      outlined
      v-model="DateFrom"
      label="Date From"
      label-color="primary"
      @change="updateDateTo"
      @click="showPopup('dateFromPopup')"
      style="margin-bottom: 5px"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="dateFromPopup" :breakpoint="1440" cover>
            <div class="q-date-container">
              <q-date v-model="DateFrom" mask="MM/DD/YYYY" />
              <q-btn
                push
                icon="close"
                class="bg-white absolute-top-right"
                round
                padding="xs"
                @click="hidePopup('dateFromPopup')"
                style="margin: 10px"
              />
            </div>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <!-- Date To -->
    <q-input
      outlined
      v-model="DateTo"
      label="Date To"
      label-color="primary"
      @change="updateDays"
      @click="showPopup('dateToPopup')"
      style="margin-bottom: 5px"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="dateToPopup" :breakpoint="1440" cover>
            <div class="q-date-container">
              <q-date v-model="DateTo" mask="MM/DD/YYYY" />
              <q-btn
                push
                icon="close"
                class="bg-white absolute-top-right"
                round
                padding="xs"
                @click="hidePopup('dateToPopup')"
                style="margin: 10px"
              />
            </div>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <!-- Time From -->
    <q-input
      outlined
      v-model="TimeFrom"
      :label="overtimeModule ? 'Time From' : 'Time From Half Day'"
      label-color="primary"
      :disable="!isTimeEnabled && !overtimeModule"
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
      :label="overtimeModule ? 'Time To' : 'Time To Half Day'"
      label-color="primary"
      :disable="!isTimeEnabled && !overtimeModule"
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

    <!-- Reason or Work To Be Done -->
    <q-input
      outlined
      v-model="Reason"
      :label="overtimeModule ? 'Reason for Overtime' : 'Reason for Leave'"
      label-color="primary"
      type="textarea"
      class="q-mb-md"
      :rows="1"
    />

    <!-- Buttons -->
    <div v-if="!editView && !overtimeModule" class="text-center">
      <q-btn
        push
        color="blue"
        class="q-mt-xs text-white"
        label="Submit Application"
        @click="submitLeaveRequest"
      />
    </div>

    <div v-if="editView" class="row justify-end q-gutter-sm">
      <q-btn
        push
        color="red"
        label="Cancel"
        class="text-subtitle1"
        @click="cancelEdit"
      />
      <q-btn
        push
        color="primary"
        label="Submit"
        class="text-subtitle1"
        @click="() => (overtimeModule ? updateOvertime() : updateLeave())"
      />
    </div>

    <div v-if="overtimeModule && !editView" class="text-center">
      <q-btn
        push
        color="blue"
        class="q-mt-xs text-white"
        label="Submit Application"
        @click="submitOvertimeRequest"
      />
    </div>
  </q-card-section>
</template>

<script>
import { QSpinnerIos } from "quasar";
import helperMethods from "src/helperMethods";

export default {
  props: {
    LeaveTypesOptions: Array,
    employeeCode: String,
    editView: Boolean,
    editLeaveID: Number,
    hrModule: Boolean,
    overtimeModule: Boolean,
  },

  emits: ["successFiling", "cancelEditEmit", "successEditEmit"],

  data() {
    return {
      LeaveType: null,
      LeaveTypes: this.LeaveTypeFilter,
      Days: null,
      DateFrom: null,
      DateTo: null,
      TimeFrom: null,
      TimeTo: null,
      Reason: null,
      workHours: null,
      updateDateToTriggered: true,
    };
  },

  computed: {
    isTimeEnabled() {
      return this.Days % 1 !== 0;
    },
  },

  methods: {
    filterFn(val, update) {
      const excludedCodes = ["OBL", "OL"];

      update(() => {
        let options = this.LeaveTypesOptions;

        if (!this.hrModule) {
          options = options.filter(
            (option) => !excludedCodes.includes(option.value),
          );
        }

        if (val === "") {
          this.LeaveTypes = options;
        } else {
          const needle = val.toLowerCase();
          this.LeaveTypes = options.filter(
            (option) => option.label.toLowerCase().indexOf(needle) > -1,
          );
        }
      });
    },

    clearSelectedLeaveType() {
      this.LeaveType = null;
    },

    showPopup(refName) {
      this.$refs[refName].show();
    },

    hidePopup(refName) {
      this.$refs[refName].hide();
    },

    updateDays() {
      const updateDays = (DateFrom, DateTo, currentDays) => {
        const fromDate = new Date(DateFrom);
        const toDate = new Date(DateTo);

        if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
          const millisecondsInDay = 24 * 60 * 60 * 1000;
          const daysDifference = (toDate - fromDate) / millisecondsInDay;

          if (daysDifference < 0) {
            currentDays = 0;
          } else {
            currentDays = Number.isInteger(daysDifference)
              ? daysDifference + 1
              : daysDifference + (daysDifference % 1 === 0.5 ? -0.5 : 0.5);
          }
        }

        return currentDays;
      };

      if (this.DateFrom && this.DateTo) {
        if (this.updateDateToTriggered) {
          this.updateDateToTriggered = false;
          return;
        }
        this.Days = updateDays(this.DateFrom, this.DateTo, this.Days);
      }
    },

    updateDateTo() {
      const updateDates = (DateFrom, days, DateTo) => {
        const fromDate = new Date(DateFrom);

        if (!isNaN(fromDate.getTime()) && days >= 0) {
          let totalMilliseconds;

          if (Number.isInteger(days)) {
            totalMilliseconds = (days - 1) * (24 * 60 * 60 * 1000);
          } else {
            totalMilliseconds = (days - 0.5) * (24 * 60 * 60 * 1000);
          }

          const toDate = new Date(fromDate.getTime() + totalMilliseconds);
          DateTo = this.formatDateTime(toDate);
        }

        return DateTo;
      };

      if (this.DateFrom && this.Days) {
        this.updateDateToTriggered = true;
        this.DateTo = updateDates(this.DateFrom, this.Days, this.DateTo);

        setTimeout(() => {
          this.updateDateToTriggered = false;
        }, 0);
      }
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

    formatDateTime(dateTimeString) {
      const options = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString("en-PH", options);
    },

    cancelEdit() {
      this.Days = null;
      this.TimeFrom = null;
      this.TimeTo = null;
      this.DateFrom = null;
      this.DateTo = null;
      this.LeaveType = null;
      this.Reason = null;
      this.$emit("cancelEditEmit");
    },

    getDocumentationMessage(leaveType) {
      switch (leaveType) {
        case "EL":
          return "Please Provide your Emergency Letter Document to HR or Head Department";
        case "SL":
          return "Please Provide your Health/Medical Certificate to HR or Head Department";
        case "ML":
        case "MC":
          return "Please Provide your Health/Medical Certificate to HR or Head Department";
        default:
          return "";
      }
    },

    async submitLeaveRequest() {
      if (
        (!Number.isInteger(this.Days) && this.Days % 0.5 !== 0) ||
        this.Days < 0 ||
        this.Days === 0
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message:
            "Days must be a whole number or a number with decimal places of 0.5",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      if (
        !this.Days ||
        !this.DateFrom ||
        !this.DateTo ||
        !this.LeaveType ||
        !this.Reason
      ) {
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

      if (
        (this.isTimeEnabled &&
          (this.TimeFrom === null || this.TimeTo === null)) ||
        (this.isTimeEnabled && (this.TimeFrom === "" || this.TimeTo === ""))
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Input a time for Half-Day",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      let leaveRequestData;

      leaveRequestData = {
        EmployeeCode: this.employeeCode,
        Days: this.Days,
        TimeFrom: this.TimeFrom,
        TimeTo: this.TimeTo,
        DateFrom: this.DateFrom,
        DateTo: this.DateTo,
        LeaveType: this.LeaveType.value,
        Reason: this.Reason,
        hrModule: this.hrModule ? true : false,
      };

      if (
        this.LeaveType.value === "EL" ||
        this.LeaveType.value === "SL" ||
        this.LeaveType.value === "ML" ||
        this.LeaveType.value === "MC"
      ) {
        const documentationMessage = this.getDocumentationMessage(
          this.LeaveType.value,
        );

        this.$q
          .dialog({
            title: "Documentation",
            message: documentationMessage,
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
            // const leaveRequestData = {
            //   EmployeeCode: this.employeeCode,
            //   Days: this.Days,
            //   TimeFrom: this.TimeFrom,
            //   TimeTo: this.TimeTo,
            //   DateFrom: this.DateFrom,
            //   DateTo: this.DateTo,
            //   LeaveType: this.LeaveType.value,
            //   Reason: this.Reason,
            // };

            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Submitting Leave Request",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });

            try {
              await helperMethods.delay(500);
              await this.$store.dispatch(
                "leaveModule/submitLeaveRequest",
                leaveRequestData,
              );
              // await this.fetchLeaves();
              this.$emit("successFiling");
              this.$q.loading.hide();
              this.$q.notify({
                color: "green-8",
                position: "center",
                message: "Success Leave Request, Wait For The Approval",
                icon: "check",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
              helperMethods.disablePointerEvents(2000);
              this.Days = null;
              this.TimeFrom = null;
              this.TimeTo = null;
              this.DateFrom = null;
              this.DateTo = null;
              this.LeaveType = null;
              this.Reason = null;
            } catch (error) {
              this.$q.loading.hide();
              if (error.response.status === 400) {
                this.$q.notify({
                  color: "negative",
                  position: "center",
                  message: `Error Leave Request / ${
                    error.response.data.body || error.response.data.error
                  }`,
                  icon: "report_problem",
                  iconColor: "white",
                  timeout: 1000,
                  progress: true,
                });
                return;
              }

              this.$q.notify({
                color: "negative",
                position: "center",
                message:
                  "Error Leave Request / Insufficient Balance, Check Your Balance",
                icon: "report_problem",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
            }
          })
          .onDismiss(() => {});
      } else {
        this.$q
          .dialog({
            title: "Confirmation",
            message: "Are you sure you want to request leave?",
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
            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Submitting Leave Request",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });

            try {
              await helperMethods.delay(500);
              await this.$store.dispatch(
                "leaveModule/submitLeaveRequest",
                leaveRequestData,
              );
              this.$emit("successFiling");
              this.$q.loading.hide();
              this.$q.notify({
                color: "green-8",
                position: "center",
                message: "Success Leave Request, Wait For The Approval",
                icon: "check",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
              helperMethods.disablePointerEvents(2000);
              this.Days = null;
              this.TimeFrom = null;
              this.TimeTo = null;
              this.DateFrom = null;
              this.DateTo = null;
              this.LeaveType = null;
              this.Reason = null;
            } catch (error) {
              this.$q.loading.hide();
              if (error.response.status === 400) {
                this.$q.notify({
                  color: "negative",
                  position: "center",
                  message: `Error Leave Request / ${
                    error.response.data.body || error.response.data.error
                  }`,
                  icon: "report_problem",
                  iconColor: "white",
                  timeout: 1000,
                  progress: true,
                });
                return;
              }

              this.$q.notify({
                color: "negative",
                position: "center",
                message:
                  "Error Leave Request / Insufficient Balance, Check Your Balance",
                icon: "report_problem",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
            }
          })
          .onDismiss(() => {});
      }
    },

    async updateLeave() {
      if (
        (!Number.isInteger(this.Days) && this.Days % 0.5 !== 0) ||
        this.Days < 0 ||
        this.Days === 0
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message:
            "Days must be a whole number or a number with decimal places of 0.5",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      if (
        !this.Days ||
        !this.DateFrom ||
        !this.DateTo ||
        !this.LeaveType ||
        !this.Reason
      ) {
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

      if (
        this.isTimeEnabled &&
        this.TimeFrom === null &&
        this.TimeTo === null
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Input a time for Half-Day",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      if (
        this.LeaveType.value === "EL" ||
        this.LeaveType.value === "SL" ||
        this.LeaveType.value === "ML" ||
        this.LeaveType.value === "MC"
      ) {
        const documentationMessage = this.getDocumentationMessage(
          this.LeaveType.value,
        );
        this.$q
          .dialog({
            title: "Documentation",
            message: documentationMessage,
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
            const updatedLeave = {
              Days: this.Days,
              TimeFrom: this.TimeFrom,
              TimeTo: this.TimeTo,
              DateFrom: this.DateFrom,
              DateTo: this.DateTo,
              LeaveType: this.LeaveType.value,
              Reason: this.Reason,
              editLeaveID: this.editLeaveID,
            };

            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Updating Leave Request",
              messageColor: "primary",
              backgroundColor: "blue-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });
            try {
              this.editDialog = false;
              await helperMethods.delay(500);
              await this.$store.dispatch(
                "leaveModule/updateLeaves",
                updatedLeave,
              );
              this.$emit("successEditEmit");
              this.$q.loading.hide();
              this.Days = null;
              this.TimeFrom = null;
              this.TimeTo = null;
              this.DateFrom = null;
              this.DateTo = null;
              this.LeaveType = null;
              this.Reason = null;
              helperMethods.disablePointerEvents(2000);
              this.$q.notify({
                color: "green-8",
                position: "center",
                message: "Success Editing Leave Request",
                icon: "check",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
            } catch (error) {
              console.error("Error Updating Leave");
              this.$q.loading.hide();
              if (error.response.status) {
                this.$q.notify({
                  color: "negative",
                  position: "center",
                  message: `Error Updating Leave Request / ${error.response.data.error}`,
                  icon: "report_problem",
                  iconColor: "white",
                  timeout: 1000,
                  progress: true,
                });
                return;
              }
              this.$q.notify({
                color: "negative",
                position: "center",
                message:
                  "Error Editing / Updating Leave Request, Check the Balance of the Leave Type",
                icon: "report_problem",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
            }
          })
          .onDismiss(() => {});
      } else {
        const updatedLeave = {
          Days: this.Days,
          TimeFrom: this.TimeFrom,
          TimeTo: this.TimeTo,
          DateFrom: this.DateFrom,
          DateTo: this.DateTo,
          LeaveType: this.LeaveType.value,
          Reason: this.Reason,
          editLeaveID: this.editLeaveID,
        };

        try {
          this.$q.loading.show({
            spinner: QSpinnerIos,
            message: "Updating Leave Request",
            messageColor: "primary",
            backgroundColor: "blue-1",
            spinnerColor: "primary",
            customClass: "custom-loading-style",
            spinnerSize: "7em",
          });
          this.editDialog = false;
          await helperMethods.delay(500);
          await this.$store.dispatch("leaveModule/updateLeaves", updatedLeave);
          this.$emit("successEditEmit");
          this.$q.loading.hide();
          this.Days = null;
          this.TimeFrom = null;
          this.TimeTo = null;
          this.DateFrom = null;
          this.DateTo = null;
          this.LeaveType = null;
          this.Reason = null;
          helperMethods.disablePointerEvents(2000);
          this.$q.notify({
            color: "green-8",
            position: "center",
            message: "Success Editing Leave Request",
            icon: "check",
            iconColor: "white",
            timeout: 1000,
            progress: true,
          });
        } catch (error) {
          console.error("Error Updating Leave");
          this.Days = null;
          this.TimeFrom = null;
          this.TimeTo = null;
          this.DateFrom = null;
          this.DateTo = null;
          this.LeaveType = null;
          this.Reason = null;
          this.$q.loading.hide();
          if (error.response.status) {
            this.$q.notify({
              color: "negative",
              position: "center",
              message: `Error Updating Leave Request / ${error.response.data.error}`,
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            return;
          }
          this.$q.notify({
            color: "negative",
            position: "center",
            message:
              "Error Editing / Updating Leave Request, Check the Balance of the Leave Type",
            icon: "report_problem",
            iconColor: "white",
            timeout: 1000,
            progress: true,
          });
        }
      }
    },

    async submitOvertimeRequest() {
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

      if (
        !this.workHours ||
        !this.DateFrom ||
        !this.DateTo ||
        !this.TimeFrom ||
        !this.TimeTo ||
        !this.Reason
      ) {
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
        workHours: this.workHours ? this.workHours : null,
        dateFrom: this.DateFrom ? this.DateFrom : null,
        dateTo: this.DateTo ? this.DateTo : null,
        timeFrom: this.TimeFrom ? this.TimeFrom : null,
        timeTo: this.TimeTo ? this.TimeTo : null,
        workLoad: this.Reason ? this.Reason : null,
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
        await this.$store.dispatch(
          "overtimeModule/submitOvertimeRequest",
          data,
        );
        this.$emit("successFiling");
        this.$q.loading.hide();
        this.workHours = null;
        this.DateFrom = null;
        this.DateTo = null;
        this.TimeFrom = null;
        this.TimeTo = null;
        this.Reason = null;
        helperMethods.disablePointerEvents(2000);
        this.$q.notify({
          color: "green-8",
          position: "center",
          message: "Success submitting overtime request",
          icon: "check",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
      } catch (error) {
        console.error("Error submitting overtime request");
        this.workHours = null;
        this.DateFrom = null;
        this.DateTo = null;
        this.TimeFrom = null;
        this.TimeTo = null;
        this.Reason = null;
        this.$q.loading.hide();
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Error submitting overtime request",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
      }
    },

    async updateOvertime() {
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

      if (
        !this.workHours ||
        !this.DateFrom ||
        !this.DateTo ||
        !this.TimeFrom ||
        !this.TimeTo ||
        !this.Reason
      ) {
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

      const updatedLeave = {
        workHours: this.workHours ? this.workHours : null,
        dateFrom: this.DateFrom ? this.DateFrom : null,
        dateTo: this.DateTo ? this.DateTo : null,
        timeFrom: this.TimeFrom ? this.TimeFrom : null,
        timeTo: this.TimeTo ? this.TimeTo : null,
        workLoad: this.Reason ? this.Reason : null,
        overtimeId: this.editLeaveID,
      };

      this.$q.loading.show({
        spinner: QSpinnerIos,
        message: "Updating Overtime Request",
        messageColor: "primary",
        backgroundColor: "blue-1",
        spinnerColor: "primary",
        customClass: "custom-loading-style",
        spinnerSize: "7em",
      });
      try {
        this.editDialog = false;
        await helperMethods.delay(500);
        await this.$store.dispatch(
          "overtimeModule/updateOvertime",
          updatedLeave,
        );
        this.$emit("successEditEmit");
        this.$q.loading.hide();
        this.Days = null;
        this.TimeFrom = null;
        this.TimeTo = null;
        this.DateFrom = null;
        this.DateTo = null;
        this.LeaveType = null;
        this.Reason = null;
        helperMethods.disablePointerEvents(2000);
        this.$q.notify({
          color: "green-8",
          position: "center",
          message: "Success Editing Overtime Request",
          icon: "check",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
      } catch (error) {
        console.error("Error Updating Overtime");
        this.$q.loading.hide();
        if (error.response.status) {
          this.$q.notify({
            color: "negative",
            position: "center",
            message: `Error Updating Overtime Request`,
            icon: "report_problem",
            iconColor: "white",
            timeout: 1000,
            progress: true,
          });
          return;
        }
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Error Editing / Updating Overtime Request",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
      }
    },
  },

  watch: {
    Days(newVal) {
      if (newVal && this.DateFrom) {
        this.updateDateTo();
      }
    },
    DateFrom(newVal) {
      if (newVal && this.Days) {
        this.updateDateTo();
      } else if (newVal && this.DateTo) {
        this.updateDays(true);
      }
    },
    DateTo(newVal) {
      if (newVal && this.DateFrom) {
        this.updateDays(true);
      }
    },
    workHours(newVal) {
      if (newVal && this.TimeFrom && this.overtimeModule) {
        this.updateTimeTo();
      }
    },
    TimeFrom(newVal) {
      if (newVal && this.workHours && this.overtimeModule) {
        this.updateTimeTo();
      }
    },
    TimeTo(newVal) {
      if (newVal && this.TimeFrom && this.overtimeModule) {
        this.updateWorkHours();
      }
    },
  },
};
</script>
