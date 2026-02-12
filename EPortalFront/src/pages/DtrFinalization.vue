<template>
  <q-layout>
    <q-page-container>
      <div class="containermainn">
        <div class="row" style="width: 95%">
          <!-- <div v-if="loading" class="full-width">
            <q-skeleton :style="{ height: '100px' }" />
            <q-skeleton class="q-mt-xl" :style="{ height: '700px' }" />
          </div> -->

          <div v-if="loadingSkeleton" class="full-width">
            <q-skeleton :style="{ height: '285px', marginBottom: '25px' }" />
            <q-skeleton :style="{ height: '500px' }" />
          </div>

          <div v-else class="full-width">
            <q-card class="bg-transparent" flat>
              <q-card-section class="q-pa-xs q-mt-sm bg-blue-2">
                <div class="row items-center q-gutter-sm">
                  <div class="text-h6 text-blue-10 text-bold">
                    Payroll Period Date:
                  </div>

                  <div class="text-h6">
                    {{ this.payrollPeriodDateFrom }} to
                    {{ this.payrollPeriodDateTo }}
                  </div>
                  <div class="row q-mb-xs">
                    <q-btn
                      padding="none"
                      class="col-12 bg-blue-10 q-mb-xs text-white"
                      flat
                      size="sm"
                      icon="keyboard_arrow_up"
                      color="primary"
                      @click="adjustPayrollPeriod('next')"
                    />
                    <q-btn
                      padding="none"
                      class="col-12 bg-blue-10 text-white"
                      flat
                      size="sm"
                      icon="keyboard_arrow_down"
                      color="primary"
                      @click="adjustPayrollPeriod('previous')"
                    />
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-none bg-grey-2">
                <div class="row q-col-gutter-xs">
                  <q-input
                    v-model="payrollPeriod"
                    label="Payroll Period"
                    label-color="primary"
                    clearable
                    outlined
                    class="blue-outline col-12 col-sm-6"
                  />

                  <q-select
                    v-model="selectedClass"
                    label="Class"
                    label-color="primary"
                    outlined
                    use-input
                    hide-selected
                    fill-input
                    behavior="menu"
                    :options="employeeClass"
                    option-label="description"
                    option-value="class"
                    clearable
                    class="blue-outline col-12 col-sm-6"
                    @update:model-value="onClassChange"
                  />

                  <q-input
                    outlined
                    v-model="fromDate"
                    label="From Date"
                    label-color="primary"
                    mask="##/##/####"
                    placeholder="MM/DD/YYYY"
                    class="blue-outline col-12 col-sm-6"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="fromDatePopUp"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <div class="q-date-container">
                            <q-date v-model="fromDate" mask="MM/DD/YYYY" />
                            <q-btn
                              push
                              icon="close"
                              class="bg-white absolute-top-right"
                              round
                              padding="xs"
                              @click="$refs.fromDatePopUp.hide()"
                              style="margin: 10px"
                            />
                          </div>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <q-input
                    outlined
                    v-model="toDate"
                    label="To Date"
                    label-color="primary"
                    mask="##/##/####"
                    placeholder="MM/DD/YYYY"
                    class="blue-outline col-12 col-sm-6"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="toDatePopUp"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <div class="q-date-container">
                            <q-date v-model="toDate" mask="MM/DD/YYYY" />
                            <q-btn
                              push
                              icon="close"
                              class="bg-white absolute-top-right"
                              round
                              padding="xs"
                              @click="$refs.toDatePopUp.hide()"
                              style="margin: 10px"
                            />
                          </div>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-select
                    v-model="typeReport"
                    label="Report Type"
                    label-color="primary"
                    outlined
                    clearable
                    :options="[
                      { label: 'Summarize & Finalize', value: 'summarize' },
                      { label: 'Summary Print', value: 'print' },
                      { label: 'Summary Tally', value: 'tally' },
                    ]"
                    option-label="label"
                    option-value="value"
                    class="blue-outline col-12 col-sm-6"
                  />

                  <q-input
                    :disable="!['RE', 'FA'].includes(selectedClass?.class)"
                    v-model="inputEmployeeCode"
                    outlined
                    label="Employee Code"
                    label-color="primary"
                    class="text-blue-6 text-subtitle1 col-12 col-sm-6 blue-outline"
                  />

                  <q-checkbox
                    v-model="computeLate"
                    label="Compute Late"
                    color="primary"
                    class="text-blue-6 col-12 col-sm-6 text-subtitle1"
                  />
                </div>
              </q-card-section>

              <div class="text-right q-mt-md">
                <q-btn
                  push
                  label="Search"
                  icon="search"
                  class="bg-positive text-white"
                  @click="searchDtr"
                  :loading="loading"
                ></q-btn>
              </div>
              <div
                v-if="!dtrItems && !loading"
                class="text-red text-h6 text-bold text-left"
              >
                No data available, Please search for time data record.
              </div>
            </q-card>

            <q-linear-progress
              v-if="loading"
              indeterminate
              color="primary"
              class="q-mt-md"
            />

            <div v-if="!loading">
              <!-- <q-card
                v-for="(employee, code) in dtrDetails"
                :key="code"
                class="q-mt-lg"
              >
                <dtrSummary :items="employee.dtr" />
              </q-card> -->
              <!-- <q-card
                v-for="(employee, code) in dtrDetails"
                :key="code"
                class="q-mt-lg"
              > -->
              <dtrResidentFaculty
                v-if="
                  dtrItems &&
                  ['RE', 'FA'].includes(selectedClass?.class) &&
                  typeReport?.value === 'summarize'
                "
                :items="dtrItems || null"
                :timeDataFrom="formateDate(fromDate)"
                :timeDataTo="formateDate(toDate)"
                :payrollPeriod="payrollPeriod"
                :payrollFrom="payrollPeriodDateFrom"
                :payrollTo="payrollPeriodDateTo"
                @successFinalize="refreshPage()"
              />

              <dtrSummary
                v-else-if="dtrItems"
                :items="dtrItems || null"
                :payrollPeriod="payrollPeriod"
                :timeDataFrom="formateDate(fromDate)"
                :timeDataTo="formateDate(toDate)"
                :payrollFrom="payrollPeriodDateFrom"
                :payrollTo="payrollPeriodDateTo"
                :typeReport="typeReport.value"
                :classDescription="selectedClass"
                @successFinalize="refreshPage()"
              />

              <!-- <dtrSummary
                v-if="dtrItems"
                :items="dtrItems"
                :payrollPeriod="payrollPeriod"
                :timeDataFrom="formateDate(fromDate)"
                :timeDataTo="formateDate(toDate)"
                :payrollFrom="payrollPeriodDateFrom"
                :payrollTo="payrollPeriodDateTo"
                :typeReport="typeReport.value"
                :classDescription="selectedClass"
                @successFinalize="refreshPage()"
              /> -->
              <!-- </q-card> -->
            </div>
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>
<script>
import helperMethods from "src/helperMethods";
import { mapGetters } from "vuex";
import dtrSummary from "../components/dtrSummary.vue";
import dtrResidentFaculty from "src/components/dtrFacultyResidentSummary.vue";

export default {
  data() {
    return {
      loading: false,
      fromDate: null,
      toDate: null,
      payrollPeriod: this.payrollPeriodDefault("payrollPeriod"),
      selectedClass: null,
      dtrItems: null,
      payrollPeriodDateFrom: this.payrollPeriodDefault("from"),
      payrollPeriodDateTo: this.payrollPeriodDefault("to"),
      typeReport: "",
      computeLate: false,
      loadingSkeleton: false,
      inputEmployeeCode: null,
    };
  },

  components: {
    dtrSummary,
    dtrResidentFaculty,
  },

  computed: {
    ...mapGetters({
      employeeClass: "DTRModule/getClass",
      dtrDetails: "DTRModule/getdtrdetails",
    }),
  },

  methods: {
    onClassChange() {
      this.dtrItems = null;
      this.inputEmployeeCode = null;
      this.typeReport = "";
    },

    // showPopup(refName) {
    //   this.$refs[refName].show();
    // },

    // hidePopup(refName) {
    //   this.$refs[refName].hide();
    // },

    payrollPeriodDefault(type) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();

      const monthStr = String(month).padStart(2, "0");

      const period = day <= 15 ? "P1" : "P2";

      const lastDay = new Date(year, month, 0).getDate();
      const lastDayStr = String(lastDay).padStart(2, "0");

      if (type === "payrollPeriod") {
        return `${year}${monthStr}${period}`;
      }

      if (type === "from") {
        return (this.payrollPeriodDateFrom =
          period === "P1"
            ? `${year}-${monthStr}-01`
            : `${year}-${monthStr}-16`);
      }
      return (this.payrollPeriodDateTo =
        period === "P1"
          ? `${year}-${monthStr}-15`
          : `${year}-${monthStr}-${lastDayStr}`);
    },

    adjustPayrollPeriod(direction) {
      const currentFrom = new Date(this.payrollPeriodDateFrom);
      const currentTo = new Date(this.payrollPeriodDateTo);

      let newFrom, newTo;

      if (direction === "next") {
        const nextStart = new Date(currentTo);
        nextStart.setDate(nextStart.getDate() + 1);

        const y = nextStart.getFullYear();
        const m = nextStart.getMonth() + 1;

        const lastDay = new Date(y, m, 0).getDate();

        if (nextStart.getDate() === 16) {
          newFrom = `${y}-${String(m).padStart(2, "0")}-16`;
          newTo = `${y}-${String(m).padStart(2, "0")}-${String(
            lastDay,
          ).padStart(2, "0")}`;
        } else {
          newFrom = `${y}-${String(m).padStart(2, "0")}-01`;
          newTo = `${y}-${String(m).padStart(2, "0")}-15`;
        }
      } else {
        const prevEnd = new Date(currentFrom);
        prevEnd.setDate(prevEnd.getDate() - 1);

        const y = prevEnd.getFullYear();
        const m = prevEnd.getMonth() + 1;

        const lastDay = new Date(y, m, 0).getDate();

        if (prevEnd.getDate() === 15) {
          newFrom = `${y}-${String(m).padStart(2, "0")}-01`;
          newTo = `${y}-${String(m).padStart(2, "0")}-15`;
        } else {
          newFrom = `${y}-${String(m).padStart(2, "0")}-16`;
          newTo = `${y}-${String(m).padStart(2, "0")}-${String(
            lastDay,
          ).padStart(2, "0")}`;
        }
      }

      this.payrollPeriodDateFrom = newFrom;
      this.payrollPeriodDateTo = newTo;

      const parts = newTo.split("-");
      const day = parseInt(parts[2]);
      const period = day <= 15 ? "P1" : "P2";

      this.payrollPeriod = `${parts[0]}${parts[1]}${period}`;
    },

    async getEmployeeClass() {
      try {
        this.loadingSkeleton = true;
        await helperMethods.delay(100);
        await this.$store.dispatch("DTRModule/employeeClass");
        this.loadingSkeleton = false;
      } catch (error) {
        this.loadingSkeleton = false;

        console.error(error);
      }
    },

    async searchDtr() {
      const periodRegex = /^\d{6}P[12]$/;

      this.loading = true;

      try {
        if (!this.payrollPeriod || !periodRegex.test(this.payrollPeriod)) {
          this.$q.notify({
            color: "negative",
            position: "center",
            message:
              "Payroll Period must be in format YYYYMMP1 or YYYYMMP2 (e.g., 202510P1)",
            icon: "report_problem",
            iconColor: "white",
            timeout: 2000,
            progress: true,
          });
          this.loading = false;
          return;
        }

        let data;
        let action;

        if (
          ["RE", "FA"].includes(this.selectedClass?.class) &&
          this.typeReport?.value === "summarize"
        ) {
          if (
            !this.inputEmployeeCode ||
            !this.fromDate ||
            !this.toDate ||
            !this.selectedClass ||
            !this.typeReport?.value
          ) {
            this.$q.notify({
              color: "negative",
              position: "center",
              message: "Employee Code is required for RE/FA classes",
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            this.loading = false;
            return;
          }

          data = {
            employeeClass: this.selectedClass?.class,
            employeeCode: this.inputEmployeeCode,
            payrollPeriod: this.payrollPeriod,
            payrollPeriodFrom: this.payrollPeriodDateFrom,
            payrollPeriodTo: this.payrollPeriodDateTo,
          };

          action = "DTRModule/residentFaculty";
        } else {
          if (
            !this.fromDate ||
            !this.toDate ||
            !this.selectedClass ||
            !this.typeReport?.value
          ) {
            this.$q.notify({
              color: "negative",
              position: "center",
              message: "Input the required field",
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            this.loading = false;
            return;
          }

          data = {
            fromDate: this.formateDate(this.fromDate),
            toDate: this.formateDate(this.toDate),
            payrollPeriodFrom: this.payrollPeriodDateFrom,
            payrollPeriodTo: this.payrollPeriodDateTo,
            employeeClass: this.selectedClass?.class,
            payrollPeriod: this.payrollPeriod,
            computeLate: this.computeLate,
            typeReport: this.typeReport.value,
            employeeCode: this.inputEmployeeCode,
          };

          action = "DTRModule/searchDtr";
        }

        await this.$store.dispatch(action, data);

        this.dtrItems = this.dtrDetails;

        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.error("Error searching DTR:", error);

        this.$q.notify({
          color: "negative",
          position: "center",
          message: `${
            error.response?.status === 400
              ? error.response.data.message
              : "Error loading time data. Please try again."
          }`,
          icon: "warning",
          iconColor: "white",
          timeout: 2000,
          progress: true,
        });
      }
    },

    formateDate(dateStr) {
      if (!dateStr) return null;

      const [month, day, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    },

    handleEnterKey(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        this.searchDtr();
      }
    },

    async refreshPage() {
      this.dtrItems = null;
    },
  },

  watch: {
    typeReport() {
      this.dtrItems = null;
    },
  },

  created() {
    this.getEmployeeClass();
  },

  mounted() {
    document.addEventListener("keydown", this.handleEnterKey);
  },

  beforeUnmount() {
    document.removeEventListener("keydown", this.handleEnterKey);
  },
};
</script>
