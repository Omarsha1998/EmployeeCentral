<template>
  <!---------------------------------------------------------------- ADD NEW OR EDIT DIALOG ---------------------------------------------------------------->
  <q-dialog
    persistent
    :maximized="false"
    transition-show="slide-up"
    transition-hide="slide-down"
    ref="addNewOrEditDialog"
  >
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6 text-primary text-center">
          {{ this.dialog.add_or_edit.action_name }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form method="post" @submit.prevent="onSubmit" autocomplete="off">
          <div class="row bg-white">
            <div class="col-lg-12 col-md-12 col-sm-12 col-12">
              <q-input
                class="marginLeftAndRight"
                type="text"
                label="Description"
                maxlength="200"
                v-model="dialog.add_or_edit.description"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'This field is required',
                ]"
              >
              </q-input>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12 col-12">
              <q-select
                class="marginLeftAndRight"
                v-model="dialog.add_or_edit.status_id"
                :options="dialog.add_or_edit.options.status"
                label="Status"
                emit-value
                map-options
                option-value="status_id"
                option-label="status_name"
                filter
                style="margin-bottom: 10px"
                lazy-rules
                :rules="[(val) => val !== null || 'This field is required']"
              />
            </div>

            <div
              class="col-lg-12 col-md-12 col-sm-12 col-12"
              v-if="this.dialog.add_or_edit.table_name === 'CollegeMajors'"
            >
              <q-select
                class="marginLeftAndRight"
                v-model="dialog.add_or_edit.course_id"
                :options="dialog.add_or_edit.options.courses"
                label="Course"
                emit-value
                map-options
                option-value="course_id"
                option-label="course_name"
                filter
                style="margin-bottom: 10px"
                lazy-rules
                :rules="[(val) => val !== null || 'This field is required']"
              />
            </div>
          </div>

          <br />
          <br />
          <br />

          <div class="column example-row-equal-width">
            <div class="row">
              <div class="col">
                <q-btn
                  class="full-width"
                  color="primary"
                  label="SUBMIT"
                  type="submit"
                  id="btnSubmit"
                ></q-btn>
              </div>
              <div class="col">
                <q-btn
                  class="full-width"
                  color="negative"
                  label="CANCEL"
                  type="button"
                  @click="this.hideAddNewOrEditDialog()"
                ></q-btn>
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
  <!---------------------------------------------------------------- ADD NEW OR EDIT DIALOG ---------------------------------------------------------------->

  <!---------------------------------------------------------------- FIELD LIST DIALOG ---------------------------------------------------------------->
  <q-dialog
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
    ref="fieldListDialog"
  >
    <q-card class="q-dialog-plugin">
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="BACK"
          @click="this.hideFieldListDialog()"
        />
      </q-card-actions>

      <q-card-section>
        <div class="text-h6 text-primary text-center">
          FIELD NAME - {{ this.dialog.titles.list.field_name }}
        </div>
      </q-card-section>

      <q-form method="post" @submit.prevent="this.getList()" autocomplete="off">
        <div class="row items-center marginLeftAndRight">
          <div class="col-md-3 col-xs-12">
            <q-input
              class="marginLeftAndRight"
              type="text"
              label="Description"
              maxlength="100"
              v-model="this.dialog.filter.search.description"
            >
            </q-input>
          </div>

          <div class="col-md-3 col-xs-12">
            <div class="q-show-xs q-hide-sm q-hide-md q-hide-lg q-hide-xl">
              <br />
            </div>

            <q-btn
              id="btnSearch"
              color="primary"
              label="SEARCH"
              icon="search"
              type="submit"
            ></q-btn>
          </div>
          <div class="col-md-3 col-xs-12">
            <div class="q-show-xs q-hide-sm q-hide-md q-hide-lg q-hide-xl">
              <br />
            </div>

            <q-select
              id="drpStatus"
              v-model="dialog.filter.search.status_id"
              :options="dialog.filter.options.status"
              label="Status"
              emit-value
              map-options
              option-value="status_id"
              option-label="status_name"
              filter
              style="margin-bottom: 10px"
            />
          </div>

          <div class="col-md-3 text-right col-xs-12">
            <div class="q-show-xs q-hide-sm q-hide-md q-hide-lg q-hide-xl">
              <br />
            </div>

            <q-btn
              color="positive"
              label="ADD NEW"
              icon="add"
              type="button"
              @click="
                this.showAddNewOrEditDialog(
                  'ADD NEW',
                  this.dialog.titles.list.field_name,
                  ''
                )
              "
            ></q-btn>
          </div>
        </div>
      </q-form>

      <q-card-section>
        <div class="text-h6 text-center">
          TOTAL ROWS : {{ this.dialog.tables.list.rows.length }}
        </div>
      </q-card-section>

      <div class="q-card__section q-card__section--vert q-dialog__message">
        <q-table
          separator="cell"
          flat
          bordered
          title=""
          :rows="this.dialog.tables.list.rows"
          :columns="this.dialog.tables.list.columns"
          row-key="id"
          :rows-per-page-options="[0]"
          style="cursor: pointer"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="action" :props="props">
                <q-btn
                  color="primary"
                  label="EDIT"
                  icon="edit"
                  type="button"
                  @click="
                    this.showAddNewOrEditDialog(
                      'EDIT',
                      this.dialog.titles.list.field_name,
                      props.row
                    )
                  "
                ></q-btn>
              </q-td>
              <q-td key="course" :props="props">
                {{ props.row.course }}
              </q-td>
              <q-td key="description" :props="props">
                {{ props.row.description }}
              </q-td>
              <q-td key="status" :props="props">
                {{ props.row.status }}
              </q-td>
              <q-td key="createdBy" :props="props">
                {{ props.row.created_by }}
              </q-td>
              <q-td key="dateTimeCreated" :props="props">
                {{ props.row.date_time_created }}
              </q-td>
              <q-td key="updatedBy" :props="props">
                {{ props.row.updated_by }}
              </q-td>
              <q-td key="dateTimeUpdated" :props="props">
                {{ props.row.date_time_updated }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-card>
  </q-dialog>
  <!---------------------------------------------------------------- FIELD LIST DIALOG ---------------------------------------------------------------->

  <!---------------------------------------------------------------- FIELDS DIALOG ---------------------------------------------------------------->
  <q-dialog
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
    ref="fieldsDialog"
  >
    <q-card class="q-dialog-plugin">
      <q-card-actions align="right">
        <q-btn
          color="negative"
          label="CLOSE"
          @click="this.hideFieldsDialog()"
        />
      </q-card-actions>

      <q-card-section>
        <div class="text-h6 text-primary">
          MODULE NAME - {{ this.dialog.titles.fields.module_name }}
        </div>
      </q-card-section>

      <div class="q-card__section q-card__section--vert q-dialog__message">
        <q-table
          separator="cell"
          flat
          bordered
          title=""
          :rows="this.dialog.tables.fields.rows"
          :columns="this.dialog.tables.fields.columns"
          row-key="field_id"
          :rows-per-page-options="[0]"
          style="cursor: pointer"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="action" :props="props">
                <q-btn
                  color="primary"
                  label="EDIT"
                  icon="edit"
                  type="button"
                  @click="this.showFieldListDialog(props.row.field_name)"
                ></q-btn>
              </q-td>
              <q-td key="fieldName" :props="props">
                {{ props.row.field_name }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-card>
  </q-dialog>
  <!---------------------------------------------------------------- FIELDS DIALOG ---------------------------------------------------------------->

  <q-pull-to-refresh @refresh="this.refresh()">
    <div class="q-pa-md">
      <TitleForPage :title="'Maintenance'" :icon="'settings'"></TitleForPage>

      <q-table
        separator="cell"
        flat
        bordered
        title=""
        :rows="this.form.table.modules.rows"
        :columns="this.form.table.modules.columns"
        row-key="module_id"
        virtual-scroll
        :rows-per-page-options="[0]"
        style="cursor: pointer; height: 350px"
        class="my-sticky-header-table"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="action" :props="props">
              <q-btn
                color="primary"
                label="EDIT"
                icon="edit"
                type="button"
                @click="
                  this.showFieldsDialog(
                    props.row.module_id,
                    props.row.module_name
                  )
                "
              ></q-btn>
            </q-td>
            <q-td key="moduleName" :props="props">
              {{ props.row.module_name }}
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
  name: "Maintenance",
  components: {
    TitleForPage,
  },
  computed: {
    maintenances() {
      return this.$store.getters["maintenance_module/maintenances"];
    },
    employeeID() {
      return this.$store.getters["user_module/employee_id"];
    },
  },
  data: function () {
    return {
      form: {
        visible: false,
        table: {
          modules: {
            columns: [
              {
                name: "action",
                required: true,
                label: "Action",
                align: "left",
                sortable: true,
              },
              {
                name: "moduleName",
                required: true,
                label: "Module Name",
                align: "left",
                sortable: true,
                field: (row) => row.module_name,
              },
            ],
            rows: [],
          },
        },
      },
      dialog: {
        tables: {
          fields: {
            columns: [
              {
                name: "action",
                required: true,
                label: "Action",
                align: "left",
                sortable: true,
              },
              {
                name: "fieldName",
                required: true,
                label: "Field Name",
                align: "left",
                sortable: true,
                field: (row) => row.field_name,
              },
            ],
            rows: [],
          },
          list: {
            columns: [
              {
                name: "action",
                required: true,
                label: "Action",
                align: "left",
                sortable: true,
              },
              {
                name: "description",
                required: true,
                label: "Description",
                align: "left",
                sortable: true,
                field: (row) => row.description,
              },
              {
                name: "status",
                required: true,
                label: "Status",
                align: "left",
                sortable: true,
                field: (row) => row.status,
              },
              {
                name: "createdBy",
                required: true,
                label: "Created By",
                align: "left",
                sortable: true,
                field: (row) => row.created_by,
              },
              {
                name: "dateTimeCreated",
                required: true,
                label: "Date Time Created",
                align: "left",
                sortable: true,
                field: (row) => row.date_time_created,
              },
              {
                name: "updatedBy",
                required: true,
                label: "Updated By",
                align: "left",
                sortable: true,
                field: (row) => row.updated_by,
              },
              {
                name: "dateTimeUpdated",
                required: true,
                label: "Date Time Updated",
                align: "left",
                sortable: true,
                field: (row) => row.date_time_updated,
              },
            ],
            rows: [],
          },
        },
        titles: {
          fields: {
            module_name: null,
          },
          list: {
            field_name: null,
          },
        },
        filter: {
          options: {
            status: [
              {
                status_id: 0,
                status_name: "Any",
              },
              {
                status_id: 1,
                status_name: "Active",
              },
              {
                status_id: 2,
                status_name: "Inactive",
              },
            ],
          },
          search: {
            description: null,
            status_id: null,
          },
        },
        add_or_edit: {
          action_name: null,
          table_name: null,
          options: {
            status: [
              {
                status_id: 1,
                status_name: "Active",
              },
              {
                status_id: 2,
                status_name: "Inactive",
              },
            ],
            courses: [],
          },
          id: null,
          description: null,
          status_id: null,
          course_id: null,
        },
      },
    };
  },
  watch: {
    async "dialog.filter.search.status_id"() {
      await this.getList();
    },
  },
  mounted: function () {
    $q = useQuasar();
  },
  created: async function () {
    await this.getAllModules();
  },
  methods: {
    refresh: function () {
      helperMethods.refreshPage();
    },
    showFieldsDialog: async function (moduleID, moduleName) {
      this.dialog.titles.fields.module_name = moduleName;
      let response = await this.$store.dispatch(
        "maintenance_module/getAllFields",
        moduleID
      );
      this.dialog.tables.fields.rows = response.data;
      this.$refs.fieldsDialog.show();
    },
    getAllModules: async function () {
      await this.$store.dispatch("maintenance_module/getAllModules");

      this.form.table.modules.rows = this.maintenances;

      this.form.visible = true;
    },
    hideFieldsDialog: function () {
      this.$refs.fieldsDialog.hide();
    },
    showFieldListDialog: async function (fieldName) {
      this.$refs.fieldsDialog.hide();
      this.dialog.filter.search.status_id = 1;
      this.dialog.filter.search.description = "";
      this.dialog.titles.list.field_name = fieldName;

      if (fieldName === "MAJORS") {
        const courseObject = {
          name: "course",
          required: true,
          label: "Course",
          align: "left",
          sortable: true,
          field: (row) => row.course,
        };

        this.dialog.tables.list.columns.splice(1, 0, courseObject);
      } else {
        this.dialog.tables.list.columns =
          this.dialog.tables.list.columns.filter(
            (column) => column.name !== "course"
          );
      }

      await this.getList();

      this.$refs.fieldListDialog.show();
    },
    getList: async function () {
      let response = await this.$store.dispatch("maintenance_module/getList", {
        fieldName: this.dialog.titles.list.field_name,
        statusID: this.dialog.filter.search.status_id,
        description: this.dialog.filter.search.description,
      });

      response.data.forEach((obj) => {
        obj.date_time_created = this.convertToReadableFormatDateTime(
          obj.date_time_created
        );
        if (obj.date_time_updated !== null) {
          obj.date_time_updated = this.convertToReadableFormatDateTime(
            obj.date_time_updated
          );
        }
      });

      this.dialog.tables.list.rows = response.data;
    },
    hideFieldListDialog: function () {
      this.$refs.fieldListDialog.hide();
      this.$refs.fieldsDialog.show();
    },
    showAddNewOrEditDialog: async function (actionName, fieldName, row) {
      this.dialog.add_or_edit.action_name = actionName;
      this.dialog.add_or_edit.table_name = helperMethods
        .toCapitalizedCase("College " + fieldName)
        .replace(" ", "");

      if (fieldName === "MAJORS") {
        const response = await this.$store.dispatch(
          "maintenance_module/getCourses"
        );

        this.dialog.add_or_edit.options.courses = response.data;
      }

      if (row !== "") {
        this.dialog.add_or_edit.id = row.id;
        this.dialog.add_or_edit.description = row.description;
        this.dialog.add_or_edit.status_id = this.getStatusID(row.status);
        this.dialog.add_or_edit.course_id = row.course_id;
      } else {
        this.dialog.add_or_edit.id = null;
        this.dialog.add_or_edit.description = null;
        this.dialog.add_or_edit.status_id = null;
        this.dialog.add_or_edit.course_id = null;
      }

      this.$refs.addNewOrEditDialog.show();
    },
    getStatusID: function (statusName) {
      return statusName === "Active" ? 1 : 2;
    },
    hideAddNewOrEditDialog: function () {
      this.$refs.addNewOrEditDialog.hide();
    },
    convertToReadableFormatDateTime: function (value) {
      return helperMethods.convertToReadableFormatDateTime(value);
    },
    onSubmit: async function () {
      try {
        const isActive = this.dialog.add_or_edit.status_id === 1 ? true : false;

        let body = {
          action_name: this.dialog.add_or_edit.action_name.trim(),
          table_name: this.dialog.add_or_edit.table_name.trim(),
          id: this.dialog.add_or_edit.id,
          description: this.dialog.add_or_edit.description.trim(),
          is_active: isActive,
          employee_id: this.employeeID,
          course_id: this.dialog.add_or_edit.course_id,
        };

        await this.$store.dispatch("maintenance_module/submit", body);

        this.hideAddNewOrEditDialog();

        $q.notify({
          type: "positive",
          message: "Sucessfully submitted.",
        });

        await this.getList();
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      }
    },
  },
});
</script>
