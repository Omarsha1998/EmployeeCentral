<template>
  <q-pull-to-refresh @refresh="refresh">
    <div class="q-pa-md">
      <TitleForPage
        :title="'Accumulated Discounts Summary'"
        :icon="'summarize'"
      ></TitleForPage>

      <q-form
        class="q-gutter-md"
        method="post"
        @submit.prevent="onSearch"
        autocomplete="off"
      >
        <div class="row">
          <div class="col-6 col-md-4" style="margin-right: 20px">
            <q-input
              type="date"
              label="DATE FROM"
              v-model="search.date_from"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'This field is required',
                (val) =>
                  val <= this.search.date_to ||
                  'DATE FROM MUST BE LOWER OR EQUAL TO DATE TO',
              ]"
            >
            </q-input>
          </div>
          <div class="col-6 col-md-4">
            <q-input
              type="date"
              label="DATE TO"
              v-model="search.date_to"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'This field is required',
                (val) =>
                  val >= this.search.date_from ||
                  'DATE TO MUST BE GREATER OR EQUAL TO DATE FROM',
              ]"
            >
            </q-input>
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
          <q-tr :props="props" click="">
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

            <q-td key="year" :props="props">
              {{ props.row.year }}
            </q-td>

            <q-td key="jan" :props="props">
              {{ props.row.jan }}
            </q-td>

            <q-td key="feb" :props="props">
              {{ props.row.feb }}
            </q-td>

            <q-td key="mar" :props="props">
              {{ props.row.mar }}
            </q-td>

            <q-td key="apr" :props="props">
              {{ props.row.apr }}
            </q-td>

            <q-td key="may" :props="props">
              {{ props.row.may }}
            </q-td>

            <q-td key="jun" :props="props">
              {{ props.row.jun }}
            </q-td>

            <q-td key="jul" :props="props">
              {{ props.row.jul }}
            </q-td>

            <q-td key="aug" :props="props">
              {{ props.row.aug }}
            </q-td>

            <q-td key="sep" :props="props">
              {{ props.row.sep }}
            </q-td>

            <q-td key="oct" :props="props">
              {{ props.row.oct }}
            </q-td>

            <q-td key="nov" :props="props">
              {{ props.row.nov }}
            </q-td>

            <q-td key="dec" :props="props">
              {{ props.row.dec }}
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
      search: {
        date_from: this.getDateFrom(),
        date_to: this.getDateTo(),
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
              name: "year",
              required: true,
              label: "Year",
              align: "left",
              sortable: true,
              field: (row) => row.year,
            },
            {
              name: "jan",
              required: true,
              label: "Jan",
              align: "left",
              sortable: true,
              field: (row) => row.jan,
            },
            {
              name: "feb",
              required: true,
              label: "Feb",
              align: "left",
              sortable: true,
              field: (row) => row.feb,
            },
            {
              name: "mar",
              required: true,
              label: "Mar",
              align: "left",
              sortable: true,
              field: (row) => row.mar,
            },
            {
              name: "apr",
              required: true,
              label: "Apr",
              align: "left",
              sortable: true,
              field: (row) => row.apr,
            },
            {
              name: "may",
              required: true,
              label: "May",
              align: "left",
              sortable: true,
              field: (row) => row.may,
            },
            {
              name: "jun",
              required: true,
              label: "Jun",
              align: "left",
              sortable: true,
              field: (row) => row.jun,
            },
            {
              name: "jul",
              required: true,
              label: "Jul",
              align: "left",
              sortable: true,
              field: (row) => row.jul,
            },
            {
              name: "aug",
              required: true,
              label: "Aug",
              align: "left",
              sortable: true,
              field: (row) => row.aug,
            },
            {
              name: "sep",
              required: true,
              label: "Sep",
              align: "left",
              sortable: true,
              field: (row) => row.sep,
            },
            {
              name: "oct",
              required: true,
              label: "Oct",
              align: "left",
              sortable: true,
              field: (row) => row.oct,
            },
            {
              name: "nov",
              required: true,
              label: "Nov",
              align: "left",
              sortable: true,
              field: (row) => row.nov,
            },
            {
              name: "dec",
              required: true,
              label: "Dec",
              align: "left",
              sortable: true,
              field: (row) => row.dec,
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
    };
  },
  methods: {
    getDateFrom: function () {
      return "2025-01-01";
    },
    getDateTo: function () {
      const today = new Date();
      const dateTo = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      return dateTo;
    },
    refresh: function () {
      helperMethods.refreshPage();
    },
    onSearch: async function () {
      try {
        document.getElementById("btnSearch").disabled = true;

        const body = {
          dateFrom: this.search.date_from,
          dateTo: this.search.date_to,
          employeeID: this.search.employee_id,
          lastName: this.search.last_name,
          firstName: this.search.first_name,
          middleName: this.search.middle_name,
        };

        const response = await this.$store.dispatch(
          "accumulated_discounts_summary_module/onSearch",
          body,
        );

        this.search.table.rows = response.data;
        if (this.search.table.rows.length === 0)
          $q.notify({ type: "positive", message: "No records found" });
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      } finally {
        document.getElementById("btnSearch").disabled = false;
      }
    },
  },
});
</script>
