<template>
  <q-layout>
    <q-page>
      <q-page-container>
        <div class="containermainn">
          <div class="row" style="width: 90%">
            <div class="col-12">
              <q-card v-if="showHeadApproveCard" class="roundedd1">
                <template v-if="$q.screen.width > 900">
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4 text-left">
                        <dropdown1
                          :showHeadDept="true"
                          :showSupervisor="level2 || level1and2"
                          @head-approve="
                            handleApprove('headApprove', pendingLeaveLvl1)
                          "
                          @supervisor-approve="
                            handleApprove('supervisor', pendingLeaveLvl2)
                          "
                          @my-approved="
                            handleApprove('myApproved', userApprovedLeave)
                          "
                          @my-rejected="
                            handleApprove('myRejected', userRejectedLeave)
                          "
                          @filter-leaves="handleFilterLeaves"
                          :pendingLeave="true"
                        />
                      </div>
                      <div class="col-4 text-center">Pending Leaves</div>
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
                  <q-skeleton v-else :style="{ height: '65px' }" />

                  <!-- Q-Skeleton Loading -->
                  <template v-if="loading">
                    <SkeletonLoader :row-count="9" :column-count="8" />
                  </template>
                  <template v-else>
                    <virtualScrollAction
                      :items="filteredLeaveRows"
                      :columns="pendingcolumns1"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :sortedPendingLeave="sortedPendingLeave"
                      :selectedDeptDescription="selectedDeptDescription"
                      :fetchapprovedLeaves="fetchapprovedLeaves"
                      :fetchrejectedLeaves="fetchrejectedLeaves"
                      :fetchpendingLeaves="fetchpendingLeaves"
                      :fetchUserApprovedLeaves="fetchUserApprovedLeaves"
                      :fetchUserRejectedLeaves="fetchUserRejectedLeaves"
                    />
                    <div
                      v-if="sortedPendingLeave.length === 0"
                      class="text-center"
                    >
                      <q-icon name="warning" style="font-size: 30px" />
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
                    Level 1 Pending Leaves
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '65px' }" />

                  <template v-if="loading">
                    <SkeletonLoader :mobile="true" />
                  </template>
                  <template v-else>
                    <div class="row">
                      <div class="col-12 col-sm-6">
                        <dropdown1
                          :showHeadDept="true"
                          @head-approve="
                            handleApprove('headApprove', pendingLeaveLvl1)
                          "
                          @supervisor-approve="
                            handleApprove('supervisor', pendingLeaveLvl2)
                          "
                          @my-approved="
                            handleApprove('myApproved', userApprovedLeave)
                          "
                          @my-rejected="
                            handleApprove('myRejected', userRejectedLeave)
                          "
                          @filter-leaves="handleFilterLeaves"
                          :pendingLeave="true"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="searchTextPending"
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

                    <qTable
                      :items="filteredLeaveRows"
                      :columns="pendingcolumns1"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :fetchapprovedLeaves="fetchapprovedLeaves"
                      :fetchrejectedLeaves="fetchrejectedLeaves"
                      :fetchpendingLeaves="fetchpendingLeaves"
                      :fetchUserApprovedLeaves="fetchUserApprovedLeaves"
                      :fetchUserRejectedLeaves="fetchUserRejectedLeaves"
                    />
                  </template>
                </template>
              </q-card>

              <div v-if="showMyApproved">
                <q-card class="roundedd1">
                  <template v-if="$q.screen.width > 900">
                    <q-card-section
                      v-if="!loading"
                      class="bg-primary text-white text-center"
                      :class="['bold-text', $q.screen.name + '-text']"
                    >
                      <div class="row">
                        <div class="col-4 text-left">
                          <dropdown1
                            :showHeadDept="true"
                            :showSupervisor="level2 || level1and2"
                            @head-approve="
                              handleApprove('headApprove', pendingLeaveLvl1)
                            "
                            @supervisor-approve="
                              handleApprove('supervisor', pendingLeaveLvl2)
                            "
                            @my-approved="
                              handleApprove('myApproved', userApprovedLeave)
                            "
                            @my-rejected="
                              handleApprove('myRejected', userRejectedLeave)
                            "
                            @filter-leaves="handleFilterLeaves"
                            :pendingLeave="true"
                          />
                        </div>
                        <div class="col-4 text-center">My Approved Leaves</div>
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
                    <q-skeleton v-else :style="{ height: '65px' }" />
                    <!-- Q-Skeleton Loading -->
                    <template v-if="loading">
                      <SkeletonLoader :row-count="9" :column-count="8" />
                    </template>
                    <template v-else>
                      <virtualScroll
                        :items="filteredLeaveRows"
                        :columns="userApprovedcolumns"
                        :LeaveTypeLabels="LeaveTypeLabels"
                        :leaveView="true"
                      />
                      <div
                        v-if="filteredLeaveRows.length === 0"
                        class="text-center"
                      >
                        <q-icon name="warning" style="font-size: 30px" />
                        No data available
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <q-card-section
                      v-if="!loading"
                      class="bg-primary text-white text-center"
                      :class="['bold-text', $q.screen.name + '-text']"
                    >
                      My Approved Leaves
                    </q-card-section>
                    <q-skeleton v-else :style="{ height: '55px' }" />
                    <template v-if="loading">
                      <SkeletonLoader :mobileApproved="true" />
                    </template>

                    <template v-else>
                      <div class="row">
                        <div class="col-12 col-sm-6">
                          <dropdown1
                            :showHeadDept="true"
                            :showSupervisor="level2 || level1and2"
                            @head-approve="
                              handleApprove('headApprove', pendingLeaveLvl1)
                            "
                            @supervisor-approve="
                              handleApprove('supervisor', pendingLeaveLvl2)
                            "
                            @my-approved="
                              handleApprove('myApproved', userApprovedLeave)
                            "
                            @my-rejected="
                              handleApprove('myRejected', userRejectedLeave)
                            "
                            @filter-leaves="handleFilterLeaves"
                            :pendingLeave="true"
                          />
                        </div>
                        <div class="col-12 col-sm-6">
                          <q-input
                            v-model="searchTextPending"
                            placeholder="Search"
                            dense
                            outlined
                            clearable
                            :style="{ width: '200px', marginLeft: 'auto' }"
                            :class="[$q.screen.name + '-text2']"
                            @clear="clearSearchText"
                          >
                            <template v-slot:append>
                              <q-icon name="search" />
                            </template>
                          </q-input>
                        </div>
                      </div>
                      <qTableCard
                        :items="filteredLeaveRows"
                        :columns="userApprovedcolumns"
                        :LeaveTypeLabels="LeaveTypeLabels"
                        :cancelLeave="false"
                      />
                    </template>
                  </template>
                </q-card>
              </div>

              <div v-if="showMyRejected">
                <q-card class="roundedd1">
                  <template v-if="$q.screen.width > 900">
                    <q-card-section
                      v-if="!loading"
                      class="bg-negative text-white text-center"
                      :class="['bold-text', $q.screen.name + '-text']"
                    >
                      <div class="row">
                        <div class="col-4 text-left">
                          <dropdown1
                            :showHeadDept="true"
                            :showSupervisor="level2 || level1and2"
                            @head-approve="
                              handleApprove('headApprove', pendingLeaveLvl1)
                            "
                            @supervisor-approve="
                              handleApprove('supervisor', pendingLeaveLvl2)
                            "
                            @my-approved="
                              handleApprove('myApproved', userApprovedLeave)
                            "
                            @my-rejected="
                              handleApprove('myRejected', userRejectedLeave)
                            "
                            @filter-leaves="handleFilterLeaves"
                            :pendingLeave="true"
                          />
                        </div>
                        <div class="col-4 text-center">My Rejected Leaves</div>
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
                    <q-skeleton v-else :style="{ height: '65px' }" />
                    <!-- Q-Skeleton Loading -->
                    <template v-if="loading">
                      <SkeletonLoader :row-count="9" :column-count="8" />
                    </template>
                    <template v-else>
                      <virtualScroll
                        :items="filteredLeaveRows"
                        :columns="userRejectedcolumns"
                        :LeaveTypeLabels="LeaveTypeLabels"
                        :leaveView="true"
                      />
                      <div
                        v-if="filteredLeaveRows.length === 0"
                        class="text-center"
                      >
                        <q-icon name="warning" style="font-size: 30px" />
                        No data available
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <q-card-section
                      v-if="!loading"
                      class="bg-negative text-white text-center"
                      :class="['bold-text', $q.screen.name + '-text']"
                    >
                      My Rejected Leaves
                    </q-card-section>
                    <q-skeleton v-else :style="{ height: '55px' }" />
                    <template v-if="loading">
                      <SkeletonLoader :mobileApproved="true" />
                    </template>

                    <template v-else>
                      <div class="row">
                        <div class="col-12 col-sm-6">
                          <dropdown1
                            :showHeadDept="true"
                            :showSupervisor="level2 || level1and2"
                            @head-approve="
                              handleApprove('headApprove', pendingLeaveLvl1)
                            "
                            @supervisor-approve="
                              handleApprove('supervisor', pendingLeaveLvl2)
                            "
                            @my-approved="
                              handleApprove('myApproved', userApprovedLeave)
                            "
                            @my-rejected="
                              handleApprove('myRejected', userRejectedLeave)
                            "
                            @filter-leaves="handleFilterLeaves"
                            :pendingLeave="true"
                          />
                        </div>
                        <div class="col-12 col-sm-6">
                          <q-input
                            v-model="searchTextPending"
                            placeholder="Search"
                            dense
                            outlined
                            clearable
                            :style="{ width: '200px', marginLeft: 'auto' }"
                            :class="[$q.screen.name + '-text2']"
                            @clear="clearSearchText"
                          >
                            <template v-slot:append>
                              <q-icon name="search" />
                            </template>
                          </q-input>
                        </div>
                      </div>
                      <qTableCard
                        :items="filteredLeaveRows"
                        :columns="userRejectedcolumns"
                        :LeaveTypeLabels="LeaveTypeLabels"
                        :cancelLeave="false"
                      />
                    </template>
                  </template>
                </q-card>
              </div>
            </div>

            <!-- Approved Leaves -->
            <div class="col-12">
              <q-card v-show="showApprovedLeaves" class="rounded">
                <template v-if="$q.screen.width > 900">
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-h6 text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4 text-left">
                        <dropdown2
                          @show-approved-leaves="showApprovedLeaves = true"
                          @show-rejected-leaves="showApprovedLeaves = false"
                          :pendingLeave="true"
                        />
                      </div>
                      <div class="col-4 text-center">Approved Leaves</div>
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
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <!-- Q-Skeleton Loading -->
                  <template v-if="loading">
                    <SkeletonLoader :row-count="9" :column-count="8" />
                  </template>
                  <template v-else>
                    <virtualScrollResult
                      :items="filteredLeaveRowsAppRej"
                      :columns="approvedcolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :leaveView="true"
                    />
                    <div
                      v-if="filteredLeaveRowsAppRej.length === 0"
                      class="text-center"
                    >
                      <q-icon name="warning" style="font-size: 30px" />
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
                    Approved Leaves
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <template v-if="loading">
                    <SkeletonLoader :mobileApproved="true" />
                  </template>

                  <template v-else>
                    <div class="row">
                      <div class="col-12 col-sm-6">
                        <dropdown2
                          @show-approved-leaves="showApprovedLeaves = true"
                          @show-rejected-leaves="showApprovedLeaves = false"
                          :pendingLeave="true"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="searchTextAppRej"
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
                    <qTableView
                      :items="filteredLeaveRowsAppRej"
                      :columns="approvedcolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                    />
                  </template>
                </template>
              </q-card>

              <!-- Rejected Leaves -->
              <q-card v-show="!showApprovedLeaves" class="rounded">
                <template v-if="$q.screen.width > 900">
                  <q-card-section
                    v-if="!loading"
                    class="bg-negative text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4 text-left">
                        <dropdown2
                          @show-approved-leaves="showApprovedLeaves = true"
                          @show-rejected-leaves="showApprovedLeaves = false"
                          :pendingLeave="true"
                        />
                      </div>
                      <div class="col-4 text-center">Rejected Leaves</div>
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
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <!-- Q-Skeleton Loading -->
                  <template v-if="loading">
                    <SkeletonLoader :row-count="9" :column-count="8" />
                  </template>

                  <template v-else>
                    <virtualScrollResult
                      :items="filteredLeaveRowsAppRej"
                      :columns="rejectedcolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :leaveView="true"
                    />
                    <div
                      v-if="filteredLeaveRowsAppRej.length === 0"
                      class="text-center"
                    >
                      <q-icon name="warning" style="font-size: 30px" />
                      No data available
                    </div>
                  </template>
                </template>

                <!-- Q-table for Q-Card responsive -->
                <template v-else>
                  <!-- Q-Skeleton Loading -->
                  <q-card-section
                    v-if="!loading"
                    class="bg-negative text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Rejected Leaves
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <template v-if="loading">
                    <SkeletonLoader :mobileApproved="true" />
                  </template>
                  <template v-else>
                    <div class="row">
                      <div class="col-12 col-sm-6">
                        <dropdown2
                          @show-approved-leaves="showApprovedLeaves = true"
                          @show-rejected-leaves="showApprovedLeaves = false"
                          :pendingLeave="true"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="searchTextAppRej"
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

                    <qTableView
                      v-if="filteredLeaveRowsAppRej.length > 0"
                      :items="filteredLeaveRowsAppRej"
                      :columns="rejectedcolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                    />
                  </template>
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
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </q-page-container>
    </q-page>
  </q-layout>
</template>

<script>
import helperMethods from "../helperMethods.js";
import dropdown1 from "../components/DropdownMenuLeaveOps1.vue";
import dropdown2 from "../components/DropdownMenuLeaveOps2.vue";
import virtualScroll from "../components/virtualScrollView.vue";
import virtualScrollAction from "../components/virtualScrollAction.vue";
import virtualScrollResult from "../components/virtualScrollViewResult.vue";
import SkeletonLoader from "../components/loadingSkeleton.vue";
import qTable from "../components/qTableAllAction.vue";
import qTableView from "../components/qTableView.vue";
import { mapGetters } from "vuex";
import qTableCard from "../components/qTableViewCard.vue";

let deptDescriptionsOptions = [];

export default {
  data() {
    return {
      rejectId: "",
      rejectDialog: false,
      reasonForRejection: "",
      showApprovedLeaves: true,
      showHeadApproveCard: true,
      showSupervisorCard: false,
      level1and2: false,
      level1: false,
      level2: false,
      searchTextMyApproved: "",
      searchTextMyRejected: "",
      searchTextPending: "",
      loadingCounter: null,
      loading: true,
      showApprovedLeaves: true,
      leaveAction: false,
      skeletonAnimations: ["wave", "fade", "fade", "none"],
      LeaveTypes: [],
      approvedLeaves: [],
      approvedcolumns: [
        {
          name: "Employee Name",
          label: "Employee Name",
          align: "center",
          field: "EmployeeName",
          sortable: false,
          width: "220px",
        },
        {
          name: "Date Approved",
          label: "Date Approved",
          align: "center",
          sortable: false,
          width: "100px",
        },
        {
          name: "Days",
          label: "Days",
          align: "center",
          field: "daysOfLeave",
          sortable: false,
          width: "100px",
        },
        {
          name: "DateFrom",
          label: "Date From",
          align: "center",
          field: "dateLeavedFrom",
          sortable: false,
          width: "140px",
        },
        {
          name: "DateTo",
          label: "Date To",
          align: "center",
          field: "dateLeavedTo",
          sortable: false,
          width: "140px",
        },
        {
          name: "LeaveType",
          label: "Leave Type",
          align: "center",
          field: "leaveType",
          sortable: false,
          width: "150px",
        },
        {
          name: "Actions/Status",
          label: "Actions",
          align: "center",
          field: "id",
          sortable: false,
          width: "150px",
        },
      ],

      rejectedLeaves: [],
      rejectedcolumns: [
        {
          name: "Employee Name",
          label: "Employee Name",
          align: "center",
          field: "EmployeeName",
          sortable: false,
          width: "220px",
        },
        {
          name: "Date Rejected",
          label: "Date Rejected",
          align: "center",
          sortable: false,
          width: "100px",
        },
        {
          name: "Days",
          label: "Days",
          align: "center",
          field: "daysOfLeave",
          sortable: false,
          width: "100px",
        },
        {
          name: "DateFrom",
          label: "Date From",
          align: "center",
          field: "dateLeavedFrom",
          sortable: false,
          width: "140px",
        },
        {
          name: "DateTo",
          label: "Date To",
          align: "center",
          field: "dateLeavedTo",
          sortable: false,
          width: "140px",
        },
        {
          name: "LeaveType",
          label: "Leave Type",
          align: "center",
          field: "leaveType",
          sortable: false,
          width: "150px",
        },
        {
          name: "Actions/Status",
          label: "Actions",
          align: "center",
          field: "id",
          sortable: false,
          width: "150px",
        },
      ],

      pendingLeaveLvl1: [],
      pendingcolumns1: [
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
          width: "80px",
        },
        {
          name: "Remaining Leave",
          label: "Remaining Leave",
          align: "center",
          field: "remainingBalance",
          sortable: false,
          width: "80px",
        },
        {
          name: "DateFrom",
          label: "Date From",
          align: "center",
          field: "dateLeavedFrom",
          sortable: false,
          width: "120px",
        },
        {
          name: "DateTo",
          label: "Date To",
          align: "center",
          field: "dateLeavedTo",
          sortable: false,
          width: "120px",
        },
        {
          name: "TimeFrom",
          label: "Time From",
          align: "center",
          field: "tIME_FROM",
          sortable: false,
          width: "118px",
        },
        {
          name: "TimeTo",
          label: "Time To",
          align: "center",
          field: "tIME_TO",
          sortable: false,
          width: "118px",
        },
        {
          name: "LeaveType",
          label: "Leave Type",
          align: "center",
          field: "leaveType",
          sortable: false,
          width: "140px",
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

      pendingLeaveLvl2: [],
      pendingcolumns2: [
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
          width: "80px",
        },
        {
          name: "Remaining Leave",
          label: "Remaining Leave",
          align: "center",
          field: "remainingBalance",
          sortable: false,
          width: "80px",
        },
        {
          name: "Date From",
          label: "Date From",
          align: "center",
          field: "dateLeavedFrom",
          sortable: false,
          width: "120px",
        },
        {
          name: "Date To",
          label: "Date To",
          align: "center",
          field: "dateLeavedTo",
          sortable: false,
          width: "120px",
        },
        {
          name: "TimeFrom",
          label: "Time From",
          align: "center",
          field: "tIME_FROM",
          sortable: false,
          width: "118px",
        },
        {
          name: "TimeTo",
          label: "Time To",
          align: "center",
          field: "tIME_TO",
          sortable: false,
          width: "118px",
        },
        {
          name: "Leave Type",
          label: "Leave Type",
          align: "center",
          field: "leaveType",
          sortable: false,
          width: "140px",
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

      leaveBalance: [],
      balancecolumns: [
        {
          name: "Year",
          label: "Year",
          align: "center",
          field: "Year",
          sortable: false,
        },
        {
          name: "LeaveType",
          label: "Leave Type",
          align: "center",
          field: "LeaveType",
          format: (val) => this.LeaveTypeLabels[val],
          sortable: false,
        },
        {
          name: "Balance",
          label: "Balance",
          align: "center",
          field: "Balance",
          sortable: false,
        },
      ],

      userApprovedLeave: [],
      userApprovedcolumns: [
        {
          name: "Employee Name",
          label: "Employee Name",
          align: "center",
          field: "EmployeeName",
          sortable: false,
          width: "220px",
        },
        {
          name: "Date Approved",
          label: "Date Approved",
          align: "center",
          sortable: false,
          width: "100px",
        },
        {
          name: "Days",
          label: "Days",
          align: "center",
          field: "daysOfLeave",
          sortable: false,
          width: "100px",
        },
        {
          name: "Date From",
          label: "Date From",
          align: "center",
          field: "dateLeavedFrom",
          sortable: false,
          width: "140px",
        },
        {
          name: "Date To",
          label: "Date To",
          align: "center",
          field: "dateLeavedTo",
          sortable: false,
          width: "140px",
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
          name: "Reason",
          label: "Reason",
          align: "left",
          sortable: false,
          width: "80px",
        },
        {
          name: "Actions/Status",
          label: "Actions",
          align: "center",
          field: "id",
          sortable: false,
          width: "150px",
        },
      ],
      userRejectedLeave: [],
      userRejectedcolumns: [
        {
          name: "Employee Name",
          label: "Employee Name",
          align: "center",
          field: "EmployeeName",
          sortable: false,
          width: "220px",
        },
        {
          name: "Date Rejected",
          label: "Date Rejected",
          align: "center",
          sortable: false,
          width: "100px",
        },
        {
          name: "Days",
          label: "Days",
          align: "center",
          field: "daysOfLeave",
          sortable: false,
          width: "100px",
        },
        {
          name: "Date From",
          label: "Date From",
          align: "center",
          field: "dateLeavedFrom",
          sortable: false,
          width: "140px",
        },
        {
          name: "Date To",
          label: "Date To",
          align: "center",
          field: "dateLeavedTo",
          sortable: false,
          width: "140px",
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
          name: "Reason",
          label: "Reason",
          align: "left",
          sortable: false,
          width: "80px",
        },
        {
          name: "Actions/Status",
          label: "Actions",
          align: "center",
          field: "id",
          sortable: false,
          width: "150px",
        },
      ],
      selectedItems: [],
      selectAllLevel1: false,
      selectAllLevel2: false,
      deptValidation: false,
      filterDialog: false,
      selectedDeptDescription: "",
      deptDescriptions: deptDescriptionsOptions,
      showMyApproved: false,
      showMyRejected: false,
      searchTextAppRej: "",
    };
  },

  components: {
    dropdown1,
    dropdown2,
    virtualScroll,
    virtualScrollAction,
    SkeletonLoader,
    virtualScrollResult,
    qTable,
    qTableView,
    qTableCard,
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

    sortedPendingLeave() {
      let data;
      switch (true) {
        case this.showHeadApproveCard:
          data = this.pendingLeaveLvl1;
          break;
        case this.showMyApproved:
          data = this.userApprovedLeave;
          break;
        case this.showMyRejected:
          data = this.userRejectedLeave;
          break;
        default:
          data = this.approvedDetails;
      }
      return this.sortPendingLeave(data);
    },

    sortedAppRejLeave() {
      let data;
      switch (true) {
        case this.showApprovedLeaves:
          data = this.approvedLeaves;
          break;
        case !this.showApprovedLeaves:
          data = this.rejectedLeaves;
          break;
        default:
          data = [];
      }
      return this.sortAppRejLeave(data);
    },

    LeaveTypeLabels() {
      return this.leaveTypes.reduce((acc, LeaveType) => {
        acc[LeaveType.value] = LeaveType.label;
        return acc;
      }, {});
    },

    filteredLeaveRows() {
      if (!this.selectedDeptDescription) {
        return this.sortedPendingLeave;
      } else {
        this.filterDialog = false;
        return this.sortedPendingLeave.filter(
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
  },

  methods: {
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.deptDescriptions = deptDescriptionsOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.deptDescriptions = deptDescriptionsOptions.filter(
          (option) => option.toLowerCase().indexOf(needle) > -1,
        );
      });
    },

    sortPendingLeave(pendingLeave) {
      if (!pendingLeave || pendingLeave.length === 0) {
        return [];
      }

      return pendingLeave
        .map((row) => ({
          ...row,
          EmployeeName: `${row.lastName}, ${row.firstName} ${
            row.middleInitial + "."
          }`,
          transDate: row.transDate.split("T")[0].replace(/-/g, "/"),
          remainingBalance:
            row.leaveType === "LWOP"
              ? "-"
              : row.remainingBalance != null
              ? parseFloat(row.remainingBalance.toFixed(2))
              : "-",
        }))
        .filter((row) => {
          const query = this.searchTextPending.toLowerCase();
          const formattedTransDate = row.transDate.replace(/-/g, "/");
          return (
            row.EmployeeName.toLowerCase().includes(query) ||
            row.leaveId.toString().toLowerCase().includes(query) ||
            this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query) ||
            formattedTransDate.includes(query)
          );
        })
        .sort((a, b) => b.leaveId - a.leaveId);
    },

    sortAppRejLeave(pendingLeave) {
      if (!pendingLeave || pendingLeave.length === 0) {
        return [];
      }

      return pendingLeave
        .map((row) => ({
          ...row,
          EmployeeName: `${row.lastName}, ${row.firstName} ${
            row.middleInitial + "."
          }`,
          transDate: row.transDate.split("T")[0].replace(/-/g, "/"),
          remainingBalance:
            row.leaveType === "LWOP"
              ? "-"
              : row.remainingBalance != null
              ? parseFloat(row.remainingBalance.toFixed(2))
              : "-",
        }))
        .filter((row) => {
          const query = this.searchTextAppRej.toLowerCase();
          const formattedTransDate = row.transDate.replace(/-/g, "/");
          return (
            row.EmployeeName.toLowerCase().includes(query) ||
            row.leaveId.toString().toLowerCase().includes(query) ||
            this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query) ||
            formattedTransDate.includes(query)
          );
        })
        .sort((a, b) => b.leaveId - a.leaveId);
    },

    clearSearchText() {
      this.searchTextPending = "";
      this.searchTextAppRej = "";
      this.searchTextAppRej = "";
      this.searchTextMyApproved = "";
      this.searchTextMyRejected = "";
    },

    handleApprove(cardType, dataList) {
      this.showMyApproved = cardType === "myApproved";
      this.showMyRejected = cardType === "myRejected";
      this.showHeadApproveCard = cardType === "headApprove";

      this.selectedItems = [];
      this.selectedDeptDescription = "";

      localStorage.setItem("showHeadApproveCard", cardType === "headApprove");
      localStorage.setItem("showMyApproved", cardType === "myApproved");
      localStorage.setItem("showMyRejected", cardType === "myRejected");

      deptDescriptionsOptions = [
        ...new Set(
          dataList.map((leave) =>
            leave.deptDescription
              ? leave.deptDescription
              : leave.deptDescSecond,
          ),
        ),
      ];
    },

    handleFilterLeaves() {
      this.filterDialog = true;
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

    async fetchpendingLeaves() {
      try {
        await helperMethods.delay(500);
        await this.$store.dispatch("leaveModule/fetchpendingLeaves");
        const pendingLeaveAll = this.pendingDetails;
        this.pendingLeaveLvl1 = pendingLeaveAll;

        const localStorageShowHeadApproveCard = localStorage.getItem(
          "showHeadApproveCard",
        );
        const localStorageShowMyApproved =
          localStorage.getItem("showMyApproved");
        const localStorageShowMyRejected =
          localStorage.getItem("showMyRejected");

        if (
          localStorageShowHeadApproveCard !== null &&
          localStorageShowMyApproved !== null &&
          localStorageShowMyRejected !== null
        ) {
          this.showHeadApproveCard = localStorageShowHeadApproveCard === "true";
          this.showMyApproved = localStorageShowMyApproved === "true";
          this.showMyRejected = localStorageShowMyRejected === "true";
        }

        const pendingLeave = this.pendingLeaveLvl1;
        deptDescriptionsOptions = [
          ...new Set(
            pendingLeave.map((leave) =>
              leave.deptDescription
                ? leave.deptDescription
                : leave.deptDescSecond,
            ),
          ),
        ];
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
  },

  created() {
    this.fetchpendingLeaves();
    this.fetchapprovedLeaves();
    this.fetchrejectedLeaves();
    this.fetchUserApprovedLeaves();
    this.fetchUserRejectedLeaves();
    this.fetchLeaveTypes();

    window.addEventListener("beforeunload", () => {
      localStorage.setItem(
        "showHeadApproveCard",
        this.showHeadApproveCard.toString(),
      );
      localStorage.setItem("showMyApproved", this.showMyApproved.toString());
      localStorage.setItem("showMyRejected", this.showMyRejected.toString());
    });
  },
};
</script>

<style>
.rounded {
  border-radius: 10px;
  margin-top: 10px;
  padding-bottom: 10px;
}

.roundedd1 {
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 50px;
  padding-bottom: 10px;
}

.containermainn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
</style>
