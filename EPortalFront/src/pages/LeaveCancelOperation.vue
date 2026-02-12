<template>
  <q-layout>
    <q-page-container>
      <div class="containermainn">
        <div class="row" style="width: 95%">
          <div class="col-12">
            <div v-if="loading">
              <div class="bg-grey-2 q-mb-xl">
                <q-skeleton :style="{ height: '65px' }" />
                <SkeletonLoader :row-count="9" :column-count="8" />
              </div>
              <div class="bg-grey-2" v-if="loading">
                <q-skeleton :style="{ height: '65px' }" />
                <SkeletonLoader :row-count="9" :column-count="8" />
              </div>
            </div>
            <viewOperation
              v-else
              :pendingDetails="pendingLeaveDetails"
              :pendingColumns="pendingColumns"
              :LeaveTypeLabels="LeaveTypeLabels"
              :userApproved="userApprovedCancel"
              :userRejected="userRejectedCancel"
              :approvedDetails="approvedCancel"
              :rejectedDetails="rejectedCancel"
              :deptDescriptionsOptions="deptDescriptions"
              :cancelOperationModule="true"
              :pendingOperationModule="false"
              :overtimeModule="false"
              @successApproved="successAction()"
            />
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>
<script>
import helperMethods from "../helperMethods.js";
import SkeletonLoader from "../components/loadingSkeleton.vue";
import { mapGetters } from "vuex";
import viewOperation from "src/components/viewOperation.vue";

let deptDescriptionsOptions = [];

export default {
  data() {
    return {
      pendingLeaveDetails: [],
      pendingColumns: [
        {
          name: "Employee Name",
          label: "Employee Name",
          align: "center",
          field: "EmployeeName",
          sortable: false,
          width: "150px",
        },
        {
          name: "Created",
          label: "Created",
          align: "center",
          field: "transDate",
          sortable: false,
          width: "80px",
        },
        {
          name: "Days",
          label: "Days",
          align: "center",
          field: "daysOfLeave",
          sortable: false,
          width: "50px",
        },
        {
          name: "Remaining Leave",
          label: "Remaining Leave",
          align: "center",
          field: "remainingBalance",
          sortable: false,
          width: "50px",
        },
        {
          name: "Date",
          label: "Date",
          align: "center",
          field: "",
          sortable: false,
          width: "120px",
        },
        // {
        //   name: "DateFrom",
        //   label: "Date From",
        //   align: "center",
        //   field: "dateLeavedFrom",
        //   sortable: false,
        //   width: "120px",
        // },
        // {
        //   name: "DateTo",
        //   label: "Date To",
        //   align: "center",
        //   field: "dateLeavedTo",
        //   sortable: false,
        //   width: "120px",
        // },
        {
          name: "Time",
          label: "Time",
          align: "center",
          field: "",
          sortable: false,
          width: "100px",
        },
        // {
        //   name: "TimeFrom",
        //   label: "Time From",
        //   align: "center",
        //   field: "tIME_FROM",
        //   sortable: false,
        //   width: "118px",
        // },
        // {
        //   name: "TimeTo",
        //   label: "Time To",
        //   align: "center",
        //   field: "tIME_TO",
        //   sortable: false,
        //   width: "118px",
        // },
        {
          name: "LeaveType",
          label: "Leave Type",
          align: "center",
          field: "leaveType",
          sortable: false,
          width: "120px",
        },
        {
          name: "Reason",
          label: "Reason",
          align: "left",
          sortable: false,
          width: "230px",
        },
        {
          name: "Actions",
          label: "Actions",
          align: "center",
          sortable: false,
          width: "100px",
        },
      ],

      userApprovedCancel: [],
      userRejectedCancel: [],
      rejectedCancel: [],
      approvedCancel: [],

      loading: true,
      deptDescriptions: deptDescriptionsOptions,
      loadingCounter: null,
    };
  },

  components: {
    SkeletonLoader,
    viewOperation,
  },

  computed: {
    ...mapGetters({
      leaveTypes: "leaveModule/leaveTypes",
      cancelPending: "leaveModule/cancelPending",
      userAppCancel: "leaveModule/userApprovedCancel",
      userRejectCancel: "leaveModule/userRejectedCancel",
      appCancel: "leaveModule/approvedCancel",
      rejectCancel: "leaveModule/rejectedCancel",
    }),

    LeaveTypeLabels() {
      return this.leaveTypes.reduce((acc, LeaveType) => {
        acc[LeaveType.value] = LeaveType.label;
        return acc;
      }, {});
    },
  },

  methods: {
    processDepartmentFilter(data) {
      this.deptDescriptions = [
        ...new Set(
          data.map((leave) =>
            leave.deptDescription
              ? leave.deptDescription
              : leave.deptDescSecond,
          ),
        ),
      ];
    },

    async getPendingCancel() {
      try {
        await this.$store.dispatch("leaveModule/getPendingCancel");
        this.pendingLeaveDetails = this.cancelPending;

        if (this.pendingLeaveDetails && this.pendingLeaveDetails.length > 0) {
          this.processDepartmentFilter(this.pendingLeaveDetails);
        }

        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error(error, "Failed to fetch pending cancel leave");
      }
    },

    async fetchUserCancelApprovedLeaves() {
      try {
        await this.$store.dispatch("leaveModule/fetchUserCancelApprovedLeaves");
        this.userApprovedCancel = this.userAppCancel;
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error(error, "Failed to fetch user approved cancel leave");
      }
    },

    async fetchUserCancelRejectedLeaves() {
      try {
        await this.$store.dispatch("leaveModule/fetchUserCancelRejectedLeaves");
        this.userRejectedCancel = this.userRejectCancel;
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error(error, "Failed to fetch user rejected cancel leave");
      }
    },

    async fetchApprovedCancelledLeaves() {
      try {
        await helperMethods.delay(500);
        await this.$store.dispatch("leaveModule/fetchApprovedCancelledLeaves");
        this.approvedCancel = this.appCancel;
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error(error, "Failed to fetch approved cancel leave");
      }
    },

    async fetchRejectedCancelledLeaves() {
      try {
        await this.$store.dispatch("leaveModule/fetchRejectedCancelledLeaves");
        this.rejectedCancel = this.rejectCancel;
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error(error, "Failed to fetch rejected cancel leave");
      }
    },

    async fetchLeaveTypes() {
      try {
        await this.$store.dispatch("leaveModule/fetchLeaveTypes");
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed to get the leave types");
      }
    },

    async successAction() {
      await this.getPendingCancel();
      await this.fetchApprovedCancelledLeaves();
      await this.fetchRejectedCancelledLeaves();
      await this.fetchUserCancelApprovedLeaves();
      await this.fetchUserCancelRejectedLeaves();
      await this.fetchLeaveTypes();
    },
  },

  created() {
    this.getPendingCancel();
    this.fetchApprovedCancelledLeaves();
    this.fetchRejectedCancelledLeaves();
    this.fetchUserCancelApprovedLeaves();
    this.fetchUserCancelRejectedLeaves();
    this.fetchLeaveTypes();
  },
};
</script>
