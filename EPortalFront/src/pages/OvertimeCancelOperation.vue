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
              :pendingDetails="pendingCancelDetails"
              :pendingColumns="pendingCancelColumns"
              :userApproved="userApproved"
              :userRejected="userRejected"
              :approvedDetails="approvedDetails"
              :rejectedDetails="rejectedDetails"
              :deptDescriptionsOptions="deptDescriptions"
              :cancelOperationModule="true"
              :pendingOperationModule="false"
              :overtimeModule="true"
              @successApproved="successAction()"
            />
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from "vuex";
import viewOperation from "src/components/viewOperation.vue";
import SkeletonLoader from "../components/loadingSkeleton.vue";
import helperMethods from "src/helperMethods";

export default {
  data() {
    return {
      pendingCancelDetails: [],
      deptDescriptions: [],
      userApproved: [],
      userRejected: [],
      approvedDetails: [],
      rejectedDetails: [],
      pendingCancelColumns: [
        {
          name: "Employee Name",
          label: "Employee Name",
          align: "center",
          field: "employeeName",
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
          name: "Hours",
          label: "Hours",
          align: "center",
          field: "workHours",
          sortable: false,
          width: "80px",
        },
        {
          name: "Overtime Date",
          label: "Date Of Overtime",
          align: "center",
          field: "formatedDateOvertime",
          sortable: false,
          width: "120px",
        },

        {
          name: "TimeFrom",
          label: "Time From",
          align: "center",
          field: "timeFrom",
          sortable: false,
          width: "118px",
        },
        {
          name: "TimeTo",
          label: "Time To",
          align: "center",
          field: "timeTo",
          sortable: false,
          width: "118px",
        },
        {
          name: "Reason",
          label: "Reason",
          align: "left",
          sortable: false,
          width: "80px",
        },
        {
          name: "Actions",
          label: "Actions",
          align: "center",
          sortable: false,
          width: "150px",
        },
      ],
      loading: true,
      loadingCounter: null,
    };
  },

  computed: {
    ...mapGetters({
      getPendingCancel: "overtimeModule/getPendingCancelOvertime",
      getUserApprovedCancel: "overtimeModule/getUserApprovedCancel",
      getUserRejectedCancel: "overtimeModule/getUserRejectedCancel",
      getRejectedCancel: "overtimeModule/getRejectedCancel",
      getApprovedCancel: "overtimeModule/getApprovedCancel",
    }),
  },

  components: {
    viewOperation,
    SkeletonLoader,
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

    async getPendingCancelOvertime() {
      try {
        helperMethods.delay(500);
        await this.$store.dispatch("overtimeModule/getPendingCancelOvertime");
        this.pendingCancelDetails = this.getPendingCancel;
        if (this.pendingCancelDetails && this.pendingCancelDetails.length > 0) {
          this.processDepartmentFilter(this.pendingCancelDetails);
        }
        this.loadingCounter++;
        if (this.loadingCounter === 5) {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        // if (error.response.status === 404) {
        //   console.error(error.response.data.body);
        //   return;
        // }
        console.error("Failed getting getting overtime review details");
      }
    },

    async successAction() {
      await this.getPendingCancelOvertime();
    },

    async getUserApprovedCancelOvertime() {
      try {
        helperMethods.delay(500);
        const status = {
          status: "ApprovedUser",
        };
        await this.$store.dispatch(
          "overtimeModule/userApprovedCancelOvertime",
          status,
        );
        this.userApproved = this.getUserApprovedCancel;
        if (this.userApproved && this.userApproved.length > 0) {
          this.processDepartmentFilter(this.userApproved);
        }
        this.loadingCounter++;
        if (this.loadingCounter === 5) {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        // if (error.response.status === 404) {
        //   console.error(error.response.data.body);
        //   return;
        // }
        console.error("Failed getting getting overtime review details");
      }
    },

    async getUserRejectedCancelOvertime() {
      try {
        helperMethods.delay(500);
        const status = {
          status: "RejectedUser",
        };
        await this.$store.dispatch(
          "overtimeModule/userRejectedCancelOvertime",
          status,
        );
        this.userRejected = this.getUserRejectedCancel;
        if (this.userRejected && this.userRejected.length > 0) {
          this.processDepartmentFilter(this.userRejected);
        }
        this.loadingCounter++;
        if (this.loadingCounter === 5) {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        // if (error.response.status === 404) {
        //   console.error(error.response.data.body);
        //   return;
        // }
        console.error("Failed getting getting overtime review details");
      }
    },

    async getApprovedCancelOvertime() {
      try {
        helperMethods.delay(500);
        const status = {
          status: "Approved",
        };
        await this.$store.dispatch(
          "overtimeModule/approvedCancelOvertime",
          status,
        );
        this.approvedDetails = this.getApprovedCancel;
        this.loadingCounter++;
        if (this.loadingCounter === 5) {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        // if (error.response.status === 404) {
        //   console.error(error.response.data.body);
        //   return;
        // }
        console.error("Failed getting getting overtime review details");
      }
    },

    async getRejectedCancelOvertime() {
      try {
        helperMethods.delay(500);
        const status = {
          status: "Rejected",
        };
        await this.$store.dispatch(
          "overtimeModule/rejectedCancelOvertime",
          status,
        );
        this.rejectedDetails = this.getRejectedCancel;
        this.loadingCounter++;
        if (this.loadingCounter === 5) {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        // if (error.response.status === 404) {
        //   console.error(error.response.data.body);
        //   return;
        // }
        console.error("Failed getting getting overtime review details");
      }
    },
  },

  created() {
    this.getPendingCancelOvertime();
    this.getUserApprovedCancelOvertime();
    this.getUserRejectedCancelOvertime();
    this.getApprovedCancelOvertime();
    this.getRejectedCancelOvertime();
  },
};
</script>
