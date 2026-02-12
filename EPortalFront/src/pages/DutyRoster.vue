<template>
  <q-layout>
    <q-page-container>
      <div class="containermainn">
        <div class="row" style="width: 95%">
          <div v-if="loadingSkeleton" class="col-12">
            <q-skeleton class="q-mt-sm" style="height: 810px; width: 100%">
            </q-skeleton>
          </div>
          <q-card v-else class="full-width">
            <div>
              <q-tabs
                v-model="tab"
                indicator-color="primary"
                active-bg-color="positive text-white"
                class="bg-primary text-white shadow-2 row"
              >
                <q-tab
                  class="col-6"
                  name="Duty Roster"
                  icon="pending_actions"
                  label="Duty Roster"
                />

                <q-tab
                  class="col-6 text"
                  name="Add Schedule"
                  icon="schedule"
                  label="Add Schedule"
                />
              </q-tabs>
            </div>
            <div>
              <q-tab-panels
                v-model="tab"
                animated
                transition-prev="slide-right"
                transition-next="slide-left"
              >
                <q-tab-panel name="Duty Roster">
                  <div class="col-12">
                    <q-select
                      filled
                      use-input
                      v-model="selectedDept"
                      input-debounce="0"
                      label="Department"
                      :options="department"
                      behavior="menu"
                      class="bg-grey-3 q-mb-lg"
                      option-label="deptDescription"
                      option-value="deptCode"
                      clearable
                      @filter="filterFn"
                      style="width: 100%"
                      @update:model-value="getEmployees(selectedDept)"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No Result
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="col-12">
                    <q-table
                      style="min-height: 580px"
                      :rows="computedEmployees"
                      :columns="employeeCol"
                      class="custom-scroll q-pb-xs"
                      color="primary"
                      row-key="name"
                      :loading="loading"
                      hide-pagination
                      :rows-per-page-options="[0]"
                    >
                      <template v-slot:header>
                        <q-tr class="sticky-thead bg-primary">
                          <q-th
                            v-for="col in employeeCol"
                            :key="col.employeeCode"
                            class="text-center text-white bold-header"
                          >
                            {{ col.label }}
                          </q-th>
                        </q-tr>
                      </template>

                      <template v-slot:top>
                        <q-input
                          class="bg-grey-4 full-width"
                          v-model="searchText"
                          placeholder="Search"
                          outlined
                          dense
                          standout
                          clearable
                          :class="[$q.screen.name + '-text2']"
                          input-style="color: #1565c0;"
                          @clear="clearSearchText"
                        />
                      </template>

                      <template v-slot:body="props">
                        <q-tr
                          :props="props"
                          @click="clickedRow(props.row)"
                          :key="props.row.employeeCode"
                          class="hover-row"
                        >
                          <q-td
                            v-for="col in employeeCol"
                            :key="col.employeeCode"
                            :style="{ width: col.width }"
                            class="text-center"
                          >
                            <template v-if="col.name === 'position'">
                              <div
                                style="
                                  white-space: normal;
                                  overflow-wrap: break-word;
                                  word-wrap: break-word;
                                "
                              >
                                {{ props.row[col.field] }}
                              </div>
                            </template>
                            <template v-else>
                              {{ props.row[col.field] }}
                            </template>
                          </q-td>
                        </q-tr>
                      </template>
                      <template v-slot:no-data="{ message }">
                        <div
                          class="full-width row flex-center text-black text-subtitle2"
                        >
                          <div class="col-12" v-if="loading">
                            <div class="row">
                              <q-inner-loading class="col-12" showing>
                                <q-spinner-dots
                                  size="50px"
                                  color="primary"
                                ></q-spinner-dots>
                              </q-inner-loading>
                              <span
                                class="col-12 text-center text-black text-subtitle1 text-bold"
                                >Please wait...
                              </span>
                            </div>
                          </div>
                          <div v-else>
                            <span class="text-black text-subtitle2"
                              >{{ message }}, Please choose a department
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
                  </div>
                  <div
                    v-if="this.employees.length > 0"
                    class="col-12 text-right q-mt-md"
                  >
                    <PrintPdf :entry="selectedDept" />
                  </div>
                </q-tab-panel>
                <q-tab-panel name="Add Schedule">
                  <div v-if="!dutyRosterCreate">
                    <div class="text-center">
                      <h5 class="text-bold text-red">
                        You are not allowed to create schedule
                      </h5>
                    </div>
                  </div>
                  <div v-else>
                    <q-input
                      class="bg-grey-3"
                      filled
                      label="Time From"
                      v-model="timeFrom"
                      @click="showPopup('TimeFromPopup')"
                      style="margin-bottom: 5px"
                    >
                      <template v-slot:append>
                        <q-icon name="schedule" class="cursor-pointer">
                          <q-popup-proxy
                            ref="TimeFromPopup"
                            :breakpoint="1440"
                            cover
                          >
                            <div class="q-date-container">
                              <q-time v-model="timeFrom" mask="h:mm A"></q-time>
                              <q-btn
                                push
                                icon="close"
                                @click="hidePopup('TimeFromPopup')"
                                class="bg-white absolute-top-right"
                                round
                                padding="xs"
                                style="margin: 10px"
                              ></q-btn>
                            </div>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-input
                      class="bg-grey-3"
                      filled
                      label="Time To"
                      v-model="timeTo"
                      @click="showPopup('TimeToPopup')"
                      style="margin-bottom: 5px"
                    >
                      <template v-slot:append>
                        <q-icon name="schedule" class="cursor-pointer">
                          <q-popup-proxy
                            ref="TimeToPopup"
                            :breakpoint="1440"
                            cover
                          >
                            <div class="q-date-container">
                              <q-time v-model="timeTo" mask="h:mm A"></q-time>
                              <q-btn
                                push
                                icon="close"
                                @click="hidePopup('TimeToPopup')"
                                class="bg-white absolute-top-right"
                                round
                                padding="xs"
                                style="margin: 10px"
                              ></q-btn>
                            </div>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-select
                      filled
                      v-model="selectedRestDay"
                      input-debounce="0"
                      label="Rest Day"
                      :options="dayRestOptions"
                      behavior="menu"
                      class="bg-grey-3 q-mb-xs"
                      option-label="label"
                      option-value="value"
                      clearable
                      style="margin-bottom: 5px"
                    />
                    <q-select
                      filled
                      v-model="selectedDayOff"
                      input-debounce="0"
                      label="Day Off"
                      :options="dayRestOptions"
                      behavior="menu"
                      class="bg-grey-3 q-mb-xs"
                      option-label="label"
                      option-value="value"
                      clearable
                    />
                    <q-select
                      filled
                      v-model="withBreak"
                      input-debounce="0"
                      label="With Break"
                      :options="withBreakOption"
                      behavior="menu"
                      class="bg-grey-3 q-mb-lg"
                      option-label="label"
                      option-value="value"
                      clearable
                      style="width: 100%"
                    />
                    <div class="text-right">
                      <q-btn
                        label="Add / Confirm New Schedule"
                        push
                        class="bg-positive text-white"
                        @click="submitNewSchedule"
                      ></q-btn>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </q-card>
        </div>

        <q-dialog v-model="employeeDtrDia" persistent>
          <q-card
            style="
              max-width: 800px;
              max-height: 850px;
              display: flex;
              flex-direction: column;
            "
            :class="[$q.screen.name + '-text']"
          >
            <!-- Header Section -->
            <q-card-section class="bg-primary row items-center q-pb-sm">
              <div class="text-h5 text-white text-bold">
                {{ selectedEmployee }}
              </div>
              <q-space></q-space>
              <q-btn
                class="bg-white"
                icon="close"
                push
                round
                dense
                padding="xs"
                @click="closeEmpDtrDia"
              ></q-btn>
            </q-card-section>

            <!-- Instructions Section (Fixed) -->
            <q-card-section
              v-if="dutyRosterManage"
              class="col-12"
              style="flex-shrink: 0"
            >
              <p style="text-align: justify; font-size: 17px">
                <span v-if="!showPermanentSchedule">
                  Please set a schedule for specific dates. After setting the
                  schedule, submit the changes. If you prefer a permanent
                  schedule for this employee,
                </span>
                <span v-else>
                  If you want to set a manual schedule for this employee
                </span>
                <a
                  href="#"
                  @click.prevent="permanentClicked()"
                  style="color: blue; text-decoration: underline"
                >
                  click here </a
                >.
              </p>
            </q-card-section>

            <!-- Month/Year Selector Section (Fixed) -->
            <q-card-section
              v-if="!showPermanentSchedule"
              style="flex-shrink: 0"
            >
              <div
                v-if="!loadingDia"
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
            </q-card-section>

            <!-- Scrollable Table Section -->
            <q-card-section
              v-if="!showPermanentSchedule"
              style="flex: 1; overflow-y: auto"
            >
              <q-table
                style="min-width: 700px"
                :rows="employeeDtr"
                :columns="filteredEmployeeDtrCol"
                class="custom-scroll"
                color="primary"
                row-key="name"
                :loading="loadingDia"
                flat
                hide-pagination
                :rows-per-page-options="[0]"
              >
                <template v-slot:header>
                  <q-tr class="bg-primary">
                    <q-th
                      v-for="col in filteredEmployeeDtrCol"
                      :key="col.code"
                      class="text-center text-white bold-header"
                      style="position: sticky; top: 0; z-index: 1"
                    >
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>

                <template v-slot:body="props">
                  <q-tr :props="props" :key="props.row.code" class="hover-row">
                    <q-td
                      v-for="col in filteredEmployeeDtrCol"
                      :key="col.code"
                      :style="{ width: col.width }"
                      class="text-center"
                    >
                      <template v-if="col.name === 'schedule'">
                        <q-select
                          filled
                          dense
                          v-model="props.row.selectedTime"
                          input-debounce="0"
                          label="Set Schedule"
                          :options="schedule"
                          behavior="menu"
                          class="bg-grey-3"
                          option-label="combineTime"
                          option-value="id"
                          clearable
                          @update:model-value="
                            (value) => onSelectTimeChange(props.row, value)
                          "
                          @filter="filterFn"
                        >
                          <template v-slot:no-option>
                            <q-item>
                              <q-item-section class="text-grey">
                                No Result
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </template>
                      <template v-else>
                        {{ props.row[col.field] }}
                      </template>
                    </q-td>
                  </q-tr>
                </template>

                <template v-slot:no-data="{ message }">
                  <div
                    class="full-width row flex-center text-black text-subtitle2"
                  >
                    <div class="col-12" v-if="loadingDia">
                      <div class="row">
                        <q-inner-loading class="col-12" showing>
                          <q-spinner-dots
                            size="50px"
                            color="primary"
                          ></q-spinner-dots>
                        </q-inner-loading>
                        <span
                          class="col-12 text-center text-black text-subtitle1 text-bold"
                          >Please wait...
                        </span>
                      </div>
                    </div>
                    <div v-else>
                      <span class="text-black text-subtitle2"
                        >{{ message }}, Please choose a department first.</span
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
            </q-card-section>

            <!-- Permanent Schedule Section (Scrollable) -->
            <q-card-section
              v-else
              style="flex: 1; overflow-y: auto; min-height: 0"
            >
              <div class="row">
                <q-card
                  class="bg-grey-1"
                  v-for="(sched, index) in permenentSched"
                  :key="sched.schedId"
                  :style="{
                    borderRadius: '10px',
                    ...getCardStyle(index),
                  }"
                >
                  <div class="q-pa-sm bg-primary row items-center">
                    <div class="text-subtitle1 text-white text-bold">
                      {{ sched.schedFrom }} - {{ sched.schedTo }}
                    </div>
                  </div>
                  <div class="q-pl-sm">
                    <strong class="text-subtitle1 text-bold">Day Off:</strong>
                    {{ sched.dayOff }}
                  </div>
                  <div class="q-pl-sm">
                    <strong class="text-subtitle1 text-bold">Rest Day:</strong>
                    {{ sched.restDay }}
                  </div>
                  <q-card-section>
                    <q-btn
                      class="full-width text-subtitle2 bg-primary text-white"
                      push
                      label="Select Schedule"
                      @click="setPermanentSched(sched, employeeDtr)"
                    ></q-btn>
                  </q-card-section>
                </q-card>
              </div>
            </q-card-section>

            <!-- Submit Button Section (Fixed) -->
            <q-card-section
              v-if="dutyRosterManage && !showPermanentSchedule"
              class="text-right q-pb-md q-pr-md"
              style="flex-shrink: 0"
            >
              <q-btn
                push
                class="bg-positive text-white"
                label="Submit Changes"
                @click="changeSchedule"
              />
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </q-page-container>
  </q-layout>
</template>
<script>
import { mapGetters } from "vuex";
import helperMethods from "src/helperMethods";
import { QSpinnerIos } from "quasar";
import PrintPdf from "../components/GeneratePdfDutyRoster.vue";
import logoPath from "../assets/images/uerm-hospital-logo.png";

export default {
  data() {
    return {
      department: [],
      employees: [],
      employeeCol: [
        {
          name: "code",
          label: "Employee Code",
          align: "center",
          field: "employeeCode",
          width: "200px",
        },
        {
          name: "name",
          label: "Name",
          align: "center",
          field: "fullName",
          width: "350px",
        },
        {
          name: "position",
          label: "Position",
          align: "center",
          field: "position",
          width: "450px",
        },
      ],
      selectedDept: null,
      loading: false,
      selectedEmployee: null,
      selectedEmployeeCode: null,
      employeeDtrDia: false,
      employeeDtr: null,
      employeeDtrCol: [
        {
          name: "transDateFormat",
          label: "Date",
          align: "center",
          field: "transDateFormat",
          width: "150px",
        },
        {
          name: "schedFromFormat",
          label: "Time From",
          align: "center",
          field: "schedFromFormat",
          width: "150px",
        },
        {
          name: "schedToFormat",
          label: "Time To",
          align: "center",
          field: "schedToFormat",
          width: "150px",
        },
        {
          name: "schedule",
          label: "Set Schedule",
          align: "center",
          field: "",
          width: "300px",
        },
        {
          name: "calendar",
          label: "Calendar",
          align: "center",
          field: "calendar",
          width: "250px",
        },
      ],
      loadingDia: false,
      schedule: [],
      selectedTime: null,
      dataCombine: [],
      searchText: "",
      loadingSkeleton: true,
      loadingCounter: null,
      tab: "Duty Roster",
      timeFrom: null,
      timeTo: null,
      withBreak: null,
      selectedDayOff: null,
      selectedRestDay: null,
      withBreakOption: [
        { label: "Yes", value: 1 },
        { label: "No", value: 2 },
      ],
      dayRestOptions: [
        { label: "Monday", value: 1 },
        { label: "Tuesday", value: 1 },
        { label: "Wednesday", value: 1 },
        { label: "Thursday", value: 1 },
        { label: "Friday", value: 1 },
        { label: "Saturday", value: 1 },
        { label: "Sunday", value: 1 },
      ],
      selectedYear: [],
      selectedMonth: [],
      yearOptions: [],
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
      showPermanentSchedule: false,
      permenentSched: [],
    };
  },

  components: {
    PrintPdf,
  },

  computed: {
    ...mapGetters({
      deptOptions: "dutyRosterModule/getDepartment",
      employeesGetter: "dutyRosterModule/getEmployees",
      employeeDtrGetter: "dutyRosterModule/getEmployeeDtr",
      scheduleGetter: "dutyRosterModule/getSchedule",
      dutyRosterManage: "user_module/dutyRosterManage",
      dutyRosterView: "user_module/dutyRosterView",
      dutyRosterCreate: "user_module/dutyRosterCreate",
      permenentnSchedList: "dutyRosterModule/getPermanentSchedList",
    }),

    filteredEmployeeDtrCol() {
      if (this.dutyRosterManage) {
        return this.employeeDtrCol;
      } else {
        return this.employeeDtrCol.filter((col) => col.name !== "schedule");
      }
    },

    computedEmployees() {
      if (Array.isArray(this.employees)) {
        const query = this.searchText.toLowerCase();
        return this.employees.filter((row) => {
          return (
            (row.employeeCode &&
              row.employeeCode.toString().toLowerCase().includes(query)) ||
            (row.fullName &&
              row.fullName.toString().toLowerCase().includes(query)) ||
            (row.position &&
              row.position.toString().toLowerCase().includes(query))
          );
        });
      }
    },

    isSelectionComplete() {
      return this.selectedYear && this.selectedMonth;
    },

    columns() {
      if (this.$q.screen.gt.md) return 3;
      if (this.$q.screen.gt.sm) return 2;
    },
  },

  methods: {
    getCardStyle(index) {
      return helperMethods.getCardStyle(index, this.columns);
    },

    clearSearchText() {
      this.searchText = "";
    },

    closeEmpDtrDia() {
      this.employeeDtrDia = false;
      this.selectedEmployee = null;
      this.selectedEmployeeCode = null;
      this.schedule = [];
      this.employeeDtr = [];
    },

    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.department = this.deptOptions;
          this.schedule = this.scheduleGetter;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.department = this.deptOptions.filter(
          (option) => option.deptDescription.toLowerCase().indexOf(needle) > -1,
        );
        this.schedule = this.scheduleGetter.filter(
          (option) => option.combineTime.toLowerCase().indexOf(needle) > -1,
        );
      });
    },

    showPopup(refName) {
      this.$refs[refName].show();
    },

    hidePopup(refName) {
      this.$refs[refName].hide();
    },

    async getLogo() {
      await this.$store.dispatch(
        "leaveModule/loadAndConvertToBase64",
        logoPath,
      );
    },

    async getDepartment() {
      try {
        helperMethods.delay(500);
        await this.$store.dispatch("dutyRosterModule/getDepartment");
        this.department = this.deptOptions;
        this.loadingCounter++;
        if (this.loadingCounter === 2) {
          this.loadingSkeleton = false;
        }
      } catch (error) {
        console.error(error);
      }
    },

    async getEmployees(department) {
      this.employees = [];
      try {
        if (!department) {
          this.loading = false;
          return;
        }
        this.loading = true;
        helperMethods.delay(500);
        const data = {
          deptCode: department.deptCode,
        };
        await this.$store.dispatch("dutyRosterModule/getEmployees", data);
        this.employees = this.employeesGetter;
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },

    async clickedRow(row) {
      this.employeeDtr = [];
      this.employeeDtrDia = true;
      this.loadingDia = true;
      try {
        helperMethods.disablePointerEvents();
        this.selectedEmployee = row.fullName;
        this.selectedEmployeeCode = row.employeeCode;
        helperMethods.delay(500);
        const data = {
          employeeCode: row.employeeCode,
          month: this.selectedMonth.value,
          year: this.selectedYear.value,
        };
        await this.$store.dispatch("dutyRosterModule/getEmployeeDtr", data);
        this.employeeDtr = this.employeeDtrGetter;
        this.schedule = this.scheduleGetter;
        this.loadingDia = false;
        helperMethods.enablePointerEvents();
      } catch (error) {
        console.error(error);
      }
    },

    onSelectTimeChange(row, value) {
      let dateSelected;
      if (value === null) {
        dateSelected = row.transDateFormat;
        const existingIndex = this.dataCombine.findIndex(
          (item) => item.dateSelected === dateSelected,
        );
        if (existingIndex !== -1) {
          this.dataCombine.splice(existingIndex, 1);
        }
        return;
      }

      dateSelected = row.transDateFormat;
      const timeSelected = row.selectedTime.id;
      const timeFrom = row.selectedTime.from;
      const timeTo = row.selectedTime.to;
      const employeeCode = row.code;

      const existingIndex = this.dataCombine.findIndex(
        (item) => item.dateSelected === dateSelected,
      );

      if (existingIndex !== -1) {
        this.dataCombine.splice(existingIndex, 1);
      }

      const newData = {
        employeeCode,
        dateSelected,
        timeSelected,
        timeFrom,
        timeTo,
      };
      this.dataCombine.push(newData);
    },

    async changeSchedule() {
      try {
        if (this.dataCombine.length === 0) {
          this.$q.notify({
            color: "negative",
            position: "center",
            message: "Please set schedule",
            icon: "report_problem",
            iconColor: "white",
            timeout: 1000,
            progress: true,
          });
          return;
        }
        helperMethods.disablePointerEvents();
        this.$q.loading.show({
          spinner: QSpinnerIos,
          message: "Setting updated schedule",
          messageColor: "primary",
          backgroundColor: "grey-1",
          spinnerColor: "primary",
          customClass: "custom-loading-style",
          spinnerSize: "7em",
        });
        helperMethods.delay(500);

        const data = {
          dataArray: this.dataCombine,
        };

        console.log(data);
        // await this.$store.dispatch("dutyRosterModule/changeSchedule", data);
        await this.getEmployees(this.selectedDept);
        this.$q.loading.hide();
        this.$q.notify({
          color: "positive",
          position: "center",
          message: "Success on setting new schedule",
          icon: "check",
          iconColor: "white",
          timeout: "1000",
          progress: true,
        });
        this.dataCombine = [];
        this.employeeDtr = [];
        this.employeeDtrDia = false;
        helperMethods.enablePointerEvents();
      } catch (error) {
        this.$q.loading.hide();
        if (error.response.status == "409") {
          this.$q.notify({
            color: "negative",
            position: "center",
            message: error.response.data.error,
            icon: "report_problem",
            iconColor: "white",
            timeout: 1000,
            progress: true,
          });
        }
        console.error(error);
      }
    },

    async submitNewSchedule() {
      if (!this.timeFrom || !this.timeTo || !this.withBreak) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Please input the required filled",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      try {
        this.$q.loading.show({
          spinner: QSpinnerIos,
          message: "Adding new Schedule",
          messageColor: "primary",
          backgroundColor: "grey-1",
          spinnerColor: "primary",
          customClass: "custom-loading-style",
          spinnerSize: "7em",
        });
        helperMethods.delay(500);
        const data = {
          timeFrom: this.convertTo24HourFormat(this.timeFrom),
          timeTo: this.convertTo24HourFormat(this.timeTo),
          restDay: !this.selectedRestDay ? null : this.selectedRestDay.value,
          dayOff: !this.selectedDayOff ? null : this.selectedDayOff.value,
          withBreak: this.withBreak.value,
        };

        await this.$store.dispatch("dutyRosterModule/submitNewSchedule", data);
        (this.timeFrom = null),
          (this.timeTo = null),
          (this.selectedRestDay = null),
          (this.selectedDayOff = null);
        this.$q.loading.hide();
        this.$q.notify({
          color: "positive",
          position: "center",
          message: "Success on adding new schedule",
          icon: "check",
          iconColor: "white",
          timeout: "1000",
          progress: true,
        });
      } catch (error) {
        this.$q.loading.hide();
        if (error.response.status == "409") {
          this.$q.notify({
            color: "negative",
            position: "center",
            message: error.response.data.body,
            icon: "report_problem",
            iconColor: "white",
            timeout: 1000,
            progress: true,
          });
        }
        console.error(error);
      }
    },

    convertTo24HourFormat(time) {
      const [hour, minutePart] = time.split(":");
      const minute = minutePart.slice(0, 2);
      const ampm = minutePart.slice(-2);

      let hour24 = parseInt(hour, 10);
      if (ampm.toUpperCase() === "PM" && hour24 !== 12) {
        hour24 += 12;
      }
      if (ampm.toUpperCase() === "AM" && hour24 === 12) {
        hour24 = 0;
      }

      return `${hour24.toString().padStart(2, "0")}:${minute}`;
    },

    generateYearOptions() {
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 30;
      const endYear = currentYear;
      const yearOptions = [];

      for (let year = endYear; year >= startYear; year--) {
        yearOptions.push({ label: year.toString(), value: year });
      }

      return yearOptions;
    },

    permanentClicked() {
      this.showPermanentSchedule = !this.showPermanentSchedule;
    },

    async getPermanentScheduleList() {
      try {
        await helperMethods.delay(500);
        await this.$store.dispatch("dutyRosterModule/getPermanentScheduleList");
        this.permenentSched = this.permenentnSchedList;
        this.loadingCounter++;
        if (this.loadingCounter === 2) {
          this.loadingSkeleton = false;
        }
      } catch (error) {
        console.error(error);
      }
    },

    async setPermanentSched(itemSched, employeeDtr) {
      if (!itemSched || !employeeDtr) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Please select schedule",
          icon: "report_problem",
          iconColor: "white",
          timeout: "1000",
          progress: true,
        });
      }
      const data = {
        employeeCode: employeeDtr[0].code,
        schedId: itemSched.schedId,
      };

      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure you want to change the permanent schedule of the employee?`,
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
            message: "Setting new schedule for the selected employee",
            messageColor: "primary",
            backgroundColor: "grey-1",
            spinnerColor: "primary",
            customClass: "custom-loading-style",
            spinnerSize: "7em",
          });
          try {
            helperMethods.delay(500);
            await this.$store.dispatch(
              "dutyRosterModule/setPermanentSched",
              data,
            );
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "center",
              message: "Success on setting permanent schedule",
              icon: "check",
              iconColor: "white",
              timeout: "1000",
              progress: true,
            });
          } catch (error) {
            this.$q.loading.hide();
            if (error.response.status == 409) {
              this.$q.notify({
                color: "negative",
                position: "center",
                message: `${error.response.body}`,
                icon: "report_problem",
                iconColor: "white",
                timeout: "1000",
                progress: true,
              });
            }
            console.error(error);
          }
        })
        .onDismiss(() => {});
    },
  },

  mounted() {
    this.yearOptions = this.generateYearOptions();
  },

  watch: {
    isSelectionComplete(value) {
      if (value) {
        const data = {
          fullName: this.selectedEmployee,
          employeeCode: this.selectedEmployeeCode,
        };
        this.clickedRow(data);
      }
    },
  },

  created() {
    this.getDepartment();
    this.getLogo();
    this.getPermanentScheduleList();
  },
};
</script>

<style scoped>
.bold-header {
  font-weight: bold;
}
</style>
