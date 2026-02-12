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
              :userApproved="userApprovedLeave"
              :userRejected="userRejectedLeave"
              :approvedDetails="approvedLeaves"
              :rejectedDetails="rejectedLeaves"
              :deptDescriptionsOptions="deptDescriptions"
              :cancelOperationModule="false"
              :pendingOperationModule="true"
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
      loadingCounter: null,
      loading: true,
      LeaveTypes: [],
      approvedLeaves: [],
      rejectedLeaves: [],
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
      userApprovedLeave: [],
      userRejectedLeave: [],
      deptDescriptions: deptDescriptionsOptions,
    };
  },

  components: {
    SkeletonLoader,
    viewOperation,
  },

  computed: {
    ...mapGetters({
      leaveTypes: "leaveModule/leaveTypes",
      pendingDetails: "leaveModule/pendingDetails",
      appDetails: "leaveModule/approvedDetails",
      rejectDetails: "leaveModule/rejectedDetails",
      userAppLeave: "leaveModule/userApprovedLeave",
      userRejectLeave: "leaveModule/userRejectedLeave",
      userCode: "user_module/employee_id",
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

    async fetchpendingLeaves() {
      try {
        await this.$store.dispatch("leaveModule/fetchpendingLeaves");
        this.pendingLeaveDetails = this.pendingDetails;

        if (this.pendingLeaveDetails && this.pendingLeaveDetails.length > 0) {
          this.processDepartmentFilter(this.pendingLeaveDetails);
        }

        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed to get pending leaves / Admin Only", error);
      }
    },

    async fetchapprovedLeaves() {
      try {
        await this.$store.dispatch("leaveModule/fetchapprovedLeaves");
        this.approvedLeaves = this.appDetails;
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed to get Approved leaves / Admin Only", error);
      }
    },

    async fetchrejectedLeaves() {
      try {
        await this.$store.dispatch("leaveModule/fetchrejectedLeaves");
        this.rejectedLeaves = this.rejectDetails;
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed to get Rejected leaves / Admin Only", error);
      }
    },

    async fetchUserApprovedLeaves() {
      try {
        await this.$store.dispatch("leaveModule/fetchUserApprovedLeave");
        this.userApprovedLeave = this.userAppLeave;
        if (this.userApprovedLeave && this.userApprovedLeave.length > 0) {
          this.processDepartmentFilter(this.userApprovedLeave);
        }
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed to get User Approved Leaves");
      }
    },

    async fetchUserRejectedLeaves() {
      try {
        await this.$store.dispatch("leaveModule/fetchUserRejectedLeave");
        this.userRejectedLeave = this.userRejectLeave;
        if (this.userRejectedLeave && this.userRejectedLeave.length > 0) {
          this.processDepartmentFilter(this.userRejectedLeave);
        }
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed to get User Approved Leaves");
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
      await this.fetchpendingLeaves();
      await this.fetchapprovedLeaves();
      await this.fetchrejectedLeaves();
      await this.fetchUserApprovedLeaves();
      await this.fetchUserRejectedLeaves();
      await this.fetchLeaveTypes();
    },
  },

  created() {
    this.fetchpendingLeaves();
    this.fetchapprovedLeaves();
    this.fetchrejectedLeaves();
    this.fetchUserApprovedLeaves();
    this.fetchUserRejectedLeaves();
    this.fetchLeaveTypes();
  },
};
</script>
