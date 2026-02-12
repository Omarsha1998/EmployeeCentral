<template>
  <q-layout>
    <q-page-container>
      <div class="containerDtr">
        <div class="row" style="width: 90%">
          <div class="col-12">
            <div>
              <q-dialog v-model="dateDialog">
                <q-card
                  :style="{
                    width: $q.screen.lt.sm
                      ? '350px'
                      : $q.screen.lt.md
                      ? '450px'
                      : '500px',
                    'min-height': $q.screen.lt.sm
                      ? '100px'
                      : $q.screen.lt.md
                      ? '100px'
                      : '100px',
                  }"
                  class="rounded"
                >
                  <q-card-section class="bg-primary row items-center q-pb-md">
                    <div class="text-h6 text-white">Choose a date</div>
                    <q-space></q-space>
                    <q-btn
                      class="bg-white"
                      icon="close"
                      push
                      round
                      dense
                      v-close-popup
                    ></q-btn>
                  </q-card-section>

                  <q-card-section class="text-subtitle2">
                    <div class="row">
                      <q-input
                        class="col-6 q-pa-xs"
                        outlined
                        label-color="primary"
                        dense
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

                      <q-input
                        class="col-6 q-pa-xs"
                        outlined
                        label-color="primary"
                        dense
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
                    <div class="q-mt-md text-right">
                      <q-btn
                        push
                        color="red"
                        class="q-mr-xs"
                        @click="dateDialog = false"
                        label="Cancel"
                      />
                      <q-btn
                        push
                        color="primary"
                        class="q-ml-xs"
                        @click="fetchDTR"
                        label="Submit"
                      />
                    </div>
                  </q-card-section>
                </q-card>
              </q-dialog>
              <q-card class="roundedDtr">
                <q-skeleton v-if="loading" :style="{ height: '60px' }" />
                <q-card-section
                  v-else
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
                  <div class="row">
                    <div class="col-4"></div>
                    <div class="col-4 text-center">Daily Time Record</div>
                    <div class="col-4 text-right">
                      <q-btn
                        push
                        label="Pick A Date"
                        icon="search"
                        class="bg-white text-blue"
                        @click="dateDialog = true"
                      />
                    </div>
                  </div>
                </q-card-section>
                <template v-if="loading">
                  <template v-for="rowIndex in 1" :key="rowIndex">
                    <div
                      style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: 50px;
                        background-color: #f2f2ef;
                      "
                    >
                      <template v-for="colIndex in 12" :key="colIndex">
                        <div
                          style="
                            flex: 1;
                            display: flex;
                            justify-content: center;
                          "
                        >
                          <q-skeleton
                            :style="{ height: '15px', width: '70%' }"
                            :animation="
                              skeletonAnimations.includes('fade')
                                ? 'fade'
                                : 'none'
                            "
                          />
                        </div>
                      </template>
                    </div>
                  </template>
                  <template v-for="rowIndex in 13" :key="rowIndex">
                    <div
                      style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: 50px;
                      "
                    >
                      <template v-for="colIndex in 1" :key="colIndex">
                        <div
                          style="
                            flex: 1;
                            display: flex;
                            justify-content: center;
                          "
                        >
                          <q-skeleton
                            :style="{ height: '45px', width: '100%' }"
                            :animation="
                              skeletonAnimations.includes('fade')
                                ? 'fade'
                                : 'none'
                            "
                          />
                        </div>
                      </template>
                    </div>
                  </template>
                </template>
                <template v-else>
                  <div v-if="dtrDetails.length === 0" class="text-center">
                    <q-icon name="warning" style="font-size: 25px" />
                    No data available
                  </div>
                  <dtrComponent
                    v-else
                    :employeeModule="true"
                    :employeeNoDtr="this.employeeNoDtr"
                    :DTRDetails="dtrDetails"
                  />
                </template>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import helperMethods from "../helperMethods.js";
import { QSpinnerIos } from "quasar";
import { mapGetters } from "vuex";
import dtrComponent from "src/components/dtrComponent.vue";

export default {
  data() {
    return {
      dateFrom: null,
      dateTo: null,
      loadingCounter: null,
      loading: true,
      skeletonAnimations: ["wave", "fade", "fade", "none"],
      dateDialog: false,
      noDtr: "",
      officer: false,
    };
  },

  components: {
    dtrComponent,
  },

  computed: {
    ...mapGetters({
      dtrDetails: "DTRModule/getdtrdetails",
      employeeNoDtr: "DTRModule/getNoDtrEmployee",
      position: "user_module/position",
      isOfficer: "user_module/isOfficer",
      employeeId: "user_module/employee_id",
    }),
  },

  methods: {
    showPopup(refName) {
      this.$refs[refName].show();
    },

    hidePopup(refName) {
      this.$refs[refName].hide();
    },

    async fetchDTR() {
      if (this.dateFrom !== null && this.dateTo !== null) {
        this.$q.loading.show({
          spinner: QSpinnerIos,
          message: "Fetching Daily Time Record Request",
          messageColor: "primary",
          backgroundColor: "grey-1",
          spinnerColor: "primary",
          customClass: "custom-loading-style",
          spinnerSize: "7em",
        });
      }

      const data = {
        employeeCode: this.employeeId,
        department: this.selectedDepartment ? this.selectedDepartment.code : "",
        selectedClass: this.selectedClass ? this.selectedClass.class : "",
        dateFrom: this.dateFrom ? this.dateFrom : "",
        dateTo: this.dateTo ? this.dateTo : "",
      };

      this.dateDialog = false;

      try {
        await helperMethods.delay(500);
        await this.$store.dispatch("DTRModule/fetchDTR", data);
        this.$q.loading.hide();
        this.loadingCounter++;
        if (this.loadingCounter === 2) {
          this.loading = false;
        }
      } catch {
        console.error(error);
      }
    },

    async fetchNoDtrEmployee() {
      try {
        const data = {
          employeeId: this.employeeId,
        };
        await this.$store.dispatch("DTRModule/fetchNoDtrEmployee", data);
        this.noDtr = this.employeeNoDtr;
        // this.employeePosition = this.position;
        // this.officer = this.isOfficer;
        this.loadingCounter++;
        if (this.loadingCounter === 2) {
          this.loading = false;
        }
      } catch {
        console.error(error);
      }
    },
  },

  created() {
    this.fetchDTR();
    this.fetchNoDtrEmployee();
  },
};
</script>

<style>
.containerDtr {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.roundedDtr {
  border-radius: 10px;
  margin-bottom: 50px;
  margin-top: 10px;
}
</style>
