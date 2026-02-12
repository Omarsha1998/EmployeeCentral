<template>
  <q-pull-to-refresh @refresh="this.refresh()">
    <TitleForPage :title="'Training / Seminar'" :icon="'event'"></TitleForPage>

    <div class="q-pa-md" v-if="formIsvisible === true">
      <div class="q-gutter-y-md">
        <div class="row justify-center" style="margin-bottom: 20px">
          <q-btn
            color="positive"
            label="CREATE"
            icon="add"
            type="button"
            @click="this.showDialogCreate()"
          ></q-btn>
        </div>

        <h5 class="text-center" v-if="trainingsOrSeminars.length === 0">
          No Records found
        </h5>

        <div v-if="trainingsOrSeminars.length > 0">
          <q-item-label
            class="text-center"
            style="margin-bottom: 15px; font-weight: bold"
            >TOTAL RECORDS : ({{ trainingsOrSeminars.length }})</q-item-label
          >
          <div
            class="borderStyle"
            v-for="trainingOrSeminar in trainingsOrSeminars"
            :key="trainingOrSeminar.training_or_seminar_name"
          >
            <div v-for="(value, property) in trainingOrSeminar" :key="property">
              <div class="row marginTopBottom20px" v-if="value !== ''">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                  <q-item-label class="cardStyle">
                    <span style="font-weight: bold">
                      {{ property.replaceAll("_", " ").toUpperCase() }}
                      :
                    </span>
                  </q-item-label>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                  <q-item-label class="cardStyle">
                    <span
                      v-if="
                        value !== '' &&
                        property === 'attached_training_or_seminar_certificate'
                      "
                    >
                      <a
                        :href="this.backend_url + value"
                        target="_blank"
                        style="color: #1681ec"
                        >CLICK HERE</a
                      >
                    </span>
                    <span
                      v-else-if="
                        value !== '' &&
                        (property === 'from_date' || property === 'to_date')
                      "
                    >
                      {{ formatted(value) }}
                    </span>
                    <span v-else>
                      {{ value }}
                    </span>
                  </q-item-label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!---------------------------------------------------------------------- CREATE ---------------------------------------------------------------------->
    <q-dialog
      v-model="dialogCreate"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6 text-primary">CREATE</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form
            id="frmCreate"
            method="post"
            @submit="this.onSubmit(this.submit.create)"
            autocomplete="off"
          >
            <div class="row bg-white">
              <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                <q-input
                  class="marginLeftAndRight"
                  type="text"
                  label="Training or Seminar Name"
                  maxlength="70"
                  v-model="this.submit.create.training_or_seminar_name"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                    (val) =>
                      /^[a-zA-Z0-9 ]*$/.test(val) ||
                      'No special characters allowed',
                  ]"
                >
                </q-input>
                <q-input
                  class="marginLeftAndRight"
                  type="text"
                  label="Training Provider"
                  maxlength="100"
                  v-model="this.submit.create.training_provider"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>

                <q-input
                  class="marginLeftAndRight"
                  type="date"
                  label="From Date"
                  v-model="this.submit.create.from_date"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>

                <q-input
                  class="marginLeftAndRight"
                  type="date"
                  label="To Date"
                  v-model="this.submit.create.to_date"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>

                <q-input
                  class="marginLeftAndRight"
                  type="text"
                  label="Venue"
                  maxlength="150"
                  v-model="this.submit.create.venue"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>
                <q-file
                  accept=".pdf"
                  clearable
                  v-model="
                    this.submit.create.attach_training_or_seminar_certificate
                  "
                  label="Attach - Training or Seminar Certificate"
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
                    PDF file is only allowed to upload PDF file is only allowed
                    to upload (5MB maximum file size)
                  </template>
                </q-file>
              </div>
            </div>
            <br />

            <div class="row" style="margin-bottom: 14px">
              <q-btn
                class="full-width"
                color="primary"
                label="SUBMIT"
                type="submit"
                id="btnSubmit"
              ></q-btn>
            </div>
            <div class="row">
              <q-btn
                class="full-width"
                color="negative"
                label="CANCEL"
                type="button"
                @click="this.hideDialogCreate()"
              ></q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!---------------------------------------------------------------------- CREATE ---------------------------------------------------------------------->
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
  name: "TrainingOrSeminar",
  components: {
    TitleForPage,
  },
  computed: {
    employeeID() {
      return this.$store.getters["user_module/employee_id"];
    },
    trainingsOrSeminars() {
      return this.$store.getters[
        "trainings_or_seminars_module/trainings_or_seminars"
      ];
    },
  },
  data: function () {
    return {
      backend_url: process.env.BACKEND_REST_API_URL,
      formIsvisible: false,
      dialogCreate: false,
      submit: {
        create: {
          request_type: "create",
          employee_id: this.employeeID,
          training_or_seminar_name: null,
          training_provider: null,
          from_date: null,
          to_date: null,
          venue: null,
          attach_training_or_seminar_certificate: null,
        },
      },
    };
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
        "trainings_or_seminars_module/get",
        this.employeeID,
      );
      this.formIsvisible = true;
    },
    formatted: function (columnValue) {
      return helperMethods.convertToReadableFormatDate(
        helperMethods.correctDate(columnValue),
      );
    },
    refresh: function () {
      helperMethods.refreshPage();
    },
    showDialogCreate: function () {
      this.dialogCreate = true;
    },
    hideDialogCreate: function () {
      this.dialogCreate = false;
      this.submit.create.training_or_seminar_name = null;
      this.submit.create.training_provider = null;
      this.submit.create.from_date = null;
      this.submit.create.to_date = null;
      this.submit.create.venue = null;
      this.submit.create.attach_training_or_seminar_certificate = null;
    },
    onSubmit: async function (data) {
      try {
        document.getElementById("btnSubmit").disabled = true;

        const obj = {
          request_type: data.request_type,
          employee_id: this.employeeID,
          training_or_seminar_name: data.training_or_seminar_name,
          training_provider: data.training_provider,
          from_date: data.from_date,
          to_date: data.to_date,
          venue: data.venue,
          attach_training_or_seminar_certificate:
            data.attach_training_or_seminar_certificate.name,
        };

        let response = await this.$store.dispatch(
          "trainings_or_seminars_module/createRequest",
          obj,
        );

        if (data.attach_training_or_seminar_certificate !== null) {
          const formData = new FormData();
          formData.append("request_id", response.data);
          formData.append("request_type", "create");
          formData.append("attach_file", "training_or_seminar_certificate");
          formData.append("employee_id", data.employee_id);
          formData.append(
            data.training_or_seminar_name.trim(),
            data.attach_training_or_seminar_certificate,
          );

          await this.$store.dispatch("user_module/upload", formData);
        }

        $q.notify({
          type: "positive",
          message: "Sucessfully submitted.",
        });
        return this.$router.push("/my-request");
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      } finally {
        document.getElementById("btnSubmit").disabled = false;
      }
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
