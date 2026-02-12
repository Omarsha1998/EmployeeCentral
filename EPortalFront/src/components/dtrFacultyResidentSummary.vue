<template>
  <q-btn
    v-if="items && items.length > 0"
    label="Archive / Summary Finalize"
    push
    class="bg-yellow-10 text-bold text-white q-pa-xs q-mb-md"
    @click="summarizeDtr()"
  />
  <q-card class="drawerStyle q-mt-md">
    <q-card-section class="q-pa-none">
      <q-table
        class="custom-scroll"
        :rows="displayedItems"
        :columns="columns"
        row-key="employeeCode"
        style="max-height: 650px"
        virtual-scroll
        hide-pagination
        :rows-per-page-options="[0]"
        @virtual-scroll="onVirtualScroll"
      >
        <template v-slot:header>
          <q-tr class="sticky-thead bg-primary">
            <q-th
              v-for="col in columns"
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
              v-for="(col, index) in columns"
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

              <template v-else-if="col.name === 'Code'">
                {{ props.row.employeeCode }}
              </template>

              <template v-else-if="col.name === 'Note'">
                <q-input
                  dense
                  outlined
                  label="Note"
                  label-color="primary"
                  type="text"
                  v-model="props.row.note"
                  input-class="text-center"
                  :rows="4"
                  autogrow
                  input-style="word-wrap: break-word; white-space: pre-wrap;"
                />
              </template>

              <template v-else>
                <q-input
                  v-model.number="props.row[col.field]"
                  type="number"
                  dense
                  borderless
                  input-class="text-center"
                  @update:model-value="updateNote(props.row, col.field)"
                />
              </template>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-xl">
            <div class="text-center">
              <q-icon
                class="text-red"
                size="2em"
                name="sentiment_dissatisfied"
              ></q-icon>
              <div class="text-black text-subtitle2 q-mt-sm">
                No data available
              </div>
            </div>
          </div>
        </template>
      </q-table>
    </q-card-section>

    <q-card-section class="q-pa-xs q-mt-md text-right">
      <q-btn
        @click="submitChanges()"
        label="Submit Changes"
        push
        class="bg-positive text-bold text-white q-pa-xs"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { QSpinnerIos } from "quasar";
import helperMethods from "src/helperMethods";

export default {
  name: "SummaryTable",
  emits: ["successFinalize"],
  props: {
    items: Array,
    timeDataFrom: String,
    timeDataTo: String,
    payrollPeriod: String,
    payrollFrom: String,
    payrollTo: String,
  },

  data() {
    return {
      displayedItems: [],
      originalValues: {},
      columns: [
        {
          name: "Code",
          label: "Code",
          align: "center",
          field: "employeeCode",
          width: "80px",
        },
        {
          name: "Name",
          label: "Name",
          align: "center",
          field: "employeeName",
          width: "120px",
        },
        {
          name: "Absences Days",
          label: "Absences Days",
          align: "center",
          field: "absences",
          width: "80px",
        },
        {
          name: "Absences Hours",
          label: "Absences Hours",
          align: "center",
          field: "absencesHours",
          width: "80px",
        },
        {
          name: "Late",
          label: "Late",
          align: "center",
          field: "lates",
          width: "80px",
        },
        {
          name: "Undertime",
          label: "Undertime",
          align: "center",
          field: "undertime",
          width: "80px",
        },
        {
          name: "OT 35",
          label: "OT 35",
          align: "center",
          field: "oT35",
          width: "80px",
        },
        {
          name: "OT 100",
          label: "OT 100",
          align: "center",
          field: "oT100",
          width: "80px",
        },
        {
          name: "OT 130",
          label: "OT 130",
          align: "center",
          field: "oT130",
          width: "80px",
        },
        {
          name: "OT 135",
          label: "OT 135",
          align: "center",
          field: "oT135",
          width: "80px",
        },
        {
          name: "Diff NP",
          label: "Diff NP",
          align: "center",
          field: "diffAM",
          width: "80px",
        },
        {
          name: "Diff PM",
          label: "Diff PM",
          align: "center",
          field: "diffPM",
          width: "80px",
        },
        {
          name: "Refund",
          label: "Refund",
          align: "center",
          field: "refund",
          width: "80px",
        },
        {
          name: "Note",
          label: "Note",
          align: "center",
          field: "note",
          width: "200px",
        },
      ],
      toDisplay: 10,
      toLoad: 10,
      searchText: "",
      fieldMapping: {
        absences: "A",
        absencesHours: "AH",
        lates: "L",
        undertime: "U",
        oT35: "O30",
        oT100: "O100",
        oT130: "O130",
        oT135: "O135",
        diffAM: "AM",
        diffPM: "PM",
        refund: "R",
      },
    };
  },

  computed: {
    filteredEmployee() {
      if (!this.searchText) return this.items || [];

      const search = this.searchText.toLowerCase();

      if (Array.isArray(this.items)) {
        return this.items.filter((item) => {
          const matchesEmployee =
            item.employeeCode?.toString().includes(search) ||
            item.employeeName?.toLowerCase().includes(search);

          const matchesCode = item.code?.toString().includes(search);

          const matchesDtr = item.dtr?.some(
            (r) =>
              r.code?.toString().includes(search) ||
              r.name?.toLowerCase().includes(search),
          );

          return matchesEmployee || matchesCode || matchesDtr;
        });
      }

      const filteredKeys = Object.keys(this.items).filter((code) => {
        const dtr = this.items[code]?.dtr || [];
        return (
          code.toString().includes(search) ||
          dtr.some(
            (r) =>
              r.code?.toString().includes(search) ||
              r.name?.toLowerCase().includes(search),
          )
        );
      });

      return filteredKeys.map((code) => this.items[code]);
    },
  },

  methods: {
    onVirtualScroll({ to }) {
      if (to >= this.displayedItems.length - 2) {
        if (this.toLoad < this.filteredEmployee.length) {
          this.toLoad += this.toDisplay;
          this.displayedItems = this.filteredEmployee.slice(0, this.toLoad);
        }
      }
    },

    initializeOriginalValues() {
      if (!this.items || this.items.length === 0) return;

      for (const item of this.items) {
        if (!item || !item.employeeCode) continue;

        this.originalValues[item.employeeCode] = {
          absences: item.absences || 0,
          absencesHours: item.absencesHours || 0,
          lates: item.lates || 0,
          undertime: item.undertime || 0,
          oT35: item.oT35 || 0,
          oT100: item.oT100 || 0,
          oT130: item.oT130 || 0,
          oT135: item.oT135 || 0,
          diffAM: item.diffAM || 0,
          diffPM: item.diffPM || 0,
          refund: item.refund || 0,
          note: item.note || "",
        };
      }
    },

    updateNote(row, field) {
      const employeeCode = row.employeeCode;
      const original = this.originalValues[employeeCode];

      if (!original) {
        return;
      }

      const originalNote = original.note || "";
      const existingParts = originalNote
        ? originalNote.split(",").map((p) => p.trim())
        : [];

      const changedFields = [];
      Object.keys(this.fieldMapping).forEach((key) => {
        const currentValue = row[key];
        const originalValue = original[key];

        if (currentValue !== originalValue) {
          const prefix = this.fieldMapping[key];
          changedFields.push(`${prefix}:`);
        }
      });

      const allParts = [...existingParts, ...changedFields];
      const uniqueParts = [...new Set(allParts)];

      this.$set
        ? this.$set(row, "note", uniqueParts.join(","))
        : (row.note = uniqueParts.join(","));
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

    submitChanges() {
      const validationData = {};

      for (const row of this.items) {
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

      const data = {};
      for (const row of this.items) {
        data.code = row.employeeCode;
        data.absences = row.absences;
        data.absencesHours = row.absencesHours;
        data.late = row.lates;
        data.undertime = row.undertime;
        data.diffAM = row.diffAM;
        data.diffPM = row.diffPM;
        data.ot35 = row.oT35;
        data.ot100 = row.oT100;
        data.ot130 = row.oT130;
        data.ot135 = row.oT135;
        data.refund = row.refund;
        data.note = row.note;
        data.payrollPeriod = this.payrollPeriod;
        data.timeDataFrom = this.timeDataFrom;
        data.timeDataTo = this.timeDataTo;
        data.moduleParams = "createUpdate";
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
            this.$emit("successFinalize");
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

            for (const row of this.filteredEmployee) {
              const employee = {
                code: row.employeeCode,
                absences: row.absences,
                absencesHours: row.absencesHours,
                late: row.lates,
                undertime: row.undertime,
                diffAM: row.diffAM,
                diffPM: row.diffPM,
                ot35: row.oT35,
                ot100: row.oT100,
                ot130: row.oT130,
                ot135: row.oT135,
                refund: row.refund,
                note: row.note ?? "",
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
  },

  watch: {
    items: {
      handler(newItems, oldItems) {
        if (newItems && newItems.length > 0) {
          if (!oldItems || newItems.length !== oldItems.length) {
            this.initializeOriginalValues();
          }
          this.$nextTick(() => {
            this.toLoad = this.toDisplay;
            this.displayedItems = this.filteredEmployee.slice(0, this.toLoad);
          });
        }
      },
      immediate: true,
      deep: false,
    },
    filteredEmployee(newVal) {
      this.$nextTick(() => {
        this.toLoad = this.toDisplay;
        this.displayedItems = newVal.slice(0, this.toLoad);
      });
    },
  },
};
</script>
