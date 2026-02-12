<template>
  <q-layout>
    <q-page-container>
      <div class="containerDtr">
        <div class="row" style="width: 90%">
          <div class="col-12">
            <div>
              <q-dialog v-model="dateDialog">
                <q-card
                  :style="{
                    width: $q.screen.lt.sm
                      ? '350px'
                      : $q.screen.lt.md
                      ? '450px'
                      : '500px',
                    'min-height': $q.screen.lt.sm
                      ? '100px'
                      : $q.screen.lt.md
                      ? '100px'
                      : '100px',
                  }"
                  class="rounded"
                >
                  <q-card-section class="bg-primary row items-center q-pb-md">
                    <div class="text-h6 text-white">
                      Choose a Month and Year
                    </div>
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

                  <q-card-section class="text-subtitle2">
                    <div
                      style="display: flex; justify-content: center; gap: 10px"
                    >
                      <q-select
                        class="year-select"
                        dense
                        v-model="selectedYear"
                        :options="yearOptions"
                        label="Year"
                        filled
                        style="width: 100%"
                        clearable
                      />
                      <q-select
                        class="month-select"
                        dense
                        v-model="selectedMonth"
                        :options="months"
                        label="Month"
                        filled
                        style="width: 100%"
                        clearable
                      />
                    </div>
                    <div
                      class="q-mb-xs q-pt-sm text-center"
                      style="display: flex; justify-content: center; gap: 10px"
                    >
                      <q-btn
                        push
                        color="primary"
                        class="q-mr-xs"
                        @click="fetchDTR"
                        label="Submit"
                      />
                      <q-btn
                        push
                        color="red"
                        class="q-ml-xs"
                        @click="dateDialog = false"
                        label="Cancel"
                      />
                    </div>
                  </q-card-section>
                </q-card>
              </q-dialog>
              <q-card class="roundedDtr">
                <q-skeleton v-if="loading" :style="{ height: '60px' }" />
                <q-card-section
                  v-else
                  class="bg-primary text-white text-bold text-h6 text-center"
                  :style="{
                    fontWeight: 'bold',
                    fontSize: $q.screen.lt.sm
                      ? '16px'
                      : $q.screen.lt.md
                      ? '18px'
                      : $q.screen.gt.md && $q.screen.lt.xl
                      ? '20px'
                      : '24px',
                  }"
                >
                  <div class="row">
                    <div class="col-4"></div>
                    <div class="col-4 text-center">Daily Time Record</div>
                    <div class="col-4 text-right">
                      <q-btn
                        push
                        label="Pick A Date"
                        icon="search"
                        class="bg-white text-blue"
                        @click="dateDialog = true"
                      />
                    </div>
                  </div>
                </q-card-section>
                <template v-if="loading">
                  <template v-for="rowIndex in 1" :key="rowIndex">
                    <div
                      style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: 50px;
                        background-color: #f2f2ef;
                      "
                    >
                      <template v-for="colIndex in 12" :key="colIndex">
                        <div
                          style="
                            flex: 1;
                            display: flex;
                            justify-content: center;
                          "
                        >
                          <q-skeleton
                            :style="{ height: '15px', width: '70%' }"
                            :animation="
                              skeletonAnimations.includes('fade')
                                ? 'fade'
                                : 'none'
                            "
                          />
                        </div>
                      </template>
                    </div>
                  </template>
                  <template v-for="rowIndex in 16" :key="rowIndex">
                    <div
                      style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: 50px;
                      "
                    >
                      <template v-for="colIndex in 1" :key="colIndex">
                        <div
                          style="
                            flex: 1;
                            display: flex;
                            justify-content: center;
                          "
                        >
                          <q-skeleton
                            :style="{ height: '45px', width: '100%' }"
                            :animation="
                              skeletonAnimations.includes('fade')
                                ? 'fade'
                                : 'none'
                            "
                          />
                        </div>
                      </template>
                    </div>
                  </template>
                </template>
                <template v-else>
                  <q-virtual-scroll
                    type="table"
                    style="max-height: 850px"
                    :virtual-scroll-item-size="48"
                    :virtual-scroll-sticky-size-start="48"
                    :virtual-scroll-sticky-size-end="32"
                    :items="computedDTRDetails"
                    class="virtual-scroll"
                  >
                    <template v-slot:before>
                      <thead class="sticky-thead">
                        <tr>
                          <th
                            v-for="col in dynamicDtrColumns"
                            :key="col.name"
                            class="text-center"
                          >
                            {{ col.label }}
                          </th>
                        </tr>
                      </thead>
                    </template>
                    <template v-slot="{ item: row }">
                      <q-tr
                        :key="row.Day"
                        :class="{
                          'bg-green-1':
                            (row.calendar !== 'ABSENT' &&
                              row.calendar !== null) ||
                            row.onLeave === true,
                          'bg-red-1':
                            row.iN === null || row.calendar === 'ABSENT',
                        }"
                        class="text-center"
                      >
                        <q-td
                          v-for="col in dynamicDtrColumns"
                          :key="col.Day"
                          :style="{ width: col.width || 'auto' }"
                          class="text-center text-subtitle1"
                        >
                          <template
                            v-if="
                              (col.field === 'iN' &&
                                !noDtr.some(
                                  (item) =>
                                    item.positionCode === employeePosition,
                                )) ||
                              (col.field === 'iN' &&
                                !noDtr.some(
                                  (item) =>
                                    item.positionCode === employeePosition &&
                                    officer === false,
                                ))
                            "
                          >
                            <q-card
                              v-if="row.late > 1 && row.late <= 14"
                              style="width: 100%"
                            >
                              <q-card-section
                                class="text-white text-bold text-center bg-yellow-10"
                                style="line-height: 25%"
                              >
                                {{ row[col.field] }}
                              </q-card-section>
                            </q-card>
                            <q-card
                              v-else-if="row.late > 14"
                              style="width: 100%"
                            >
                              <q-card-section
                                class="text-white text-bold text-center bg-red-10"
                                style="line-height: 25%"
                              >
                                {{ row[col.field] }}
                              </q-card-section>
                            </q-card>
                            <q-card
                              v-else-if="row.iN !== null"
                              style="width: 100%"
                            >
                              <q-card-section
                                class="text-white text-bold text-center bg-green-8"
                                style="line-height: 25%"
                              >
                                {{ row[col.field] }}
                              </q-card-section>
                            </q-card>
                            <div v-else>-</div>
                          </template>
                          <template
                            v-else-if="
                              (col.field === 'iN' &&
                                noDtr.some(
                                  (item) =>
                                    item.positionCode === employeePosition,
                                ) &&
                                officer === false) ||
                              (col.field === 'iN' &&
                                !noDtr.some(
                                  (item) =>
                                    item.positionCode === employeePosition,
                                ) &&
                                officer === true) ||
                              (col.field === 'iN' &&
                                noDtr.some(
                                  (item) =>
                                    item.positionCode === employeePosition,
                                ) &&
                                officer === true)
                            "
                          >
                            <q-card v-if="row.iN === null" style="width: 100%">
                              <q-card-section
                                class="text-white text-bold text-center bg-green-8"
                                style="line-height: 25%"
                              >
                                {{ row[col.field] }}
                              </q-card-section>
                            </q-card>
                            <div v-else>-</div>
                          </template>
                          <template v-else-if="col.field === 'oUT'">
                            <q-card
                              v-if="row[col.field] !== null"
                              style="width: 100%"
                            >
                              <q-card-section
                                class="text-white text-bold text-center bg-green-8"
                                style="line-height: 25%"
                              >
                                {{ row[col.field] }}
                              </q-card-section>
                            </q-card>
                            <div v-else>-</div>
                          </template>
                          <template v-else-if="col.field === 'oT - IN'">
                            <q-card v-if="row['oT - IN'] !== null">
                              <q-card-section
                                class="text-white text-bold text-center bg-green-8"
                                style="line-height: 25%"
                              >
                                {{ row[col.field] }}
                              </q-card-section>
                            </q-card>
                            <div v-else>-</div>
                          </template>
                          <template v-else-if="col.field === 'oT - OUT'">
                            <q-card v-if="row['oT - OUT'] !== null">
                              <q-card-section
                                class="text-white text-bold text-center bg-green-8"
                                style="line-height: 25%"
                              >
                                {{ row[col.field] }}
                              </q-card-section>
                            </q-card>
                            <div v-else>-</div>
                          </template>
                          <template v-else-if="col.field === 'late'">
                            <q-card
                              v-if="row.late > 1 && row.late <= 14"
                              style="width: 100%"
                            >
                              <q-card-section
                                class="text-white text-bold text-center bg-yellow-10"
                                style="line-height: 25%"
                              >
                                {{ row[col.field] }}
                              </q-card-section>
                            </q-card>
                            <q-card
                              v-else-if="row.late > 14"
                              style="width: 100%"
                            >
                              <q-card-section
                                class="text-white text-bold text-center bg-red-10"
                                style="line-height: 25%"
                              >
                                {{ row[col.field] }}
                              </q-card-section>
                            </q-card>
                            <div v-else>-</div>
                          </template>
                          <template v-else-if="col.field === 'undertime'">
                            <q-card
                              v-if="row.undertime > 1 && row.undertime <= 14"
                              style="width: 100%"
                            >
                              <q-card-section
                                class="text-white text-bold text-center bg-yellow-10"
                                style="line-height: 25%"
                              >
                                {{ row[col.field] }}
                              </q-card-section>
                            </q-card>
                            <q-card
                              v-else-if="row.undertime > 14"
                              style="width: 100%"
                            >
                              <q-card-section
                                class="text-white text-bold text-center bg-red-10"
                                style="line-height: 25%"
                              >
                                {{ row[col.field] }}
                              </q-card-section>
                            </q-card>
                            <div v-else>-</div>
                          </template>
                          <template v-else-if="col.field === 'otHours'">
                            <q-card v-if="row.otHours > 1" style="width: 100%">
                              <q-card-section
                                class="text-white text-bold text-center bg-green-8"
                                style="line-height: 25%"
                              >
                                {{ row[col.field] }}
                              </q-card-section>
                            </q-card>
                            <div v-else>-</div>
                          </template>
                          <template v-else-if="col.field === 'holidayPay'">
                            <q-card
                              v-if="row.holidayPay > 1"
                              style="width: 100%"
                            >
                              <q-card-section
                                class="text-white text-bold text-center bg-green-8"
                                style="line-height: 25%"
                              >
                                {{ row[col.field] }}
                              </q-card-section>
                            </q-card>
                            <div v-else>-</div>
                          </template>
                          <template v-else-if="col.field === 'workHours'">
                            <q-card v-if="row.workHours !== '-'">
                              <q-card-section
                                class="text-white text-bold text-center bg-green-8"
                                style="line-height: 25%"
                              >
                                {{ row[col.field] }}
                              </q-card-section>
                            </q-card>
                            <div v-else>-</div>
                          </template>
                          <template v-else>
                            {{ row[col.field] }}
                          </template>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-virtual-scroll>
                  <div v-if="DTRDetails.length === 0" class="text-center">
                    <q-icon name="warning" style="font-size: 25px" />
                    No data available
                  </div>
                </template>
                <q-card-section
                  v-if="DTRDetails.length > 0"
                  class="bg-blue-2 text-left"
                >
                  <span class="text-italic">Total work hours this month: </span>
                  <span class="text-bold">{{ totalWorkHoursMonth }}</span>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import helperMethods from "../helperMethods.js";
import { QSpinnerIos } from "quasar";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      DTRDetails: [],
      dtrColumns: [
        {
          name: "Day",
          label: "Day",
          align: "center",
          field: "dayOfWeek",
          sortable: false,
          width: "80px",
        },
        {
          name: "Date",
          label: "Date",
          align: "center",
          field: "transDateFormat",
          sortable: false,
          width: "80px",
        },
        {
          name: "Calendar",
          label: "Calendar",
          align: "center",
          field: "calendar",
          sortable: false,
          width: "100px",
        },
        {
          name: "Schedule",
          label: "Schedule",
          align: "center",
          field: "schedule",
          sortable: false,
          width: "100px",
        },
        {
          name: "IN",
          label: "IN",
          align: "center",
          field: "iN",
          sortable: false,
          width: "80px",
        },
        {
          name: "OUT",
          label: "OUT",
          align: "center",
          field: "oUT",
          sortable: false,
          width: "80px",
        },
        {
          name: "OT IN",
          label: "OT IN",
          align: "center",
          field: "oT - IN",
          sortable: false,
          width: "80px",
        },
        {
          name: "OT OUT",
          label: "OT OUT",
          align: "center",
          field: "oT - OUT",
          sortable: false,
          width: "80px",
        },
        {
          name: "Late",
          label: "Late",
          align: "center",
          field: "late",
          sortable: false,
          width: "80px",
        },
        {
          name: "Undertime",
          label: "Undertime",
          align: "center",
          field: "undertime",
          sortable: false,
          width: "80px",
        },
        {
          name: "Overtime",
          label: "Overtime",
          align: "center",
          field: "otHours",
          sortable: false,
          width: "80px",
        },
        {
          name: "Work Hours",
          label: "Work Hours",
          align: "center",
          field: "workHours",
          sortable: false,
          width: "80px",
        },
      ],
      noDtrColumns: [
        {
          name: "Day",
          label: "Day",
          align: "center",
          field: "dayOfWeek",
          sortable: false,
          width: "100px",
        },
        {
          name: "Date",
          label: "Date",
          align: "center",
          field: "transDateFormat",
          sortable: false,
          width: "200px",
        },
        {
          name: "Calendar",
          label: "Calendar",
          align: "center",
          field: "calendar",
          sortable: false,
          width: "200px",
        },
        {
          name: "Schedule",
          label: "Schedule",
          align: "center",
          field: "schedule",
          sortable: false,
          width: "200px",
        },
        {
          name: "IN",
          label: "IN",
          align: "center",
          field: "iN",
          sortable: false,
          width: "125px",
        },
        {
          name: "OUT",
          label: "OUT",
          align: "center",
          field: "oUT",
          sortable: false,
          width: "125px",
        },
        {
          name: "Work Hours",
          label: "Work Hours",
          align: "center",
          field: "workHours",
          sortable: false,
          width: "100px",
        },
      ],
      loadingCounter: null,
      loading: true,
      skeletonAnimations: ["wave", "fade", "fade", "none"],
      selectedYear: [],
      selectedMonth: [],
      yearOptions: [],
      LeaveTypes: [
        { label: "Vacation Leave", value: "VL" },
        { label: "Sick Leave", value: "SL" },
        { label: "Emergency Leave", value: "EL" },
        { label: "Birthday Leave", value: "BL" },
        { label: "Leave Without Pay", value: "LWOP" },
        { label: "Magna Carta", value: "MC" },
        { label: "Maternity Leave", value: "ML" },
        { label: "Official Leave", value: "OL" },
        { label: "Parental Leave", value: "PARENTL" },
        { label: "Paternity Leave", value: "PL" },
        { label: "Sabbatical Leave", value: "SABL" },
        { label: "Study Leave", value: "STUDL" },
        { label: "Union Leave", value: "UL" },
      ],
      months: [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
      ],
      dateDialog: false,
      noDtr: "",
      employeePosition: this.position,
      officer: false,
    };
  },

  computed: {
    ...mapGetters({
      dtrDetails: "DTRModule/getdtrdetails",
      employeeNoDtr: "DTRModule/getNoDtrEmployee",
      position: "user_module/position",
      isOfficer: "user_module/isOfficer",
    }),

    noDtrPositionCodes() {
      return this.noDtr.map((item) => item.positionCode);
    },

    dynamicDtrColumns() {
      const hasMatch = this.noDtrPositionCodes.includes(this.employeePosition);
      return hasMatch || this.officer === true
        ? this.noDtrColumns
        : this.dtrColumns;
    },

    computedDTRDetails() {
      return this.DTRDetails.map((row) => {
        const hasMatch = this.noDtrPositionCodes.includes(
          this.employeePosition,
        );
        const schedule = hasMatch ? "-" : row.schedule;
        const checkIn = row.iN
          ? row.iN.split(":").map((num) => parseInt(num, 10))
          : null;
        const checkOut = row.oUT
          ? row.oUT.split(":").map((num) => parseInt(num, 10))
          : null;
        let workHours = "-";
        if (checkIn && checkOut) {
          let checkInDecimal =
            parseInt(checkIn[0], 10) + parseInt(checkIn[1], 10) / 60;
          let checkOutDecimal =
            parseInt(checkOut[0], 10) + parseInt(checkOut[1], 10) / 60;
          if (checkOutDecimal < checkInDecimal) {
            checkOutDecimal += 24;
          }

          let totalHours = checkOutDecimal - checkInDecimal;

          const [startTimeStr, endTimeStr] = row.schedule.split(" - ");
          const startTime = new Date("1970-01-01T" + startTimeStr + "Z");
          const endTime = new Date("1970-01-01T" + endTimeStr + "Z");
          let timeDifferenceMs = endTime - startTime;
          let timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);

          if (totalHours > 0) {
            if (timeDifferenceHours >= 9) {
              totalHours -= 1;
            } else {
              totalHours;
            }
            workHours = totalHours > 0 ? totalHours.toFixed(2) : "-";
          } else {
            workHours = "-";
          }
        } else {
          const [startTimeStr, endTimeStr] = row.schedule.split(" - ");
          const startTime = new Date("1970-01-01T" + startTimeStr + "Z");
          const endTime = new Date("1970-01-01T" + endTimeStr + "Z");
          let timeDifferenceMs = endTime - startTime;
          let timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);
          const currentDate = new Date();
          const schedToDate = new Date(row.schedTo);
          if (currentDate < schedToDate) {
            const currentDecimal =
              currentDate.getHours() + currentDate.getMinutes() / 60;
            const checkInDecimal = checkIn ? checkIn[0] + checkIn[1] / 60 : 0;
            let hoursDiff = currentDecimal - checkInDecimal;

            if (hoursDiff > 0) {
              if (timeDifferenceHours >= 9) {
                hoursDiff -= 1;
              } else {
                hoursDiff;
              }
              workHours = hoursDiff.toFixed(2);
            } else {
              workHours = hoursDiff.toFixed(2);
            }
          }
        }

        return {
          ...row,
          undertime: row.undertime === 0 ? null : row.undertime,
          late: row.late === 0 ? null : row.late,
          otHours: row.otHours === 0 ? null : row.otHours,
          holidayPay: row.holidayPay === 0 ? null : row.holidayPay,
          schedule:
            row.onLeave === true
              ? "ON LEAVE"
              : row.calendar === "REST DAY"
              ? "REST DAY"
              : row.calendar === "DAY OFF"
              ? "DAY OFF"
              : row.calendar && row.calendar.toUpperCase().includes("HOLIDAY")
              ? "HOLIDAY"
              : schedule,
          calendar:
            row.onLeave === true
              ? this.LeaveTypes.find(
                  (leave) => leave.value === row.leaveType,
                )?.label.toUpperCase()
              : row.absent === true && new Date(row.transDate) < new Date()
              ? "ABSENT"
              : row.calendar,
          workHours: !row.iN && !row.oUT ? "-" : workHours,
        };
      });
    },

    totalWorkHoursMonth() {
      let totalHours = 0;
      this.computedDTRDetails.forEach((row) => {
        if (row.workHours && row.workHours !== "-") {
          totalHours += parseFloat(row.workHours);
        }
      });
      return totalHours.toFixed(2);
    },

    getLeaveTypeLabel(leaveTypeValue) {
      const leaveType = this.LeaveTypes.find(
        (leave) => leave.value === leaveTypeValue,
      );
      return leaveType ? leaveType.label : "";
    },
  },

  methods: {
    async fetchDTR() {
      const month = this.selectedMonth.value;
      const year = this.selectedYear.value;

      if (month !== undefined && year !== undefined) {
        this.$q.loading.show({
          spinner: QSpinnerIos,
          message: "Fetching Daily Time Record Request",
          messageColor: "primary",
          backgroundColor: "grey-1",
          spinnerColor: "primary",
          customClass: "custom-loading-style",
          spinnerSize: "7em",
        });
      }

      const dateData = {
        month: month,
        year: year,
      };
      this.dateDialog = false;

      try {
        await helperMethods.delay(500);
        await this.$store.dispatch("DTRModule/fetchDTR", dateData);
        this.DTRDetails = this.dtrDetails;
        this.$q.loading.hide();
        this.loadingCounter++;
        if (this.loadingCounter === 2) {
          this.loading = false;
        }
      } catch {
        console.error(error);
      }
    },

    generateYearOptions() {
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 30; // Change this value to set the starting year
      const endYear = currentYear; // Change this value to set the ending year
      const yearOptions = [];

      for (let year = endYear; year >= startYear; year--) {
        yearOptions.push({ label: year.toString(), value: year });
      }

      return yearOptions;
    },

    async fetchNoDtrEmployee() {
      try {
        await this.$store.dispatch("DTRModule/fetchNoDtrEmployee");
        this.noDtr = this.employeeNoDtr;
        this.employeePosition = this.position;
        this.officer = this.isOfficer;
        this.loadingCounter++;
        if (this.loadingCounter === 2) {
          this.loading = false;
        }
      } catch {
        console.error(error);
      }
    },
  },

  mounted() {
    this.yearOptions = this.generateYearOptions();
  },

  created() {
    this.fetchDTR();
    this.fetchNoDtrEmployee();
  },
};
</script>

<style>
.containerDtr {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.roundedDtr {
  border-radius: 10px;
  margin-bottom: 50px;
  margin-top: 10px;
  height: 970px;
}

.containerDtr.show-scrollbar::-webkit-scrollbar {
  width: 10px; /* Show scrollbar on hover */
}

.q-menu {
  max-height: 300px !important;
  overflow-y: auto !important;
}
</style>
