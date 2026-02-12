<template>
  <div class="row">
    <div class="col-12">
      <q-card v-if="showHeadApproveCard" class="roundedd1">
        <template v-if="$q.screen.width > 900">
          <q-card-section
            class="bg-primary text-white text-center"
            :class="['bold-text', $q.screen.name + '-text']"
          >
            <div class="row">
              <div class="col-4 text-left">
                <dropdown1
                  :showHeadDept="true"
                  @head-approve="handleApprove('headApprove', pendingDetails)"
                  @accomplish-approve="
                    handleApprove('accomplishApprove', pendingAccomplishment)
                  "
                  @my-approved="handleApprove('myApproved', userApproved)"
                  @my-rejected="handleApprove('myRejected', userRejected)"
                  @filter-leaves="handleFilterDepartment"
                  :pendingLeave="pendingOperationModule"
                  :overtimeModule="overtimeModule"
                  :cancelLeave="cancelOperationModule"
                />
              </div>
              <div class="col-4 text-center">
                {{
                  overtimeModule
                    ? cancelOperationModule
                      ? "Pending Cancel Overtime"
                      : "Pending Overtime Details"
                    : cancelOperationModule
                      ? "Pending Cancel Leave"
                      : "Pending Leave Details"
                }}
              </div>
              <div class="col-4 text-right">
                <q-input
                  class="bg-white"
                  v-model="searchTextPending"
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

          <virtualScrollAction
            v-if="!cancelOperationModule && pendingOperationModule"
            :items="filterPendingDetails"
            :columns="pendingColumns"
            :sortedPendingLeave="sortedPendingDetails"
            :selectedDeptDescription="selectedDeptDescription"
            :overtimeModule="overtimeModule"
            :LeaveTypeLabels="LeaveTypeLabels"
            @successApplication="successApplication()"
          />

          <virtualScrollCancelAction
            v-if="cancelOperationModule && !pendingOperationModule"
            :items="filterPendingDetails"
            :columns="pendingColumns"
            :sortedPendingLeave="sortedPendingDetails"
            :selectedDeptDescription="selectedDeptDescription"
            :overtimeModule="overtimeModule"
            :LeaveTypeLabels="LeaveTypeLabels"
            @successApplication="successApplication()"
          />

          <div
            v-if="filterPendingDetails.length === 0"
            class="full-width row flex-center text-black text-subtitle2"
          >
            <div>
              No data available
              <q-icon
                class="text-red"
                size="2em"
                name="sentiment_dissatisfied"
              ></q-icon>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="row">
            <q-card-section
              style="border-radius: 10px"
              class="col-12 bg-primary text-white text-center"
              :class="['bold-text', $q.screen.name + '-text']"
            >
              {{
                overtimeModule
                  ? cancelOperationModule
                    ? "Pending Cancel Overtime"
                    : "Pending Overtime Details"
                  : cancelOperationModule
                    ? "Pending Cancel Leave"
                    : "Pending Leave Details"
              }}
            </q-card-section>

            <div
              class="text-left"
              :class="[$q.screen.lt.sm ? 'col-12' : 'col-6']"
            >
              <dropdown1
                :showHeadDept="true"
                @head-approve="handleApprove('headApprove', pendingDetails)"
                @accomplish-approve="
                  handleApprove('accomplishApprove', pendingAccomplishment)
                "
                @my-approved="handleApprove('myApproved', userApproved)"
                @my-rejected="handleApprove('myRejected', userRejected)"
                @filter-leaves="handleFilterDepartment"
                :pendingLeave="pendingOperationModule"
                :overtimeModule="overtimeModule"
                :cancelLeave="cancelOperationModule"
              />
            </div>
            <div
              class="text-right"
              :class="[$q.screen.lt.sm ? 'col-12' : 'col-6']"
            >
              <q-input
                class="bg-white"
                v-model="searchTextPending"
                placeholder="Search"
                dense
                outlined
                clearable
                :style="{ marginLeft: 'auto' }"
                :class="[$q.screen.name + '-text2']"
                @clear="clearSearchText"
              />
            </div>
          </div>
          <qTable
            :items="filterPendingDetails"
            :columns="pendingColumns"
            :LeaveTypeLabels="LeaveTypeLabels"
            :overtimeModule="overtimeModule"
            :cancelLeave="cancelOperationModule"
            @successApplication="successApplication()"
          />
        </template>
      </q-card>

      <q-card v-if="showPendingAccomplish" class="roundedd1">
        <q-card-section
          class="bg-primary text-white text-center"
          :class="['bold-text', $q.screen.name + '-text']"
        >
          <div class="row">
            <div class="col-4 text-left">
              <dropdown1
                :showHeadDept="true"
                @head-approve="handleApprove('headApprove', pendingDetails)"
                @accomplish-approve="
                  handleApprove('accomplishApprove', pendingAccomplishment)
                "
                @my-approved="handleApprove('myApproved', userApproved)"
                @my-rejected="handleApprove('myRejected', userRejected)"
                @filter-leaves="handleFilterDepartment"
                :pendingLeave="pendingOperationModule"
                :overtimeModule="overtimeModule"
                :cancelLeave="cancelOperationModule"
              />
            </div>
            <div class="col-4 text-center">Pending Accomplishment</div>
            <div class="col-4 text-right">
              <q-input
                class="bg-white"
                v-model="searchTextPending"
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
        <virtualScrollAction
          v-if="!cancelOperationModule && pendingOperationModule"
          :items="filterPendingDetails"
          :columns="pendingColumns"
          :sortedPendingLeave="sortedPendingDetails"
          :selectedDeptDescription="selectedDeptDescription"
          :overtimeModule="overtimeModule"
          :LeaveTypeLabels="LeaveTypeLabels"
          :accomplishModule="showPendingAccomplish"
          @successApplication="successApplication()"
        />

        <div
          v-if="filterPendingDetails.length === 0"
          class="full-width row flex-center text-black text-subtitle2"
        >
          <div>
            No data available
            <q-icon
              class="text-red"
              size="2em"
              name="sentiment_dissatisfied"
            ></q-icon>
          </div>
        </div>
      </q-card>

      <div v-if="showMyApproved">
        <q-card class="roundedd1">
          <template v-if="$q.screen.width > 900">
            <q-card-section
              class="bg-primary text-white text-center"
              :class="['bold-text', $q.screen.name + '-text']"
            >
              <div class="row">
                <div class="col-4 text-left">
                  <dropdown1
                    :showHeadDept="true"
                    @head-approve="handleApprove('headApprove', pendingDetails)"
                    @accomplish-approve="
                      handleApprove('accomplishApprove', pendingAccomplishment)
                    "
                    @my-approved="handleApprove('myApproved', userApproved)"
                    @my-rejected="handleApprove('myRejected', userRejected)"
                    @filter-leaves="handleFilterDepartment"
                    :pendingLeave="pendingOperationModule"
                    :overtimeModule="overtimeModule"
                    :cancelLeave="cancelOperationModule"
                  />
                </div>
                <div class="col-4 text-center">
                  My Approved {{ cancelOperationModule ? "Cancel" : "" }}
                  {{ overtimeModule ? "Overtime" : "Leaves" }}
                </div>
                <div class="col-4 text-right">
                  <q-input
                    class="bg-white"
                    v-model="searchTextPending"
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
            <virtualScrollView
              :items="filterPendingDetails"
              :columns="pendingColumns"
              :leaveView="true"
              :overtimeModule="overtimeModule"
              :LeaveTypeLabels="LeaveTypeLabels"
            />
            <div
              v-if="filterPendingDetails.length === 0"
              class="full-width row flex-center text-black text-subtitle2"
            >
              <div>
                No data available
                <q-icon
                  class="text-red"
                  size="2em"
                  name="sentiment_dissatisfied"
                ></q-icon>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="row">
              <q-card-section
                style="border-radius: 10px"
                class="col-12 bg-primary text-white text-center"
                :class="['bold-text', $q.screen.name + '-text']"
              >
                My Approved {{ cancelOperationModule ? "Cancel" : "" }}
                {{ overtimeModule ? "Overtime" : "Leaves" }}
              </q-card-section>

              <div
                class="text-left"
                :class="[$q.screen.lt.sm ? 'col-12' : 'col-6']"
              >
                <dropdown1
                  :showHeadDept="true"
                  @head-approve="handleApprove('headApprove', pendingDetails)"
                  @accomplish-approve="
                    handleApprove('accomplishApprove', pendingAccomplishment)
                  "
                  @my-approved="handleApprove('myApproved', userApproved)"
                  @my-rejected="handleApprove('myRejected', userRejected)"
                  @filter-leaves="handleFilterDepartment"
                  :pendingLeave="pendingOperationModule"
                  :overtimeModule="overtimeModule"
                  :cancelLeave="cancelOperationModule"
                />
              </div>
              <div
                class="text-right"
                :class="[$q.screen.lt.sm ? 'col-12' : 'col-6']"
              >
                <q-input
                  class="bg-white"
                  v-model="searchTextPending"
                  placeholder="Search"
                  dense
                  outlined
                  clearable
                  :style="{ marginLeft: 'auto' }"
                  :class="[$q.screen.name + '-text2']"
                  @clear="clearSearchText"
                />
              </div>
            </div>
            <qTableCard
              :items="filterPendingDetails"
              :columns="pendingColumns"
              :LeaveTypeLabels="LeaveTypeLabels"
              :cancelLeave="cancelOperationModule"
            />
          </template>
        </q-card>
      </div>

      <div v-if="showMyRejected">
        <q-card class="roundedd1">
          <template v-if="$q.screen.width > 900">
            <q-card-section
              class="bg-negative text-white text-center"
              :class="['bold-text', $q.screen.name + '-text']"
            >
              <div class="row">
                <div class="col-4 text-left">
                  <dropdown1
                    :showHeadDept="true"
                    @head-approve="handleApprove('headApprove', pendingDetails)"
                    @accomplish-approve="
                      handleApprove('accomplishApprove', pendingAccomplishment)
                    "
                    @my-approved="handleApprove('myApproved', userApproved)"
                    @my-rejected="handleApprove('myRejected', userRejected)"
                    @filter-leaves="handleFilterDepartment"
                    :pendingLeave="pendingOperationModule"
                    :overtimeModule="overtimeModule"
                    :cancelLeave="cancelOperationModule"
                  />
                </div>
                <div class="col-4 text-center">
                  My Rejected {{ cancelOperationModule ? "Cancel" : "" }}
                  {{ overtimeModule ? "Overtime" : "Leaves" }}
                </div>
                <div class="col-4 text-right">
                  <q-input
                    class="bg-white"
                    style="font-size: 15px"
                    v-model="searchTextPending"
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

            <virtualScrollView
              :items="filterPendingDetails"
              :columns="pendingColumns"
              :leaveView="true"
              :overtimeModule="overtimeModule"
              :LeaveTypeLabels="LeaveTypeLabels"
            />
            <div
              v-if="filterPendingDetails.length === 0"
              class="full-width row flex-center text-black text-subtitle2"
            >
              <div>
                No data available
                <q-icon
                  class="text-red"
                  size="2em"
                  name="sentiment_dissatisfied"
                ></q-icon>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="row">
              <q-card-section
                style="border-radius: 10px"
                class="col-12 bg-negative text-white text-center"
                :class="['bold-text', $q.screen.name + '-text']"
              >
                My Rejected {{ cancelOperationModule ? "Cancel" : "" }}
                {{ overtimeModule ? "Overtime" : "Leaves" }}
              </q-card-section>

              <div
                class="text-left"
                :class="[$q.screen.lt.sm ? 'col-12' : 'col-6']"
              >
                <dropdown1
                  :showHeadDept="true"
                  @head-approve="handleApprove('headApprove', pendingDetails)"
                  @accomplish-approve="
                    handleApprove('accomplishApprove', pendingAccomplishment)
                  "
                  @my-approved="handleApprove('myApproved', userApproved)"
                  @my-rejected="handleApprove('myRejected', userRejected)"
                  @filter-leaves="handleFilterDepartment"
                  :pendingLeave="pendingOperationModule"
                  :overtimeModule="overtimeModule"
                  :cancelLeave="cancelOperationModule"
                />
              </div>
              <div
                class="text-right"
                :class="[$q.screen.lt.sm ? 'col-12' : 'col-6']"
              >
                <q-input
                  class="bg-white"
                  v-model="searchTextPending"
                  placeholder="Search"
                  dense
                  outlined
                  clearable
                  :style="{ marginLeft: 'auto' }"
                  :class="[$q.screen.name + '-text2']"
                  @clear="clearSearchText"
                />
              </div>
            </div>
            <qTableCard
              :items="filterPendingDetails"
              :columns="pendingColumns"
              :LeaveTypeLabels="LeaveTypeLabels"
              :cancelLeave="cancelOperationModule"
            />
          </template>
        </q-card>
      </div>
    </div>

    <div class="col-12">
      <q-card v-show="showApprovedLeaves" class="rounded">
        <template v-if="$q.screen.width > 900">
          <q-card-section
            class="bg-primary text-white text-h6 text-center"
            :class="['bold-text', $q.screen.name + '-text']"
          >
            <div class="row">
              <div class="col-4 text-left">
                <dropdown2
                  @show-approved-leaves="showApprovedLeaves = true"
                  @show-rejected-leaves="showApprovedLeaves = false"
                  :cancelLeave="cancelOperationModule"
                  :pendingLeave="pendingOperationModule"
                  :overtimeModule="overtimeModule"
                />
              </div>
              <div class="col-4 text-center">
                Approved {{ cancelOperationModule ? "Cancel" : "" }}
                {{ overtimeModule ? "Overtime" : "Leaves" }}
              </div>
              <div class="col-4 text-right">
                <q-input
                  class="bg-white"
                  style="font-size: 15px"
                  v-model="searchTextAppRej"
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

          <virtualScrollResult
            :items="filteredLeaveRowsAppRej"
            :columns="pendingColumns"
            :leaveView="true"
            :overtimeModule="overtimeModule"
            :LeaveTypeLabels="LeaveTypeLabels"
          />

          <div
            v-if="filteredLeaveRowsAppRej.length === 0"
            class="full-width row flex-center text-black text-subtitle2"
          >
            <div>
              No data available
              <q-icon
                class="text-red"
                size="2em"
                name="sentiment_dissatisfied"
              ></q-icon>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="row">
            <q-card-section
              style="border-radius: 10px"
              class="col-12 bg-primary text-white text-center"
              :class="['bold-text', $q.screen.name + '-text']"
            >
              Approved {{ cancelOperationModule ? "Cancel" : "" }}
              {{ overtimeModule ? "Overtime" : "Leaves" }}
            </q-card-section>

            <div
              class="text-left"
              :class="[$q.screen.lt.sm ? 'col-12' : 'col-6']"
            >
              <dropdown2
                @show-approved-leaves="showApprovedLeaves = true"
                @show-rejected-leaves="showApprovedLeaves = false"
                :cancelLeave="cancelOperationModule"
                :pendingLeave="pendingOperationModule"
                :overtimeModule="overtimeModule"
              />
            </div>
            <div
              class="text-right"
              :class="[$q.screen.lt.sm ? 'col-12' : 'col-6']"
            >
              <q-input
                class="bg-white"
                v-model="searchTextPending"
                placeholder="Search"
                dense
                outlined
                clearable
                :style="{ marginLeft: 'auto' }"
                :class="[$q.screen.name + '-text2']"
                @clear="clearSearchText"
              />
            </div>
          </div>
          <qTableCard
            :items="filteredLeaveRowsAppRej"
            :columns="pendingColumns"
            :LeaveTypeLabels="LeaveTypeLabels"
            :cancelLeave="cancelOperationModule"
          />
        </template>
      </q-card>

      <q-card v-show="!showApprovedLeaves" class="rounded">
        <template v-if="$q.screen.width > 900">
          <q-card-section
            class="bg-negative text-white text-center"
            :class="['bold-text', $q.screen.name + '-text']"
          >
            <div class="row">
              <div class="col-4 text-left">
                <dropdown2
                  @show-approved-leaves="showApprovedLeaves = true"
                  @show-rejected-leaves="showApprovedLeaves = false"
                  :cancelLeave="cancelOperationModule"
                  :pendingLeave="pendingOperationModule"
                  :overtimeModule="overtimeModule"
                />
              </div>
              <div class="col-4 text-center">
                Rejected {{ cancelOperationModule ? "Cancel" : "" }}
                {{ overtimeModule ? "Overtime" : "Leaves" }}
              </div>
              <div class="col-4 text-right">
                <q-input
                  class="bg-white"
                  style="font-size: 15px"
                  v-model="searchTextAppRej"
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

          <virtualScrollResult
            :items="filteredLeaveRowsAppRej"
            :columns="pendingColumns"
            :leaveView="true"
            :overtimeModule="overtimeModule"
            :LeaveTypeLabels="LeaveTypeLabels"
          />

          <div
            v-if="filteredLeaveRowsAppRej.length === 0"
            class="full-width row flex-center text-black text-subtitle2"
          >
            <div>
              No data available
              <q-icon
                class="text-red"
                size="2em"
                name="sentiment_dissatisfied"
              ></q-icon>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="row">
            <q-card-section
              style="border-radius: 10px"
              class="col-12 bg-negative text-white text-center"
              :class="['bold-text', $q.screen.name + '-text']"
            >
              Rejected {{ cancelOperationModule ? "Cancel" : "" }}
              {{ overtimeModule ? "Overtime" : "Leaves" }}
            </q-card-section>

            <div
              class="text-left"
              :class="[$q.screen.lt.sm ? 'col-12' : 'col-6']"
            >
              <dropdown2
                @show-approved-leaves="showApprovedLeaves = true"
                @show-rejected-leaves="showApprovedLeaves = false"
                :cancelLeave="cancelOperationModule"
                :pendingLeave="pendingOperationModule"
                :overtimeModule="overtimeModule"
              />
            </div>
            <div
              class="text-right"
              :class="[$q.screen.lt.sm ? 'col-12' : 'col-6']"
            >
              <q-input
                class="bg-white"
                v-model="searchTextPending"
                placeholder="Search"
                dense
                outlined
                clearable
                :style="{ marginLeft: 'auto' }"
                :class="[$q.screen.name + '-text2']"
                @clear="clearSearchText"
              />
            </div>
          </div>
          <qTableCard
            :items="filteredLeaveRowsAppRej"
            :columns="pendingColumns"
            :LeaveTypeLabels="LeaveTypeLabels"
            :cancelLeave="cancelOperationModule"
          />
        </template>
      </q-card>
    </div>
  </div>

  <q-dialog v-model="filterDialog">
    <q-card
      :class="[
        'bold-text',
        $q.screen.name + '-width',
        $q.screen.name + '-min-height',
      ]"
      class="rounded"
    >
      <q-card-section class="bg-primary row items-center q-pb-md">
        <div class="text-h6 text-white">Pick / Choose A Department</div>
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
      <q-card-section style="display: flex; flex-wrap: wrap">
        <q-select
          class="hoverable-item"
          v-model="selectedDeptDescription"
          :options="deptDescriptions"
          input-debounce="0"
          label="Department"
          filled
          style="width: 100%"
          clearable
          behavior="menu"
          fill-input
          hide-selected
          @filter="filterFn"
          use-input
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import dropdown1 from "../components/DropdownMenuLeaveOps1.vue";
import virtualScrollAction from "../components/virtualScrollAction.vue";
import virtualScrollCancelAction from "./virtualScrollCancelAction.vue";
import virtualScrollView from "../components/virtualScrollView.vue";
import dropdown2 from "../components/DropdownMenuLeaveOps2.vue";
import virtualScrollResult from "../components/virtualScrollViewResult.vue";
import qTable from "../components/qTableAllAction.vue";
import qTableCard from "../components/qTableView.vue";

export default {
  props: {
    pendingDetails: Array,
    pendingColumns: Array,
    userApproved: Array,
    userRejected: Array,
    deptDescriptionsOptions: Array,
    cancelOperationModule: Boolean,
    pendingOperationModule: Boolean,
    approvedDetails: Array,
    rejectedDetails: Array,
    overtimeModule: Boolean,
    LeaveTypeLabels: Object,
    pendingAccomplishment: Array,
  },

  emits: ["successApproved"],

  data() {
    return {
      showHeadApproveCard: true,
      showPendingAccomplish: false,
      showMyApproved: false,
      showMyRejected: false,
      filterDialog: false,
      selectedDeptDescription: "",
      deptDescriptions: this.deptDescriptionsOptions,
      searchTextPending: "",
      searchTextAppRej: "",
      showApprovedLeaves: true,
    };
  },

  components: {
    dropdown1,
    virtualScrollAction,
    virtualScrollCancelAction,
    virtualScrollView,
    dropdown2,
    virtualScrollResult,
    qTable,
    qTableCard,
  },

  computed: {
    filterPendingDetails() {
      if (!this.selectedDeptDescription) {
        return this.sortedPendingDetails;
      } else {
        this.filterDialog = false;
        return this.sortedPendingDetails.filter(
          (row) => row.deptDescription === this.selectedDeptDescription,
        );
      }
    },

    filteredLeaveRowsAppRej() {
      if (!this.selectedDeptDescription) {
        return this.sortedAppRejLeave;
      } else {
        this.filterDialog = false;
        return this.sortedAppRejLeave.filter(
          (row) => row.deptDescription === this.selectedDeptDescription,
        );
      }
    },

    sortedPendingDetails() {
      let data;
      switch (true) {
        case this.showHeadApproveCard:
          data = this.pendingDetails;
          break;
        case this.showPendingAccomplish:
          data = this.pendingAccomplishment;
          break;
        case this.showMyApproved:
          data = this.userApproved;
          break;
        case this.showMyRejected:
          data = this.userRejected;
          break;
        default:
          data = [];
      }
      return this.sortedMethod(data);
    },

    sortedAppRejLeave() {
      let data;
      switch (true) {
        case this.showApprovedLeaves:
          data = this.approvedDetails;
          break;
        case !this.showApprovedLeaves:
          data = this.rejectedDetails;
          break;
        default:
          data = [];
      }
      return this.sortedMethodAppRej(data);
    },
  },

  methods: {
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.deptDescriptions = this.deptDescriptionsOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.deptDescriptions = this.deptDescriptionsOptions.filter(
          (option) => option.toLowerCase().indexOf(needle) > -1,
        );
      });
    },

    sortedMethod(data) {
      if (!Array.isArray(data) || data.length === 0) return [];

      const isLeave = data.some((row) => "leaveId" in row);

      return data
        .map((row) => {
          if (isLeave) {
            return {
              ...row,
              EmployeeName: `${row.lastName}, ${row.firstName} ${
                row.middleInitial || ""
              }.`,
              transDate: this.formatDateTime(row.transDate),
              formattedFromLeave: this.formatDateTime(row.dateLeavedFrom),
              formattedToLeave: this.formatDateTime(row.dateLeavedTo),
              remainingBalance:
                row.leaveType === "LWOP"
                  ? "-"
                  : row.remainingBalance != null
                    ? parseFloat(row.remainingBalance.toFixed(2))
                    : "-",
            };
          } else {
            return {
              ...row,
              transDate: this.formatDateTime(row.overtimeCreated),
              formatedDateOvertime: this.formatDateTime(row.dateOfOvertime),
            };
          }
        })
        .filter((row) => {
          const query = this.searchTextPending.toLowerCase();

          if (isLeave) {
            return (
              row.EmployeeName.toLowerCase().includes(query) ||
              row.leaveId.toString().includes(query) ||
              (this.LeaveTypeLabels[row.leaveType] || "")
                .toLowerCase()
                .includes(query) ||
              row.transDate.includes(query) ||
              row.formattedFromLeave.includes(query) ||
              row.formattedToLeave.includes(query)
            );
          } else {
            return (
              row.employeeName.toLowerCase().includes(query) ||
              row.overtimeId.toString().includes(query) ||
              (row.dateCreated &&
                row.dateCreated.toString().toLowerCase().includes(query)) ||
              (row.dateOfOvertime &&
                row.dateOfOvertime.toString().toLowerCase().includes(query)) ||
              (row.formatedDateOvertime &&
                row.formatedDateOvertime.includes(query))
            );
          }
        })
        .sort((a, b) => {
          return isLeave ? b.leaveId - a.leaveId : b.overtimeId - a.overtimeId;
        });
    },

    sortedMethodAppRej(data) {
      if (!Array.isArray(data) || data.length === 0) return [];

      const isLeave = data.some((row) => "leaveId" in row);

      return data
        .map((row) => {
          if (isLeave) {
            return {
              ...row,
              EmployeeName: `${row.lastName}, ${row.firstName} ${
                row.middleInitial || ""
              }.`,
              transDate: this.formatDateTime(row.transDate),
              formattedFromLeave: this.formatDateTime(row.dateLeavedFrom),
              formattedToLeave: this.formatDateTime(row.dateLeavedTo),
              remainingBalance:
                row.leaveType === "LWOP"
                  ? "-"
                  : row.remainingBalance != null
                    ? parseFloat(row.remainingBalance.toFixed(2))
                    : "-",
            };
          } else {
            return {
              ...row,
              transDate: this.formatDateTime(row.overtimeCreated),
              formatedDateOvertime: this.formatDateTime(row.dateOfOvertime),
            };
          }
        })
        .filter((row) => {
          const query = this.searchTextAppRej.toLowerCase();

          if (isLeave) {
            return (
              row.EmployeeName.toLowerCase().includes(query) ||
              row.leaveId.toString().includes(query) ||
              (this.LeaveTypeLabels[row.leaveType] || "")
                .toLowerCase()
                .includes(query) ||
              row.transDate.includes(query) ||
              row.formattedFromLeave.includes(query) ||
              row.formattedToLeave.includes(query)
            );
          } else {
            return (
              row.employeeName.toLowerCase().includes(query) ||
              row.overtimeId.toString().includes(query) ||
              (row.dateCreated &&
                row.dateCreated.toString().toLowerCase().includes(query)) ||
              (row.dateOfOvertime &&
                row.dateOfOvertime.toString().toLowerCase().includes(query)) ||
              (row.formatedDateOvertime &&
                row.formatedDateOvertime.includes(query))
            );
          }
        })
        .sort((a, b) => {
          return isLeave ? b.leaveId - a.leaveId : b.overtimeId - a.overtimeId;
        });
    },

    clearSearchText() {
      this.searchTextPending = "";
      this.searchTextAppRej = "";
    },

    handleFilterDepartment() {
      this.filterDialog = true;
    },

    handleApprove(cardType, dataList) {
      this.showMyApproved = cardType === "myApproved";
      this.showMyRejected = cardType === "myRejected";
      this.showHeadApproveCard = cardType === "headApprove";
      this.showPendingAccomplish = cardType === "accomplishApprove";

      this.selectedItems = [];
      this.selectedDeptDescription = "";

      localStorage.setItem("showHeadApproveCard", cardType === "headApprove");
      localStorage.setItem(
        "showPendingAccomplish",
        cardType === "accomplishApprove",
      );
      localStorage.setItem("showMyApproved", cardType === "myApproved");
      localStorage.setItem("showMyRejected", cardType === "myRejected");

      if (dataList) {
        this.deptDescriptions = [
          ...new Set(
            dataList.map((overtime) =>
              overtime.deptDescription
                ? overtime.deptDescription
                : overtime.deptDescSecond,
            ),
          ),
        ];
      }
    },

    formatDateTime(dateTimeString) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString(undefined, options);
    },

    successApplication() {
      this.$emit("successApproved");
    },
  },

  mounted() {
    this.showHeadApproveCard =
      localStorage.getItem("showHeadApproveCard") === "true";
    this.showPendingAccomplish =
      localStorage.getItem("showPendingAccomplish") === "true";
    this.showMyApproved = localStorage.getItem("showMyApproved") === "true";
    this.showMyRejected = localStorage.getItem("showMyRejected") === "true";

    if (
      !this.showHeadApproveCard &&
      !this.showPendingAccomplish &&
      !this.showMyApproved &&
      !this.showMyRejected
    ) {
      this.showHeadApproveCard = true;
    }

    let storedData = null;
    if (this.showHeadApproveCard) storedData = this.pendingDetails;
    else if (this.showPendingAccomplish)
      storedData = this.pendingAccomplishment;
    else if (this.showMyApproved) storedData = this.userApproved;
    else if (this.showMyRejected) storedData = this.userRejected;

    if (storedData) {
      this.deptDescriptions = [
        ...new Set(
          storedData.map((overtime) =>
            overtime.deptDescription
              ? overtime.deptDescription
              : overtime.deptDescSecond,
          ),
        ),
      ];
    }
  },
};
</script>
