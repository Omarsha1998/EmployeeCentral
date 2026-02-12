<template>
  <q-pull-to-refresh @refresh="this.refresh()">
    <TitleForPage
      :title="'Educational Background'"
      :icon="'school'"
    ></TitleForPage>

    <div class="q-pa-md" v-if="form.visible === true">
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

        <h5
          class="text-center"
          v-if="
            $store.getters[
              'educational_backgrounds_module/educational_backgrounds'
            ].length === 0
          "
        >
          No Records found
        </h5>

        <div
          v-if="
            $store.getters[
              'educational_backgrounds_module/educational_backgrounds'
            ].length > 0
          "
        >
          <q-item-label
            class="text-center"
            style="margin-bottom: 15px; font-weight: bold"
            >TOTAL RECORDS : ({{
              $store.getters[
                "educational_backgrounds_module/educational_backgrounds"
              ].length
            }})</q-item-label
          >
          <div
            class="borderStyle"
            v-for="education in $store.getters[
              'educational_backgrounds_module/educational_backgrounds'
            ]"
            :key="education.diploma"
          >
            <div v-for="(value, property) in education" :key="property">
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
                        (property === 'attached_tor' ||
                          property === 'attached_diploma')
                      "
                    >
                      <a
                        :href="this.backend_url + value"
                        target="_blank"
                        style="color: #1681ec"
                        >CLICK HERE</a
                      >
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
      v-model="dialog.visible"
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
            @submit="this.onSubmit()"
            autocomplete="off"
          >
            <div class="row bg-white">
              <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                <q-input
                  id="txtFrom"
                  class="marginLeftAndRight"
                  type="number"
                  label="From (year)"
                  maxlength="4"
                  v-model="this.dialog.data.from"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                    (val) => (val && val.length < 5) || 'Maximum digit is 4',
                    (val) => (val && val.length > 3) || '4 digit is required',
                  ]"
                >
                </q-input>
                <q-input
                  id="txtTo"
                  class="marginLeftAndRight"
                  type="number"
                  label="To (year)"
                  maxlength="4"
                  v-model="this.dialog.data.to"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                    (val) => (val && val.length < 5) || 'Maximum digit is 4',
                    (val) => (val && val.length > 3) || '4 digit is required',
                  ]"
                >
                </q-input>

                <q-select
                  id="drpDegrees"
                  class="marginLeftAndRight"
                  v-model="this.dialog.data.degree_id"
                  :options="this.dialog.options.degrees"
                  label="Degree"
                  emit-value
                  map-options
                  option-value="degree_id"
                  option-label="degree_name"
                  filter
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val !== null && val !== undefined && val !== '') ||
                      'This field is required',
                  ]"
                />
                <q-input
                  v-if="this.dialog.data.degree_id === 0"
                  ref="inputDegree"
                  id="inputDegree"
                  class="marginLeftAndRight"
                  label="Please specify your degree here"
                  maxlength="200"
                  v-model="this.dialog.data.degree_name"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>

                <q-select
                  id="drpCourses"
                  class="marginLeftAndRight"
                  v-model="this.dialog.data.course_id"
                  :options="this.dialog.options.courses"
                  label="Course"
                  emit-value
                  map-options
                  option-value="course_id"
                  option-label="course_name"
                  filter
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val !== null && val !== undefined && val !== '') ||
                      'This field is required',
                  ]"
                />
                <q-input
                  v-if="this.dialog.data.course_id === 0"
                  ref="txtCourseName"
                  id="txtCourseName"
                  class="marginLeftAndRight"
                  label="Please specify your course here"
                  maxlength="200"
                  v-model="this.dialog.data.course_name"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>

                <q-select
                  id="drpMajors"
                  class="marginLeftAndRight"
                  v-model="this.dialog.data.major_id"
                  :options="this.dialog.options.majors"
                  label="Major"
                  emit-value
                  map-options
                  option-value="major_id"
                  option-label="major_name"
                  filter
                  style="margin-bottom: 10px"
                />
                <q-input
                  v-if="this.dialog.data.major_id === 0"
                  ref="txtMajorName"
                  id="txtMajorName"
                  class="marginLeftAndRight"
                  label="Please specify your major here"
                  maxlength="200"
                  v-model="this.dialog.data.major_name"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>

                <q-select
                  id="drpInstitutionNames"
                  class="marginLeftAndRight"
                  v-model="this.dialog.data.school_id"
                  :options="this.dialog.options.institutions"
                  label="Institution"
                  emit-value
                  map-options
                  option-value="school_id"
                  option-label="school_name"
                  filter
                  lazy-rules
                  :rules="[(val) => !!val || 'This field is required']"
                />

                <q-input
                  v-if="
                    this.dialog.view.location !== null &&
                    this.dialog.view.location !== ''
                  "
                  disable
                  class="marginLeftAndRight"
                  type="text"
                  label="Institution Location"
                  v-model="this.dialog.view.location"
                  id="txtInstitutionLocation"
                >
                </q-input>
                <q-file
                  id="qFileAttachTOR"
                  accept=".pdf"
                  clearable
                  v-model="this.dialog.data.attach_tor"
                  label="Attach - TOR"
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
                <q-file
                  id="qFileAttachDiploma"
                  accept=".pdf"
                  clearable
                  v-model="this.dialog.data.attach_diploma"
                  label="Attach - Diploma"
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
  name: "EducationalBackground",
  components: {
    TitleForPage,
  },
  computed: {
    employeeID() {
      return this.$store.getters["user_module/employee_id"];
    },
  },
  data: function () {
    return {
      backend_url: process.env.BACKEND_REST_API_URL,
      form: {
        visible: false,
      },
      dialog: {
        visible: false,
        options: {
          degrees: null,
          courses: null,
          majors: null,
          institutions: null,
        },
        view: {
          location: null,
        },
        data: {
          request_type: "create",
          employee_id: this.employeeID,
          from: null,
          to: null,
          school_id: null,
          degree_id: null,
          course_id: null,
          major_id: null,
          degree_name: null,
          course_name: null,
          major_name: null,
          attach_tor: null,
          attach_diploma: null,
        },
      },
    };
  },
  watch: {
    "dialog.data.school_id"() {
      if (this.form.visible === true && this.dialog.data.school_id !== null) {
        let index = this.dialog.options.institutions.findIndex(
          (x) => x.school_id === this.dialog.data.school_id,
        );
        this.dialog.view.location =
          this.dialog.options.institutions[index].location;
      }
    },
    async "dialog.data.course_id"() {
      if (this.form.visible === true && this.dialog.data.course_id !== null) {
        this.dialog.data.major_id = null;
        this.dialog.options.majors = await this.$store.dispatch(
          "educational_backgrounds_module/getMajors",
          this.dialog.data.course_id,
        );

        this.dialog.options.majors.push({ major_id: 0, major_name: "OTHERS" });

        this.dialog.data.course_name = null;

        if (this.dialog.data.course_id === 0)
          await this.focusInInput("txtCourseName");
      }
    },
    async "dialog.data.degree_id"() {
      this.dialog.data.degree_name = null;

      if (this.dialog.data.degree_id === 0)
        await this.focusInInput("inputDegree");
    },
    async "dialog.data.major_id"() {
      this.dialog.data.major_name = null;

      if (this.dialog.data.major_id === 0)
        await this.focusInInput("txtMajorName");
    },
  },
  mounted: function () {
    $q = useQuasar();
  },
  created: async function () {
    await this.getData();
  },
  methods: {
    async focusInInput(refName) {
      await this.$nextTick();
      const inputWrapper = this.$refs[refName];
      if (inputWrapper) {
        const inputElement = inputWrapper.$el.querySelector("input");
        if (inputElement) inputElement.focus();
      }
    },
    getData: async function () {
      await this.$store.dispatch(
        "educational_backgrounds_module/get",
        this.employeeID,
      );
      this.form.visible = true;
    },
    refresh: function () {
      helperMethods.refreshPage();
    },
    showDialogCreate: async function () {
      let response = await this.$store.dispatch(
        "educational_backgrounds_module/getOptions",
      );

      response.degrees.push({ degree_id: 0, degree_name: "OTHERS" });
      this.dialog.options.degrees = response.degrees;

      response.courses.push({ course_id: 0, course_name: "OTHERS" });
      this.dialog.options.courses = response.courses;

      this.dialog.options.institutions = response.institutions;

      this.dialog.visible = true;
    },
    hideDialogCreate: function () {
      this.dialog.visible = false;
      this.dialog.data.from = null;
      this.dialog.data.to = null;
      this.dialog.data.degree_id = null;
      this.dialog.data.course_id = null;
      this.dialog.data.major_id = null;
      this.dialog.data.attach_tor = null;
      this.dialog.data.attach_diploma = null;
      this.dialog.view.location = null;
    },
    getDiploma: function () {
      let index = this.dialog.options.degrees.findIndex(
        (x) => x.degree_id === this.dialog.data.degree_id,
      );
      let response = this.dialog.options.degrees[index].degree_name;

      response += " ";

      index = this.dialog.options.courses.findIndex(
        (x) => x.course_id === this.dialog.data.course_id,
      );
      response += this.dialog.options.courses[index].course_name;

      response += " ";

      if (this.dialog.data.major_id !== null) {
        index = this.dialog.options.majors.findIndex(
          (x) => x.major_id === this.dialog.data.major_id,
        );
        response += this.dialog.options.majors[index].major_name;
      }

      return response;
    },
    onSubmit: async function () {
      try {
        document.getElementById("btnSubmit").disabled = true;

        const majorID =
          this.dialog.data.major_id === 0 || this.dialog.data.major_id !== null
            ? this.dialog.data.major_name
            : this.dialog.data.major_id;

        const obj = {
          request_type: this.dialog.data.request_type,
          employee_id: this.employeeID,
          from: this.dialog.data.from,
          to: this.dialog.data.to,
          school_id: this.dialog.data.school_id,
          degree_id:
            this.dialog.data.degree_id === 0
              ? this.dialog.data.degree_name
              : this.dialog.data.degree_id,
          course_id:
            this.dialog.data.course_id === 0
              ? this.dialog.data.course_name
              : this.dialog.data.course_id,
          major_id: majorID,
          diploma: this.getDiploma(),
          attach_tor: this.dialog.data.attach_tor.name,
          attach_diploma: this.dialog.data.attach_diploma.name,
        };

        let response = await this.$store.dispatch(
          "educational_backgrounds_module/createRequest",
          obj,
        );

        if (
          this.dialog.data.attach_tor !== null &&
          this.dialog.data.attach_diploma !== null
        ) {
          const formData = new FormData();
          formData.append("request_id", response.data);
          formData.append("request_type", "create");
          formData.append("attach_file", "tor_and_diploma");
          formData.append("employee_id", this.employeeID);
          formData.append("tor", this.dialog.data.attach_tor);
          formData.append("diploma", this.dialog.data.attach_diploma);

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
