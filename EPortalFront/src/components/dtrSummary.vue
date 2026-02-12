<template>
  <q-btn
    v-if="typeReport === 'summarize' && items && items.length > 0"
    label="Archive / Summary Finalize"
    push
    class="bg-yellow-10 text-bold text-white q-pa-xs q-mb-md"
    @click="summarizeDtr()"
  />
  <div :class="['q-mb-xl', typeReport === 'summarize' ? 'q-mt-md' : 'q-mt-xl']">
    <div v-if="items && items.length > 0" class="q-mb-md">
      <q-input
        class="blue-outline col-12 col-sm-6"
        v-model="searchText"
        dense
        placeholder="Search"
        outlined
        standout
        clearable
        :class="[$q.screen.name + '-text2']"
        input-style="color: #1565c0;"
        @clear="this.searchText = ''"
      />
    </div>
    <div v-if="typeReport === 'summarize'">
      <div
        v-if="!displayedItems || displayedItems.length === 0"
        class="text-red text-h6 text-bold text-left"
      >
        No data available, Please search for time data record.
      </div>

      <q-card
        v-for="(employee, index) in displayedItems"
        :key="employee.code"
        :class="['drawerStyle', 'q-pa-xs', { 'q-mt-xl': index !== 0 }]"
      >
        <q-card-section class="q-pa-none">
          <q-table
            flat
            bordered
            :rows="employee.dtr"
            :columns="computedColumns"
            row-key="Level"
            hide-bottom
            style="height: auto; overflow-y: auto"
            class="virtual-scroll"
            :pagination="{ rowsPerPage: 0 }"
            hide-pagination
          >
            <template v-slot:header>
              <q-tr class="bg-grey-3">
                <q-th colspan="100%" class="text-left">
                  <div class="row q-gutter-md q-pa-sm text-subtitle2">
                    <div>
                      Employee Code:
                      <strong>{{ employee.dtr[0].code }}</strong>
                    </div>
                    <div>
                      Name: <strong>{{ employee.dtr[0].name }}</strong>
                    </div>
                    <div>
                      Position:
                      <strong>{{ employee.dtr[0].position }}</strong>
                    </div>
                    <div>
                      Department:
                      <strong>{{ employee.dtr[0].department }}</strong>
                    </div>
                  </div>
                </q-th>
              </q-tr>
              <q-tr class="sticky-thead bg-primary">
                <q-th
                  v-for="col in computedColumns"
                  :key="col.name"
                  :style="{ width: col.width }"
                  class="text-center text-white text-bold"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props" :key="props.row.employeeCode">
                <q-td
                  v-for="col in computedColumns"
                  :key="col.name"
                  class="text-center"
                >
                  <template
                    v-if="col.name === 'Absent' || col.name === 'Leave'"
                  >
                    <div>
                      {{ props.row[col.field] ? 1 : 0 }}
                    </div>
                  </template>

                  <template
                    v-else-if="
                      col.name === 'IN' ||
                      col.name === 'OUT' ||
                      col.name === 'OT IN' ||
                      col.name === 'OT OUT'
                    "
                  >
                    <div
                      class="flex justify-center items-center cursor-pointer"
                      style="height: 85%"
                      @click="onCardClick(props.row, col.name)"
                    >
                      <q-card
                        v-if="col.name === 'IN'"
                        style="width: 75%; height: 100%"
                        class="flex flex-center text-center text-white"
                        :class="{
                          'bg-yellow-10':
                            props.row.late > 1 && props.row.late <= 15,
                          'bg-red-10': props.row.late > 15,
                          'bg-green-8': props.row.late <= 1 || !props.row.late,
                        }"
                      >
                        <q-card-section
                          v-if="props.row[col.field]"
                          class="q-pa-xs text-bold"
                        >
                          {{ props.row[col.field] }}
                        </q-card-section>
                        <q-card-section v-else class="q-pa-none text-bold">
                          -
                        </q-card-section>
                      </q-card>

                      <q-card
                        v-else-if="col.name === 'OUT'"
                        style="width: 75%; height: 100%"
                        class="flex flex-center text-center text-white"
                        :class="{
                          'bg-yellow-10':
                            props.row.undertime > 1 &&
                            props.row.undertime <= 14,
                          'bg-red-10': props.row.undertime > 14,
                          'bg-green-8':
                            props.row.undertime <= 1 || !props.row.undertime,
                        }"
                      >
                        <q-card-section
                          v-if="props.row[col.field]"
                          class="q-pa-xs text-bold"
                        >
                          {{ props.row[col.field] }}
                        </q-card-section>
                        <q-card-section v-else class="q-pa-none text-bold">
                          -
                        </q-card-section>
                      </q-card>

                      <q-card
                        v-else
                        style="width: 75%; height: 100%"
                        class="flex flex-center text-center bg-green-8 text-white"
                      >
                        <q-card-section
                          v-if="props.row[col.field]"
                          class="q-pa-xs text-bold"
                        >
                          {{ props.row[col.field] }}
                        </q-card-section>
                        <q-card-section v-else class="q-pa-none text-bold">
                          -
                        </q-card-section>
                      </q-card>
                    </div>
                  </template>

                  <template v-else-if="col.name === 'Late'">
                    <div
                      class="flex justify-center items-center"
                      style="height: 85%"
                    >
                      <q-card
                        v-if="props.row.late > 1 && props.row.late <= 15"
                        style="width: 75%; height: 100%"
                        class="flex flex-center text-center bg-yellow-10 text-white"
                      >
                        <q-card-section class="q-pa-xs text-bold">
                          {{ props.row.late }}
                        </q-card-section>
                      </q-card>
                      <q-card
                        v-else-if="props.row.late > 15"
                        style="width: 75%; height: 100%"
                        class="flex flex-center text-center bg-red-10 text-white"
                      >
                        <q-card-section class="q-pa-xs text-bold">
                          {{ props.row.late }}
                        </q-card-section>
                      </q-card>
                      <div v-else>-</div>
                    </div>
                  </template>

                  <template v-else-if="col.name === 'Undertime'">
                    <div
                      class="flex justify-center items-center"
                      style="height: 85%"
                    >
                      <q-card
                        v-if="
                          props.row.undertime > 1 && props.row.undertime <= 14
                        "
                        style="width: 75%; height: 100%"
                        class="flex flex-center text-center bg-yellow-10 text-white"
                      >
                        <q-card-section class="q-pa-xs text-bold">
                          {{ props.row.undertime }}
                        </q-card-section>
                      </q-card>
                      <q-card
                        v-else-if="props.row.undertime > 14"
                        style="width: 75%; height: 100%"
                        class="flex flex-center text-center bg-red-10 text-white"
                      >
                        <q-card-section class="q-pa-xs text-bold">
                          {{ props.row.undertime }}
                        </q-card-section>
                      </q-card>
                      <q-card-section v-else class="q-pa-xs text-bold">
                        -
                      </q-card-section>
                    </div>
                  </template>

                  <template v-else-if="col.name === 'Remarks'">
                    <div v-if="props.row.remarksTimeAdjustment">
                      <q-btn
                        push
                        @click="remarksMethod(props.row.remarksTimeAdjustment)"
                        icon="article"
                        color="primary"
                        dense
                        size="md"
                      >
                        <q-tooltip>{{
                          props.row.remarksTimeAdjustment
                        }}</q-tooltip>
                      </q-btn>
                    </div>
                    <div v-else class="text-grey-6">-</div>
                  </template>
                  <renderCell v-else :row="props.row" :col="col" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>

        <q-card-section class="q-pa-none q-mt-lg">
          <div class="row q-col-gutter-xs">
            <div class="col-9">
              <div class="row q-col-gutter-xs">
                <q-input
                  dense
                  outlined
                  label="Absences"
                  label-color="primary"
                  type="number"
                  :model-value="getTotalValue(employee.code, 'absent')"
                  @update:model-value="
                    (val) => updateTotalValue(employee.code, 'absent', val)
                  "
                  class="col blue-outline"
                  min="0"
                  @keydown="preventNegative"
                />
                <q-input
                  dense
                  outlined
                  :label="
                    hasComputedLate(employee.code)
                      ? 'Late (Computed From Last Month)'
                      : 'Late'
                  "
                  label-color="primary"
                  type="number"
                  :model-value="getLateValue(employee.code)"
                  @update:model-value="
                    (val) => updateTotalValue(employee.code, 'late', val)
                  "
                  class="col blue-outline"
                  min="0"
                  @keydown="preventNegative"
                />

                <q-input
                  dense
                  outlined
                  label="Undertime"
                  label-color="primary"
                  type="number"
                  :model-value="getTotalValue(employee.code, 'undertime')"
                  @update:model-value="
                    (val) => updateTotalValue(employee.code, 'undertime', val)
                  "
                  class="col blue-outline"
                  min="0"
                  @keydown="preventNegative"
                />
                <q-input
                  dense
                  outlined
                  label="Diff AM"
                  label-color="primary"
                  type="number"
                  :model-value="getTotalValue(employee.code, 'diffAM')"
                  @update:model-value="
                    (val) => updateTotalValue(employee.code, 'diffAM', val)
                  "
                  class="col blue-outline"
                  min="0"
                  @keydown="preventNegative"
                />
                <q-input
                  dense
                  outlined
                  label="Diff PM"
                  label-color="primary"
                  type="number"
                  :model-value="getTotalValue(employee.code, 'diffPM')"
                  @update:model-value="
                    (val) => updateTotalValue(employee.code, 'diffPM', val)
                  "
                  class="col blue-outline"
                  min="0"
                  @keydown="preventNegative"
                />
              </div>

              <div class="row q-col-gutter-xs">
                <q-input
                  dense
                  outlined
                  label="Absences Note"
                  label-color="primary"
                  type="text"
                  :model-value="getNoteValue(employee.code, 'absent')"
                  @update:model-value="
                    (val) => updateNoteValue(employee.code, 'absent', val)
                  "
                  class="col blue-outline"
                />
                <q-input
                  dense
                  outlined
                  label="Late Note"
                  label-color="primary"
                  type="text"
                  :model-value="getNoteValue(employee.code, 'late')"
                  @update:model-value="
                    (val) => updateNoteValue(employee.code, 'late', val)
                  "
                  class="col blue-outline"
                />
                <q-input
                  dense
                  outlined
                  label="Undertime Note"
                  label-color="primary"
                  type="text"
                  :model-value="getNoteValue(employee.code, 'undertime')"
                  @update:model-value="
                    (val) => updateNoteValue(employee.code, 'undertime', val)
                  "
                  class="col blue-outline"
                />
                <q-input
                  dense
                  outlined
                  label="Diff AM Note"
                  label-color="primary"
                  type="text"
                  :model-value="getNoteValue(employee.code, 'diffAM')"
                  @update:model-value="
                    (val) => updateNoteValue(employee.code, 'diffAM', val)
                  "
                  class="col blue-outline"
                />
                <q-input
                  dense
                  outlined
                  label="Diff PM Note"
                  label-color="primary"
                  type="text"
                  :model-value="getNoteValue(employee.code, 'diffPM')"
                  @update:model-value="
                    (val) => updateNoteValue(employee.code, 'diffPM', val)
                  "
                  class="col blue-outline"
                />
              </div>

              <div class="row q-col-gutter-xs q-mt-md">
                <q-input
                  dense
                  outlined
                  label="Overtime 35"
                  label-color="primary"
                  type="number"
                  :model-value="getOvertimeValue(employee.code, 'OT 35')"
                  @update:model-value="
                    (val) => updateOvertimeValue(employee.code, 'OT 35', val)
                  "
                  class="col blue-outline"
                  min="0"
                  @keydown="preventNegative"
                />
                <q-input
                  dense
                  outlined
                  label="Overtime 100"
                  label-color="primary"
                  type="number"
                  :model-value="getOvertimeValue(employee.code, 'OT 100')"
                  @update:model-value="
                    (val) => updateOvertimeValue(employee.code, 'OT 100', val)
                  "
                  class="col blue-outline"
                  min="0"
                  @keydown="preventNegative"
                />
                <q-input
                  dense
                  outlined
                  label="Overtime 130"
                  label-color="primary"
                  type="number"
                  :model-value="getOvertimeValue(employee.code, 'OT 130')"
                  @update:model-value="
                    (val) => updateOvertimeValue(employee.code, 'OT 130', val)
                  "
                  class="col blue-outline"
                  min="0"
                  @keydown="preventNegative"
                />
                <q-input
                  dense
                  outlined
                  label="Overtime 135"
                  label-color="primary"
                  type="number"
                  :model-value="getOvertimeValue(employee.code, 'OT 135')"
                  @update:model-value="
                    (val) => updateOvertimeValue(employee.code, 'OT 135', val)
                  "
                  class="col blue-outline"
                  min="0"
                  @keydown="preventNegative"
                />
                <q-input
                  dense
                  outlined
                  label="Refund"
                  label-color="primary"
                  type="number"
                  :model-value="getTotalValue(employee.code, 'refund')"
                  @update:model-value="
                    (val) => updateTotalValue(employee.code, 'refund', val)
                  "
                  class="col blue-outline"
                  min="0"
                  @keydown="preventNegative"
                />
              </div>

              <div class="row q-col-gutter-xs">
                <q-input
                  dense
                  outlined
                  label="Overtime 35 Note"
                  label-color="primary"
                  type="text"
                  :model-value="getNoteValue(employee.code, 'ot35')"
                  @update:model-value="
                    (val) => updateNoteValue(employee.code, 'ot35', val)
                  "
                  class="col blue-outline"
                />
                <q-input
                  dense
                  outlined
                  label="Overtime 100 Note"
                  label-color="primary"
                  type="text"
                  :model-value="getNoteValue(employee.code, 'ot100')"
                  @update:model-value="
                    (val) => updateNoteValue(employee.code, 'ot100', val)
                  "
                  class="col blue-outline"
                />
                <q-input
                  dense
                  outlined
                  label="Overtime 130 Note"
                  label-color="primary"
                  type="text"
                  :model-value="getNoteValue(employee.code, 'ot130')"
                  @update:model-value="
                    (val) => updateNoteValue(employee.code, 'ot130', val)
                  "
                  class="col blue-outline"
                />
                <q-input
                  dense
                  outlined
                  label="Overtime 135 Note"
                  label-color="primary"
                  type="text"
                  :model-value="getNoteValue(employee.code, 'ot135')"
                  @update:model-value="
                    (val) => updateNoteValue(employee.code, 'ot135', val)
                  "
                  class="col blue-outline"
                />
                <q-input
                  dense
                  outlined
                  label="Refund Note"
                  label-color="primary"
                  type="text"
                  :model-value="getNoteValue(employee.code, 'refund')"
                  @update:model-value="
                    (val) => updateNoteValue(employee.code, 'refund', val)
                  "
                  class="col blue-outline"
                  style="cursor: pointer"
                />
              </div>
            </div>

            <div class="col-3">
              <q-input
                outlined
                dense
                label="Note"
                label-color="primary"
                type="textarea"
                class="blue-outline"
                :model-value="generateNote(employee.code)"
                :rows="9"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-xs q-mt-md text-right">
          <q-btn
            @click="submitChanges(employee.code)"
            label="Submit Changes"
            push
            class="bg-positive text-bold text-white q-pa-xs"
          />
        </q-card-section>
      </q-card>

      <div class="col-12 q-mt-lg q-pb-xl text-center">
        <q-btn
          v-if="displayedItems.length > 1"
          class="text-white"
          label="Load More"
          color="primary"
          @click="loadMore"
        />
      </div>
    </div>

    <div v-if="typeReport === 'print' || typeReport === 'tally'">
      <q-card class="drawerStyle q-mt-md">
        <q-card-section class="q-pa-none">
          <q-table
            class="custom-scroll"
            :rows="displayedItems"
            :columns="computedColumns"
            row-key="code"
            style="max-height: 650px"
            virtual-scroll
            hide-pagination
            :rows-per-page-options="[0]"
            @virtual-scroll="onVirtualScroll"
          >
            <template v-slot:header>
              <q-tr class="sticky-thead bg-primary">
                <q-th
                  v-for="col in computedColumns"
                  :key="col.name"
                  :style="{ width: 'auto' }"
                  class="text-center text-white text-bold"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props" :key="props.row.employeeCode">
                <q-td
                  v-for="(col, index) in computedColumns"
                  :key="col.name"
                  class="text-center"
                  :style="{
                    width: col.width,
                    borderBottom: '1px solid #ccc',
                    borderRight: index > 0 ? '1px solid #ccc' : 'none',
                  }"
                >
                  <template v-if="col.name === 'Name'">
                    <div class="row">
                      <div class="col-12">{{ props.row.employeeName }}</div>
                      <div class="col-12">{{ props.row.department }}</div>
                    </div>
                  </template>
                  <template v-else-if="col.name === 'Note'">
                    <div
                      style="
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        word-break: break-word;
                        max-width: 200px;
                      "
                    >
                      {{ props.row.note }}
                    </div>
                  </template>
                  <renderCell v-else :row="props.row" :col="col" />
                </q-td>
              </q-tr>
            </template>

            <template v-slot:no-data="{ message }">
              <div class="full-width row flex-center text-black text-subtitle2">
                <div>
                  <span class="text-black text-subtitle2">
                    {{ message }}
                  </span>
                  <q-icon
                    class="text-red"
                    size="2em"
                    name="sentiment_dissatisfied"
                  ></q-icon>
                </div>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <div class="q-mt-md text-right">
        <dtrPdf
          :columns="computedColumns"
          :items="items"
          :typeReport="typeReport"
          :payrollPeriod="`${payrollFrom} - ${payrollTo}`"
          :classDescription="classDescription.description"
        />
      </div>
    </div>
  </div>
  <q-dialog v-model="selectedEmployeeTime">
    <q-card style="max-width: 1100px; position: relative">
      <q-card-section
        class="bg-primary row items-center q-pa-sm text-h6"
        style="min-width: 400px"
      >
        <div class="bg-primary text-white text-bold">
          Manual Time Adjustment
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

      <q-card-section class="q-pa-sm">
        <div class="row text-subtitle1">
          <div class="col-12 q-pa-none">
            Employee: {{ selectedEmployeeTimeData.employeeName }} ({{
              selectedEmployeeTimeData.employeeCode
            }})
          </div>
          <div class="col-12 q-pa-none">
            Date:
            {{ selectedEmployeeTimeData.dtrDate }}
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pa-sm row">
        <q-input
          outlined
          v-model="selectedEmployeeTimeData.value"
          :label="getLabelText(selectedEmployeeTimeData.label, 'label')"
          label-color="primary"
          type="time"
          class="blue-outline col-12"
        >
        </q-input>

        <q-input
          outlined
          v-model="selectedEmployeeTimeData.remarks"
          label="Reason for time adjustment"
          label-color="primary"
          type="textarea"
          class="blue-outline col-12 q-mt-xs"
          :rows="3"
        />
      </q-card-section>

      <q-card-section class="q-pa-sm text-right">
        <q-btn
          class="text-bold"
          label="Submit"
          color="primary"
          push
          @click="saveTimeChange"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="remarksTimeAdj">
    <q-card style="max-width: 1100px; position: relative">
      <q-card-section
        class="bg-primary row items-center q-pa-sm text-h6"
        style="min-width: 400px"
      >
        <div class="bg-primary text-white text-bold">
          Time Adjustment Remarks(Reason)
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

      <q-card-section class="q-pt-xm text-justify text-subtitle1">
        {{ timeAdjustmentRemarks }}
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import helperMethods from "src/helperMethods";
import renderCell from "./helpers/renderCell.vue";
import { QSpinnerIos } from "quasar";
import dtrPdf from "../components/DTRReportPdf.vue";

export default {
  emits: ["successFinalize"],
  props: {
    items: Object,
    payrollPeriod: String,
    timeDataFrom: String,
    timeDataTo: String,
    payrollFrom: String,
    payrollTo: String,
    typeReport: String,
    classDescription: Object,
  },

  data() {
    return {
      displayedItems: [],
      toDisplay: 10,
      toLoad: 10,
      searchText: "",
      isLoadingMore: false,
      scrollThreshold: 350,
      manualNotes: {},
      manualTotals: {},
      selectedEmployeeTime: false,
      selectedEmployeeTimeData: {},
      remarksTimeAdj: false,
      timeAdjustmentRemarks: "",
    };
  },

  components: {
    renderCell,
    dtrPdf,
  },

  computed: {
    // computedColumns() {
    //   const baseColumns = [
    //     {
    //       name: "Code",
    //       label: "Code",
    //       align: "center",
    //       field: "employeeCode",
    //       width: "80px",
    //     },
    //     {
    //       name: "Name",
    //       label: "Name",
    //       align: "center",
    //       field: "employeeName",
    //       width: "80px",
    //     },
    //     {
    //       name: "Absences Days",
    //       label: "Absences Days",
    //       align: "center",
    //       field: "absences",
    //       width: "80px",
    //     },
    //     {
    //       name: "Absences Hours",
    //       label: "Absences Hours",
    //       align: "center",
    //       field: "absencesHours",
    //       width: "80px",
    //     },
    //     {
    //       name: "Late",
    //       label: "Late",
    //       align: "center",
    //       field: "lates",
    //       width: "80px",
    //     },
    //     {
    //       name: "Undertime",
    //       label: "Undertime",
    //       align: "center",
    //       field: "undertime",
    //       width: "80px",
    //     },
    //     {
    //       name: "OT 35",
    //       label: "OT 35",
    //       align: "center",
    //       field: "oT35",
    //       width: "80px",
    //     },
    //     {
    //       name: "OT 100",
    //       label: "OT 100",
    //       align: "center",
    //       field: "oT100",
    //       width: "80px",
    //     },
    //     {
    //       name: "OT 130",
    //       label: "OT 130",
    //       align: "center",
    //       field: "oT130",
    //       width: "80px",
    //     },
    //     {
    //       name: "OT 135",
    //       label: "OT 135",
    //       align: "center",
    //       field: "oT135",
    //       width: "80px",
    //     },
    //     {
    //       name: "Diff NP",
    //       label: "Diff NP",
    //       align: "center",
    //       field: "diffAM",
    //       width: "80px",
    //     },
    //     {
    //       name: "Diff PM",
    //       label: "Diff PM",
    //       align: "center",
    //       field: "diffPM",
    //       width: "80px",
    //     },
    //     {
    //       name: "Refund",
    //       label: "Refund",
    //       align: "center",
    //       field: "refund",
    //       width: "80px",
    //     },
    //     {
    //       name: "Note",
    //       label: "Note",
    //       align: "center",
    //       field: "note",
    //       width: "130px",
    //     },
    //   ];

    //   const rawMapping = {
    //     "Absences Days": "Raw Absences",
    //     Late: "Raw Lates",
    //     Undertime: "Raw Undertime",
    //     "OT 35": "Raw OT 35",
    //     "OT 100": "Raw OT 100",
    //     "OT 130": "Raw OT 130",
    //     "OT 135": "Raw OT 135",
    //     "Diff NP": "Raw Diff NP",
    //     "Diff PM": "Raw Diff PM",
    //   };

    //   const specialRawFields = {
    //     "Diff NP": "rawDiffAM",
    //     "Diff PM": "rawDiffPM",
    //   };

    //   const summarizeColumns = [
    //     {
    //       name: "Day",
    //       label: "Day",
    //       align: "center",
    //       field: "dayOfWeek",
    //       width: "80px",
    //     },
    //     {
    //       name: "Date",
    //       label: "Date",
    //       align: "center",
    //       field: "transDateFormat",
    //       width: "80px",
    //     },
    //     {
    //       name: "Calendar",
    //       label: "Calendar",
    //       align: "center",
    //       field: "calendar",
    //       width: "100px",
    //     },
    //     {
    //       name: "Schedule",
    //       label: "Schedule",
    //       align: "center",
    //       field: "schedule",
    //       width: "100px",
    //     },
    //     {
    //       name: "IN",
    //       label: "IN",
    //       align: "center",
    //       field: "iN",
    //       width: "80px",
    //     },
    //     {
    //       name: "OUT",
    //       label: "OUT",
    //       align: "center",
    //       field: "oUT",
    //       width: "80px",
    //     },
    //     {
    //       name: "OT IN",
    //       label: "OT IN",
    //       align: "center",
    //       field: "oTIN",
    //       width: "80px",
    //     },
    //     {
    //       name: "OT OUT",
    //       label: "OT OUT",
    //       align: "center",
    //       field: "oTOUT",
    //       width: "80px",
    //     },
    //     {
    //       name: "Late",
    //       label: "Late",
    //       align: "center",
    //       field: "late",
    //       width: "80px",
    //     },
    //     {
    //       name: "Absent",
    //       label: "Absent",
    //       align: "center",
    //       field: "absent",
    //       width: "80px",
    //     },
    //     {
    //       name: "Leave",
    //       label: "Leave",
    //       align: "center",
    //       field: "onLeave",
    //       width: "80px",
    //     },
    //     {
    //       name: "Undertime",
    //       label: "Undertime",
    //       align: "center",
    //       field: "undertime",
    //       width: "80px",
    //     },
    //     {
    //       name: "Overtime",
    //       label: "Overtime",
    //       align: "center",
    //       field: "otHours",
    //       width: "80px",
    //     },
    //     {
    //       name: "Diff AM",
    //       label: "Diff AM",
    //       align: "center",
    //       field: "diffAM",
    //       width: "80px",
    //     },
    //     {
    //       name: "Diff PM",
    //       label: "Diff PM",
    //       align: "center",
    //       field: "diffPM",
    //       width: "80px",
    //     },
    //   ];

    //   if (this.typeReport === "tally") {
    //     return baseColumns.flatMap((col) => {
    //       const result = [col];
    //       const rawLabel = rawMapping[col.name];

    //       if (rawLabel) {
    //         const rawField =
    //           specialRawFields[col.name] ||
    //           rawLabel.replace(/\s+/g, "").replace("Raw", "raw");

    //         result.push({
    //           name: rawLabel,
    //           label: rawLabel,
    //           align: "center",
    //           field: rawField,
    //           sortable: false,
    //           width: "80px",
    //         });
    //       }
    //       return result;
    //     });
    //   }

    //   if (this.typeReport === "summarize") {
    //     return summarizeColumns;
    //   }

    //   return baseColumns;
    // },

    computedColumns() {
      const baseColumns = [
        {
          name: "Code",
          label: "Code",
          align: "center",
          field: "employeeCode",
        },
        {
          name: "Name",
          label: "Name",
          align: "center",
          field: "employeeName",
        },
        {
          name: "Absences Days",
          label: "Absences Days",
          align: "center",
          field: "absences",
        },
        {
          name: "Absences Hours",
          label: "Absences Hours",
          align: "center",
          field: "absencesHours",
        },
        {
          name: "Late",
          label: "Late",
          align: "center",
          field: "lates",
        },
        {
          name: "Undertime",
          label: "Undertime",
          align: "center",
          field: "undertime",
        },
        {
          name: "OT 35",
          label: "OT 35",
          align: "center",
          field: "oT35",
        },
        {
          name: "OT 100",
          label: "OT 100",
          align: "center",
          field: "oT100",
        },
        {
          name: "OT 130",
          label: "OT 130",
          align: "center",
          field: "oT130",
        },
        {
          name: "OT 135",
          label: "OT 135",
          align: "center",
          field: "oT135",
        },
        {
          name: "Diff NP",
          label: "Diff NP",
          align: "center",
          field: "diffAM",
        },
        {
          name: "Diff PM",
          label: "Diff PM",
          align: "center",
          field: "diffPM",
        },
        {
          name: "Refund",
          label: "Refund",
          align: "center",
          field: "refund",
        },
        {
          name: "Note",
          label: "Note",
          align: "center",
          field: "note",
        },
      ];

      const rawMapping = {
        "Absences Days": "Raw Absences",
        Late: "Raw Lates",
        Undertime: "Raw Undertime",
        "OT 35": "Raw OT 35",
        "OT 100": "Raw OT 100",
        "OT 130": "Raw OT 130",
        "OT 135": "Raw OT 135",
        "Diff NP": "Raw Diff NP",
        "Diff PM": "Raw Diff PM",
      };

      const specialRawFields = {
        "Diff NP": "rawDiffAM",
        "Diff PM": "rawDiffPM",
      };

      const summarizeColumns = [
        {
          name: "Day",
          label: "Day",
          align: "center",
          field: "dayOfWeek",
        },
        {
          name: "Date",
          label: "Date",
          align: "center",
          field: "transDateFormat",
        },
        {
          name: "Calendar",
          label: "Calendar",
          align: "center",
          field: "calendar",
        },
        {
          name: "Schedule",
          label: "Schedule",
          align: "center",
          field: "schedule",
        },
        {
          name: "IN",
          label: "IN",
          align: "center",
          field: "iN",
        },
        {
          name: "OUT",
          label: "OUT",
          align: "center",
          field: "oUT",
        },
        {
          name: "OT IN",
          label: "OT IN",
          align: "center",
          field: "oTIN",
        },
        {
          name: "OT OUT",
          label: "OT OUT",
          align: "center",
          field: "oTOUT",
        },
        {
          name: "Late",
          label: "Late",
          align: "center",
          field: "late",
        },
        {
          name: "Absent",
          label: "Absent",
          align: "center",
          field: "absent",
        },
        {
          name: "Leave",
          label: "Leave",
          align: "center",
          field: "onLeave",
        },
        {
          name: "Undertime",
          label: "Undertime",
          align: "center",
          field: "undertime",
        },
        {
          name: "Overtime",
          label: "Overtime",
          align: "center",
          field: "otHours",
        },
        {
          name: "Diff AM",
          label: "Diff AM",
          align: "center",
          field: "diffAM",
        },
        {
          name: "Diff PM",
          label: "Diff PM",
          align: "center",
          field: "diffPM",
        },
        {
          name: "Remarks",
          label: "Remark (TimeAdj)",
          align: "center",
          field: "remarksTimeAdjustment",
        },
      ];

      if (this.typeReport === "tally") {
        return baseColumns.flatMap((col) => {
          const result = [col];
          const rawLabel = rawMapping[col.name];

          if (rawLabel) {
            const rawField =
              specialRawFields[col.name] ||
              rawLabel.replace(/\s+/g, "").replace("Raw", "raw");

            result.push({
              name: rawLabel,
              label: rawLabel,
              align: "center",
              field: rawField,
              sortable: false,
            });
          }
          return result;
        });
      }

      if (this.typeReport === "summarize") {
        return summarizeColumns;
      }

      return baseColumns;
    },

    allEmployeeCodes() {
      if (Array.isArray(this.items)) {
        return this.items.map((item) => item.employeeCode);
      }
      return this.items ? Object.keys(this.items) : [];
    },

    filteredEmployee() {
      if (!this.searchText) return this.items;

      const search = this.searchText.toLowerCase();

      if (Array.isArray(this.items)) {
        return this.items.filter((item) => {
          // Search in top-level fields
          const matchesCode = item.code
            ?.toString()
            .toLowerCase()
            .includes(search);
          const matchesEmployeeCode = item.employeeCode
            ?.toString()
            .toLowerCase()
            .includes(search);
          const matchesEmployeeName = item.employeeName
            ?.toLowerCase()
            .includes(search);

          // Search inside dtr array
          const matchesDtr = item.dtr?.some((dtrItem) => {
            return (
              dtrItem.code?.toString().toLowerCase().includes(search) ||
              dtrItem.name?.toLowerCase().includes(search) ||
              dtrItem.deptCode?.toString().toLowerCase().includes(search) ||
              dtrItem.department?.toLowerCase().includes(search) ||
              dtrItem.posCode?.toLowerCase().includes(search) ||
              dtrItem.position?.toLowerCase().includes(search)
            );
          });

          // Search inside overtime array (optional)
          const matchesOvertime = item.overtime?.some((otItem) => {
            return (
              otItem.code?.toString().toLowerCase().includes(search) ||
              otItem.name?.toLowerCase().includes(search)
            );
          });

          return (
            matchesCode ||
            matchesEmployeeCode ||
            matchesEmployeeName ||
            matchesDtr ||
            matchesOvertime
          );
        });
      }

      // For object-based items (your second case)
      return Object.keys(this.items).filter((code) => {
        const item = this.items[code];
        const dtr = item?.dtr || [];

        // Search in code
        const matchesCode = code.toString().toLowerCase().includes(search);

        // Search in dtr array
        const matchesDtr = dtr.some((dtrItem) => {
          return (
            dtrItem.code?.toString().toLowerCase().includes(search) ||
            dtrItem.name?.toLowerCase().includes(search) ||
            dtrItem.deptCode?.toString().toLowerCase().includes(search) ||
            dtrItem.department?.toLowerCase().includes(search) ||
            dtrItem.posCode?.toLowerCase().includes(search) ||
            dtrItem.position?.toLowerCase().includes(search)
          );
        });

        return matchesCode || matchesDtr;
      });
    },

    // displayedEmployees() {
    //   return this.filteredEmployee.slice(0, this.toDisplay);
    // },

    hasReachedEnd() {
      return this.displayedCount >= this.allEmployeeCodes.length;
    },
  },

  methods: {
    getTotal(dtr, field) {
      if (!dtr) return 0;

      if (field === "absent") {
        return dtr.filter((row) => row.absent === true && row.onLeave === false)
          .length;
      }

      if (["late", "undertime", "diffAM", "diffPM"].includes(field)) {
        return dtr.reduce((total, record) => {
          return total + (parseFloat(record[field]) || 0);
        }, 0);
      }

      // if (["late", "undertime", "diffAM", "diffPM"].includes(field)) {
      //   return dtr.filter((row) => {
      //     const value = parseFloat(row[field]);
      //     return !isNaN(value) && value > 0;
      //   }).length;
      // }

      return 0;
    },

    getOvertimeTotal(overtime, type) {
      const item = overtime || [];
      return item
        .filter((row) => row.type === type)
        .reduce((sum, row) => sum + (Number(row.hours) || 0), 0);
    },

    initManualNotes(code) {
      if (!this.manualNotes[code]) {
        this.manualNotes[code] = {
          absent: "",
          late: "",
          undertime: "",
          diffAM: "",
          diffPM: "",
          ot35: "",
          ot100: "",
          ot130: "",
          ot135: "",
          refund: "",
        };
      }
    },

    initManualTotals(code) {
      if (!this.manualTotals) {
        this.manualTotals = {};
      }
      if (!this.manualTotals[code]) {
        this.manualTotals[code] = {
          absent: null,
          late: null,
          undertime: null,
          diffAM: null,
          diffPM: null,
          ot35: null,
          ot100: null,
          ot130: null,
          ot135: null,
          refund: null,
        };
      }
    },

    updateNoteValue(code, field, value) {
      this.initManualNotes(code);
      this.manualNotes[code][field] = value;
    },

    sanitizeNumber(value) {
      if (value === null || value === undefined || value === "") {
        return 0;
      }

      let num = parseFloat(value);

      if (num < 0) {
        num = 0;
      }

      return Math.floor(num);
    },

    preventNegative(event) {
      if (event.key === "-" || event.key === "e" || event.key === "E") {
        event.preventDefault();
      }
    },

    updateTotalValue(code, field, value) {
      this.initManualTotals(code);
      this.manualTotals[code][field] = this.sanitizeNumber(value);
    },

    updateOvertimeValue(code, type, value) {
      this.initManualTotals(code);
      const fieldMap = {
        "OT 35": "ot35",
        "OT 100": "ot100",
        "OT 130": "ot130",
        "OT 135": "ot135",
      };
      const field = fieldMap[type];
      this.manualTotals[code][field] = this.sanitizeNumber(value);
    },

    hasComputedLate(code) {
      return (
        this.items[code]?.computedLate !== undefined &&
        this.items[code]?.computedLate !== null
      );
    },

    getLateValue(code) {
      this.initManualTotals(code);
      const manualValue = this.manualTotals[code]?.late;

      if (manualValue !== null && manualValue !== undefined) {
        return manualValue;
      }

      if (this.hasComputedLate(code)) {
        return this.items[code].computedLate;
      }

      const employee = this.items[code];
      return this.getTotal(employee?.dtr, "late");
    },

    getTotalValue(code, field) {
      if (field === "late") {
        return this.getLateValue(code);
      }

      this.initManualTotals(code);
      const manualValue = this.manualTotals[code][field];

      if (manualValue !== null && manualValue !== undefined) {
        return manualValue;
      }

      const employee = Array.isArray(this.items)
        ? this.items.find((emp) => emp.code === code)
        : this.items[code];

      return this.getTotal(employee?.dtr, field);
    },

    getOvertimeValue(code, type) {
      this.initManualTotals(code);
      const fieldMap = {
        "OT 35": "ot35",
        "OT 100": "ot100",
        "OT 130": "ot130",
        "OT 135": "ot135",
      };
      const field = fieldMap[type];
      const manualValue = this.manualTotals[code][field];
      if (manualValue !== null && manualValue !== undefined) {
        return manualValue;
      }
      const employee = this.items[code];
      return this.getOvertimeTotal(employee?.overtime, type);
    },

    getNoteDates(code, field) {
      this.initManualNotes(code);
      const employee = this.items[code];
      const dtr = employee?.dtr || [];
      const overtime = employee?.overtime || [];

      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const getDates = (items, filterFn) => {
        return items
          .filter(filterFn)
          .map((item) => formatDate(item.date || item.transDate))
          .join(",");
      };

      switch (field) {
        case "absent":
          return getDates(
            dtr,
            (record) => record.absent === true && record.onLeave === false,
          );
        case "late":
          return getDates(dtr, (record) => record.late > 0);
        case "undertime":
          return getDates(dtr, (record) => record.undertime > 0);
        case "diffAM":
          return getDates(dtr, (record) => record.diffAM > 0);
        case "diffPM":
          return getDates(dtr, (record) => record.diffPM > 0);
        case "ot35":
          return getDates(overtime, (ot) => ot.type === "OT 35");
        case "ot100":
          return getDates(overtime, (ot) => ot.type === "OT 100");
        case "ot130":
          return getDates(overtime, (ot) => ot.type === "OT 130");
        case "ot135":
          return getDates(overtime, (ot) => ot.type === "OT 135");
        default:
          return "";
      }
    },

    getNoteValue(code, field) {
      this.initManualNotes(code);
      const manualValue = this.manualNotes[code][field];
      return manualValue !== "" ? manualValue : this.getNoteDates(code, field);
    },

    generateNote(code) {
      const employee = this.items[code];
      const dtr = employee?.dtr || [];

      this.initManualNotes(code);

      const notesParts = [];

      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const getDateRange = (dtr) => {
        if (!dtr || dtr.length === 0) return "";
        const dates = dtr.map(
          (record) => new Date(record.date || record.transDate),
        );
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        return `${formatDate(minDate)} to ${formatDate(maxDate)}`;
      };

      const getFinalDates = (field) => {
        const manual = this.manualNotes[code]?.[field];
        return manual !== "" ? manual : this.getNoteDates(code, field);
      };

      // OT 135
      const o135Dates = getFinalDates("ot135");
      if (o135Dates) notesParts.push(`O135:${o135Dates}`);

      // OT 130
      const o130Dates = getFinalDates("ot130");
      if (o130Dates) notesParts.push(`O130:${o130Dates}`);

      // OT 100
      const o100Dates = getFinalDates("ot100");
      if (o100Dates) notesParts.push(`O100:${o100Dates}`);

      // OT 30/35
      const o30Dates = getFinalDates("ot35");
      if (o30Dates) notesParts.push(`O30:${o30Dates}`);

      // Late
      const lateDates = getFinalDates("late");
      if (lateDates) notesParts.push(`L:${lateDates}`);

      // Absent
      const absentDates = getFinalDates("absent");
      if (absentDates) notesParts.push(`A:${absentDates}`);

      // Undertime
      const undertimeDates = getFinalDates("undertime");
      if (undertimeDates) notesParts.push(`U:${undertimeDates}`);

      // Diff AM
      const manualDiffAM = this.manualNotes[code]?.diffAM;
      if (manualDiffAM !== "") {
        notesParts.push(`AM:${manualDiffAM}`);
      } else {
        const hasDiffAM = dtr.some((record) => record.diffAM > 0);
        if (hasDiffAM) {
          const dateRange = getDateRange(dtr);
          notesParts.push(`AM:${dateRange}`);
        }
      }

      // Diff PM
      const manualDiffPM = this.manualNotes[code]?.diffPM;
      if (manualDiffPM !== "") {
        notesParts.push(`PM:${manualDiffPM}`);
      } else {
        const hasDiffPM = dtr.some((record) => record.diffPM > 0);
        if (hasDiffPM) {
          const dateRange = getDateRange(dtr);
          notesParts.push(`PM:${dateRange}`);
        }
      }

      // Refund
      const refundNote = this.manualNotes[code]?.refund;
      if (refundNote) notesParts.push(`R:${refundNote}`);

      return notesParts.join(";");
    },

    async loadMoreEmployees() {
      if (this.isLoadingMore || this.hasReachedEnd) return;

      this.isLoadingMore = true;
      await new Promise((resolve) => setTimeout(resolve, 300));

      this.toDisplay = Math.min(
        this.toDisplay + this.toLoad,
        this.filteredEmployee.length,
      );

      this.isLoadingMore = false;
    },

    validateOvertimeRule(data) {
      const otRuleMessage = {
        ot35: { limit: 36, label: "Overtime 35" },
        ot100: { limit: 36, label: "Overtime 100" },
        ot130: { limit: 100, label: "Overtime 130" },
        ot135: { limit: 100, label: "Overtime 135" },
      };

      for (const [empCode, row] of Object.entries(data)) {
        for (const [key, rule] of Object.entries(otRuleMessage)) {
          const value = row[key];

          if (value > rule.limit) {
            this.$q.notify({
              color: "negative",
              position: "center",
              message: `${rule.label} for ${empCode} exceeds the limit of ${rule.limit} mins per payroll.`,
              icon: "warning",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            return false;
          }
        }
      }

      return true;
    },

    async submitChanges(code) {
      const data = {
        code: code,
        absences: this.getTotalValue(code, "absent"),
        late: this.getTotalValue(code, "late"),
        undertime: this.getTotalValue(code, "undertime"),
        diffAM: this.getTotalValue(code, "diffAM"),
        diffPM: this.getTotalValue(code, "diffPM"),
        ot35: this.getOvertimeValue(code, "OT 35"),
        ot100: this.getOvertimeValue(code, "OT 100"),
        ot130: this.getOvertimeValue(code, "OT 130"),
        ot135: this.getOvertimeValue(code, "OT 135"),
        refund: this.getTotalValue(code, "refund"),
        note: this.generateNote(code),
        payrollPeriod: this.payrollPeriod,
        timeDataFrom: this.timeDataFrom,
        timeDataTo: this.timeDataTo,
        moduleParams: "createUpdate",
      };

      if (!this.validateOvertimeRule(data)) {
        return;
      }

      this.$q
        .dialog({
          title: "Confirmation",
          message:
            "Are you sure you want to submit employee time record changes?",
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
          this.$q.loading.show({
            spinner: QSpinnerIos,
            message: "Submitting employee time data changes",
            messageColor: "primary",
            backgroundColor: "grey-1",
            spinnerColor: "primary",
            customClass: "custom-loading-style",
            spinnerSize: "7em",
          });

          try {
            helperMethods.disablePointerEvents();
            helperMethods.delay(100);
            await this.$store.dispatch("DTRModule/dtrPosting", data);
            this.$q.loading.hide();
            helperMethods.enablePointerEvents();
            this.$q.notify({
              color: "positive",
              position: "center",
              message: "Success submitting changes.",
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          } catch (error) {
            this.$q.loading.hide();

            helperMethods.enablePointerEvents();
            console.error(error);
            this.$q.notify({
              color: "negative",
              position: "center",
              message: `${
                error.response.status === 400
                  ? `${error.response.data.message}`
                  : "Error submitting changes."
              }`,
              icon: "warning",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          }
        })
        .onDismiss(() => {});
    },

    async summarizeDtr() {
      const validationData = {};
      for (const row of this.filteredEmployee) {
        validationData[row.code] = {
          ot35: row.oT35,
          ot100: row.oT100,
          ot130: row.oT130,
          ot135: row.oT135,
        };
      }

      if (!this.validateOvertimeRule(validationData)) {
        return;
      }

      this.$q
        .dialog({
          title: "Confirmation",
          message:
            "Are you sure you want to finalize all the Time Record and proceed the data to payroll?",
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
          this.$q.loading.show({
            spinner: QSpinnerIos,
            message: "Finalizing time data",
            messageColor: "primary",
            backgroundColor: "grey-1",
            spinnerColor: "primary",
            customClass: "custom-loading-style",
            spinnerSize: "7em",
          });

          try {
            helperMethods.disablePointerEvents();
            await helperMethods.delay(100);
            const allEmployeeData = [];

            for (const code of this.filteredEmployee) {
              const employee = {
                code: code.code,
                absences: this.getTotalValue(code.code, "absent"),
                late: this.getTotalValue(code.code, "late"),
                undertime: this.getTotalValue(code.code, "undertime"),
                diffAM: this.getTotalValue(code.code, "diffAM"),
                diffPM: this.getTotalValue(code.code, "diffPM"),
                ot35: this.getOvertimeValue(code.code, "OT 35"),
                ot100: this.getOvertimeValue(code.code, "OT 100"),
                ot130: this.getOvertimeValue(code.code, "OT 130"),
                ot135: this.getOvertimeValue(code.code, "OT 135"),
                refund: this.getTotalValue(code.code, "refund"),
                note: this.generateNote(code.code),
                payrollPeriod: this.payrollPeriod,
                timeDataFrom: this.timeDataFrom,
                timeDataTo: this.timeDataTo,
                moduleParams: "summarize",
              };

              allEmployeeData.push(employee);
            }

            const data = {
              employeeData: allEmployeeData,
              payrollPeriodFrom: this.payrollFrom,
              payrollPeriodTo: this.payrollTo,
            };

            await this.$store.dispatch("DTRModule/finalizeTimeData", data);
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "center",
              message: "Success finalizing time data.",
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            helperMethods.enablePointerEvents();
            this.$emit("successFinalize");
          } catch (error) {
            this.$q.loading.hide();
            helperMethods.enablePointerEvents();
            console.log(error);
            this.$q.notify({
              color: "negative",
              position: "center",
              message: `${
                error.response.status === 400
                  ? `${error.response.data.message}`
                  : "Error finalizing time data."
              }`,
              icon: "warning",
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
        if (this.toLoad < this.filteredEmployee.length) {
          this.toLoad += this.toDisplay;
          this.displayedItems = this.filteredEmployee.slice(0, this.toLoad);
        }
      }
    },

    loadMore() {
      const currentLength = this.displayedItems.length;
      const newItems = this.filteredEmployee.slice(
        currentLength,
        currentLength + this.toLoad,
      );
      this.displayedItems.push(...newItems);
    },

    getLabelText(value, type) {
      const labels = {
        IN: type === "label" ? "Time In" : "iN",
        OUT: type === "label" ? "Time Out" : "oUT",
        "OT IN": type === "label" ? "Overtime In" : "oT - IN",
        "OT OUT": type === "label" ? "Overtime Out" : "oT - OUT",
      };
      return labels[value] || value;
    },

    onCardClick(selectedItem, column) {
      this.selectedEmployeeTime = true;

      const period = selectedItem?.transDateFormat?.replace(/-/g, "") || "";

      this.selectedEmployeeTimeData = {
        employeeCode: selectedItem?.code,
        employeeName: selectedItem?.name,
        value: selectedItem?.[this.getLabelText(column, "value")],
        label: column,
        period: period,
        remarks: "",
        dtrDate: selectedItem?.transDateFormat,
      };
    },

    saveTimeChange() {
      const selected = this.selectedEmployeeTimeData;

      const employeeItem = this.items.find(
        (item) => item.code === selected.employeeCode,
      );

      const matchingDtr = employeeItem.dtr.find(
        (d) => d.transDateFormat === selected.dtrDate,
      );

      const dtrKey = this.getLabelText(selected.label, "value");

      const dtrValue = matchingDtr[dtrKey];

      if (selected.value === dtrValue) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Please specify some changes.",
          icon: "warning",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure you want to change Employee: (${selected.employeeName} - ${selected.employeeCode}) time data date ${selected.dtrDate}?`,
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
          this.$q.loading.show({
            spinner: QSpinnerIos,
            message: "Saving time data changes",
            messageColor: "primary",
            backgroundColor: "grey-1",
            spinnerColor: "primary",
            customClass: "custom-loading-style",
            spinnerSize: "7em",
          });

          try {
            helperMethods.disablePointerEvents();
            await helperMethods.delay(100);
            await this.$store.dispatch(
              "DTRModule/saveTimeData",
              this.selectedEmployeeTimeData,
            );
            this.selectedEmployeeTime = false;
            this.$q.notify({
              color: "positive",
              position: "center",
              message: "Success time data changes.",
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            this.$q.loading.hide();
            helperMethods.enablePointerEvents();
          } catch (error) {
            this.$q.loading.hide();
            helperMethods.enablePointerEvents();
            console.log(error);
            this.$q.notify({
              color: "negative",
              position: "center",
              message: `${
                error.response.status === 400
                  ? `${error.response.data.message}`
                  : "Error finalizing time data."
              }`,
              icon: "warning",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          }
        })
        .onDismiss(() => {});
    },

    remarksMethod(timeAdjustmentRemarks) {
      this.remarksTimeAdj = true;
      this.timeAdjustmentRemarks = timeAdjustmentRemarks;
    },
  },

  watch: {
    items: {
      handler() {
        this.toLoad = this.toDisplay;
        this.displayedItems = this.filteredEmployee.slice(0, this.toLoad);
      },
      immediate: true,
    },
    filteredEmployee(newVal) {
      this.toLoad = this.toDisplay;
      this.displayedItems = newVal.slice(0, this.toLoad);
    },
  },
};
</script>
