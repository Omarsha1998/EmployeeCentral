<template>
  <q-layout>
    <q-page>
      <q-page-container>
        <div class="containermainn">
          <div style="width: 95%">
            <!-- Employee Code -->
            <div v-if="loading" class="full-width">
              <q-skeleton :style="{ height: '260px', marginBottom: '25px' }" />
              <q-skeleton :style="{ height: '120px' }" />
            </div>
            <div v-else class="row">
              <q-card class="col-12">
                <q-card-section
                  class="bg-primary text-white text-center"
                  style="height: 70px"
                  :class="['bold-text', $q.screen.name + '-text']"
                >
                  Search Details
                </q-card-section>
                <q-card-section class="row">
                  <div class="col-12 col-sm-6 col-md-4 q-pa-xs">
                    <q-input
                      class="blue-outline"
                      v-model="inputtedEmpCode"
                      input-debounce="0"
                      label="Employee Code"
                      label-color="primary"
                      outlined
                      clearable
                      behavior="menu"
                      fill-input
                      hide-selected
                      use-input
                    />
                  </div>

                  <!-- Department -->
                  <div class="col-12 col-sm-6 col-md-4 q-pa-xs">
                    <q-select
                      class="blue-outline"
                      v-model="selectedDepartment"
                      use-input
                      input-debounce="0"
                      label="Department"
                      label-color="primary"
                      outlined
                      :options="departments"
                      option-label="deptDescription"
                      option-value="deptCode"
                      @filter="filterFn"
                      behavior="menu"
                      fill-input
                      hide-selected
                      clearable
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey"
                            >No results</q-item-section
                          >
                        </q-item>
                      </template>
                    </q-select>
                  </div>

                  <!-- Class -->
                  <div class="col-12 col-sm-6 col-md-4 q-pa-xs">
                    <q-select
                      class="blue-outline"
                      v-model="selectedClass"
                      use-input
                      input-debounce="0"
                      label="Class"
                      label-color="primary"
                      outlined
                      :options="classOption"
                      option-label="description"
                      option-value="class"
                      @filter="filterFn"
                      behavior="menu"
                      fill-input
                      hide-selected
                      clearable
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey"
                            >No results</q-item-section
                          >
                        </q-item>
                      </template>
                    </q-select>
                  </div>

                  <!-- Date From -->
                  <div class="col-12 col-sm-6 col-md-4 q-pa-xs">
                    <q-input
                      class="blue-outline"
                      outlined
                      label-color="primary"
                      v-model="dateFrom"
                      label="Date From"
                      @click="showPopup('dateFromPopup')"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="dateFromPopup"
                            :breakpoint="1440"
                            cover
                          >
                            <div class="q-date-container">
                              <q-date v-model="dateFrom" mask="MM/DD/YYYY" />
                              <q-btn
                                push
                                icon="close"
                                @click="hidePopup('dateFromPopup')"
                                class="bg-white absolute-top-right"
                                round
                                padding="xs"
                                style="margin: 10px"
                              />
                            </div>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>

                  <!-- Date To -->
                  <div class="col-12 col-sm-6 col-md-4 q-pa-xs">
                    <q-input
                      class="blue-outline"
                      outlined
                      label-color="primary"
                      v-model="dateTo"
                      label="Date To"
                      @click="showPopup('dateToPopup')"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="dateToPopup"
                            :breakpoint="1440"
                            cover
                          >
                            <div class="q-date-container">
                              <q-date v-model="dateTo" mask="MM/DD/YYYY" />
                              <q-btn
                                push
                                icon="close"
                                @click="hidePopup('dateToPopup')"
                                class="bg-white absolute-top-right"
                                round
                                padding="xs"
                                style="margin: 10px"
                              />
                            </div>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>

                  <!-- Add more inputs here -->
                  <div class="col-12 text-right q-pt-sm">
                    <q-btn
                      class="text-white bg-positive"
                      push
                      label="Search"
                      @click="searchEmployeeDtr"
                    ></q-btn>
                  </div>
                </q-card-section>
              </q-card>
              <q-card class="col-12 q-mt-lg q-mb-lg">
                <q-card-section
                  class="bg-primary text-white text-bold text-h6 text-center"
                  :style="{
                    fontWeight: 'bold',
                    fontSize: $q.screen.lt.sm
                      ? '16px'
                      : $q.screen.lt.md
                        ? '18px'
                        : $q.screen.gt.md && $q.screen.lt.xl
                          ? '20px'
                          : '24px',
                  }"
                >
                  <div class="text-center">Daily Time Record</div>
                </q-card-section>

                <q-card-section
                  class="q-pa-md"
                  style="
                    position: sticky;
                    top: 0;
                    z-index: 1;
                    background: white;
                  "
                >
                  <q-input
                    v-if="dtrDetails.length > 0"
                    class="blue-outline"
                    v-model="searchTextDetails"
                    label="Search"
                    outlined
                    clearable
                    @clear="clearSearchText"
                  />
                </q-card-section>

                <q-card-section>
                  <div
                    v-if="dtrDetails.length === 0"
                    class="text-center text-red"
                  >
                    <q-icon name="warning" style="font-size: 25px" />
                    No data available
                  </div>
                  <dtrComponent
                    v-else
                    :employeeModule="false"
                    :employeeNoDtr="0"
                    :DTRDetails="filteredDtrDetails"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </q-page-container>
    </q-page>
  </q-layout>
</template>

<script>
import { mapGetters } from "vuex";
import dtrComponent from "src/components/dtrComponent.vue";
import { QSpinnerIos } from "quasar";
import helperMethods from "src/helperMethods";

export default {
  data() {
    return {
      inputtedEmpCode: null,
      selectedDepartment: null,
      selectedClass: null,
      departments: null,
      dateFrom: null,
      dateTo: null,
      classOption: null,
      loading: true,
      loadingSkeleton: null,
      searchTextDetails: "",
    };
  },
  components: {
    dtrComponent,
  },

  computed: {
    ...mapGetters({
      employeeCode: "user_module/employee_id",
      deptCode: "user_module/employeeDeptCode",
      allDepartmentsGetter: "hierarchyModule/getAllDepartments",
      classGetter: "employeeModule/getClass",
      dtrDetails: "DTRModule/getdtrdetails",
    }),

    filteredDtrDetails() {
      if (!this.searchTextDetails) return this.dtrDetails;

      const query = this.searchTextDetails.toLowerCase();
      return this.dtrDetails.filter((row) =>
        row.name.toString().toLowerCase().includes(query),
      );
    },
  },
  methods: {
    clearSearchText() {
      this.searchTextDetails = "";
    },

    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.departments = this.allDepartmentsGetter;
          this.classOption = this.classGetter;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.departments = this.allDepartmentsGetter.filter(
          (option) => option.deptDescription.toLowerCase().indexOf(needle) > -1,
        );
        this.classOption = this.classGetter.filter(
          (option) => option.description.toLowerCase().indexOf(needle) > -1,
        );
      });
    },

    showPopup(refName) {
      this.$refs[refName].show();
    },

    hidePopup(refName) {
      this.$refs[refName].hide();
    },

    async getDepartment() {
      try {
        const data = {
          employeeCode: this.employeeCode,
          deptCode: this.deptCode,
        };
        await helperMethods.delay(500);
        await this.$store.dispatch("hierarchyModule/getDepartments", data);
        this.loadingSkeleton++;
        if (this.loadingSkeleton === 2) {
          this.loading = false;
        }
      } catch (errpr) {
        console.error(error);
      }
    },

    async getEmployeeClass() {
      try {
        await helperMethods.delay(500);
        await this.$store.dispatch("employeeModule/getClass");
        this.loadingSkeleton++;
        if (this.loadingSkeleton === 2) {
          this.loading = false;
        }
      } catch (error) {
        console.error(error);
      }
    },

    formateDate(dateString) {
      const [month, day, year] = dateString.split("/");
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0",
      )}`;
      return formattedDate;
    },

    async searchEmployeeDtr() {
      if (
        !this.inputtedEmpCode &&
        !this.selectedDepartment &&
        !this.selectedClass
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message:
            "Please enter or select at least one field in the search criteria",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      this.$q.loading.show({
        spinner: QSpinnerIos,
        message: "Fetching Daily Time Record Request",
        messageColor: "primary",
        backgroundColor: "grey-1",
        spinnerColor: "primary",
        customClass: "custom-loading-style",
        spinnerSize: "7em",
      });

      try {
        await helperMethods.delay(500);
        helperMethods.disablePointerEvents();

        const data = {
          employeeCode: this.inputtedEmpCode ? this.inputtedEmpCode : "",
          department: this.selectedDepartment
            ? this.selectedDepartment.deptCode
            : "",
          selectedClass: this.selectedClass ? this.selectedClass.class : "",
          dateFrom: this.dateFrom ? this.formateDate(this.dateFrom) : "",
          dateTo: this.dateTo ? this.formateDate(this.dateTo) : "",
        };

        if (this.inputtedEmpCode) {
          const ownershipData = {
            employeeCode: this.inputtedEmpCode,
            approverCode: this.employeeCode,
          };

          await this.$store.dispatch("DTRModule/checkOwnership", ownershipData);
        }

        await this.$store.dispatch("DTRModule/fetchDTR", data);

        this.$q.loading.hide();
        helperMethods.enablePointerEvents();
      } catch (error) {
        this.$q.loading.hide();
        helperMethods.enablePointerEvents();

        console.error(error);

        let errorMessage = "An error occurred while fetching DTR";
        let errorIcon = "error";

        if (error.isOwnershipError) {
          errorMessage = error.message;
          errorIcon = "report_problem";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        this.$q.notify({
          color: "negative",
          position: "center",
          message: errorMessage,
          icon: errorIcon,
          iconColor: "white",
          timeout: 2000,
          progress: true,
        });
      }
    },

    handleEnterKey(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        this.searchEmployeeDtr();
      }
    },
  },

  created() {
    this.getDepartment();
    this.getEmployeeClass();
  },

  mounted() {
    document.addEventListener("keydown", this.handleEnterKey);
  },

  beforeUnmount() {
    document.removeEventListener("keydown", this.handleEnterKey);
  },
};
</script>
