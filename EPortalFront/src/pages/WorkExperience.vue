<template>
  <q-pull-to-refresh @refresh="this.refresh()">

    <TitleForPage :title="'Work Experience'" :icon="'work'"></TitleForPage>

    <div class="q-pa-md" v-if="this.formIsvisible === true">
      <div class="q-gutter-y-md">
        <h5 class="text-center" v-if="workExperiences.length === 0">
          No Records found
        </h5>

        <div v-if="workExperiences.length > 0">
          <q-item-label
            class="text-center"
            style="margin-bottom: 15px; font-weight: bold"
            >TOTAL RECORDS : ({{ workExperiences.length }})</q-item-label
          >

          <div
            class="borderStyle"
            v-for="work_experience in this.workExperiences"
            :key="work_experience.company_name"
          >
            <div
              class="row marginTopBottom20px"
              v-for="(value, property) in work_experience"
              :key="property"
            >
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
                  <span>
                    {{ value }}
                  </span>
                </q-item-label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-pull-to-refresh>
</template>

<script>
import { defineComponent } from "vue";
import helperMethods from "../helperMethods.js";
import TitleForPage from "../components/TitleForPage.vue";

export default defineComponent({
  name: "WorkExperience",
  components: {
    TitleForPage,
  },
  computed: {
    employeeID() {
      return this.$store.getters["user_module/employee_id"];
    },
    workExperiences() {
      return this.$store.getters["work_experiences_module/work_experiences"];
    },
  },
  data: function () {
    return {
      formIsvisible: false,
    };
  },
  created: async function () {
    await this.getData();
  },
  methods: {
    getData: async function () {
      await this.$store.dispatch(
        "work_experiences_module/get",
        this.employeeID
      );

      this.formIsvisible = true;
    },
    refresh: function () {
      helperMethods.refreshPage();
    },
  },
});
</script>
