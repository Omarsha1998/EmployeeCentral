<template>
  <q-layout>
    <q-page-container>
      <div class="containermainn">
        <div class="row" style="width: 95%">
          <div
            class="col-12 q-mt-md q-mb-md inputDiv"
            style="border-radius: 10px"
          >
            <div class="row">
              <q-input
                :class="$q.screen.gt.sm ? 'col-6' : 'col-12'"
                class="q-pa-sm"
                outlined
                label-color="primary"
                label="Type"
                disable
                v-model="typeInput"
              />

              <q-input
                outlined
                :class="$q.screen.gt.sm ? 'col-6' : 'col-12'"
                class="q-pa-sm"
                label-color="primary"
                label="Payroll Period"
                maxlength="10"
                :model-value="payrollPeriod"
                :rules="[validatePayrollPeriod]"
                @update:model-value="formatPayrollPeriod"
              />
            </div>
            <div class="col-12 text-center q-pa-sm">
              <q-btn
                label="Search"
                class="text-white"
                push
                color="primary"
                @click="searchPendingHrd"
              />
            </div>
          </div>

          <div class="col-12">
            <q-card class="roundedd1">
              <q-card-section
                class="bg-primary text-white text-center"
                style="height: 70px"
                :class="['bold-text', $q.screen.name + '-text']"
              >
                <div class="row">
                  <div class="col-4 text-left"></div>
                  <div class="col-4 text-center">Overtime Review</div>
                  <div class="col-4 text-right">
                    <q-input
                      class="bg-white"
                      style="font-size: 15px"
                      v-model="searchTextDetails"
                      placeholder="Search"
                      dense
                      outlined
                      clearable
                      :style="{ width: '200px', marginLeft: 'auto' }"
                      :class="[$q.screen.name + '-text2']"
                      @clear="searchTextDetails = ''"
                    />
                  </div>
                </div>
              </q-card-section>
              <div v-if="loading">
                <div class="bg-grey-2" v-if="loading">
                  <SkeletonLoader :row-count="9" :column-count="8" />
                </div>
              </div>

              <q-table
                v-else
                style="max-height: 600px"
                class="custom-scroll"
                :rows="computedDetails"
                :columns="pendingColumn"
                row-key="name"
                virtual-scroll
                hide-pagination
                :virtual-scroll-item-size="11"
              >
                <template v-slot:header>
                  <q-tr class="sticky-thead bg-grey-3 text-black">
                    <q-th style="width: 10px">
                      <q-checkbox v-model="selectAll" @click="selectAllItems" />
                    </q-th>
                    <q-th
                      v-for="col in pendingColumn"
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
                    <q-td style="width: 10px" class="text-center">
                      <q-checkbox v-model="selectedItems" :val="props.row" />
                    </q-td>
                    <q-td
                      class="text-center"
                      v-for="col in pendingColumn"
                      :key="col.name"
                    >
                      <template v-if="col.name === 'Employee Name'">
                        <div class="text-bold">
                          {{ props.row.EmployeeName || props.row.employeeName }}
                        </div>
                        <div style="font-size: 11px">
                          {{
                            props.row.deptDescription ||
                            props.row.deptDescSecond
                          }}
                        </div>
                      </template>
                      <template v-else-if="col.name === 'Schedule'">
                        <div>
                          DTR Schedule:
                          <span class="text-subtitle2 text-bold"
                            >{{ props.row.formatedDateOvertime }} ({{
                              props.row.schedStartTime !== "" &&
                              props.row.schedEndtime !== ""
                                ? props.row.schedStartTime +
                                  " - " +
                                  props.row.schedEndTime
                                : props.row.note
                            }})</span
                          >
                        </div>
                        <div>
                          Overtime Schedule:
                          <span class="text-subtitle2 text-bold"
                            >{{ props.row.formatedDateOvertime }} ({{
                              props.row.timeFrom + " - " + props.row.timeTo
                            }})</span
                          >
                        </div>
                      </template>

                      <template v-else-if="col.name === 'Actions'">
                        <q-btn
                          style="width: 50%"
                          icon="check_circle"
                          color="green"
                          class="q-mr-xs"
                          @click="approveReject(props.row, 'Approve')"
                          :disable="selectedItems.length > 1"
                        />
                        <q-btn
                          style="width: 50%"
                          icon="cancel"
                          color="negative"
                          class="q-mr-xs"
                          @click="rejectDia(props.row)"
                          :disable="selectedItems.length > 1"
                        />
                      </template>
                      <template v-else>
                        {{ props.row[col.field] || " - " }}
                      </template>
                    </q-td>
                  </q-tr>
                </template>
                <template v-slot:no-data="{ message }">
                  <div
                    class="full-width row flex-center text-black text-subtitle2"
                  >
                    <div>
                      <span class="text-black text-subtitle2"
                        >{{ message }}, Please input a payroll period
                        first.</span
                      >
                      <q-icon
                        class="text-red"
                        size="2em"
                        name="sentiment_dissatisfied"
                      ></q-icon>
                    </div>
                  </div>
                </template>
              </q-table>
              <div v-if="selectedItems.length > 1" class="col-12 q-pb-sm">
                <div
                  class="q-mt-xs text-center"
                  style="display: flex; justify-content: center; gap: 10px"
                >
                  <q-btn
                    push
                    color="primary"
                    class="q-mr-xs"
                    @click="approveReject(selectedItems, 'Approve')"
                    label="Approve Selected Overtime"
                  />
                  <q-btn
                    push
                    color="red"
                    class="q-ml-xs"
                    @click="rejectDia(selectedItems)"
                    label="Reject Selected Overtime"
                  />
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </div>

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
              Reason for rejecting overtime review
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
              class="bg-grey-3"
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
                @click="approveReject(rejectData, 'Reject')"
              />
            </div>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>
<script>
import { mapGetters } from "vuex";
import { QSpinnerIos } from "quasar";
import helperMethods from "src/helperMethods";
import SkeletonLoader from "../components/loadingSkeleton.vue";

export default {
  data() {
    return {
      pendingDetails: [],
      pendingColumn: [
        {
          name: "Employee Name",
          label: "Employee Name",
          align: "center",
          field: "employeeName",
          sortable: false,
          width: "200px",
        },
        {
          name: "Created",
          label: "Created",
          align: "center",
          field: "transDate",
          sortable: false,
          width: "100px",
        },
        {
          name: "Schedule",
          label: "Schedule",
          align: "center",
          field: "",
          sortable: false,
          width: "200px",
        },
        {
          name: "Time In",
          label: "Time From",
          align: "center",
          field: "schedIn",
          sortable: false,
          width: "100px",
        },
        {
          name: "Time Out",
          label: "Time To",
          align: "center",
          field: "schedOut",
          sortable: false,
          width: "100px",
        },
        {
          name: "Approved Hours",
          label: "Approved Hours",
          align: "center",
          field: "approvedHours",
          sortable: false,
          width: "100px",
        },
        {
          name: "Overtime Type",
          label: "Overtime Type",
          align: "center",
          field: "oTType",
          sortable: false,
          width: "100px",
        },
        {
          name: "Actions",
          label: "Actions",
          align: "center",
          field: "",
          sortable: false,
          width: "100px",
        },
      ],
      workHours: {},
      selectedItems: [],
      selectAll: false,
      payrollPeriod: null,
      typeInput: "Overtime",
      rejectDialog: false,
      rejectData: [],
      reasonForRejection: "",
      loading: false,
      searchTextDetails: "",
    };
  },

  components: {
    SkeletonLoader,
  },

  computed: {
    ...mapGetters({ pendingHrd: "overtimeModule/getPendingHrd" }),
    computedDetails() {
      if (Array.isArray(this.pendingDetails)) {
        const query = this.searchTextDetails.toLowerCase();

        return this.pendingDetails
          .map((row) => ({
            ...row,
            transDate: this.formatDateTime(row.overtimeCreated),
            formatedDateOvertime: this.formatDateTime(row.dateOfOvertime),
          }))
          .filter((row) => {
            return (
              (row.deptDescription &&
                row.deptDescription.toString().toLowerCase().includes(query)) ||
              (row.employeeCode &&
                row.employeeCode.toString().toLowerCase().includes(query)) ||
              (row.employeeName &&
                row.employeeName.toString().toLowerCase().includes(query)) ||
              (row.formatedDateOvertime &&
                row.formatedDateOvertime
                  .toString()
                  .toLowerCase()
                  .includes(query)) ||
              (row.transDate &&
                row.transDate.toString().toLowerCase().includes(query))
            );
          })
          .sort((a, b) => b.otId - a.otId); // use otId instead of id based on your sample
      } else {
        return [];
      }
    },
  },

  methods: {
    formatDateTime(dateTimeString) {
      const options = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString("en-PH", options);
    },

    async getPendingHrd() {
      try {
        this.$q.loading.show({
          spinner: QSpinnerIos,
          message: "Fetching overtime review",
          messageColor: "primary",
          backgroundColor: "grey-1",
          spinnerColor: "primary",
          customClass: "custom-loading-style",
          spinnerSize: "7em",
        });
        await this.$store.dispatch("overtimeModule/getPendingHrd");
        this.pendingDetails = this.pendingHrd;
        this.loading = false;
        this.$q.loading.hide();
      } catch (error) {
        this.loading = false;
        this.$q.loading.hide();
        this.$q.notify({
          color: "negative",
          position: "center",
          message: `${error.response.data.body}`,
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        if (error.response.status === 404) {
          console.error(error.response.data.body);
          return;
        }
        console.error("Failed getting getting overtime review details");
      }
    },

    async searchPendingHrd() {
      if (
        !this.payrollPeriod ||
        !/^\d{4}-(0[1-9]|1[0-2])-P[1-2]$/.test(this.payrollPeriod)
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Payroll format must be YYYY-MM-P1 or YYYY-MM-P2",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }
      this.loading = true;
      await this.getPendingHrd();
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

    onSelectTimeChange(row, value) {
      const changeValue = this.pendingDetails.find(
        (item) => item.otId === row.otId,
      );
      if (changeValue) {
        changeValue.filedHours = value;
      }
    },

    formatPayrollPeriod(val) {
      let cleaned = val.toUpperCase().replace(/[^0-9P]/g, "");

      const year = cleaned.slice(0, 4);
      const month = cleaned.slice(4, 6);
      let part = cleaned.slice(6);

      if (part.length > 2) {
        part = part.slice(0, 2);
      }

      let formatted = year;
      if (month) formatted += "-" + month;
      if (part) formatted += "-" + part;

      if (cleaned.length === 4) {
        formatted = year + "-";
      }

      if (cleaned.length === 6) {
        formatted = year + "-" + month + "-P";
      }

      this.payrollPeriod = formatted.slice(0, 10);
    },

    validatePayrollPeriod(val) {
      const regex = /^\d{4}-(0[1-9]|1[0-2])-P[1-2]$/;
      return regex.test(val) || "Format must be YYYY-MM-P1 or YYYY-MM-P2";
    },

    approveReject(data, action) {
      if (
        !this.payrollPeriod ||
        !/^\d{4}-(0[1-9]|1[0-2])-P[1-2]$/.test(this.payrollPeriod)
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Payroll format must be YYYY-MM-P1 or YYYY-MM-P2",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      if (!data || data.length === 0) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: `Please select overtime to ${
            action === "Approve" ? "approved" : "reject"
          }`,
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
          message: `Are you sure you want to  ${
            action === "Approve" ? "approve" : "reject"
          } ${data.length > 1 ? "these overtime" : "this overtime"}
          `,
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
            helperMethods.disablePointerEvents();
            let overtimeData;
            if (Array.isArray(data)) {
              overtimeData = data;
            } else {
              overtimeData = [data];
            }

            const finalStatus = action === "Approve" ? "Approved" : "Rejected";

            const finalData = {
              data: overtimeData,
              payrollPeriod: this.payrollPeriod.replaceAll("-", ""),
              status: finalStatus,
              reason: this.reasonForRejection,
            };

            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Approving overtime review",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });
            await helperMethods.delay(500);
            // await this.$store.dispatch(
            //   "overtimeModule/approveRejectHrdReview",
            //   finalData,
            // );
            await this.getPendingHrd();
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "center",
              message: `Success ${
                action === "Approve" ? "approving" : "rejecting"
              } overtime review`,
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            this.selectAll = false;
            this.rejectData = [];
            this.selectedItems = [];
            this.rejectDialog = false;
            helperMethods.enablePointerEvents();
          } catch (error) {
            this.$q.loading.hide();
            // console.error(
            //   `Error ${
            //     action === "Approve" ? "approving" : "rejecting"
            //   } overtime review`,
            // );
            this.$q.notify({
              color: "negative",
              position: "center",
              message: `${error.response.data.body}`,
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          }
        });
    },

    selectAllItems() {
      if (this.selectAll) {
        this.selectedItems = [...this.computedDetails];
      } else {
        this.selectedItems = [];
      }
    },

    rejectDia(data) {
      this.rejectDialog = true;
      this.rejectData = data;
    },

    cancelReject() {
      this.reasonForRejection = "";
      this.rejectDialog = false;
      this.rejectData = [];
    },

    handleEnterKey(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        this.searchPendingHrd();
      }
    },
  },

  mounted() {
    document.addEventListener("keydown", this.handleEnterKey);
  },

  beforeUnmount() {
    document.removeEventListener("keydown", this.handleEnterKey);
  },
};
</script>
