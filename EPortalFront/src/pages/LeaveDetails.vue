<template>
  <div>
    <q-layout>
      <q-page-container>
        <div class="containermainn">
          <div class="row" style="width: 95%">
            <!-- Leave Request Form -->
            <div :class="$q.screen.gt.md ? 'col-4 q-pr-lg' : 'col-12'">
              <div>
                <q-card class="filingForm">
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    style="height: 70px"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Leave Request Form
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <filingForm
                    v-if="!loading"
                    :LeaveTypesOptions="leaveTypes"
                    :hrModule="false"
                    :editView="false"
                    @successFiling="successFiling"
                  />

                  <q-card-section v-else>
                    <SkeletonLoader :formDetails="true" />
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Leave Details / Leave Balance -->
            <div :class="$q.screen.gt.md ? 'col-8' : 'col-12'">
              <q-card class="roundedd">
                <template v-if="$q.screen.width > 900">
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white"
                    style="height: 70px"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4"></div>
                      <div class="col-4 text-center">Leave Details</div>
                      <div class="col-4 text-right">
                        <q-input
                          class="bg-white"
                          v-model="searchTextBalance"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :style="{ width: '200px', marginLeft: 'auto' }"
                          :class="[$q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        />
                      </div>
                    </div>
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <template v-if="loading">
                    <!-- Q-Skeleton Loading -->
                    <SkeletonLoader :row-count="10" :column-count="3" />
                  </template>

                  <template v-else>
                    <viewDetails
                      :items="sortedLeaveBalance"
                      :columns="balancecolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :desktop="true"
                    />
                    <div
                      v-if="sortedLeaveBalance.length === 0"
                      class="text-center"
                    >
                      <q-icon
                        name="warning"
                        style="font-size: 30px; color: red"
                      />

                      No data available
                    </div>
                    <div style="flex: 1"></div>
                    <q-card-section
                      v-if="sortedLeaveBalance.length > 0"
                      class="bg-blue-2 text-left"
                    >
                      <span class="text-italic"
                        >Total Vacation Leave Remaining:
                      </span>
                      <span class="text-bold">{{ totalVl }}</span>
                    </q-card-section>
                  </template>
                </template>

                <template v-else>
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Leave Details
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <SkeletonLoader :detailsSkel="true" />
                  </template>

                  <template v-else>
                    <q-input
                      class="col-12"
                      v-model="searchTextBalance"
                      placeholder="Search"
                      dense
                      outlined
                      clearable
                      :class="[$q.screen.name + '-text2']"
                      @clear="clearSearchText"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>

                    <viewDetails
                      :items2="sortedLeaveBalance"
                      :columns2="balancecolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :tableMobile="true"
                    />
                    <template> </template>
                    <div
                      v-if="sortedLeaveBalance.length === 0"
                      class="text-center"
                    >
                      <q-icon name="warning" style="font-size: 25px" />
                      No data available
                    </div>
                  </template>
                </template>
              </q-card>
            </div>

            <!-- Leave History -->
            <div class="col-12">
              <q-card
                v-show="showLeaveHistory"
                class="roundedd1"
                :class="`card-${$q.screen.name}`"
              >
                <template v-if="$q.screen.width > 900">
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    style="height: 70px"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4 text-left">
                        <DropdownMenu
                          :items="LeaveDetailsDirect"
                          @show-leave-history="showLeaveHistory = true"
                          @show-leave-ledger="showLeaveHistory = false"
                          @show-leave-approvers="approverDialog = true"
                        />
                      </div>
                      <div class="col-4 text-center">Leave History</div>
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
                          @clear="clearSearchText"
                        />
                      </div>
                    </div>
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <!-- Q-Skeleton Loading -->
                    <SkeletonLoader :row-count="10" :column-count="9" />
                  </template>
                  <template v-else>
                    <viewLeaveDetails
                      :itemDetails="LeaveDetailsDirect"
                      :itemApprover="approversDetails"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :leaveTypesOptions="leaveTypes"
                      :searchTextDetails="searchTextDetails"
                      :hrModule="false"
                      :mobileView="false"
                      @emitSuccessEditing="emitSuccessEditing()"
                    />
                  </template>
                </template>

                <!-- Q-table for Q-Card responsive -->
                <template v-else>
                  <!-- Q-Skeleton Loading -->
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Leave History
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <SkeletonLoader :mobile="true" />
                  </template>

                  <template v-else>
                    <div class="row">
                      <div class="col-12 col-sm-6">
                        <DropdownMenu
                          :items="LeaveDetailsDirect"
                          @show-leave-history="showLeaveHistory = true"
                          @show-leave-ledger="showLeaveHistory = false"
                          @show-leave-approvers="approverDialog = true"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="searchTextDetails"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :class="[$q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        >
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                      </div>
                    </div>
                    <viewLeaveDetails
                      :itemDetails="LeaveDetailsDirect"
                      :itemApprover="approversDetails"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :leaveTypesOptions="leaveTypes"
                      :searchTextDetails="searchTextDetails"
                      :hrModule="false"
                      :mobileView="true"
                      @emitSuccessEditing="emitSuccessEditing()"
                    />
                  </template>
                </template>
              </q-card>
            </div>

            <!-- Leave Ledger -->
            <div class="col-12">
              <q-card v-show="!showLeaveHistory" class="roundedd1">
                <template v-if="$q.screen.width > 900">
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    style="height: 70px"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4 text-left">
                        <DropdownMenu
                          :items="LeaveDetailsDirect"
                          @show-leave-history="showLeaveHistory = true"
                          @show-leave-ledger="showLeaveHistory = false"
                          @show-leave-approvers="approverDialog = true"
                        />
                      </div>
                      <div class="col-4 text-center">Leave Ledger</div>
                      <div class="col-4 text-right">
                        <q-input
                          class="bg-white"
                          style="font-size: 15px"
                          v-model="searchTextForfeited"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :style="{ width: '200px', marginLeft: 'auto' }"
                          :class="[$q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        />
                      </div>
                    </div>
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <!-- Q-Skeleton Loading -->
                    <SkeletonLoader :row-count="10" :column-count="9" />
                  </template>

                  <template v-else>
                    <viewDetails
                      :items="sortedLeaveLedger"
                      :columns="leaveLedgerColumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :desktop="true"
                    />
                    <div
                      v-if="sortedLeaveLedger.length === 0"
                      class="text-center"
                    >
                      <q-icon
                        name="warning"
                        style="font-size: 30px; color: red"
                      />

                      No data available
                    </div>
                  </template>
                </template>

                <!-- Q-table for Q-Card responsive -->
                <template v-else>
                  <!-- Q-Skeleton Loading -->
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Leave Ledger
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <template v-if="loading">
                    <SkeletonLoader :mobileApproved="true" />
                  </template>

                  <template v-else>
                    <div class="row">
                      <div class="col-12 col-sm-6">
                        <DropdownMenu
                          :items="LeaveDetailsDirect"
                          @show-leave-history="showLeaveHistory = true"
                          @show-leave-ledger="showLeaveHistory = false"
                          @show-leave-approvers="approverDialog = true"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="searchTextDetails"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :class="[$q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        >
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                      </div>
                    </div>

                    <viewDetails
                      :items="sortedLeaveLedger"
                      :columns="leaveLedgerColumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :tableMobile2="true"
                    />
                    <div
                      v-if="sortedLeaveLedger.length === 0"
                      class="text-center"
                    >
                      <q-icon name="warning" style="font-size: 25px" />
                      No data available
                    </div>
                  </template>
                </template>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Approver Dialog -->
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

        <!-- Reason Dialog -->
        <q-dialog v-model="reasonDialog">
          <q-card
            :class="[
              'bold-text',
              $q.screen.name + '-text',
              $q.screen.name + '-width',
              $q.screen.name + '-min-height',
            ]"
            class="rounded"
          >
            <q-card-section class="bg-primary row items-center q-pb-sm">
              <div class="text-h6 text-white text-bold">
                Leave Request Reason
              </div>
              <q-space></q-space>
              <q-btn
                class="bg-white"
                icon="close"
                push
                round
                dense
                padding="xs"
                v-close-popup
              ></q-btn>
            </q-card-section>
            <q-card-section class="q-pt-xm text-justify text-subtitle1">
              {{ reasonForLeave }}
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page-container>
    </q-layout>
  </div>
</template>
<script>
import helperMethods from "../helperMethods.js";
import DropdownMenu from "../components/DropdownMenuLeaveDetails.vue";
import SkeletonLoader from "../components/loadingSkeleton.vue";
import viewDetails from "../components/viewDetails.vue";
import { mapGetters } from "vuex";
import PrintPDF from "../components/GeneratePDF.vue";
import filingForm from "src/components/filingForm.vue";
import viewLeaveDetails from "src/components/viewLeaveDetails.vue";

let LeaveTypesOptions = [];

const originalOptions = [
  { label: "Google", value: "GL" },
  { label: "Facebook", value: "FB" },
  { label: "Twitter", value: "TW" },
  { label: "Apple", value: "AP" },
  { label: "Oracle", value: "OR" },
];

export default {
  data() {
    return {
      totalVl: "",
      searchTextDetails: "",
      searchTextForfeited: "",
      searchTextBalance: "",
      skeletonAnimations: ["wave", "fade", "fade", "none"],
      approverDialog: false,
      showLeaveHistory: true,
      loadingCounter: null,
      loading: true,
      reasonForCancelation: "",
      cancelId: "",
      cancelDialog: false,
      approversDetails: [],
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
      LeaveTypes: LeaveTypesOptions,
      LeaveDetails: [],

      editDialog: false,
      editLeaveID: null,
      leaveBalance: [],
      balancecolumns: [
        {
          name: "Leave Type",
          label: "Leave Type",
          align: "center",
          field: "leaveType",
          sortable: false,
        },
        {
          name: "Year",
          label: "Year",
          align: "center",
          field: "year",
          sortable: false,
        },
        {
          name: "Balance",
          label: "Balance",
          align: "center",
          field: "remaining",
          sortable: false,
        },
      ],
      leaveLedger: [],
      leaveLedgerColumns: [
        {
          name: "Remarks",
          label: "Remarks",
          align: "center",
          field: "remarks",
          sortable: false,
          width: "300px",
        },
        {
          name: "Leave Type",
          label: "Leave Type",
          align: "center",
          field: "leaveType",
          sortable: false,
          width: "150px",
        },
        {
          name: "Item Type",
          label: "Item Type",
          align: "center",
          field: "iTEMTYPE",
          sortable: false,
          width: "150px",
        },
        {
          name: "Debit",
          label: "Debit",
          align: "center",
          field: "debit",
          sortable: false,
          width: "50px",
        },
        {
          name: "Credit",
          label: "Credit",
          align: "center",
          field: "credit",
          sortable: false,
          width: "50px",
        },
        {
          name: "Year Effectivity",
          label: "Year Effectivity",
          align: "center",
          field: "yearEffectivity",
          sortable: false,
          width: "100px",
        },
        {
          name: "Year Attributed",
          label: "Year Attributed",
          align: "center",
          field: "yearAttributed",
          sortable: false,
          width: "100px",
        },
        {
          name: "Transaction Date",
          label: "Transaction Date",
          align: "center",
          field: "transDate",
          sortable: false,
          width: "100px",
        },
      ],
      reasonDialog: false,
      reasonForRejection: "",
      reasonDialogCancel: false,
      daysExceedsBalance: false,
      model: null,
      options: originalOptions,
      reasonDialog: false,
      reasonForLeave: "",
    };
  },

  components: {
    DropdownMenu,
    SkeletonLoader,
    viewDetails,
    PrintPDF,
    filingForm,
    viewLeaveDetails,
  },

  computed: {
    ...mapGetters({
      leaveTypes: "leaveModule/leaveTypes",
      leaveDetails: "leaveModule/leaveDetails",
      appDetails: "leaveModule/approversDetails",
      leaveBal: "leaveModule/balanceDetails",
      leaveLedgerGetter: "leaveModule/leaveLedgerDetails",
    }),

    LeaveDetailsDirect() {
      return this.$store.state.leaveModule.leaveDetails;
    },

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

    sortedLeaveBalance() {
      if (!Array.isArray(this.leaveBalance)) {
        return [];
      }

      const query = this.searchTextBalance.toLowerCase();

      const filteredLeaves = this.leaveBalance.filter(
        (item) => item.leaveType !== "OL" && item.leaveType !== "OBL",
      );

      const sortedBalances = filteredLeaves
        .filter(
          (row) =>
            row.year.toString().toLowerCase().includes(query) ||
            this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query),
        )
        .sort((a, b) => {
          const leaveTypeOrder = { VL: 1, SL: 2 };
          const orderA = leaveTypeOrder[a.leaveType] || 3;
          const orderB = leaveTypeOrder[b.leaveType] || 3;
          if (orderA === orderB) {
            return b.year - a.year;
          }
          return orderA - orderB;
        });

      return sortedBalances.map((row) => ({
        ...row,
        remaining: Number.isInteger(row.remaining)
          ? row.remaining
          : row.remaining.toFixed(2),
      }));
    },

    sortedLeaveDetails() {
      if (Array.isArray(this.LeaveDetails)) {
        const query = this.searchTextDetails.toLowerCase();
        return this.LeaveDetails.filter((row) => {
          return (
            row.leaveId.toString().toLowerCase().includes(query) ||
            this.formatDateTime(row.transDate).toLowerCase().includes(query) ||
            this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query)
          );
        }).sort((a, b) => b.transDate - a.transDate);
      } else {
        return [];
      }
    },

    sortedLeaveLedger() {
      if (Array.isArray(this.leaveLedger)) {
        const query = this.searchTextForfeited.toLowerCase();
        return this.leaveLedger
          .filter((row) => {
            const remarks = row.remarks
              ? row.remarks.toString().toLowerCase()
              : "";
            const itemType = row.iTEMTYPE
              ? row.iTEMTYPE.toString().toLowerCase()
              : "";
            const leaveTypeLabel =
              this.LeaveTypeLabels[row.leaveType]?.toLowerCase() || "";
            const formattedDate =
              this.formatDateTime(row.transDate)?.toLowerCase() || "";

            return (
              remarks.includes(query) ||
              itemType.includes(query) ||
              leaveTypeLabel.includes(query) ||
              formattedDate.includes(query)
            );
          })
          .sort((a, b) => b.id - a.id);
      } else {
        return [];
      }
    },

    LeaveTypeLabels() {
      return this.leaveTypes.reduce((acc, { value, label }) => {
        acc[value] = label;
        return acc;
      }, {});
    },
  },

  methods: {
    clearSearchText() {
      this.searchTextDetails = "";
      this.searchTextForfeited = "";
      this.searchTextBalance = "";
    },

    async successFiling() {
      await this.fetchLeaves();
    },

    async emitSuccessEditing() {
      await this.fetchLeaves();
    },

    async fetchLeaves() {
      await helperMethods.delay(500);
      try {
        await this.$store.dispatch("leaveModule/fetchLeaves");
        this.LeaveDetails = this.leaveDetails;
        // this.LeaveDetails = [...this.$store.state.leaveModule.leaveDetails];
        this.loadingCounter++;
        if (this.loadingCounter === 3) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed getting Leave Details");
      }
    },

    async fetchApprovers() {
      await helperMethods.delay(500);
      try {
        await this.$store.dispatch("leaveModule/fetchApprovers");
        this.approversDetails = this.appDetails;
      } catch (error) {
        console.error("Faile getting approvers details");
      }
    },

    async fetchleaveBalance() {
      try {
        await this.$store.dispatch("leaveModule/fetchleaveBalances");
        this.leaveBalance = this.leaveBal;
        let sumVL = 0;
        for (const balance of this.leaveBalance) {
          if (balance.leaveType === "VL") {
            sumVL += balance.remaining;
          }
        }
        this.totalVl = sumVL;
        this.loadingCounter++;
        if (this.loadingCounter === 3) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed Getting User Leave Balance");
      }
    },

    async fetchLeaveLedger() {
      try {
        await this.$store.dispatch("leaveModule/fetchLeaveLedger");
        this.leaveLedger = this.leaveLedgerGetter;
        this.loadingCounter++;
        if (this.loadingCounter === 3) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed to get the leave ledger");
      }
    },

    async fetchLeaveTypes() {
      try {
        await this.$store.dispatch("leaveModule/fetchLeaveTypes");
        LeaveTypesOptions = this.leaveTypes;
      } catch (error) {
        console.error("Failed to get the leave types");
      }
    },

    formatDateTime(dateTimeString) {
      const options = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString("en-PH", options);
    },

    formatTimeTo12Hours(Time) {
      return Time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    },

    getFormattedCellValue(row, col) {
      if (col.field === "leaveType") {
        return this.LeaveTypeLabels[row[col.field]];
      } else if (
        col.field === "dateLeavedFrom" ||
        col.field === "dateLeavedTo" ||
        col.field === "transDate"
      ) {
        return this.formatDateTime(row[col.field]);
      } else {
        return row[col.field];
      }
    },
  },

  created() {
    this.fetchLeaves();
    this.fetchleaveBalance();
    this.fetchLeaveLedger();
    this.fetchApprovers();
    this.fetchLeaveTypes();
  },
};
</script>

<style>
.roundedd {
  border-radius: 10px;
  margin-bottom: 50px;
  margin-top: 10px;
  height: 580px;
  display: flex;
  flex-direction: column;
}

.roundedd1 {
  border-radius: 10px;
  padding-bottom: 10px;
}
</style>
