<template>
  <q-dialog
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
    ref="dialog"
    @hide="this.$refs.dialog.hide()"
  >
    <q-card class="q-dialog-plugin">
      <div>
        <q-card-actions align="right">
          <q-btn
            color="negative"
            label="CLOSE"
            type="button"
            @click="this.$refs.dialog.hide()"
          />
        </q-card-actions>
      </div>
      <div>
        <h5 class="text-center">
          <span style="font-weight: bold">EMPLOYEE DEPENDENT: </span> ({{
            this.latest_selected_employee.employee_id
          }})
          {{ this.latest_selected_employee.employee_full_name }}
        </h5>

        <q-card-actions align="right">
          <div class="text-right">
            <p class="q-mb-none">
              <span style="font-weight: bold">Max Annual Benefit: </span>
              {{ this.latest_selected_employee.max_annual_benefit }}
            </p>
            <p class="q-mb-none">
              <span style="font-weight: bold"
                >Total Accumulated Discounts:
              </span>
              {{ this.latest_selected_employee.total_accumulated_discounts }}
            </p>
            <p class="q-mb-none">
              <span style="font-weight: bold">Balance: </span>
              {{ this.latest_selected_employee.balance }}
            </p>
          </div>
        </q-card-actions>

        <div class="q-pa-md">
          <q-table
            separator="cell"
            flat
            bordered
            title=""
            :rows="this.latest_selected_employee.table.rows"
            :columns="this.latest_selected_employee.table.columns"
            row-key="full_name"
            virtual-scroll
            :rows-per-page-options="[0]"
            style="cursor: pointer; height: 350px"
            class="my-sticky-header-table"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="currentStatus" :props="props">
                  {{ props.row.current_status }}
                </q-td>

                <q-td key="approvedBy" :props="props">
                  {{ props.row.approved_by }}
                </q-td>

                <q-td key="dateTimeApproved" :props="props">
                  {{ props.row.date_time_approved }}
                </q-td>

                <q-td key="patientNo" :props="props">
                  {{ props.row.patient_no }}
                </q-td>

                <q-td key="fullName" :props="props">
                  {{ props.row.full_name }}
                </q-td>

                <q-td key="relationship" :props="props">
                  {{ props.row.relationship }}
                </q-td>

                <q-td key="birthDate" :props="props">
                  {{ props.row.birth_date }}
                </q-td>

                <q-td key="age" :props="props">
                  {{ props.row.age }}
                </q-td>

                <q-td key="occupation" :props="props">
                  {{ props.row.occupation }}
                </q-td>

                <q-td key="accumulatedDiscount" :props="props">
                  {{ props.row.accumulated_discount }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-pull-to-refresh @refresh="refresh">
    <div class="q-pa-md">
      <TitleForPage
        :title="'Employee Dependent'"
        :icon="'account_tree'"
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
              class="marginLeftAndRight"
              v-model="options.department_id"
              :options="options.departments"
              label="Department"
              emit-value
              map-options
              option-value="department_id"
              option-label="department_name"
              filter
              lazy-rules
              :rules="[(val) => val !== null || 'This field is required']"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
            <q-input
              class="marginLeftAndRight"
              type="text"
              label="Employee ID"
              maxlength="4"
              v-model="search.employee_id"
            >
            </q-input>
          </div>
          <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
            <q-input
              class="marginLeftAndRight"
              type="text"
              label="Last Name"
              maxlength="30"
              v-model="search.last_name"
            >
            </q-input>
          </div>
          <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
            <q-input
              class="marginLeftAndRight"
              type="text"
              label="First Name"
              maxlength="40"
              v-model="search.first_name"
            >
            </q-input>
          </div>
          <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
            <q-input
              class="marginLeftAndRight"
              type="text"
              label="Middle Name"
              maxlength="30"
              v-model="search.middle_name"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-btn
              style="margin: 20px"
              id="btnSearch"
              color="primary"
              label="SEARCH"
              icon="search"
              type="submit"
            ></q-btn>
          </div>
        </div>
      </q-form>

      <q-table
        separator="cell"
        flat
        bordered
        title=""
        :rows="this.search.table.rows"
        :columns="this.search.table.columns"
        row-key="employee_id"
        virtual-scroll
        :rows-per-page-options="[0]"
        style="cursor: pointer; height: 350px"
        class="my-sticky-header-table"
      >
        <template v-slot:body="props">
          <q-tr
            :props="props"
            @click="
              selectEmployee(
                props.row.employee_id,
                props.row.last_name +
                  ', ' +
                  props.row.first_name +
                  ' ' +
                  props.row.middle_name,
                props.row.max_annual_benefit,
                props.row.total_accumulated_discounts,
              )
            "
          >
            <q-td key="employeeID" :props="props">
              {{ props.row.employee_id }}
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

            <q-td key="employmentStatus" :props="props">
              {{ props.row.employment_status }}
            </q-td>

            <q-td key="resignationDate" :props="props">
              {{ props.row.resignation_date }}
            </q-td>

            <q-td key="benefitClassificationCode" :props="props">
              {{ props.row.benefit_classification_code }}
            </q-td>

            <q-td key="benefitClassificationDescription" :props="props">
              {{ props.row.benefit_classification_description }}
            </q-td>

            <q-td key="maxAnnualBenefit" :props="props">
              {{ props.row.max_annual_benefit }}
            </q-td>

            <q-td key="totalAccumulatedDiscounts" :props="props">
              {{ props.row.total_accumulated_discounts }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-pull-to-refresh>
</template>

<script>
import { defineComponent } from "vue";
import helperMethods from "../helperMethods.js";
import TitleForPage from "../components/TitleForPage.vue";

// -------------------- Notify plugins --------------------
import { useQuasar } from "quasar";
let $q;
// -------------------- Notify plugins --------------------

export default defineComponent({
  name: "EmployeeDependent",
  components: {
    TitleForPage,
  },
  mounted: function () {
    $q = useQuasar();
  },
  data() {
    return {
      options: {
        departments: null,
        department_id: null,
      },
      search: {
        department_id: null,
        employee_id: "",
        last_name: "",
        first_name: "",
        middle_name: "",
        table: {
          columns: [
            {
              name: "employeeID",
              required: true,
              label: "Employee ID",
              align: "left",
              sortable: true,
              field: (row) => row.employee_id,
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
            {
              name: "employmentStatus",
              required: true,
              label: "Employment Status",
              align: "left",
              sortable: true,
              field: (row) => row.employment_status,
            },
            {
              name: "resignationDate",
              required: true,
              label: "Resignation Date",
              align: "left",
              sortable: true,
              field: (row) => row.resignation_date,
            },
            {
              name: "benefitClassificationCode",
              required: true,
              label: "Benefit Classification Code",
              align: "left",
              sortable: true,
              field: (row) => row.benefit_classification_code,
            },
            {
              name: "benefitClassificationDescription",
              required: true,
              label: "Benefit Classification Description",
              align: "left",
              sortable: true,
              field: (row) => row.benefit_classification_description,
            },
            {
              name: "maxAnnualBenefit",
              required: true,
              label: "Max Annual Benefit",
              align: "right",
              sortable: true,
              field: (row) => row.max_annual_benefit,
            },
            {
              name: "totalAccumulatedDiscounts",
              required: true,
              label: "Total Accumulated Discounts",
              align: "right",
              sortable: true,
              field: (row) => row.total_accumulated_discounts,
            },
          ],
          rows: [],
        },
      },
      latest_selected_employee: {
        employee_id: null,
        employee_full_name: null,
        table: {
          columns: [
            {
              name: "currentStatus",
              required: true,
              label: "Current Status",
              align: "left",
              sortable: true,
              field: (row) => row.current_status,
            },
            {
              name: "approvedBy",
              required: true,
              label: "Approved By",
              align: "left",
              sortable: true,
              field: (row) => row.approved_by,
            },
            {
              name: "dateTimeApproved",
              required: true,
              label: "Date Time Approved",
              align: "left",
              sortable: true,
              field: (row) => row.date_time_approved,
            },
            {
              name: "patientNo",
              required: true,
              label: "Patient No",
              align: "left",
              sortable: true,
              field: (row) => row.patient_no,
            },
            {
              name: "fullName",
              required: true,
              label: "Full Name",
              align: "left",
              sortable: true,
              field: (row) => row.full_name,
            },
            {
              name: "relationship",
              required: true,
              label: "Relationship",
              align: "left",
              sortable: true,
              field: (row) => row.relationship,
            },
            {
              name: "birthDate",
              required: true,
              label: "Birth Date",
              align: "left",
              sortable: true,
              field: (row) => row.birth_date,
            },
            {
              name: "age",
              required: true,
              label: "Age",
              align: "left",
              sortable: true,
              field: (row) => row.age,
            },
            {
              name: "occupation",
              required: true,
              label: "Occupation",
              align: "left",
              sortable: true,
              field: (row) => row.occupation,
            },
            {
              name: "accumulatedDiscount",
              required: true,
              label: "Accumulated Discount",
              align: "right",
              sortable: true,
              field: (row) => row.accumulated_discount,
            },
          ],
          rows: [],
        },
        max_annual_benefit: null,
        total_accumulated_discounts: null,
        balance: null,
      },
    };
  },
  beforeMount: async function () {
    await this.getAllDepartments();
  },
  watch: {
    async "options.department_id"() {
      if (this.options.department_id !== "0") await this.onSearch();
      else this.search.table.rows = [];
    },
  },
  methods: {
    getAllDepartments: async function () {
      try {
        let response = await this.$store.dispatch(
          "employee_dependents_module/getAllDepartments",
        );

        this.options.departments = response.data;
        if (this.options.departments && this.options.departments.length > 0) {
          this.options.department_id =
            this.options.departments[0].department_id;
        }
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
        this.search.department_id = this.options.department_id;

        const body = {
          departmentID: this.search.department_id.toString().trim(),
          employeeID: this.search.employee_id,
          lastName: this.search.last_name,
          firstName: this.search.first_name,
          middleName: this.search.middle_name,
        };

        const response = await this.$store.dispatch(
          "employee_dependents_module/getEmployees",
          body,
        );

        this.search.table.rows = response.data;
        if (this.search.table.rows.length === 0) {
          $q.notify({
            type: "positive",
            message: "No records found",
          });
        }
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      } finally {
        document.getElementById("btnSearch").disabled = false;
      }
    },
    selectEmployee: async function (
      employeeID,
      employeeFullName,
      maxAnnualBenefit,
      totalAccumulatedDiscounts,
    ) {
      try {
        this.latest_selected_employee.employee_id = employeeID;
        this.latest_selected_employee.employee_full_name = employeeFullName;

        this.latest_selected_employee.max_annual_benefit = maxAnnualBenefit;
        this.latest_selected_employee.total_accumulated_discounts =
          totalAccumulatedDiscounts;

        this.latest_selected_employee.balance =
          parseFloat(
            this.latest_selected_employee.max_annual_benefit.replace(/,/g, ""),
          ) -
          parseFloat(
            this.latest_selected_employee.total_accumulated_discounts.replace(
              /,/g,
              "",
            ),
          );

        this.latest_selected_employee.balance =
          this.latest_selected_employee.balance
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        let response = await this.$store.dispatch(
          "employee_dependents_module/getEmployeeDependents",
          employeeID,
        );

        this.latest_selected_employee.table.rows = response.data;
        this.$refs.dialog.show();
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      }
    },
  },
});
</script>
