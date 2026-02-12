<template>
  <q-virtual-scroll
    v-if="!mobileView"
    class="virtual-scroll"
    type="table"
    style="max-height: 450px"
    :virtual-scroll-item-size="48"
    :virtual-scroll-sticky-size-start="48"
    :virtual-scroll-sticky-size-end="32"
    :items="displayedItems"
    @virtual-scroll="onVirtualScroll"
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
                class="no-dropdown"
                style="width: 40px"
              >
                <q-list class="text-bold">
                  <q-item
                    v-if="!hrModule"
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

                  <PrintPDF :entry="row" />
                </q-list>
              </q-btn-dropdown>
            </div>
            <div
              v-else-if="
                (row.status === 'Approved' && row.iDCode !== 'TempLeave') ||
                (row.approvedByLevel1 !== null &&
                  row.status === 'PendingLevel2' &&
                  row.iDCode !== 'TempLeave')
              "
            >
              <q-btn-dropdown
                push
                icon="settings"
                class="no-dropdown"
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
                    @click="reasonLeave(row.reasonForRejection, 'reject')"
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
                    @click="reasonLeave(row.reasonForCancel, 'cancel')"
                  >
                    <q-item-section>
                      <q-item-label>Reason of Cancelation</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </template>
          <template v-if="col.name === 'Time'">
            {{ row.timeFrom }} - {{ formatTime(row.timeTo) }}
          </template>
          <template v-if="col.name === 'Reason'">
            <!-- <q-btn
              push
              @click="reasonLeave(row.reasonForLeave, 'request')"
              icon="article"
              color="primary"
              style="width: 50%"
            /> -->

            <span
              @click="reasonLeave(row.reasonForLeave || row.workLoad)"
              class="cursor-pointer text-center text-primary"
              style="
                width: 100%;
                white-space: normal;
                word-break: break-word;
                overflow-wrap: anywhere;
              "
            >
              {{
                (row.reasonForLeave || row.workLoad)
                  .split(" ")
                  .slice(0, 3)
                  .join(" ")
              }}
              <span
                v-if="
                  (row.reasonForLeave || row.workLoad).split(' ').length > 3
                "
              >
                ... See more
              </span>
            </span>
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
                  row.status === 'Approved' && row.cancelledStatusOrig === null
                "
              >
                <q-card class="blue-outline" style="width: 100%">
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
                (row.status === 'Pending' || row.status === 'PendingLevel2') &&
                row.cancelledStatusOrig === null
              "
            >
              <div style="display: block; justify-content: center">
                <div
                  class="q-pb-xs"
                  v-if="
                    itemApprover && itemApprover.some((item) => item.lvl === 1)
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
                    itemApprover && itemApprover.some((item) => item.lvl === 2)
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
              v-if="row.iDCode === 'TempLeave' && row.status === 'CANCELLED'"
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
                    itemApprover && itemApprover.some((item) => item.lvl === 1)
                  "
                >
                  <template v-if="row.cancelledStatusOrig === 'PendingLevel2'">
                    <q-card style="width: 100%">
                      <q-card-section
                        class="bg-green-8 text-white text-bold text-center"
                        style="line-height: 25%"
                      >
                        LEVEL 1 CANCEL APPROVED
                      </q-card-section>
                    </q-card>
                  </template>
                  <template v-else-if="row.cancelledStatusOrig === 'Pending'">
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
                    itemApprover && itemApprover.some((item) => item.lvl === 2)
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

  <q-table
    v-if="mobileView"
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
              v-for="col in props.cols.filter((col) => col.name !== 'desc')"
              :key="col.name"
            >
              <q-item-section>
                <q-item-label>{{ col.label + ":" }}</q-item-label>
              </q-item-section>
              <template v-if="col.label === 'Actions' && !hrModule">
                <div
                  v-if="
                    (props.row.approvedByLevel1 === 0 &&
                      props.row.status === 'PendingLevel2' &&
                      props.row.iDCode !== 'TempLeave') ||
                    (props.row.status === 'Pending' &&
                      props.row.iDCode !== 'TempLeave')
                  "
                >
                  <q-btn-dropdown
                    push
                    icon="settings"
                    class="no-dropdown"
                    style="width: 40px"
                  >
                    <q-list class="text-bold">
                      <q-item
                        v-if="!hrModule"
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
                      <PrintPDF :entry="props.row" />
                      <!-- <PrintPDF
                                          v-if="props.row.status === 'Approved'"
                                          :entry="row"
                                        /> -->
                    </q-list>
                  </q-btn-dropdown>
                </div>
                <div
                  v-else-if="
                    (props.row.status === 'Approved' &&
                      props.row.iDCode !== 'TempLeave') ||
                    (props.row.approvedByLevel1 !== null &&
                      props.row.status === 'PendingLevel2' &&
                      props.row.iDCode !== 'TempLeave')
                  "
                >
                  <q-btn-dropdown
                    push
                    icon="settings"
                    class="no-dropdown"
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
                        @click="
                          reasonLeave(props.row.reasonForRejection, 'reject')
                        "
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
                        @click="
                          reasonLeave(props.row.reasonForCancel, 'cancel')
                        "
                      >
                        <q-item-section>
                          <q-item-label>Reason of Cancellation</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </div>
              </template>

              <template v-if="col.name === 'Reason'">
                <div style="display: block; justify-content: center">
                  <q-btn
                    push
                    @click="reasonLeave(props.row.reasonForLeave)"
                    icon="article"
                    color="primary"
                    style="line-height: 25%"
                  />
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
                        itemApprover &&
                        itemApprover.some((item) => item.lvl === 1)
                      "
                    >
                      <template v-if="props.row.status === 'PendingLevel2'">
                        <q-card style="width: 100%">
                          <q-card-section
                            class="bg-green-8 text-white text-bold text-center"
                            style="line-height: 25%"
                          >
                            LEVEL 1 APPROVED
                          </q-card-section>
                        </q-card>
                      </template>
                      <template v-else-if="props.row.status === 'Pending'">
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
                        itemApprover &&
                        itemApprover.some((item) => item.lvl === 2)
                      "
                    >
                      <template v-if="props.row.approvedByLevel2 === null">
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
                    props.row.cancelledStatusOrig === 'RejectedByLevel1' ||
                    props.row.cancelledStatusOrig === 'RejectedByLevel2'
                  "
                >
                  <template
                    v-if="
                      (props.row.cancelledStatusOrig === 'Approved' &&
                        props.row.approvedByLevel1 !== null &&
                        props.row.approvedByLevel2 === null) ||
                      (props.row.cancelledStatusOrig === 'Approved' &&
                        props.row.approvedByLevel1 === null &&
                        props.row.approvedByLevel2 === null)
                    "
                  >
                    <div style="display: block; justify-content: center">
                      <q-card style="width: 100%">
                        <q-card-section
                          class="bg-negative text-white text-bold text-center"
                          style="line-height: 25%"
                        >
                          CANCELED
                        </q-card-section>
                      </q-card>
                    </div>
                  </template>
                  <template
                    v-if="
                      props.row.cancelledStatusOrig === 'Approved' &&
                      props.row.approvedByLevel1 !== null &&
                      props.row.approvedByLevel2 !== null
                    "
                  >
                    <div style="display: block; justify-content: center">
                      <q-card style="width: 100%">
                        <q-card-section
                          class="bg-negative text-white text-bold text-center"
                          style="line-height: 25%"
                        >
                          CANCELED APPROVED
                        </q-card-section>
                      </q-card>
                    </div>
                  </template>
                  <template
                    v-else-if="
                      props.row.cancelledStatusOrig === 'RejectedByLevel1'
                    "
                  >
                    <div style="display: block; justify-content: center">
                      <q-card style="width: 100%">
                        <q-card-section
                          class="bg-negative text-white text-bold text-center"
                          style="line-height: 25%"
                        >
                          CANCEL REJECTED BY LEVEL 1
                        </q-card-section>
                      </q-card>
                    </div>
                  </template>
                  <template
                    v-else-if="
                      props.row.cancelledStatusOrig === 'RejectedByLevel2'
                    "
                  >
                    <div style="display: block; justify-content: center">
                      <q-card style="width: 100%">
                        <q-card-section
                          class="bg-negative text-white text-bold text-center"
                          style="line-height: 25%"
                        >
                          CANCEL REJECTED BY LEVEL 2
                        </q-card-section>
                      </q-card>
                    </div>
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
                        itemApprover &&
                        itemApprover.some((item) => item.lvl === 1)
                      "
                    >
                      <template
                        v-if="props.row.cancelledStatusOrig === 'PendingLevel2'"
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
                        v-else-if="props.row.cancelledStatusOrig === 'Pending'"
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
                        itemApprover &&
                        itemApprover.some((item) => item.lvl === 2)
                      "
                    >
                      <template v-if="props.row.cancelledByLevel2 === null">
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
    <q-icon name="warning" style="font-size: 30px; color: red" />

    No data available
  </div>

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
          {{
            cancel
              ? "Leave Cancel Reason"
              : rejection
              ? "Leave Rejection Reason"
              : "Leave Request Reason"
          }}
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

  <q-dialog v-model="editDialog">
    <q-card
      :class="[
        'bold-text',
        $q.screen.name + '-text',
        $q.screen.name + '-width',
        $q.screen.name + '-min-height',
      ]"
      class="rounded"
    >
      <q-card-section
        rd-section
        class="bg-primary text-white text-center"
        horizontal:class="['bold-text', $q.screen.name + '-text']"
      >
        Edit Leave Form
      </q-card-section>

      <q-card-section>
        <filingForm
          :LeaveTypesOptions="leaveTypes"
          :editView="true"
          :editLeaveID="editLeaveID"
          :hrModule="false"
          @cancelEditEmit="cancelEditEmit"
          @successEditEmit="successEditEmit"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="cancelDialog">
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
        <div class="text-white text-bold">Reason For Canceling Leave</div>
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
      <q-card-section class="q-pt-xm">
        <q-input
          filled
          v-model="reasonForCancelation"
          placeholder="Type here"
          type="textarea"
        ></q-input>
      </q-card-section>
      <q-card-actions
        style="display: flex; justify-content: right"
        class="q-pr-md"
      >
        <div style="display: flex; justify-content: center; gap: 10px">
          <q-btn
            class="bg-negative text-white text-subtitle1"
            push
            label="cancel"
            @click="cancelCancelation"
          />
          <q-btn
            class="bg-primary text-white text-subtitle1"
            push
            label="confirm"
            @click="confirmCancel"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import PrintPDF from "../components/GeneratePDF.vue";
import filingForm from "src/components/filingForm.vue";
import helperMethods from "src/helperMethods";
import { Loading, QSpinnerIos } from "quasar";

export default {
  emits: ["emitSuccessEditing"],

  props: {
    itemDetails: Array,
    itemApprover: Array,
    LeaveTypeLabels: Object,
    hrModule: Boolean,
    leaveTypesOptions: Array,
    searchTextDetails: String,
    mobileView: Boolean,
  },

  data() {
    return {
      leaveDetails: this.itemDetails,
      approversDetails: this.itemApprover,
      displayedItems: [],
      toDisplay: 10,
      toLoad: 10,
      leavecolumns: [
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
          field: "transDate",
          width: "100px",
        },
        {
          name: "Days",
          label: "Days",
          align: "center",
          field: "daysOfLeave",
          sortable: false,
          width: "82px",
        },
        {
          name: "Time",
          label: "Time",
          align: "center",
          field: "",
          sortable: false,
          width: "110px",
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
          name: "Date",
          label: "Date",
          align: "center",
          field: "",
          sortable: false,
          width: "120px",
        },
        // {
        //   name: "Date From",
        //   label: "Date From",
        //   align: "center",
        //   field: "dateLeavedFrom",
        //   sortable: false,
        //   width: "138px",
        // },
        // {
        //   name: "Date To",
        //   label: "Date To",
        //   align: "center",
        //   field: "dateLeavedTo",
        //   sortable: false,
        //   width: "138px",
        // },
        {
          name: "Leave Type",
          label: "Leave Type",
          align: "center",
          field: "leaveType",
          sortable: false,
          width: "130px",
        },
        {
          name: "Reason",
          label: "Reason",
          align: "left",
          sortable: false,
          width: "300px",
        },
        {
          name: "Status",
          label: "Status",
          align: "center",
          field: "Status",
          sortable: false,
          width: "110px",
        },
      ],
      reasonDialog: false,
      reasonForLeave: null,
      editLeaveID: null,
      editDialog: false,
      leaveTypes: this.leaveTypesOptions,
      cancelDialog: false,
      cancelId: null,
      reasonForCancelation: "",
      request: false,
      rejection: false,
      cancel: false,
    };
  },

  components: {
    PrintPDF,
    filingForm,
  },

  computed: {
    sortedLeaveDetails() {
      if (Array.isArray(this.itemDetails)) {
        const query = this.searchTextDetails
          ? this.searchTextDetails.toLowerCase()
          : "";
        return this.itemDetails
          .filter((row) => {
            return (
              row.leaveId.toString().toLowerCase().includes(query) ||
              this.formatDateTime(row.transDate)
                .toLowerCase()
                .includes(query) ||
              this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query)
            );
          })
          .sort((a, b) => b.transDate - a.transDate);
      } else {
        return [];
      }
    },
  },

  methods: {
    formatTime(time) {
      if (!time) return time;

      if (time.startsWith("0:")) {
        return time.replace("0:", "12:");
      }

      return time;
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

    getFormattedCellValue(row, col) {
      if (col.field === "leaveType") {
        return this.LeaveTypeLabels[row[col.field]];
      } else if (col.field === "transDate") {
        return this.formatDateTime(row[col.field]);
      } else if (col.name === "Date") {
        return `${this.formatDateTime(
          row.dateLeavedFrom,
        )} - ${this.formatDateTime(row.dateLeavedTo)}`;
      } else {
        return row[col.field];
      }
    },

    reasonLeave(reasonForLeave, stringValue) {
      this.reasonDialog = true;
      this.reasonForLeave = reasonForLeave;

      this.request = false;
      this.cancel = false;
      this.rejection = false;

      if (stringValue === "request") {
        this.request = true;
      } else if (stringValue === "cancel") {
        this.cancel = true;
      } else if (stringValue === "reject") {
        this.rejection = true;
      }
    },

    editLeave(leaveId) {
      this.editDialog = true;
      this.editLeaveID = leaveId;
    },

    cancelEditEmit() {
      this.editDialog = false;
    },

    async fetchLeaves() {
      try {
        await this.$store.dispatch("leaveModule/fetchLeaves");
      } catch (error) {
        console.error("Failed getting Leave Details");
      }
    },

    async successEditEmit() {
      this.editDialog = false;
      this.$emit("emitSuccessEditing");
    },

    cancelLeave(leaveId) {
      this.cancelDialog = true;
      this.cancelId = leaveId;
    },

    cancelCancelation() {
      this.reasonForCancelation = "";
      this.cancelDialog = false;
      this.cancelId = "";
    },

    async confirmCancel() {
      if (this.reasonForCancelation.length === 0) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Input the Required Field (Reason)",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      this.$q
        .dialog({
          title: "Warning",
          message: "Are you sure you want to cancel your leave?",
          cancel: true,
          persistent: true,
          ok: {
            push: true,
            color: "primary",
            label: "Confirm",
            class: "text-subtitle1",
          },
          cancel: {
            push: true,
            color: "negative",
            label: "Cancel",
            class: "text-subtitle1",
          },
        })
        .onOk(async () => {
          const cancelData = {
            LeaveID: this.cancelId,
            reason: this.reasonForCancelation,
            hrModule: this.hrModule,
          };
          this.cancelDialog = false;
          this.reasonDialogCancel = false;

          this.$q.loading.show({
            spinner: QSpinnerIos,
            message: "Cancelling Leave Request",
            messageColor: "primary",
            backgroundColor: "grey-1",
            spinnerColor: "primary",
            customClass: "custom-loading-style",
            spinnerSize: "7em",
          });

          try {
            await helperMethods.delay(500);
            await this.$store.dispatch("leaveModule/cancelLeave", cancelData);
            this.cancelId = "";
            this.$emit("emitSuccessEditing");
            this.$q.loading.hide();
            this.cancelDialog = false;
            this.reasonForCancelation = "";
            this.cancelId = "";
            this.$q.notify({
              color: "green-8",
              position: "center",
              message: "Success Cancel of Leave Request, Wait For The Approval",
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            helperMethods.disablePointerEvents(2000);
          } catch (error) {
            this.cancelId = "";
            this.$q.loading.hide();
            this.reasonForCancelation = "";
            this.cancelDialog = false;
            this.$q.notify({
              color: "negative",
              position: "center",
              message: "Error cancel of leave request",
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          }
        })
        .onDismiss(() => {});
    },

    onVirtualScroll({ to }) {
      if (to >= this.displayedItems.length - 2) {
        if (this.toLoad < this.sortedLeaveDetails.length) {
          this.toLoad += this.toDisplay;
          this.displayedItems = this.sortedLeaveDetails.slice(0, this.toLoad);
        }
      }
    },
  },

  watch: {
    itemDetails: {
      handler(item) {
        this.displayedItems = item.slice(0, this.toDisplay);
      },
      immediate: true,
    },

    sortedLeaveDetails(newVal) {
      this.displayedItems = newVal.slice(0, this.toDisplay);
    },
  },
};
</script>
