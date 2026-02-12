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
              :pendingDetails="pendingDetails"
              :pendingColumns="pendingColumns"
              :userApproved="userApproved"
              :userRejected="userRejected"
              :approvedDetails="approvedDetails"
              :rejectedDetails="rejectedDetails"
              :pendingAccomplishment="pendingAccomplishDetails"
              :deptDescriptionsOptions="deptDescriptions"
              :cancelOperationModule="false"
              :pendingOperationModule="true"
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
import dropdown1 from "../components/DropdownMenuLeaveOps1.vue";
import virtualScrollAction from "../components/virtualScrollAction.vue";
import viewOperation from "../components/viewOperation.vue";
import SkeletonLoader from "../components/loadingSkeleton.vue";
import helperMethods from "src/helperMethods";

export default {
  data() {
    return {
      pendingDetails: [],
      // showHeadApproveCard: true,
      // showMyApproved: false,
      // showMyRejected: false,
      // filterDialog: false,
      userApproved: [],
      userRejected: [],
      approvedDetails: [],
      rejectedDetails: [],
      // selectedDeptDescription: "",
      deptDescriptions: [],
      // searchTextPending: "",
      pendingColumns: [
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
          width: "100px",
        },
        {
          name: "Overtime Date",
          label: "Date Of Overtime",
          align: "center",
          field: "formatedDateOvertime",
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
        //   name: "TimeFrom",
        //   label: "Time From",
        //   align: "center",
        //   field: "timeFrom",
        //   sortable: false,
        //   width: "118px",
        // },
        // {
        //   name: "TimeTo",
        //   label: "Time To",
        //   align: "center",
        //   field: "timeTo",
        //   sortable: false,
        //   width: "118px",
        // },
        {
          name: "Reason",
          label: "Reason",
          align: "left",
          sortable: false,
          width: "350px",
        },
        {
          name: "Actions",
          label: "Actions",
          align: "center",
          sortable: false,
          width: "120px",
        },
      ],
      loading: true,
      loadingCounter: null,
      pendingAccomplishDetails: [],
    };
  },

  components: {
    dropdown1,
    virtualScrollAction,
    viewOperation,
    SkeletonLoader,
  },

  computed: {
    ...mapGetters({
      pendingOvertime: "overtimeModule/getPendingOvertime",
      userApprovedDetails: "overtimeModule/getUserApprovedOvertime",
      userRejectedDetails: "overtimeModule/getUserRejectedOvertime",
      getApprovedDetails: "overtimeModule/getApprovedOvertime",
      getRejectedDetails: "overtimeModule/getRejectedOvertime",
      pendingAccomplishmentGetter: "overtimeModule/getPendingAccomplishment",
    }),
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

    async getPendingOvertime() {
      try {
        helperMethods.delay(500);
        await this.$store.dispatch("overtimeModule/getPendingOvertime");
        this.pendingDetails = this.pendingOvertime;

        if (this.pendingDetails && this.pendingDetails.length > 0) {
          this.processDepartmentFilter(this.pendingDetails);
        }
        this.loadingCounter++;
        if (this.loadingCounter === 5) {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;

        if (error.response.status === 404) {
          console.error(error.response.data.body);
          return;
        }
        console.error("Failed getting getting overtime review details");
      }
    },

    async getUserApprovedOvertime() {
      try {
        helperMethods.delay(500);

        const status = {
          status: "ApprovedUser",
        };
        await this.$store.dispatch(
          "overtimeModule/getUserApprovedOvertime",
          status,
        );
        this.userApproved = this.userApprovedDetails;
        if (this.userApproved && this.userApproved.length > 0) {
          this.processDepartmentFilter(this.userApproved);
        }
        this.loadingCounter++;
        if (this.loadingCounter === 5) {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;

        if (error.response.status === 404) {
          console.error(error.response.data.body);
          return;
        }
        console.error("Failed getting getting overtime review details");
      }
    },

    async getUseRejectedOvertime() {
      try {
        helperMethods.delay(500);

        const status = {
          status: "RejectedUser",
        };
        await this.$store.dispatch(
          "overtimeModule/getUseRejectedOvertime",
          status,
        );
        this.userRejected = this.userRejectedDetails;
        if (this.userRejected && this.userRejected.length > 0) {
          this.processDepartmentFilter(this.userRejected);
        }
        this.loadingCounter++;
        if (this.loadingCounter === 5) {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;

        if (error.response.status === 404) {
          console.error(error.response.data.body);
          return;
        }
        console.error("Failed getting getting overtime review details");
      }
    },

    async getApprovedOvertime() {
      try {
        helperMethods.delay(500);

        const status = {
          status: "Approved",
        };
        await this.$store.dispatch(
          "overtimeModule/getApprovedOvertime",
          status,
        );
        this.approvedDetails = this.getApprovedDetails;
        this.loadingCounter++;
        if (this.loadingCounter === 5) {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;

        if (error.response.status === 404) {
          console.error(error.response.data.body);
          return;
        }
        console.error("Failed getting getting overtime review details");
      }
    },

    async getRejectedOvertime() {
      try {
        helperMethods.delay(500);
        const status = {
          status: "Rejected",
        };
        await this.$store.dispatch(
          "overtimeModule/getRejectedOvertime",
          status,
        );
        this.rejectedDetails = this.getRejectedDetails;
        this.loadingCounter++;
        if (this.loadingCounter === 5) {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        if (error.response.status === 404) {
          console.error(error.response.data.body);
          return;
        }
        console.error("Failed getting getting overtime review details");
      }
    },

    async getPendingAccomplishment() {
      try {
        helperMethods.delay(500);
        await this.$store.dispatch("overtimeModule/getPendingAccomplishment");
        this.pendingAccomplishDetails = this.pendingAccomplishmentGetter;
      } catch (error) {
        this.loading = false;
        if (error.response.status === 404) {
          console.error(error.response.data.body);
          return;
        }
        console.error("Failed getting getting overtime review details");
      }
    },

    async successAction() {
      this.getPendingOvertime();
      this.getUserApprovedOvertime();
      this.getUseRejectedOvertime();
      this.getApprovedOvertime();
      this.getRejectedOvertime();
      this.getPendingAccomplishment();
    },
  },

  created() {
    this.getPendingOvertime();
    this.getUserApprovedOvertime();
    this.getUseRejectedOvertime();
    this.getApprovedOvertime();
    this.getRejectedOvertime();
    this.getPendingAccomplishment();
  },
};
</script>
