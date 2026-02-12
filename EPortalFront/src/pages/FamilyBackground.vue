<template>
  <!---------------------------------------------------------------- ADD NEW OR EDIT DIALOG ---------------------------------------------------------------->
  <q-dialog
    v-model="dialog.visible"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6 text-blue-10">
          {{ this.dialog.action }} - FAMILY BACKGROUND
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form method="post" @submit.prevent="onSubmit" autocomplete="off">
          <div class="row bg-white">
            <div class="col-lg-6 col-md-12 col-sm-12 col-12">
              <q-input
                class="marginLeftAndRight"
                type="text"
                label="Full Name"
                maxlength="80"
                v-model="dialog.data.full_name"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'This field is required',
                ]"
              >
              </q-input>
            </div>
            <div
              class="col-lg-6 col-md-12 col-sm-12 col-12"
              v-if="this.dialog.action === 'ADD NEW'"
            >
              <q-select
                id="drpRelationship"
                class="marginLeftAndRight"
                v-model="this.dialog.data.relationship"
                :options="this.dialog.options.relationships"
                label="Relationship"
                emit-value
                map-options
                option-value="relationship"
                option-label="relationship"
                filter
                lazy-rules
                :rules="[(val) => !!val || 'This field is required']"
              />
            </div>
            <div
              class="col-lg-6 col-md-12 col-sm-12 col-12"
              v-if="
                this.dialog.action === 'EDIT' &&
                this.dialog.has_uploaded_certificate_before === false &&
                (this.dialog.relationship === 'CHILD' ||
                  this.dialog.relationship === 'SPOUSE')
              "
            >
              <q-file
                id="qFileEdit"
                class="marginLeftAndRight"
                accept=".pdf"
                clearable
                v-model="this.dialog.data.certificate"
                :label="
                  this.dialog.relationship === 'CHILD'
                    ? 'Attach - Birth Certificate'
                    : 'Attach - Marriage Certificate'
                "
                counter
                lazy-rules
                @rejected="this.onRejected"
                :rules="[
                  (val) => (val && val !== null) || 'This field is required',
                ]"
                max-file-size="5242880"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>

                <template v-slot:hint>
                  PDF file is only allowed to upload (5MB maximum file size)
                </template>
              </q-file>
            </div>

            <div
              class="col-lg-6 col-md-12 col-sm-12 col-12"
              v-if="
                this.dialog.has_uploaded_certificate_before === false &&
                this.dialog.action === 'ADD NEW' &&
                (this.dialog.data.relationship === 'CHILD' ||
                  this.dialog.data.relationship === 'SPOUSE')
              "
            >
              <q-file
                id="qFileAddNew"
                class="marginLeftAndRight"
                accept=".pdf"
                clearable
                v-model="this.dialog.data.certificate"
                :label="
                  this.dialog.data.relationship === 'CHILD'
                    ? 'Attach - Birth Certificate'
                    : 'Attach - Marriage Certificate'
                "
                counter
                lazy-rules
                @rejected="this.onRejected"
                :rules="[
                  (val) => (val && val !== null) || 'This field is required',
                ]"
                max-file-size="5242880"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>

                <template v-slot:hint>
                  PDF file is only allowed to upload (5MB maximum file size)
                </template>
              </q-file>
            </div>

            <div class="col-lg-6 col-md-12 col-sm-12 col-12">
              <q-input
                class="marginLeftAndRight"
                type="date"
                label="Birth Date"
                v-model="this.dialog.data.birth_date"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'This field is required',
                ]"
              >
              </q-input>
            </div>

            <div class="col-lg-6 col-md-12 col-sm-12 col-12">
              <q-input
                class="marginLeftAndRight"
                type="text"
                label="Occupation"
                maxlength="100"
                v-model="dialog.data.occupation"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'This field is required',
                ]"
              >
              </q-input>
            </div>

            <div class="col-lg-6 col-md-12 col-sm-12 col-12">
              <q-input
                class="marginLeftAndRight"
                type="text"
                label="School Name or Company Name"
                v-model="dialog.data.school_name_or_company_name"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'This field is required',
                ]"
              >
              </q-input>
            </div>
          </div>

          <br />
          <br />
          <br />

          <div class="footer">
            <div class="column example-row-equal-width">
              <div class="row">
                <div class="col">
                  <q-btn
                    class="full-width"
                    color="blue-10"
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
                    @click="this.hideDialog()"
                  ></q-btn>
                </div>
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
  <!---------------------------------------------------------------- ADD NEW OR EDIT DIALOG ---------------------------------------------------------------->

  <!---------------------------------------------------------------- CONFIRMATION DIALOG ---------------------------------------------------------------->
  <q-dialog
    v-model="confirmation_dialog.visible"
    persistent
    :maximized="false"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-card-section class="text-center">
        <div class="text-h6 text-blue-10">
          Your request has been successfully submitted. Would you like to add
          another?
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="column example-row-equal-width">
          <div class="row">
            <div class="col">
              <q-btn
                class="full-width"
                color="negative"
                label="NO"
                type="button"
                @click="this.$router.push('/my-request')"
              ></q-btn>
            </div>
            <div class="col">
              <q-btn
                class="full-width"
                color="blue-10"
                label="YES"
                type="button"
                @click="this.hideConfirmationDialog()"
              ></q-btn>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <!---------------------------------------------------------------- CONFIRMATION DIALOG ---------------------------------------------------------------->

  <q-pull-to-refresh @refresh="this.refresh()">
    <TitleForPage
      :title="'Family Background'"
      :icon="'favorite'"
    ></TitleForPage>
    <div class="q-pa-md" v-if="this.form.visible === true">
      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-select
            id="drpFilterBy"
            class="marginLeftAndRight"
            v-model="this.form.filter.selected.relationship"
            :options="this.form.filter.options.relationships"
            label="Filter By : "
            emit-value
            map-options
            option-value="relationship"
            option-label="relationship"
            filter
            lazy-rules
            :rules="[(val) => val !== 0 || 'This field is required']"
          />
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 text-right">
          <!-- Added text-right class -->
          <q-btn
            style="margin: 20px"
            id="btnAddNew"
            color="blue-10"
            label="ADD NEW"
            icon="add"
            type="button"
            @click="this.showDialog(0, 'ADD NEW')"
          ></q-btn>
        </div>
      </div>

      <div class="q-gutter-y-md">
        <q-table
          separator="cell"
          flat
          bordered
          title=""
          :rows="this.table.rows"
          :columns="this.table.columns"
          row-key="id"
          :rows-per-page-options="[0]"
          style="cursor: pointer"
        >
          <template v-slot:body="props">
            <q-tr>
              <q-td key="action" :props="props">
                <q-btn
                  color="blue-10"
                  label="EDIT"
                  type="button"
                  @click="this.showDialog(props.row.id, 'EDIT')"
                ></q-btn>
              </q-td>

              <q-td key="fullName" :props="props">
                {{ props.row.full_name }}
              </q-td>

              <q-td key="relationship" :props="props">
                {{ props.row.relationship }}
              </q-td>

              <q-td key="certificate" :props="props">
                <a
                  v-if="props.row.certificate !== ''"
                  :href="this.backend_url + props.row.certificate"
                  target="_blank"
                  style="color: #1681ec"
                >
                  {{
                    props.row.relationship === "SPOUSE"
                      ? "MARRIAGE CERTIFICATE"
                      : "BIRTH CERTIFICATE"
                  }}
                </a>
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

              <q-td key="schoolNameOrCompanyName" :props="props">
                {{ props.row.school_name_or_company_name }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-pull-to-refresh>
</template>

<script>
import { defineComponent } from "vue";

// -------------------- Notify plugins --------------------
import { useQuasar } from "quasar";
let $q;
// -------------------- Notify plugins --------------------

import helperMethods from "../helperMethods.js";
import TitleForPage from "../components/TitleForPage.vue";

export default defineComponent({
  name: "FamilyBackground",
  components: {
    TitleForPage,
  },
  computed: {
    employeeID() {
      return this.$store.getters["user_module/employee_id"];
    },
    familyBackgrounds() {
      return this.$store.getters[
        "family_backgrounds_module/family_backgrounds"
      ];
    },
  },
  data: function () {
    return {
      backend_url: process.env.BACKEND_REST_API_URL,
      form: {
        visible: false,
        filter: {
          selected: {
            relationship: null,
          },
          options: {
            relationships: [],
          },
        },
      },
      dialog: {
        visible: false,
        action: null,
        options: {
          relationships: [],
        },
        has_uploaded_certificate_before: false,
        relationship: null,
        data: {
          family_id: null,
          full_name: null,
          relationship: null,
          certificate: null,
          birth_date: null,
          age: null,
          occupation: null,
          school_name_or_company_name: null,
        },
      },
      confirmation_dialog: {
        visible: false,
      },
      table: {
        columns: [
          {
            name: "action",
            required: false,
            label: "ACTION",
            align: "center",
            sortable: false,
          },
          {
            name: "fullName",
            required: true,
            label: "FULL NAME",
            align: "center",
            sortable: true,
            field: (row) => row.full_name,
          },
          {
            name: "relationship",
            required: true,
            label: "RELATIONSHIP",
            align: "center",
            sortable: true,
            field: (row) => row.relationship,
          },
          {
            name: "certificate",
            required: true,
            label: "CERTIFICATE",
            align: "center",
            sortable: true,
            field: (row) => row.certificate,
          },
          {
            name: "birthDate",
            required: true,
            label: "BIRTH DATE",
            align: "center",
            sortable: true,
            field: (row) => row.birth_date,
          },
          {
            name: "age",
            required: true,
            label: "AGE",
            align: "center",
            sortable: true,
            field: (row) => row.age,
          },
          {
            name: "occupation",
            required: true,
            label: "OCCUPATION",
            align: "center",
            sortable: true,
            field: (row) => row.occupation,
          },
          {
            name: "schoolNameOrCompanyName",
            required: true,
            label: "SCHOOL NAME OR COMPANY NAME",
            align: "center",
            sortable: true,
            field: (row) => row.school_name_or_company_name,
          },
        ],
        rows: [],
        all_rows: [],
      },
    };
  },
  watch: {
    "form.filter.selected.relationship"(newValue, oldValue) {
      if (
        this.form.visible === true &&
        this.form.filter.selected.relationship !== null
      ) {
        this.handleChange();
      }
    },
    "dialog.data.relationship"(newValue, oldValue) {
      if (
        this.form.visible === true &&
        this.dialog.data.relationship !== null &&
        this.dialog.action === "ADD NEW"
      ) {
        this.dialog.data.certificate = null;
      }
    },
  },
  mounted: function () {
    $q = useQuasar();
  },
  created: async function () {
    await this.getData();
  },
  methods: {
    getData: async function () {
      await this.$store.dispatch(
        "family_backgrounds_module/get",
        this.employeeID,
      );

      let family = this.familyBackgrounds;
      family.forEach((element) => {
        element.birth_date = helperMethods.removeTime(element.birth_date);
      });

      this.table.all_rows = family;
      this.table.rows = family;

      const relationships = await this.$store.dispatch(
        "family_backgrounds_module/getRelationships",
      );

      let obj = [];
      relationships.forEach((element) => {
        if (
          element.relationship === "CHILD" ||
          element.relationship === "SIBLING" ||
          this.table.all_rows.filter(
            (row) => row.relationship === element.relationship,
          ).length === 0
        ) {
          if (
            element.relationship === "GRAND MOTHER" ||
            element.relationship === "GRAND FATHER" ||
            element.relationship === "GREAT-GRANDFATHER" ||
            element.relationship === "GREAT-GRANDMOTHER"
          ) {
            const totalRows = this.table.all_rows.filter(
              (row) => row.relationship === element.relationship,
            ).length;
            if (totalRows === 2) return;
          }

          obj.push(element.relationship);
        }
      });

      this.dialog.options.relationships = obj;

      const relationshipCategories = await this.$store.dispatch(
        "family_backgrounds_module/getRelationshipCategories",
      );

      this.form.filter.options.relationships = relationshipCategories;

      this.form.filter.selected.relationship =
        this.form.filter.options.relationships[0];
      this.form.visible = true;
    },
    showDialog: async function (id, action) {
      if (id > 0 && action === "EDIT") {
        let index = this.table.rows.findIndex((x) => x.id === id);
        let obj = this.table.rows[index];
        this.dialog.data.family_id = obj.id;
        this.dialog.data.full_name = obj.full_name;
        this.dialog.data.relationship = obj.relationship;
        this.dialog.relationship = obj.relationship;

        if (obj.certificate === "") {
          this.dialog.has_uploaded_certificate_before = false;
          this.dialog.data.certificate = null;
        } else {
          this.dialog.has_uploaded_certificate_before = true;
        }

        this.dialog.data.birth_date = obj.birth_date;
        this.dialog.data.age = obj.age;
        this.dialog.data.occupation = obj.occupation;
        this.dialog.data.school_name_or_company_name =
          obj.school_name_or_company_name;
      } else {
        this.dialog.has_uploaded_certificate_before = false;
      }

      this.dialog.action = action;
      this.dialog.visible = true;
    },
    onSubmit: async function () {
      try {
        document.getElementById("btnSubmit").disabled = true;
        let requestType = this.dialog.action === "ADD NEW" ? "create" : "edit";
        let obj = {
          family_id: this.dialog.data.family_id,
          request_type: requestType,
          employee_id: this.employeeID,
          family_type: this.dialog.data.relationship,
          full_name: this.dialog.data.full_name,
          birth_date: this.dialog.data.birth_date,
          occupation: this.dialog.data.occupation,
          school_name_or_company_name:
            this.dialog.data.school_name_or_company_name,
        };

        if (
          this.dialog.relationship === "CHILD" ||
          this.dialog.data.relationship === "CHILD"
        ) {
          obj.attach_birth_certificate =
            this.dialog.data.certificate === null
              ? ""
              : this.dialog.data.certificate.name;
        } else if (
          this.dialog.relationship === "SPOUSE" ||
          this.dialog.data.relationship === "SPOUSE"
        ) {
          obj.attach_marriage_certificate =
            this.dialog.data.certificate === null
              ? ""
              : this.dialog.data.certificate.name;
        }

        let response = await this.$store.dispatch(
          "family_backgrounds_module/createRequest",
          obj,
        );

        if (this.dialog.data.certificate !== null) {
          const formData = new FormData();
          formData.append("request_id", response.data);
          formData.append("request_type", "create");

          let attachFile = "";
          if (
            this.dialog.relationship === "CHILD" ||
            this.dialog.data.relationship === "CHILD"
          ) {
            attachFile = "birth_certificate";
            formData.append(
              this.dialog.data.full_name,
              this.dialog.data.certificate,
            );
          } else if (
            this.dialog.relationship === "SPOUSE" ||
            this.dialog.data.relationship === "SPOUSE"
          ) {
            attachFile = "marriage_certificate";
            formData.append(
              "marriage_certificate",
              this.dialog.data.certificate,
            );
          } else {
            throw (
              "Uploading file for the relationship of " +
              this.dialog.relationship +
              " is not allowed."
            );
          }

          formData.append("attach_file", attachFile);
          formData.append("employee_id", this.employeeID);

          await this.$store.dispatch("user_module/upload", formData);
        }

        if (
          this.dialog.data.relationship === "CHILD" ||
          this.dialog.data.relationship === "SIBLING"
        ) {
          this.hideDialog();
          this.showConfirmationDialog();
        } else {
          $q.notify({
            type: "positive",
            message: "Successfully submitted.",
          });
          return this.$router.push("/my-request");
        }
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      } finally {
        document.getElementById("btnSubmit").disabled = false;
      }
    },
    toSentenceCase: function (str) {
      return str.toLowerCase().replace(/^(.)|\s+(.)/g, function ($1) {
        return $1.toUpperCase();
      });
    },
    handleChange: function () {
      let filteredRelationship = this.form.filter.selected.relationship;
      if (filteredRelationship !== "ALL") {
        let filteredRows = null;

        if (filteredRelationship === "PARENTS") {
          filteredRows = this.table.all_rows.filter(
            (row) =>
              row.relationship === "MOTHER" || row.relationship === "FATHER",
          );
        } else if (filteredRelationship === "SIBLINGS") {
          filteredRows = this.table.all_rows.filter(
            (row) => row.relationship === "SIBLING",
          );
        } else if (filteredRelationship === "CHILDREN") {
          filteredRows = this.table.all_rows.filter(
            (row) => row.relationship === "CHILD",
          );
        } else if (filteredRelationship === "GRAND PARENTS") {
          filteredRows = this.table.all_rows.filter(
            (row) =>
              row.relationship === "GRAND MOTHER" ||
              row.relationship === "GRAND FATHER",
          );
        } else if (filteredRelationship === "AUNTS") {
          filteredRows = this.table.all_rows.filter(
            (row) => row.relationship === "AUNT",
          );
        } else if (filteredRelationship === "UNCLES") {
          filteredRows = this.table.all_rows.filter(
            (row) => row.relationship === "UNCLE",
          );
        } else if (filteredRelationship === "FIRST COUSINS") {
          filteredRows = this.table.all_rows.filter(
            (row) => row.relationship === "COUSINS",
          );
        } else if (filteredRelationship === "GREAT-GRAND PARENTS") {
          filteredRows = this.table.all_rows.filter(
            (row) =>
              row.relationship === "GREAT-GRANDFATHER" ||
              row.relationship === "GREAT-GRANDMOTHER",
          );
        } else if (filteredRelationship === "SPOUSE") {
          filteredRows = this.table.all_rows.filter(
            (row) => row.relationship === "SPOUSE",
          );
        } else if (filteredRelationship === "PARENTS IN LAW") {
          filteredRows = this.table.all_rows.filter(
            (row) =>
              row.relationship === "MOTHER-IN-LAW" ||
              row.relationship === "FATHER-IN-LAW",
          );
        }

        this.table.rows = filteredRows;
      } else {
        this.table.rows = this.table.all_rows;
      }
    },
    refresh: function () {
      helperMethods.refreshPage();
    },
    hideDialog: function () {
      this.dialog.visible = false;
      this.dialog.action = null;

      this.dialog.data.family_id = null;
      this.dialog.data.full_name = null;
      this.dialog.data.relationship = null;
      this.dialog.relationship = null;

      this.dialog.has_uploaded_certificate_before = false;
      this.dialog.data.certificate = null;

      this.dialog.data.birth_date = null;
      this.dialog.data.age = null;
      this.dialog.data.occupation = null;
      this.dialog.data.school_name_or_company_name = null;
    },
    showConfirmationDialog: function () {
      this.confirmation_dialog.visible = true;
    },
    hideConfirmationDialog: function () {
      this.confirmation_dialog.visible = false;
      this.showDialog(0, "ADD NEW");
    },
    onRejected: function (rejectedFiles) {
      const errorsMap = {
        accept: "(.pdf) file is only allowed to upload.",
        "max-file-size":
          "The file size exceeded 5MB. Please reduce the file size.",
      };

      rejectedFiles.forEach((rejectedFile) => {
        const errorMessage = errorsMap[rejectedFile.failedPropValidation];

        if (!errorMessage) {
          return;
        }

        if (rejectedFile.failedPropValidation) {
          $q.notify({
            type: "negative",
            message: errorMessage,
          });
        }
      });
    },
  },
});
</script>
