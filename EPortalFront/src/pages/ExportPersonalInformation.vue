<template>
  <q-pull-to-refresh @refresh="refresh">
    <div class="q-pa-md">
      <TitleForPage
        :title="'Export Personal Information'"
        :icon="'download'"
      ></TitleForPage>

      <q-form
        class="q-gutter-md"
        method="post"
        @submit.prevent="onSearch"
        autocomplete="off"
      >
        <div class="row">
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <q-select
              id="drpDepartment"
              class="marginLeftAndRight"
              v-model="search.department_code"
              :options="options.department"
              label="Department"
              emit-value
              map-options
              option-value="department_code"
              option-label="department_name"
              filter
            />
          </div>
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <q-select
              id="drpPosition"
              class="marginLeftAndRight"
              v-model="search.position_code"
              :options="options.position"
              label="Position"
              emit-value
              map-options
              option-value="position_code"
              option-label="position_name"
              filter
            />
          </div>
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <q-select
              id="drpClass"
              class="marginLeftAndRight"
              v-model="search.class_code"
              :options="options.class"
              label="Class"
              emit-value
              map-options
              option-value="class_code"
              option-label="class_name"
              filter
            />
          </div>
        </div>

        <div class="row">
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <q-select
              id="drpStatus"
              class="marginLeftAndRight"
              v-model="search.status_code"
              :options="options.status"
              label="Status"
              emit-value
              map-options
              option-value="status_code"
              option-label="status_name"
              filter
            />
          </div>
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <q-select
              id="drpGender"
              class="marginLeftAndRight"
              v-model="search.gender_code"
              :options="options.gender"
              label="Gender"
              emit-value
              map-options
              option-value="gender_code"
              option-label="gender_name"
              filter
            />
          </div>
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <q-select
              id="drpActive"
              class="marginLeftAndRight"
              v-model="search.active_code"
              :options="options.active"
              label="Active"
              emit-value
              map-options
              option-value="active_code"
              option-label="active_name"
              filter
            />
          </div>
        </div>

        <div class="row">
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <q-input
              id="txtLastName"
              class="marginLeftAndRight"
              type="text"
              label="Last Name"
              maxlength="100"
              v-model="search.last_name"
            >
            </q-input>
          </div>

          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <q-input
              id="txtFirstName"
              class="marginLeftAndRight"
              type="text"
              label="First Name"
              maxlength="100"
              v-model="search.first_name"
            >
            </q-input>
          </div>

          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <q-input
              id="txtMiddleName"
              class="marginLeftAndRight"
              type="text"
              label="Middle Name"
              maxlength="100"
              v-model="search.middle_name"
            >
            </q-input>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <q-select
              id="drpGroup"
              class="marginLeftAndRight"
              v-model="search.group_name"
              :options="options.group"
              label="Group"
              emit-value
              map-options
              option-value="group_name"
              option-label="group_name"
              filter
            />
          </div>

          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <q-input
              id="txtEmployeeCode"
              class="marginLeftAndRight"
              type="text"
              label="Employee Code"
              maxlength="100"
              v-model="search.employee_code"
            >
            </q-input>
          </div>

          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <q-select
              id="drpWithLicense"
              class="marginLeftAndRight"
              v-model="search.with_license_code"
              :options="options.with_license"
              label="With License"
              emit-value
              map-options
              option-value="with_license_code"
              option-label="with_license_name"
              filter
            />
          </div>
        </div>

        <div class="row">
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <q-select
              id="drpEducationalAttainment"
              class="marginLeftAndRight"
              v-model="search.educational_attainment"
              :options="options.educational_attainment"
              label="Educational Attainment"
              emit-value
              map-options
              option-value="education_name"
              option-label="education_name"
              filter
            />
          </div>
        </div>

        <div class="q-gutter-y-md">
          <div class="row">
            <q-btn
              style="margin: 10px"
              id="btnSearch"
              color="primary"
              label="SEARCH"
              icon="search"
              type="submit"
            ></q-btn>
            <q-btn
              style="margin: 10px"
              v-if="this.table.selected.length > 0"
              color="positive"
              label="EXPORT TO EXCEL"
              icon="download"
              type="button"
              @click="this.exportToExcel()"
            ></q-btn>
          </div>
        </div>
      </q-form>

      <div class="q-show-xs q-hide-sm q-hide-md q-hide-lg q-hide-xl">
        <br />
      </div>

      <q-table
        separator="cell"
        flat
        bordered
        title=""
        selection="multiple"
        v-model:selected="this.table.selected"
        :rows="this.table.rows"
        :columns="this.table.columns"
        row-key="employee_code"
        virtual-scroll
        :rows-per-page-options="[0]"
        style="cursor: pointer"
        class="my-sticky-header-table"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td class="text-center bg-white">
              <q-checkbox dense v-model="props.selected" />
            </q-td>

            <q-td key="employeeCode" :props="props">
              {{ props.row.employee_code }}
            </q-td>

            <q-td key="lastName" :props="props">
              {{ props.row.last_name }}
            </q-td>

            <q-td key="firstName" :props="props">
              {{ props.row.first_name }}
            </q-td>

            <q-td key="middleName" :props="props">
              {{ props.row.middle_name }}
            </q-td>

            <q-td key="department" :props="props">
              {{ props.row.department }}
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <!-- {{ this.table.selected }} -->
    </div>
  </q-pull-to-refresh>
</template>

<script>
import * as exceljs from "exceljs";

import { defineComponent } from "vue";
import helperMethods from "../helperMethods.js";
import TitleForPage from "../components/TitleForPage.vue";

// -------------------- Notify plugins --------------------
import { useQuasar } from "quasar";
let $q;
// -------------------- Notify plugins --------------------

export default defineComponent({
  name: "ExportPersonalInformation",
  components: {
    TitleForPage,
  },
  mounted: function () {
    $q = useQuasar();
  },
  data() {
    return {
      options: {
        department: null,
        position: null,
        class: null,
        status: null,
        gender: null,
        active: null,
        group: null,
        with_license: null,
        educational_attainment: null,
      },
      search: {
        department_code: null,
        position_code: null,
        class_code: null,
        status_code: null,
        gender_code: null,
        active_code: null,
        last_name: null,
        first_name: null,
        middle_name: null,
        group_name: null,
        employee_code: null,
        with_license_code: null,
        educational_attainment: null,
      },
      table: {
        columns: [
          {
            name: "employeeCode",
            required: true,
            label: "Employee Code",
            align: "left",
            sortable: true,
            field: (row) => row.employee_code,
          },
          {
            name: "lastName",
            required: true,
            label: "Last Name",
            align: "left",
            sortable: true,
            field: (row) => row.last_name,
          },
          {
            name: "firstName",
            required: true,
            label: "First Name",
            align: "left",
            sortable: true,
            field: (row) => row.first_name,
          },
          {
            name: "middleName",
            required: true,
            label: "Middle Name",
            align: "left",
            sortable: true,
            field: (row) => row.middle_name,
          },
          {
            name: "department",
            required: true,
            label: "Department",
            align: "left",
            sortable: true,
            field: (row) => row.department,
          },
        ],
        rows: [],
        selected: [],
      },
      latest_selected_employee: {
        employee_id: null,
        employee_full_name: null,
        attachment_archive: null,
      },
    };
  },
  beforeMount: async function () {
    await this.getAllOptions();
  },
  methods: {
    getAllOptions: async function () {
      try {
        let response = await this.$store.dispatch(
          "export_personal_informations_module/getAllOptions",
        );

        this.options.department = response.data.department;
        this.options.position = response.data.position;
        this.options.class = response.data.class;
        this.options.status = response.data.status;
        this.options.gender = response.data.gender;
        this.options.active = response.data.active;
        this.options.group = response.data.group;
        this.options.with_license = response.data.with_license;
        this.options.educational_attainment =
          response.data.educational_attainment;

        this.search.department_code =
          this.options.department[0].department_code;
        this.search.position_code = this.options.position[0].position_code;
        this.search.class_code = this.options.class[0].class_code;
        this.search.status_code = this.options.status[0].status_code;
        this.search.gender_code = this.options.gender[0].gender_code;
        this.search.active_code = this.options.active[1].active_code;
        this.search.group_name = this.options.group[0].group_name;
        this.search.with_license_code =
          this.options.with_license[0].with_license_code;
        this.search.educational_attainment =
          this.options.educational_attainment[0].education_name;
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      }
    },
    refresh: function () {
      helperMethods.refreshPage();
    },
    onSearch: async function () {
      try {
        document.getElementById("btnSearch").disabled = true;

        const $q = this.$q;
        $q.loading.show({
          message: "RETRIEVING RECORDS. PLEASE WAIT ...",
        });

        let body = {
          department_code: this.search.department_code,
          position_code: this.search.position_code,
          class_code: this.search.class_code,
          status_code: this.search.status_code,
          gender_code: this.search.gender_code,
          active_code: this.search.active_code,
          last_name:
            this.search.last_name === null ? "" : this.search.last_name,
          first_name:
            this.search.first_name === null ? "" : this.search.first_name,
          middle_name:
            this.search.middle_name === null ? "" : this.search.middle_name,
          group_name:
            this.search.group_name === "Any" ? "" : this.search.group_name,
          employee_code:
            this.search.employee_code === null ? "" : this.search.employee_code,
          with_license_code: this.search.with_license_code,
          educational_attainment:
            this.search.educational_attainment === "Any"
              ? ""
              : this.search.educational_attainment,
        };

        let response = await this.$store.dispatch(
          "export_personal_informations_module/searchEmployee",
          body,
        );

        this.table.rows = response.data;
        this.table.selected = [];

        $q.loading.hide();

        if (this.table.rows.length === 0) {
          $q.notify({
            type: "positive",
            message: "No records found",
          });
        }
      } catch (error) {
        $q.loading.hide();
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      } finally {
        document.getElementById("btnSearch").disabled = false;
      }
    },
    readResponseAsArrayBuffer: async function (response) {
      const reader = response.body.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      return new Uint8Array(
        chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), []),
      ).buffer;
    },
    exportToExcel: async function () {
      try {
        const $q = this.$q;

        $q.loading.show({
          message: "EXPORTING TO EXCEL FILE. PLEASE WAIT ...",
        });

        let employeeCodes = [];

        this.table.selected.forEach((item) => {
          let employeeCode = item.employee_code;
          employeeCodes.push(employeeCode);
        });

        let body = {
          employee_ids: employeeCodes,
          with_license_code: this.search.with_license_code,
        };

        let response = await this.$store.dispatch(
          "export_personal_informations_module/exportToExcel",
          body,
        );

        const data = response.data;

        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("Personal Information"); // Sheet name

        let markedDuplicates = new Set(); // Set to store marked duplicate employee codes
        let employeeCodesMap = new Map(); // Map to track occurrence of each employee code

        data.forEach((item) => {
          let employeeCode = item["Employee Code"]; // Accessing the correct column name
          let count = employeeCodesMap.get(employeeCode) || 0;
          employeeCodesMap.set(employeeCode, count + 1);
          if (count > 0) {
            markedDuplicates.add(employeeCode); // Add duplicate employee code to Set
          }
        });

        // Get the header row from data
        const headerRow = Object.keys(data[0]); // Assuming all rows have the same keys

        // Write headers
        worksheet.addRow(headerRow);

        // Loop through each row of data
        data.forEach((row, rowIndex) => {
          const rowData = []; // Array to store data for each row
          // Loop through each column of data and add to rowData array
          Object.keys(row).forEach((key) => {
            rowData.push(row[key]);
          });
          // Write data row
          worksheet.addRow(rowData);

          // Set background color for duplicate rows (yellow)
          if (markedDuplicates.has(row["Employee Code"])) {
            worksheet.getRow(rowIndex + 2).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFF00" },
            };
          }
        });

        // Download the workbook
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Personal-Information.xlsx";
        link.click();

        URL.revokeObjectURL(link.href);
        $q.loading.hide();
      } catch (error) {
        $q.loading.hide();
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      }
    },
  },
});
</script>
