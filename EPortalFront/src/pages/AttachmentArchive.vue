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
          <span style="font-weight: bold">Selected Employee : </span> ({{
            this.latest_selected_employee.employee_id
          }})
          {{ this.latest_selected_employee.employee_full_name }}
        </h5>

        <q-expansion-item
          expand-separator
          icon="newspaper"
          :label="
            'PRC ID (LICENSE) = ' +
            this.latest_selected_employee.attachment_archive.totals.prc_id
          "
        >
          <q-card>
            <q-card-section
              v-for="obj in this.latest_selected_employee.attachment_archive
                .names_and_links.prc_id"
              :key="obj.name"
            >
              <a
                :href="this.backend_url + obj.link"
                target="_blank"
                style="color: #1681ec"
                >{{ obj.name }}</a
              >
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="people"
          :label="
            'BIRTH CERTIFICATE (FOR CHILDREN) = ' +
            this.latest_selected_employee.attachment_archive.totals
              .birth_certificate
          "
        >
          <q-card>
            <q-card-section
              v-for="obj in this.latest_selected_employee.attachment_archive
                .names_and_links.birth_certificate"
              :key="obj.name"
            >
              <a
                :href="this.backend_url + obj.link"
                target="_blank"
                style="color: #1681ec"
                >{{ obj.name }}</a
              >
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="people"
          :label="
            'MARRIAGE CERTIFICATE (FOR SPOUSE) = ' +
            this.latest_selected_employee.attachment_archive.totals
              .marriage_certificate
          "
        >
          <q-card>
            <q-card-section
              v-for="obj in this.latest_selected_employee.attachment_archive
                .names_and_links.marriage_certificate"
              :key="obj.name"
            >
              <a
                :href="this.backend_url + obj.link"
                target="_blank"
                style="color: #1681ec"
                >{{ obj.name }}</a
              >
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="school"
          :label="
            'TOR (EDUCATIONAL BACKGROUND) = ' +
            this.latest_selected_employee.attachment_archive.totals.tor
          "
        >
          <q-card>
            <q-card-section
              v-for="obj in this.latest_selected_employee.attachment_archive
                .names_and_links.tor"
              :key="obj.name"
            >
              <a
                :href="this.backend_url + obj.link"
                target="_blank"
                style="color: #1681ec"
                >{{ obj.name }}</a
              >
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="school"
          :label="
            'DIPLOMA (EDUCATIONAL BACKGROUND) = ' +
            this.latest_selected_employee.attachment_archive.totals.diploma
          "
        >
          <q-card>
            <q-card-section
              v-for="obj in this.latest_selected_employee.attachment_archive
                .names_and_links.diploma"
              :key="obj.name"
            >
              <a
                :href="this.backend_url + obj.link"
                target="_blank"
                style="color: #1681ec"
                >{{ obj.name }}</a
              >
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="event"
          :label="
            'TRAINING/SEMINAR CERTIFICATE (TRAINING/SEMINAR) = ' +
            this.latest_selected_employee.attachment_archive.totals
              .training_or_seminar
          "
          caption=""
        >
          <q-card>
            <q-card-section
              v-for="obj in this.latest_selected_employee.attachment_archive
                .names_and_links.training_or_seminar"
              :key="obj.name"
            >
              <a
                :href="this.backend_url + obj.link"
                target="_blank"
                style="color: #1681ec"
                >{{ obj.name }}</a
              >
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
    </q-card>
  </q-dialog>

  <q-pull-to-refresh @refresh="refresh">
    <div class="q-pa-md">
      <TitleForPage
        :title="'Attachment Archive'"
        :icon="'upload'"
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
        :rows="this.table.rows"
        :columns="this.table.columns"
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
  name: "AttachmentArchive",
  components: {
    TitleForPage,
  },
  mounted: function () {
    $q = useQuasar();
  },
  data() {
    return {
      backend_url: process.env.BACKEND_REST_API_URL,
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
      },
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
        ],
        rows: [],
      },
      latest_selected_employee: {
        employee_id: null,
        employee_full_name: null,
        attachment_archive: null,
      },
    };
  },
  beforeMount: async function () {
    await this.getAllDepartments();
  },
  methods: {
    getAllDepartments: async function () {
      try {
        let response = await this.$store.dispatch(
          "attachment_archives_module/getAllDepartments",
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
          "attachment_archives_module/searchEmployee",
          body,
        );

        this.table.rows = response.data;
        if (this.table.rows.length === 0) {
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
    selectEmployee: async function (employeeID, employeeFullName) {
      try {
        this.latest_selected_employee.employee_id = employeeID;
        this.latest_selected_employee.employee_full_name = employeeFullName;

        let response = await this.$store.dispatch(
          "attachment_archives_module/getEmployeeAttachments",
          employeeID,
        );

        this.latest_selected_employee.attachment_archive = response.data;
        this.$refs.dialog.show();
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      }
    },
  },
});
</script>
