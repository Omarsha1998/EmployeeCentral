<template>
  <q-layout>
    <q-page-container>
      <div class="containermainn">
        <div class="row" style="width: 95%">
          <div v-if="loadingSkeleton" class="col-12">
            <q-skeleton style="height: 270px; width: 100%"> </q-skeleton>

            <q-skeleton class="q-mt-xl" style="height: 500px; width: 100%">
            </q-skeleton>
          </div>
          <div v-else class="col-12">
            <!-- Filter Card -->
            <q-card class="roundedd1">
              <q-card-section
                :class="['bold-text', $q.screen.name + '-text']"
                class="bg-primary text-white text-center"
              >
                Filter Report
              </q-card-section>
              <q-card-section>
                <q-select
                  filled
                  v-model="selectedCollege"
                  use-input
                  input-debounce="0"
                  label="College"
                  :options="colleges"
                  @filter="filterFn"
                  behavior="menu"
                  fill-input
                  hide-selected
                  class="bg-grey-3 q-mb-xs"
                  option-label="description"
                  option-value="college"
                  clearable
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-select
                  filled
                  v-model="selectedSemester"
                  use-input
                  input-debounce="0"
                  label="Semester"
                  :options="semesters"
                  @filter="filterFn"
                  behavior="menu"
                  fill-input
                  hide-selected
                  clearable
                  class="bg-grey-3 q-mb-xs"
                  option-label="semDescription"
                  option-value="semester"
                ></q-select>
              </q-card-section>
              <div class="text-center">
                <q-btn
                  class="bg-primary text-white"
                  push
                  :label="
                    selectedCollege || selectedSemester
                      ? 'Search'
                      : 'Search All'
                  "
                  @click="getReports"
                />
              </div>
            </q-card>

            <!-- Inner Loading Spinner just below the filter card -->
            <div class="q-mt-md">
              <q-inner-loading v-if="loading" showing style="size: 25px">
                <q-spinner-dots size="50px" color="primary"></q-spinner-dots>
              </q-inner-loading>
            </div>

            <!-- Reports Table -->
            <q-card>
              <q-card-section v-if="reports.length > 0 && !loading">
                <q-input
                  class="hoverable-item q-mb-md"
                  v-model="searchText"
                  label="Search"
                  dense
                  standout="bg-primary text-white"
                  clearable
                  label-color="primary"
                  @clear="clearSearchText"
                />
                <q-virtual-scroll
                  class="virtual-scroll"
                  type="table"
                  style="max-height: 600px; min-width: 400px"
                  :virtual-scroll-item-size="48"
                  :virtual-scroll-sticky-size-start="48"
                  :virtual-scroll-sticky-size-end="32"
                  :items="computedReport"
                  :virtual-scroll-slice-size="25"
                >
                  <template v-slot:before>
                    <thead class="sticky-thead">
                      <tr class="bg-primary">
                        <th v-for="col in reportCol" :key="col.name">
                          {{ col.label }}
                        </th>
                      </tr>
                    </thead>
                  </template>

                  <template v-slot="{ item: row }">
                    <q-tr :key="row.employeeCode">
                      <q-td
                        v-for="col in reportCol"
                        :key="col.name"
                        class="text-center"
                        :style="{ width: col.width }"
                      >
                        <template v-if="col.name === 'subjectDesc'">
                          <div
                            style="
                              white-space: normal;
                              overflow-wrap: break-word;
                              word-wrap: break-word;
                            "
                          >
                            {{ row[col.field] }}
                          </div>
                        </template>
                        <template v-else-if="col.name === 'schedule'">
                          <div v-if="row.schedule.length > 0">
                            {{ row.schedule }}
                          </div>
                          <div v-else>-</div>
                        </template>
                        <template v-else>
                          {{ row[col.field] }}
                        </template>
                      </q-td>
                    </q-tr>
                  </template>
                </q-virtual-scroll>

                <div class="q-pt-md text-right">
                  <q-btn
                    class="bg-positive text-white"
                    label="Generate Report"
                    push
                    @click="generateReport"
                  />
                </div>
              </q-card-section>
            </q-card>

            <div v-if="reports.length === 0">
              <div
                v-if="!loading"
                class="text-grey q-pa-md text-center"
                :class="['bold-text', $q.screen.name + '-text']"
              >
                Select a filter or just click search without filter to get all
                the Faculty Load
              </div>
              <q-inner-loading v-if="loading" style="size: 25px">
                <q-spinner-dots size="50px" color="primary"></q-spinner-dots>
              </q-inner-loading>
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
import ExcelJS from "exceljs";

let semesterOption = [];

export default {
  data() {
    return {
      selectedCollege: null,
      colleges: [],
      selectedSemester: null,
      semesters: [],
      reports: null,
      reports: [],
      reportCol: [
        {
          name: "name",
          label: "Professor",
          align: "center",
          field: "name",
          width: "200px",
        },
        {
          name: "subjectDesc",
          label: "Subject",
          align: "center",
          field: "subjectDesc",
          width: "200px",
        },
        {
          name: "semDescription",
          label: "Semester",
          align: "center",
          field: "semDescription",
          width: "200px",
        },
        {
          name: "collegeDescription",
          label: "College / Course",
          align: "center",
          field: "collegeDescription",
          width: "200px",
        },
        {
          name: "section",
          label: "Section",
          align: "center",
          field: "section",
          width: "100px",
        },
        {
          name: "schedule",
          label: "Schedule",
          align: "center",
          field: "schedule",
          width: "100px",
        },
      ],
      loading: false,
      loadingSkeleton: true,
      loadingCounter: null,
      searchText: "",
    };
  },

  computed: {
    ...mapGetters({
      collegeOptions: "facultyModule/getColleges",
      semesterOptions: "facultyModule/getSemesters",
      reportData: "facultyModule/getReports",
    }),

    computedReport() {
      if (Array.isArray(this.reports)) {
        const query = this.searchText.toLowerCase();
        return this.reports.filter((row) => {
          return (
            (row.collegeDescription &&
              row.collegeDescription
                .toString()
                .toLowerCase()
                .includes(query)) ||
            (row.name && row.name.toString().toLowerCase().includes(query)) ||
            (row.semDescription &&
              row.semDescription.toString().toLowerCase().includes(query)) ||
            (row.subjectDesc &&
              row.subjectDesc.toString().toLowerCase().includes(query)) ||
            (row.section &&
              row.section.toString().toLowerCase().includes(query))
          );
        });
      }
    },
  },

  methods: {
    clearSearchText() {
      this.searchText = "";
    },

    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.colleges = this.collegeOptions;
          this.semesters = this.semesterOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.colleges = this.collegeOptions.filter(
          (option) => option.description.toLowerCase().indexOf(needle) > -1,
        );
        this.semesters = this.semesterOptions.filter(
          (option) => option.semDescription.toLowerCase().indexOf(needle) > -1,
        );
      });
    },

    async getColleges() {
      try {
        await helperMethods.delay(500);
        await this.$store.dispatch("facultyModule/getColleges");
        this.colleges = this.collegeOptions;
        this.loadingCounter++;
        if (this.loadingCounter === 2) {
          this.loadingSkeleton = false;
        }
      } catch (error) {
        console.error(error);
      }
    },

    async getSemesters() {
      try {
        await helperMethods.delay(500);
        await this.$store.dispatch("facultyModule/getSemesters");
        this.semesters = this.semesterOptions;
        this.loadingCounter++;
        if (this.loadingCounter === 2) {
          this.loadingSkeleton = false;
        }
      } catch (error) {
        console.error(error);
      }
    },

    async getReports() {
      try {
        const data = {
          college: this.selectedCollege ? this.selectedCollege.college : null,
          collegeDescription: this.selectedCollege
            ? this.selectedCollege.description
            : null,
          semester: this.selectedSemester
            ? this.selectedSemester.semester
            : null,
        };
        this.loading = true;
        await helperMethods.delay(500);
        await this.$store.dispatch("facultyModule/getReports", data);
        this.reports = this.reportData;
        if (this.reports.length === 0) {
          this.$q.notify({
            color: "negative",
            position: "center",
            message:
              "There is no data result, Please find another semester or college",
            icon: "report_problem",
            iconColor: "white",
            timeout: 1500,
            progress: true,
          });
        }
        this.loading = false;
      } catch {
        console.error(error);
      }
    },

    async generateReport() {
      helperMethods.disablePointerEvents();
      const workBook = new ExcelJS.Workbook();
      const workSheet = workBook.addWorksheet("Report Summary");

      workSheet.columns = [
        { header: "Employee ID", key: "employeeid", width: 15 },
        { header: "Name", key: "name", width: 30 },
        { header: "Subject Code", key: "subjectCode", width: 15 },
        { header: "Subject Description", key: "subjectDesc", width: 30 },
        { header: "Section", key: "section", width: 10 },
        { header: "College", key: "college", width: 10 },
        { header: "College Description", key: "collegeDescription", width: 40 },
        { header: "Semester Description", key: "semDescription", width: 30 },
        { header: "Schedule", key: "schedule", width: 20 },
      ];

      workSheet.getRow(1).font = { bold: true };
      workSheet.getRow(1).alignment = { horizontal: "center" };

      for (const report of this.reports) {
        const newRow = workSheet.addRow(report);
        newRow.alignment = { horizontal: "center" };
      }
      const buffer = await workBook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", "Generated_Report.xlsx");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      helperMethods.enablePointerEvents();
    },
  },

  created() {
    this.getColleges();
    this.getSemesters();
  },
};
</script>
