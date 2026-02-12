<template>
  <q-pull-to-refresh @refresh="this.refresh()">
    <div class="bgImageUERM row justify-center">
      <q-layout class="row justify-center items-center">
        <q-card
          style="margin: 15px"
          :style="{
            width: $q.screen.lt.sm
              ? '300px'
              : $q.screen.lt.md
              ? '350px'
              : '400px',
          }"
        >
          <div style="margin-top: 70px"></div>
          <Logo />
          <div style="margin-bottom: 70px"></div>
          <div class="text-center">
            <h5 class="text-bold">UPDATE LICENSE</h5>
          </div>
          <q-card-section>
            <q-form
              id="frm"
              class="q-gutter-xs"
              method="post"
              @submit.prevent="onSubmit(this.submit)"
              autocomplete="off"
            >
              <h6
                class="text-center"
                style="margin: 0 30px"
                v-if="view.remaining_days === 0"
              >
                Today is your last day to submit a request to update your
                license before it expires. Please update it.
              </h6>
              <h6
                class="text-center"
                style="margin: 0 30px"
                v-else-if="view.remaining_days > 0"
              >
                You have {{ view.remaining_days }}
                {{ view.remaining_days == 1 ? "day" : "days" }}, before your
                license will expire.
              </h6>
              <h6
                class="text-center"
                style="margin: 0 30px; color: red"
                v-else-if="
                  view.remaining_days < 0 &&
                  this.submit.current_expiration_date !==
                    '1900-01-01T00:00:00.000Z'
                "
              >
                This license is already expired. Please update it.
              </h6>

              <q-item-label
                >License Name : {{ submit.license_name }}</q-item-label
              >
              <q-item-label>License No : {{ submit.license_no }}</q-item-label>

              <q-item-label
                v-if="
                  this.submit.current_expiration_date !==
                  '1900-01-01T00:00:00.000Z'
                "
                >License Expiration Date :
                {{ view.string_old_expiration_date }}</q-item-label
              >

              <q-item-label
                v-if="
                  this.submit.current_expiration_date !==
                  '1900-01-01T00:00:00.000Z'
                "
                >PRC ID :
                <a
                  :href="this.backend_url + view.prc_id_url"
                  target="_blank"
                  style="color: #1681ec"
                  >CLICK HERE</a
                >
              </q-item-label>

              <q-input
                type="date"
                label="New Expiration Date of License"
                v-model="submit.new_expiration_date"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'This field is required',
                ]"
              >
              </q-input>

              <q-file
                accept=".pdf"
                clearable
                v-model="submit.attach_prc_id"
                label="Attach - PRC ID"
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

              <div>
                <br />
                <br />
                <q-btn
                  id="btnSubmit"
                  class="full-width"
                  color="primary"
                  label="SUBMIT"
                  type="submit"
                ></q-btn>
                <q-btn
                  class="full-width"
                  color="primary"
                  label="NOT NOW"
                  type="button"
                  style="margin-top: 7px"
                  @click="refresh()"
                ></q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-layout>
    </div>
  </q-pull-to-refresh>
</template>

<script>
// -------------------- Notify plugins --------------------
import { useQuasar } from "quasar";
let $q;
// -------------------- Notify plugins --------------------

import Logo from "../components/Logo.vue";
import TitleWithAppName from "../components/TitleWithAppName.vue";
import helperMethods from "../helperMethods.js";

export default {
  name: "UpdateLicense",
  computed: {
    employeeID() {
      return this.$store.getters["user_module/employee_id"];
    },
    licenses() {
      return this.$store.getters["licenses_module/licenses"];
    },
  },
  components: {
    Logo,
    TitleWithAppName,
  },
  data: function () {
    return {
      backend_url: process.env.BACKEND_REST_API_URL,
      view: {
        remaining_days: null,
        string_old_expiration_date: null,
        prc_id_url: null,
      },
      submit: {
        employee_id: this.employeeID,
        license_no: null,
        license_name: null,
        rec_no: null,
        new_expiration_date: null,
        current_expiration_date: null,
        attach_prc_id: null,
      },
    };
  },
  beforeMount: function () {
    this.setDetails();
  },
  mounted: function () {
    $q = useQuasar();
  },
  methods: {
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
    refresh: function () {
      helperMethods.refreshPage();
    },
    createCookie: function (newValue) {
      if (newValue != undefined)
        helperMethods.createCookie("exposed_license_indexes", newValue);
    },
    setDetails: function () {
      let index = helperMethods.getCookie("not_exposed_notification_index");
      helperMethods.deleteCookie("not_exposed_notification_index");

      if (helperMethods.getCookie("exposed_license_indexes") === undefined)
        this.createCookie(index);
      else {
        let indexes = helperMethods.getCookie("exposed_license_indexes");
        helperMethods.deleteCookie("exposed_license_indexes");
        if (indexes.includes(index.toString()) === false)
          indexes = indexes + " " + index;

        this.createCookie(indexes);
      }

      this.submit.license_name = this.licenses[index].license_name;
      this.submit.license_no = this.licenses[index].license_no;
      this.submit.current_expiration_date =
        this.licenses[index].expiration_date;
      this.submit.rec_no = this.licenses[index].rec_no;
      this.view.remaining_days = helperMethods.daysBetweenTwoDates(
        this.submit.current_expiration_date,
        helperMethods.getDateToday(),
      );

      this.view.string_old_expiration_date =
        helperMethods.convertToReadableFormatDate(
          this.submit.current_expiration_date,
        );

      this.view.prc_id_url = this.licenses[index].url;
    },
    onSubmit: async function (data) {
      try {
        document.getElementById("btnSubmit").disabled = true;

        const obj = {
          employee_id: this.employeeID,
          license_no: data.license_no,
          license_name: data.license_name,
          new_expiration_date: data.new_expiration_date,
          current_expiration_date: data.current_expiration_date,
          attach_prc_id: data.attach_prc_id.name,
          rec_no: data.rec_no,
        };

        let response = await this.$store.dispatch(
          "licenses_module/createRequest",
          obj,
        );

        if (data.attach_prc_id !== null) {
          const formData = new FormData();
          formData.append("request_id", response.data);
          formData.append(
            "request_type",
            data.current_expiration_date === "1900-01-01T00:00:00.000Z"
              ? "create"
              : "edit",
          );
          formData.append("attach_file", "prc_id");
          formData.append("employee_id", this.employeeID);
          formData.append(this.submit.license_name.trim(), data.attach_prc_id);
          await this.$store.dispatch("user_module/upload", formData);
        }

        $q.notify({
          type: "positive",
          message: "Successfully submitted.",
        });

        return this.$router.push("/my-request");
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      } finally {
        document.getElementById("btnSubmit").disabled = false;
      }
    },
  },
};
</script>
