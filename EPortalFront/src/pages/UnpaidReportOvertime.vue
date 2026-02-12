<template>
  <q-layout>
    <q-page-container>
      <div class="containermainn">
        <div class="row" style="width: 95%">
          <div v-if="loadingSkeleton" class="full-width">
            <q-skeleton :style="{ height: '285px', marginBottom: '25px' }" />
            <q-skeleton :style="{ height: '500px' }" />
          </div>

          <div v-else class="full-width q-mb-xl">
            <q-card class="bg-transparent">
              <q-card-section
                class="bg-primary text-white text-center"
                :class="['bold-text', $q.screen.name + '-text']"
              >
                Unpaid Overtime Report
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <div class="row q-col-gutter-xs">
                  <q-input
                    outlined
                    v-model="fromDate"
                    label="From Date"
                    label-color="primary"
                    mask="##/##/####"
                    placeholder="MM/DD/YYYY"
                    class="blue-outline col-12 col-sm-4"
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
                    class="blue-outline col-12 col-sm-4"
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
                    class="blue-outline col-12 col-sm-4"
                    @update:model-value="onClassChange"
                  />
                </div>
              </q-card-section>
              <q-card-section class="text-right q-pa-sm">
                <q-btn
                  push
                  label="Search"
                  icon="search"
                  class="bg-positive text-white"
                  @click="searchOvertime"
                  :loading="loading"
                ></q-btn>
              </q-card-section>
            </q-card>

            <div
              v-if="!overtimeItems && !loading"
              class="text-red text-h6 text-bold text-left q-mt-lg"
            >
              No data available, Please search for time data record.
            </div>

            <q-linear-progress
              v-if="loading"
              indeterminate
              color="primary"
              class="q-mt-md"
            />
            <div v-if="!loading" class="q-mt-xl">
              <div
                v-if="overtimeItems && overtimeItems.length > 0"
                class="q-mb-sm"
              >
                <q-input
                  class="blue-outline col-12 col-sm-6"
                  v-model="searchText"
                  placeholder="Search"
                  outlined
                  standout
                  clearable
                  :class="[$q.screen.name + '-text2']"
                  input-style="color: #1565c0;"
                  @clear="this.searchText = ''"
                />
              </div>

              <q-card
                v-if="overtimeItems && overtimeItems.length > 0"
                class="drawerStyle q-pa-xs"
              >
                <q-card-section class="q-pa-none">
                  <q-table
                    class="custom-scroll"
                    :rows="computedItems"
                    :columns="columns"
                    row-key="employeeCode"
                    style="max-height: 750px"
                    virtual-scroll
                    hide-pagination
                    :rows-per-page-options="[0]"
                  >
                    <template v-slot:header>
                      <q-tr class="sticky-thead bg-primary">
                        <q-th
                          v-for="(col, index) in columns"
                          :key="col.name"
                          :style="{ width: col.width }"
                          :class="[
                            'text-center text-white text-bold',
                            index > 0 ? 'border-left' : '',
                          ]"
                        >
                          {{ col.label }}
                        </q-th>
                      </q-tr>
                    </template>

                    <template v-slot:body="props">
                      <q-tr :props="props" :key="props.row.employeeCode">
                        <q-td
                          v-for="(col, index) in columns"
                          :key="col.name"
                          class="text-center"
                          :style="{
                            borderBottom: '1px solid #ccc',
                            borderRight: index > 0 ? '1px solid #ccc' : 'none',
                            ...(['Department', 'Position'].includes(col.name)
                              ? {
                                  wordBreak: 'break-word',
                                  whiteSpace: 'normal',
                                }
                              : {}),
                          }"
                        >
                          <template v-if="col.name === 'Name'">
                            <div class="q-pa-xs">
                              <div class="text-bold text-black">
                                {{ props.row.employeeName }}
                              </div>
                              <div
                                class="text-italic text-grey-6"
                                style="font-size: 0.9em"
                              >
                                ({{ props.row.position }})
                              </div>
                              <div
                                class="text-grey-6"
                                style="font-size: 0.85em"
                              >
                                {{ props.row.department }}
                              </div>
                            </div>
                          </template>

                          <template v-else-if="col.name === 'Overtime Dates'">
                            <div class="overtime-dates-cell">
                              <template v-if="props.row.dates">
                                <div
                                  v-for="(date, idx) in props.row.dates.split(
                                    ',',
                                  )"
                                  :key="idx"
                                  class="overtime-date-item"
                                >
                                  {{ date.trim() }}
                                </div>
                              </template>
                              <span v-else>-</span>
                            </div>
                          </template>

                          <renderCell v-else :row="props.row" :col="col" />
                        </q-td>
                      </q-tr>
                    </template>
                    <template v-slot:no-data>
                      <div class="full-width row flex-center q-pa-xl">
                        <div class="text-center">
                          <q-icon
                            class="text-red"
                            size="2em"
                            name="sentiment_dissatisfied"
                          ></q-icon>
                          <div class="text-black text-subtitle2 q-mt-sm">
                            No data available
                          </div>
                        </div>
                      </div>
                    </template>
                  </q-table>
                </q-card-section>
                <q-card-section class="q-pa-none q-mb-sm text-right">
                  <dtrPdf
                    :columns="columns"
                    :items="overtimeItems"
                    :typeReport="'unpaidOvertime'"
                    :payrollPeriod="`${fromDate} - ${toDate}`"
                    :classDescription="selectedClass?.class"
                  />
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
import { mapGetters } from "vuex";
import helperMethods from "src/helperMethods";
import renderCell from "src/components/helpers/renderCell.vue";
import dtrPdf from "../components/DTRReportPdf.vue";

export default {
  data() {
    return {
      loadingSkeleton: false,
      fromDate: null,
      toDate: null,
      selectedClass: null,
      overtimeItems: null,
      loading: false,
      columns: [
        {
          name: "Code",
          label: "Code",
          align: "center",
          field: "employeeCode",
        },
        {
          name: "Name",
          label: "Name",
          align: "center",
          field: "employeeName",
        },

        {
          name: "Service Length",
          label: "Service Length",
          align: "center",
          field: "serviceLength",
        },
        {
          name: "Overtime Dates",
          label: "Overtime Dates",
          align: "center",
          field: "dates",
        },
        {
          name: "OT 30",
          label: "OT 130",
          align: "center",
          field: "oT 30",
        },
        {
          name: "OT 100",
          label: "OT 100",
          align: "center",
          field: "oT 100",
        },
        {
          name: "OT 130",
          label: "OT 130",
          align: "center",
          field: "oT 130",
        },
        {
          name: "OT 135",
          label: "OT 135",
          align: "center",
          field: "oT 135",
        },
        {
          name: "Total Overtime",
          label: "Total Overtime",
          align: "center",
          field: "totalOvertime",
        },
      ],
      searchText: "",
    };
  },

  components: {
    renderCell,
    dtrPdf,
  },

  computed: {
    ...mapGetters({
      employeeClass: "DTRModule/getClass",
    }),

    computedItems() {
      if (!Array.isArray(this.overtimeItems)) {
        return [];
      }

      const search = this.searchText.toLowerCase();
      return this.overtimeItems.filter((item) => {
        const matchesEmployee =
          item.employeeCode?.toString().includes(search) ||
          item.employeeName?.toLowerCase().includes(search);

        return matchesEmployee;
      });
    },
  },

  methods: {
    formatOvertimeDates(dates) {
      if (!dates) return [];
      return dates.split(",").map((date) => date.trim());
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

    onClassChange() {
      this.overtimeItems = null;
    },

    async searchOvertime() {
      if (!this.fromDate || !this.toDate) {
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

      this.loading = true;

      helperMethods.disablePointerEvents();
      helperMethods.delay(100);

      const data = {
        fromDate: this.fromDate ? this.fromDate : null,
        toDate: this.toDate ? this.toDate : null,
        classCode: this.selectedClass?.class ?? "",
      };

      const [err, res] = await helperMethods.tryCatchAsync(
        this.$store.dispatch("overtimeModule/unpaidOvertime", data),
      );

      this.loading = false;

      helperMethods.enablePointerEvents();

      if (err) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: `${err.response.data.message}`,
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        this.loading = false;
        helperMethods.enablePointerEvents();
        return;
      }

      this.overtimeItems = res;
    },

    handleEnterKey(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        this.searchOvertime();
      }
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
