<template>
  <q-layout>
    <q-page-container>
      <div class="containermainn">
        <div class="row" style="width: 95%">
          <div :class="$q.screen.gt.md ? 'col-3 q-pr-lg' : 'col-12'">
            <q-card class="filingForm">
              <q-card-section
                v-if="!loading"
                class="bg-primary text-white text-center"
                style="height: 70px"
                :class="['bold-text', $q.screen.name + '-text']"
              >
                Overtime Request Form
              </q-card-section>
              <filingForm
                v-if="!loading"
                :hrModule="false"
                :editView="false"
                :overtimeModule="true"
                @successFiling="emitSuccessEditing()"
              />

              <q-card-section v-else>
                <SkeletonLoader :formDetails="true" :overtimeForm="true" />
              </q-card-section>
            </q-card>
          </div>
          <div :class="$q.screen.gt.md ? 'col-9' : 'col-12'">
            <div class="bg-grey-3" v-if="loading">
              <q-skeleton :style="{ height: '70px' }" />
              <SkeletonLoader :row-count="9" :column-count="9" />
            </div>
            <q-card class="filingForm" v-else style="height: 519px">
              <q-card-section
                class="bg-primary text-white text-center"
                style="height: 70px"
                :class="['bold-text', $q.screen.name + '-text']"
              >
                <div class="row">
                  <div class="col-4 text-left">
                    <q-btn
                      push
                      style="width: 200px"
                      class="text-black bg-white"
                      icon="sort"
                      label="Approvers"
                      @click="approverDialog = true"
                    />
                  </div>
                  <div class="col-4 text-center">Overtime History</div>
                  <div class="col-4 text-right">
                    <q-input
                      class="bg-white"
                      style="font-size: 15px"
                      v-model="searchTextDetails"
                      placeholder="Search"
                      dense
                      outlined
                      clearable
                      :style="{ width: '200px', marginLeft: 'auto' }"
                      :class="[$q.screen.name + '-text2']"
                      @clear="searchTextDetails = ''"
                    />
                  </div>
                </div>
              </q-card-section>

              <overtimeView
                v-if="overtimeDetails"
                :itemDetails="computedOvertimeDetails"
                :itemColumns="overtimeColumns"
                :itemApprover="approversDetails"
                @emitSuccessEditing="emitSuccessEditing()"
              />
              <!-- <q-skeleton v-else :style="{ height: '55px' }" /> -->
            </q-card>
          </div>
        </div>
      </div>

      <q-dialog v-model="approverDialog">
        <q-card
          :class="[
            'bold-text',
            $q.screen.name + '-text',
            $q.screen.name + '-min-height',
            $q.screen.name + '-min-width',
          ]"
          class="rounded"
        >
          <q-card-section
            class="bg-primary row items-center q-pb-md"
            style="min-width: 400px"
          >
            <div class="bg-primary text-white text-bold">
              Approvers by Level
            </div>
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
          <q-card-section class="text-subtitle1">
            <q-table
              flat
              bordered
              :rows="sortedApproversDetails"
              :columns="approversCol"
              row-key="Level"
              hide-bottom
              style="max-height: 400px; overflow-y: auto"
              class="virtual-scroll"
              :pagination="{ rowsPerPage: 0 }"
              hide-pagination
            >
            </q-table>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import filingForm from "src/components/filingForm.vue";
import { mapGetters } from "vuex";
import overtimeView from "src/components/viewDetailsComponent.vue";
import SkeletonLoader from "../components/loadingSkeleton.vue";
import DropdownMenu from "../components/DropdownMenuLeaveDetails.vue";
import helperMethods from "src/helperMethods";

export default {
  data() {
    return {
      overtimeDetails: [],
      overtimeColumns: [
        {
          name: "",
          label: "Actions",
          align: "center",
          field: "action",
          width: "8px",
        },
        {
          name: "Created",
          label: "Created",
          align: "center",
          field: "overtimeCreated",
          width: "102px",
        },
        {
          name: "Filed Hours",
          label: "Filed Hours",
          align: "center",
          field: "workHours",
          sortable: false,
          width: "80px",
        },
        {
          name: "Approved Hours",
          label: "Approved Hours",
          align: "center",
          field: "approvedHours",
          sortable: false,
          width: "80px",
        },
        {
          name: "Time",
          label: "Time",
          align: "center",
          field: "",
          sortable: false,
          width: "120px",
        },
        // {
        //   name: "Time From",
        //   label: "Time From",
        //   align: "center",
        //   field: "timeFrom",
        //   sortable: false,
        //   width: "118px",
        // },
        // {
        //   name: "Time To",
        //   label: "Time To",
        //   align: "center",
        //   field: "timeTo",
        //   sortable: false,
        //   width: "118px",
        // },
        {
          name: "Overtime Date",
          label: "Overtime Date",
          align: "center",
          field: "dateOfOvertime",
          sortable: false,
          width: "110px",
        },
        {
          name: "Work Load",
          label: "Work Load",
          align: "left",
          sortable: false,
          width: "360px",
        },
        {
          name: "Status",
          label: "Status",
          align: "center",
          field: "Status",
          sortable: false,
          width: "140px",
        },
      ],
      approversDetails: null,
      approversCol: [
        { name: "Level", label: "Level", align: "center", field: "Level" },
        {
          name: "Approver Name",
          label: "Approver Name",
          align: "center",
          field: "EmployeeName",
          width: "130px",
        },
      ],
      loading: true,
      loadingCounter: null,
      searchTextDetails: "",
      approverDialog: false,
    };
  },

  components: {
    filingForm,
    overtimeView,
    SkeletonLoader,
    DropdownMenu,
  },

  computed: {
    ...mapGetters({
      getOvertime: "overtimeModule/getOvertimeDetails",
      appDetails: "leaveModule/approversDetails",
    }),

    sortedApproversDetails() {
      if (!this.approversDetails || this.approversDetails.length === 0) {
        return [];
      }

      const mappedDetails = this.approversDetails.map((row) => ({
        ...row,
        EmployeeName: `${row.firstName} ${row.middleInitial}. ${row.lastName}`,
        Level: `${row.lvl}`,
      }));

      const groupedByLevel = mappedDetails.reduce((acc, curr) => {
        const { Level, EmployeeName, ...rest } = curr;
        if (!acc[Level]) {
          acc[Level] = { ...rest, Level, EmployeeName };
        } else {
          acc[Level].EmployeeName += `, ${EmployeeName}`;
        }
        return acc;
      }, {});

      return Object.values(groupedByLevel);
    },

    computedOvertimeDetails() {
      if (Array.isArray(this.overtimeDetails)) {
        const query = this.searchTextDetails.toLowerCase();
        return this.overtimeDetails
          .filter((row) => {
            return (
              this.formatDateTime(row.overtimeCreated)
                .toLowerCase()
                .includes(query) ||
              this.formatDateTime(row.dateOfOvertime)
                .toLowerCase()
                .includes(query)
            );
          })
          .sort((a, b) => b.dateOfOvertime - a.dateOfOvertime);
      } else {
        return [];
      }
    },
  },

  methods: {
    formatDateTime(dateTimeString) {
      const options = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString("en-PH", options);
    },

    async getOvertimeDetails() {
      try {
        helperMethods.delay(500);
        await this.$store.dispatch("overtimeModule/getOvertimeDetails");
        const overtimeData = this.getOvertime;
        if (overtimeData.body === "No Overtime Details Found") {
          this.overtimeDetails = [];
        } else {
          this.overtimeDetails = overtimeData;
        }
        this.loadingCounter++;
        if (this.loadingCounter === 2) {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        if (error.response.status === 404) {
          console.error(error.response.data.body);
          return;
        }
        console.error("Failed getting getting overtime details");
      }
    },

    async getApproverDetails() {
      try {
        helperMethods.delay(500);
        await this.$store.dispatch("leaveModule/fetchApprovers");
        this.approversDetails = this.appDetails;
        this.loadingCounter++;
        if (this.loadingCounter === 2) {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        console.error("Failed getting approvers details");
      }
    },

    async emitSuccessEditing() {
      await this.getOvertimeDetails();
    },
  },

  created() {
    this.getOvertimeDetails();
    this.getApproverDetails();
  },
};
</script>
