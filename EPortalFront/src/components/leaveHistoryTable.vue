<template>
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
        <q-virtual-scroll
          class="virtual-scroll"
          type="table"
          style="max-height: 450px"
          :virtual-scroll-item-size="48"
          :virtual-scroll-sticky-size-start="48"
          :virtual-scroll-sticky-size-end="32"
          :items="sortedLeaveDetails"
        >
          <template v-slot:before>
            <thead class="sticky-thead">
              <tr>
                <th v-for="col in leavecolumns" :key="col.name">
                  {{ col.name }}
                </th>
              </tr>
            </thead>
          </template>

          <template v-slot="{ item: row, leaveId }">
            <q-tr :key="leaveId">
              <q-td
                v-for="col in leavecolumns"
                :key="col.leaveId"
                class="text-center"
                :style="{ width: col.width }"
              >
                {{ getFormattedCellValue(row, col) }}
                <template v-if="col.label === 'Actions'">
                  <div
                    v-if="
                      (row.approvedByLevel1 === 0 &&
                        row.status === 'PendingLevel2' &&
                        row.iDCode !== 'TempLeave') ||
                      (row.status === 'Pending' && row.iDCode !== 'TempLeave')
                    "
                  >
                    <q-btn-dropdown
                      push
                      icon="settings"
                      class="no-dropdown bg-grey-3"
                      style="width: 40px"
                    >
                      <q-list class="text-bold">
                        <q-item
                          class="hoverable-item"
                          clickable
                          v-close-popup
                          @click="editLeave(row.leaveId)"
                        >
                          <q-item-section>
                            <q-item-label>Edit Leave</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item
                          class="hoverable-item"
                          clickable
                          v-close-popup
                          @click="cancelLeave(row.leaveId)"
                        >
                          <q-item-section>
                            <q-item-label>Cancel Leave</q-item-label>
                          </q-item-section>
                        </q-item>
                        <PrintPDF
                          v-if="row.status === 'Approved'"
                          :entry="row"
                        />
                      </q-list>
                    </q-btn-dropdown>
                  </div>
                  <div
                    v-else-if="
                      (row.status === 'Approved' &&
                        row.iDCode !== 'TempLeave') ||
                      (row.approvedByLevel1 !== null &&
                        row.status === 'PendingLevel2' &&
                        row.iDCode !== 'TempLeave')
                    "
                  >
                    <q-btn-dropdown
                      push
                      icon="settings"
                      class="no-dropdown bg-grey-3"
                      style="width: 40px"
                    >
                      <q-list class="text-bold">
                        <q-item
                          class="hoverable-item"
                          clickable
                          v-close-popup
                          @click="cancelLeave(row.leaveId)"
                        >
                          <q-item-section>
                            <q-item-label>Cancel Leave</q-item-label>
                          </q-item-section>
                        </q-item>
                        <PrintPDF :entry="row" />
                        <!-- <PrintPDF
                                      v-if="row.status === 'Approved'"
                                      :entry="row"
                                    /> -->
                      </q-list>
                    </q-btn-dropdown>
                  </div>
                  <div
                    v-if="
                      row.status === 'RejectedByLevel1' ||
                      row.status === 'RejectedByLevel2'
                    "
                  >
                    <q-btn-dropdown
                      push
                      icon="settings"
                      class="no-dropdown"
                      style="width: 40px"
                    >
                      <q-list class="text-bold bg-grey-3">
                        <q-item
                          class="hoverable-item"
                          clickable
                          v-close-popup
                          @click="reason(row.reasonForRejection)"
                        >
                          <q-item-section>
                            <q-item-label>Reason of Rejection</q-item-label>
                          </q-item-section>
                        </q-item>
                        <PrintPDF :entry="row" />
                        <!-- <PrintPDF
                                      v-if="row.status === 'Approved'"
                                      :entry="row"
                                    /> -->
                      </q-list>
                    </q-btn-dropdown>
                  </div>
                  <div v-if="row.cancelledStatusOrig !== null">
                    <q-btn-dropdown
                      push
                      icon="settings"
                      class="no-dropdown"
                      style="width: 40px"
                    >
                      <q-list class="text-bold bg-grey-3">
                        <q-item
                          class="hoverable-item"
                          clickable
                          v-close-popup
                          @click="reasonCancel(row.reasonForCancel)"
                        >
                          <q-item-section>
                            <q-item-label>Reason of Cancelation</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown>
                  </div>
                </template>
                <template v-if="col.name === 'Reason'">
                  <q-btn
                    push
                    @click="reasonLeave(row.reasonForLeave)"
                    icon="article"
                    color="primary"
                    style="width: 50%"
                  />
                </template>
                <template v-if="col.name === 'Status'">
                  <template
                    v-if="
                      row.status === 'Approved' ||
                      row.status === 'RejectedByLevel1' ||
                      row.status === 'RejectedByLevel2'
                    "
                  >
                    <template
                      v-if="
                        row.status === 'Approved' &&
                        row.cancelledStatusOrig === null
                      "
                    >
                      <q-card style="width: 100%">
                        <q-card-section
                          class="bg-green-8 text-white text-bold text-center"
                          style="line-height: 25%"
                        >
                          LEAVE APPROVED
                        </q-card-section>
                      </q-card>
                    </template>
                    <template v-else-if="row.status === 'RejectedByLevel1'">
                      <q-card style="width: 100%">
                        <q-card-section
                          class="bg-negative text-white text-bold text-center"
                          style="line-height: 25%"
                        >
                          REJECTED BY LEVEL 1
                        </q-card-section>
                      </q-card>
                    </template>
                    <template v-else-if="row.status === 'RejectedByLevel2'">
                      <q-card style="width: 100%">
                        <q-card-section
                          class="bg-negative text-white text-bold text-center"
                          style="line-height: 25%"
                        >
                          REJECTED BY LEVEL 2
                        </q-card-section>
                      </q-card>
                    </template>
                  </template>
                  <template
                    v-else-if="
                      (row.status === 'Pending' ||
                        row.status === 'PendingLevel2') &&
                      row.cancelledStatusOrig === null
                    "
                  >
                    <div style="display: block; justify-content: center">
                      <div
                        class="q-pb-xs"
                        v-if="
                          approversDetails &&
                          approversDetails.some((item) => item.lvl === 1)
                        "
                      >
                        <template v-if="row.status === 'PendingLevel2'">
                          <q-card style="width: 100%">
                            <q-card-section
                              class="bg-green-8 text-white text-bold text-center"
                              style="line-height: 25%"
                            >
                              LEVEL 1 APPROVED
                            </q-card-section>
                          </q-card>
                        </template>
                        <template v-else-if="row.status === 'Pending'">
                          <q-card style="width: 100%">
                            <q-card-section
                              class="bg-yellow-10 text-white text-bold text-center"
                              style="line-height: 25%"
                            >
                              PENDING LEVEL 1
                            </q-card-section>
                          </q-card>
                        </template>
                      </div>
                      <div
                        class="q-pb-xs"
                        v-if="
                          approversDetails &&
                          approversDetails.some((item) => item.lvl === 2)
                        "
                      >
                        <template v-if="row.approvedByLevel2 === null">
                          <q-card style="width: 100%">
                            <q-card-section
                              class="bg-yellow-10 text-white text-bold text-center"
                              style="line-height: 25%"
                            >
                              PENDING LEVEL 2
                            </q-card-section>
                          </q-card>
                        </template>
                      </div>
                    </div>
                  </template>
                  <template
                    v-if="
                      row.iDCode === 'TempLeave' && row.status === 'CANCELLED'
                    "
                  >
                    <q-card style="width: 100%">
                      <q-card-section
                        class="bg-negative text-white text-bold text-center"
                        style="line-height: 25%"
                      >
                        CANCELED APPROVED
                      </q-card-section>
                    </q-card>
                  </template>
                  <template
                    v-if="
                      row.cancelledStatusOrig === 'Approved' ||
                      row.cancelledStatusOrig === 'RejectedByLevel1' ||
                      row.cancelledStatusOrig === 'RejectedByLevel2'
                    "
                  >
                    <template
                      v-if="
                        (row.cancelledStatusOrig === 'Approved' &&
                          row.approvedByLevel1 !== null &&
                          row.approvedByLevel2 === null) ||
                        (row.cancelledStatusOrig === 'Approved' &&
                          row.approvedByLevel1 === null &&
                          row.approvedByLevel2 === null)
                      "
                    >
                      <q-card style="width: 100%">
                        <q-card-section
                          class="bg-negative text-white text-bold text-center"
                          style="line-height: 25%"
                        >
                          CANCELED
                        </q-card-section>
                      </q-card>
                    </template>
                    <template
                      v-if="
                        row.cancelledStatusOrig === 'Approved' &&
                        row.approvedByLevel1 !== null &&
                        row.approvedByLevel2 !== null
                      "
                    >
                      <q-card style="width: 100%">
                        <q-card-section
                          class="bg-negative text-white text-bold text-center"
                          style="line-height: 25%"
                        >
                          CANCELED APPROVED
                        </q-card-section>
                      </q-card>
                    </template>
                    <template
                      v-else-if="row.cancelledStatusOrig === 'RejectedByLevel1'"
                    >
                      <q-card style="width: 100%">
                        <q-card-section
                          class="bg-negative text-white text-bold text-center"
                          style="line-height: 25%"
                        >
                          CANCEL REJECTED BY LEVEL 1
                        </q-card-section>
                      </q-card>
                    </template>
                    <template
                      v-else-if="row.cancelledStatusOrig === 'RejectedByLevel2'"
                    >
                      <q-card style="width: 100%">
                        <q-card-section
                          class="bg-negative text-white text-bold text-center"
                          style="line-height: 25%"
                        >
                          CANCEL REJECTED BY LEVEL 2
                        </q-card-section>
                      </q-card>
                    </template>
                  </template>
                  <template
                    v-else-if="
                      row.cancelledStatusOrig === 'Pending' ||
                      row.cancelledStatusOrig === 'PendingLevel2'
                    "
                  >
                    <div style="display: block; justify-content: center">
                      <div
                        class="q-pb-xs"
                        v-if="
                          approversDetails &&
                          approversDetails.some((item) => item.lvl === 1)
                        "
                      >
                        <template
                          v-if="row.cancelledStatusOrig === 'PendingLevel2'"
                        >
                          <q-card style="width: 100%">
                            <q-card-section
                              class="bg-green-8 text-white text-bold text-center"
                              style="line-height: 25%"
                            >
                              LEVEL 1 CANCEL APPROVED
                            </q-card-section>
                          </q-card>
                        </template>
                        <template
                          v-else-if="row.cancelledStatusOrig === 'Pending'"
                        >
                          <q-card style="width: 100%">
                            <q-card-section
                              class="bg-yellow-10 text-white text-bold text-center"
                              style="line-height: 25%"
                            >
                              PENDING CANCEL LEVEL 1
                            </q-card-section>
                          </q-card>
                        </template>
                      </div>
                      <div
                        class="q-pb-xs"
                        v-if="
                          approversDetails &&
                          approversDetails.some((item) => item.lvl === 2)
                        "
                      >
                        <template v-if="row.cancelledByLevel2 === null">
                          <q-card style="width: 100%">
                            <q-card-section
                              class="bg-yellow-10 text-white text-bold text-center"
                              style="line-height: 25%"
                            >
                              PENDING CANCEL LEVEL 2
                            </q-card-section>
                          </q-card>
                        </template>
                      </div>
                    </div>
                  </template>
                </template>
              </q-td>
            </q-tr>
          </template>
        </q-virtual-scroll>
        <div v-if="sortedLeaveDetails.length === 0" class="text-center">
          <q-icon name="warning" style="font-size: 30px; color: red" />

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
        Leave History
      </q-card-section>
      <q-skeleton v-else :style="{ height: '55px' }" />

      <template v-if="loading">
        <SkeletonLoader :mobile="true" />
        <!-- <div class="q-pa-xs col-12 grid-style-transition">
                      <q-card bordered flat>
                        <template v-for="index in 7" :key="index">
                          <div style="display: flex; justify-content: space-between; width: 100%; padding: 5px 5px 5px;">
                            <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </template>
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 5px 5px 5px;">
                          <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          <div>
                            <q-skeleton :style="{ height: '30px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '30px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </div>
                      </q-card>
                    </div> -->
      </template>

      <template v-else>
        <div class="row">
          <div class="col-12 col-sm-6">
            <DropdownMenu
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
        <q-table
          v-if="sortedLeaveDetails.length > 0"
          grid
          flat
          bordered
          card-class="bg-primary text-white"
          :rows="sortedLeaveDetails"
          :columns="leavecolumns"
          row-key="leaveId"
          hide-bottom
          style="max-height: 450px; overflow-y: auto"
          class="virtual-scroll"
          :pagination="{ rowsPerPage: 0 }"
          hide-pagination
        >
          <template v-slot:item="props">
            <div class="q-pa-xs col-12 grid-style-transition">
              <q-card
                bordered
                flat
                :class="{
                  'bg-blue-1 text-black': props.rowIndex % 2 !== 1,
                }"
              >
                <q-list dense>
                  <q-item
                    v-for="col in props.cols.filter(
                      (col) => col.name !== 'desc',
                    )"
                    :key="col.name"
                  >
                    <q-item-section>
                      <q-item-label>{{ col.label + ":" }}</q-item-label>
                    </q-item-section>
                    <template v-if="col.label === 'Actions'">
                      <div
                        class="q-pt-xs"
                        v-if="
                          (props.row.approvedByLevel1 === 0 &&
                            props.row.status === 'PendingLevel2') ||
                          props.row.status === 'Pending'
                        "
                      >
                        <q-btn-dropdown
                          push
                          icon="settings"
                          class="no-dropdown bg-grey-3"
                          style="width: 40px"
                        >
                          <q-list class="text-bold">
                            <q-item
                              class="hoverable-item"
                              clickable
                              v-close-popup
                              @click="editLeave(props.row.leaveId)"
                            >
                              <q-item-section>
                                <q-item-label>Edit Leave</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item
                              class="hoverable-item"
                              clickable
                              v-close-popup
                              @click="cancelLeave(props.row.leaveId)"
                            >
                              <q-item-section>
                                <q-item-label>Cancel Leave</q-item-label>
                              </q-item-section>
                            </q-item>
                            <PrintPDF :entry="row" />
                            <!-- <PrintPDF
                                          v-if="props.row.status === 'Approved'"
                                          :entry="row"
                                        /> -->
                          </q-list>
                        </q-btn-dropdown>
                      </div>
                      <div
                        class="q-pt-xs"
                        v-else-if="
                          props.row.status === 'Approved' ||
                          (props.row.approvedByLevel1 !== null &&
                            props.row.approvedByLevel2 === null)
                        "
                      >
                        <q-btn-dropdown
                          push
                          icon="settings"
                          class="no-dropdown bg-grey-3"
                          style="width: 40px"
                        >
                          <q-list class="text-bold">
                            <q-item
                              class="hoverable-item"
                              clickable
                              v-close-popup
                              @click="cancelLeave(props.row.leaveId)"
                            >
                              <q-item-section>
                                <q-item-label>Cancel Leave</q-item-label>
                              </q-item-section>
                            </q-item>
                            <PrintPDF :entry="props.row" />
                            <!-- <PrintPDF
                                          v-if="props.row.status === 'Approved'"
                                          :entry="props.row"
                                        /> -->
                          </q-list>
                        </q-btn-dropdown>
                      </div>
                      <div
                        class="q-pt-xs"
                        v-if="
                          props.row.status === 'RejectedByLevel1' ||
                          props.row.status === 'RejectedByLevel2'
                        "
                      >
                        <q-btn-dropdown
                          push
                          icon="settings"
                          class="no-dropdown"
                          style="width: 40px"
                        >
                          <q-list class="text-bold bg-grey-3">
                            <q-item
                              class="hoverable-item"
                              v-if="
                                props.row.status === 'RejectedByLevel1' ||
                                props.row.status === 'RejectedByLevel2'
                              "
                              clickable
                              v-close-popup
                              @click="reason(props.row.reasonForRejection)"
                            >
                              <q-item-section>
                                <q-item-label>Reason of Rejection</q-item-label>
                              </q-item-section>
                            </q-item>
                            <PrintPDF :entry="props.row" />
                            <!-- <PrintPDF
                                          v-if="props.row.status === 'Approved'"
                                          :entry="row"
                                        /> -->
                          </q-list>
                        </q-btn-dropdown>
                      </div>
                      <div
                        class="q-pt-xs"
                        v-if="props.row.cancelledStatusOrig !== null"
                      >
                        <q-btn-dropdown
                          push
                          icon="settings"
                          class="no-dropdown"
                          style="width: 40px"
                        >
                          <q-list class="text-bold bg-grey-3">
                            <q-item
                              class="hoverable-item"
                              clickable
                              v-close-popup
                              @click="reasonCancel(props.row.reasonForCancel)"
                            >
                              <q-item-section>
                                <q-item-label
                                  >Reason of Cancellation</q-item-label
                                >
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-btn-dropdown>
                      </div>
                    </template>
                    <template v-if="col.name === 'Status'">
                      <template
                        v-if="
                          props.row.status === 'Approved' ||
                          props.row.status === 'RejectedByLevel1' ||
                          props.row.status === 'RejectedByLevel2'
                        "
                      >
                        <div class="q-pt-xs">
                          <template
                            v-if="
                              props.row.status === 'Approved' &&
                              props.row.cancelledStatusOrig === null
                            "
                          >
                            <q-card style="width: 100%">
                              <q-card-section
                                class="bg-green-8 text-white text-bold text-center"
                                style="line-height: 25%"
                              >
                                LEAVE APPROVED
                              </q-card-section>
                            </q-card>
                          </template>
                          <template
                            v-else-if="props.row.status === 'RejectedByLevel1'"
                          >
                            <q-card style="width: 100%">
                              <q-card-section
                                class="bg-negative text-white text-bold text-center"
                                style="line-height: 25%"
                              >
                                REJECTED BY LEVEL 1
                              </q-card-section>
                            </q-card>
                          </template>
                          <template
                            v-else-if="props.row.status === 'RejectedByLevel2'"
                          >
                            <q-card style="width: 100%">
                              <q-card-section
                                class="bg-negative text-white text-bold text-center"
                                style="line-height: 25%"
                              >
                                REJECTED BY LEVEL 2
                              </q-card-section>
                            </q-card>
                          </template>
                        </div>
                      </template>
                      <template
                        v-else-if="
                          (props.row.status === 'Pending' ||
                            props.row.status === 'PendingLevel2') &&
                          props.row.cancelledStatusOrig === null
                        "
                      >
                        <div style="display: block; justify-content: center">
                          <div
                            class="q-pb-xs"
                            v-if="
                              approversDetails &&
                              approversDetails.some((item) => item.lvl === 1)
                            "
                          >
                            <template
                              v-if="props.row.status === 'PendingLevel2'"
                            >
                              <q-card style="width: 100%">
                                <q-card-section
                                  class="bg-green-8 text-white text-bold text-center"
                                  style="line-height: 25%"
                                >
                                  LEVEL 1 APPROVED
                                </q-card-section>
                              </q-card>
                            </template>
                            <template
                              v-else-if="props.row.status === 'Pending'"
                            >
                              <q-card style="width: 100%">
                                <q-card-section
                                  class="bg-yellow-10 text-white text-bold text-center"
                                  style="line-height: 25%"
                                >
                                  PENDING LEVEL 1
                                </q-card-section>
                              </q-card>
                            </template>
                          </div>
                          <div
                            class="q-pb-xs"
                            v-if="
                              approversDetails &&
                              approversDetails.some((item) => item.lvl === 2)
                            "
                          >
                            <template
                              v-if="props.row.approvedByLevel2 === null"
                            >
                              <q-card style="width: 100%">
                                <q-card-section
                                  class="bg-yellow-10 text-white text-bold text-center"
                                  style="line-height: 25%"
                                >
                                  PENDING LEVEL 2
                                </q-card-section>
                              </q-card>
                            </template>
                          </div>
                        </div>
                      </template>
                      <template
                        v-if="
                          props.row.cancelledStatusOrig === 'Approved' ||
                          props.row.cancelledStatusOrig ===
                            'RejectedByLevel1' ||
                          props.row.cancelledStatusOrig === 'RejectedByLevel2'
                        "
                      >
                        <template
                          v-if="props.row.cancelledStatusOrig === 'Approved'"
                        >
                          <q-card style="width: 100%">
                            <q-card-section
                              class="bg-negative text-white text-bold text-center"
                              style="line-height: 25%"
                            >
                              CANCELED APPROVED
                            </q-card-section>
                          </q-card>
                        </template>
                        <template
                          v-else-if="
                            props.row.cancelledStatusOrig === 'RejectedByLevel1'
                          "
                        >
                          <q-card style="width: 100%">
                            <q-card-section
                              class="bg-negative text-white text-bold text-center"
                              style="line-height: 25%"
                            >
                              CANCEL REJECTED BY LEVEL 1
                            </q-card-section>
                          </q-card>
                        </template>
                        <template
                          v-else-if="
                            props.row.cancelledStatusOrig === 'RejectedByLevel2'
                          "
                        >
                          <q-card style="width: 100%">
                            <q-card-section
                              class="bg-negative text-white text-bold text-center"
                              style="line-height: 25%"
                            >
                              CANCEL REJECTED BY LEVEL 2
                            </q-card-section>
                          </q-card>
                        </template>
                      </template>
                      <template
                        v-else-if="
                          props.row.cancelledStatusOrig === 'Pending' ||
                          props.row.cancelledStatusOrig === 'PendingLevel2'
                        "
                      >
                        <div style="display: block; justify-content: center">
                          <div
                            class="q-pb-xs"
                            v-if="
                              approversDetails &&
                              approversDetails.some((item) => item.lvl === 1)
                            "
                          >
                            <template
                              v-if="
                                props.row.cancelledStatusOrig ===
                                'PendingLevel2'
                              "
                            >
                              <q-card style="width: 100%">
                                <q-card-section
                                  class="bg-green-8 text-white text-bold text-center"
                                  style="line-height: 25%"
                                >
                                  LEVEL 1 CANCEL APPROVED
                                </q-card-section>
                              </q-card>
                            </template>
                            <template
                              v-else-if="
                                props.row.cancelledStatusOrig === 'Pending'
                              "
                            >
                              <q-card style="width: 100%">
                                <q-card-section
                                  class="bg-yellow-10 text-white text-bold text-center"
                                  style="line-height: 25%"
                                >
                                  PENDING CANCEL LEVEL 1
                                </q-card-section>
                              </q-card>
                            </template>
                          </div>
                          <div
                            class="q-pb-xs"
                            v-if="
                              approversDetails &&
                              approversDetails.some((item) => item.lvl === 2)
                            "
                          >
                            <template
                              v-if="props.row.cancelledByLevel2 === null"
                            >
                              <q-card style="width: 100%">
                                <q-card-section
                                  class="bg-yellow-10 text-white text-bold text-center"
                                  style="line-height: 25%"
                                >
                                  PENDING CANCEL LEVEL 2
                                </q-card-section>
                              </q-card>
                            </template>
                          </div>
                        </div>
                      </template>
                    </template>
                    <template v-else>
                      <q-item-label
                        class="text-bold text-black"
                        caption
                        style="padding-top: 7px"
                      >
                        {{ getFormattedCellValue(props.row, col) }}
                      </q-item-label>
                    </template>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </template>
        </q-table>
        <div v-if="sortedLeaveDetails.length === 0" class="text-center">
          <q-icon name="warning" style="font-size: 25px; color: red" />
          No data available
        </div>
      </template>
    </template>
  </q-card>
</template>

<script></script>
