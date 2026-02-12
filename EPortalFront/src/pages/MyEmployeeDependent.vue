<template>
  <q-pull-to-refresh @refresh="refresh">
    <div class="q-pa-md">
      <TitleForPage
        :title="'My Employee Dependent'"
        :icon="'family_restroom'"
      ></TitleForPage>

      <q-card-actions align="left">
        <div class="text-left">
          <p class="q-mb-none">
            <span style="font-weight: bold">Employee Full Name: </span>
            {{ this.employee_full_name }}
          </p>

          <p class="q-mb-none">
            <span style="font-weight: bold">Department: </span>
            {{ this.department_name }}
          </p>

          <p class="q-mb-none">
            <span style="font-weight: bold">Employment Status: </span>
            {{ this.employment_status }}
          </p>

          <p class="q-mb-none">
            <span style="font-weight: bold">Benefit Classification Code: </span>
            {{ this.benefit_classification_code }}
          </p>

          <p class="q-mb-none">
            <span style="font-weight: bold"
              >Benefit Classification Description:
            </span>
            {{ this.benefit_classification_description }}
          </p>

          <p class="q-mb-none">
            <span style="font-weight: bold">Max Annual Benefit: </span>
            {{ this.max_annual_benefit }}
          </p>
          <p class="q-mb-none">
            <span style="font-weight: bold">Total Accumulated Discounts: </span>
            {{ this.total_accumulated_discounts }}
          </p>
          <p class="q-mb-none">
            <span style="font-weight: bold">Balance: </span>
            {{ this.balance }}
          </p>
        </div>
      </q-card-actions>

      <q-table
        separator="cell"
        flat
        bordered
        title=""
        :rows="this.table.rows"
        :columns="this.table.columns"
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
  computed: {
    employeeID() {
      return this.$store.getters["user_module/employee_id"];
    },
  },
  mounted: function () {
    $q = useQuasar();
  },
  data() {
    return {
      employee_full_name: null,
      department_name: null,
      employment_status: null,
      benefit_classification_code: null,
      benefit_classification_description: null,
      max_annual_benefit: null,
      total_accumulated_discounts: null,
      balance: null,
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
    };
  },
  beforeMount: async function () {
    await this.getDetails(this.employeeID);
  },
  methods: {
    refresh: function () {
      helperMethods.refreshPage();
    },
    getDetails: async function (employeeID) {
      try {
        const $q = this.$q;
        $q.loading.show({
          message: "RETRIEVING RECORDS. PLEASE WAIT ...",
        });

        let response = await this.$store.dispatch(
          "my_employee_dependents_module/getDetails",
          employeeID,
        );

        this.employee_full_name = response.data.employee_full_name;
        this.department_name = response.data.department_name;
        this.employment_status = response.data.employment_status;
        this.benefit_classification_code =
          response.data.benefit_classification_code;
        this.benefit_classification_description =
          response.data.benefit_classification_description;
        this.max_annual_benefit = response.data.max_annual_benefit;
        this.total_accumulated_discounts =
          response.data.total_accumulated_discounts;
        this.balance = response.data.balance;
        this.table.rows = response.data.table_rows;

        $q.loading.hide();
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      }
    },
  },
});
</script>