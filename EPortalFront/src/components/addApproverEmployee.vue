<template>
  <q-input
    v-if="addEmployee === false"
    class="hoverable-item"
    v-model="inputtedEmpCode"
    placeholder="Employee Code / Approver Code"
    outlined
    clearable
  />
  <q-select
    v-model="selectedDepartmentToAdd"
    class="hoverable-item q-mt-xs"
    standout
    outlined
    use-input
    input-debounce="0"
    fill-input
    hide-selected
    clearable
    label="Department's"
    :options="departmentsOptions"
    option-label="description"
    option-value="deptCode"
    @filter="filterFn"
    @update:model-value="onDepartmentSelect"
    behavior="menu"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>
  </q-select>

  <q-select
    v-model="selectedLevelToAdd"
    class="hoverable-item q-mt-xs"
    standout
    outlined
    use-input
    input-debounce="0"
    fill-input
    hide-selected
    clearable
    label="Level of Approval"
    :options="levels"
    behavior="menu"
  />

  <div class="q-mt-lg">
    <q-virtual-scroll
      v-if="employees !== null"
      class="virtual-scroll"
      type="table"
      style="max-height: 400px; min-width: 400px"
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :virtual-scroll-sticky-size-end="32"
      :items="employees"
      :virtual-scroll-slice-size="25"
    >
      <template v-slot:before>
        <thead class="sticky-thead">
          <tr>
            <th style="width: 10px">
              <q-checkbox
                v-model="selectAll"
                @click="selectAllItems"
              ></q-checkbox>
            </th>
            <th v-for="col in filteredDeptEmployeeCol" :key="col.name">
              {{ col.label }}
            </th>
          </tr>
        </thead>
      </template>

      <template v-slot="{ item: row }">
        <q-tr :key="row.employeeCode">
          <q-td style="width: 10px" class="text-center">
            <q-checkbox
              v-model="selectedItems"
              :val="row"
              @click="selectedRows"
            />
          </q-td>
          <q-td
            v-for="col in filteredDeptEmployeeCol"
            :key="col.name"
            class="text-center"
            :style="{ width: col.width }"
          >
            <template v-if="col.name === 'fullName'">
              <div
                style="
                  white-space: normal;
                  overflow-wrap: break-word;
                  word-wrap: break-word;
                "
              >
                {{ row[col.field] }}
              </div>
            </template>
            <template v-else>
              {{ row[col.field] }}
            </template>
          </q-td>
        </q-tr>
      </template>
    </q-virtual-scroll>

    <div class="q-pt-md text-right" v-if="employees !== null">
      <q-btn
        label="Confirm / Add"
        class="bg-positive text-white"
        push
        @click="newData()"
      />
    </div>
    <q-inner-loading v-if="loading" showing style="size: 25px">
      <q-spinner-dots size="50px" color="primary"></q-spinner-dots>
    </q-inner-loading>
  </div>

  <div
    v-if="!loading && employees === null"
    class="text-grey q-pa-md text-center"
  >
    Choose a department first to see all the employees
  </div>
</template>

<script>
import helperMethods from "src/helperMethods";
import { mapGetters } from "vuex";
let levelOptions = [
  { label: "Level 1", value: 1 },
  { label: "Level 2", value: 2 },
];

export default {
  name: "EmployeeTable",
  emits: ["confirm-add"], // Declare the custom event here
  props: {
    departments: {
      type: Array,
      required: true,
    },
    addEmployee: { Boolean },
    approverCode: { String },
  },

  data() {
    return {
      selectAll: false,
      selectedItems: [],
      loading: false,
      departmentsOptions: this.departments,
      selectedDepartmentToAdd: null,
      employees: null,
      selectedDeptEmployeeCol: [
        {
          name: "employeeCode",
          label: "Employee Code",
          align: "center",
          field: "employeeCode",
          width: "100px",
        },
        {
          name: "fullName",
          label: "Employee Name",
          align: "center",
          field: "fullName",
          width: "350px",
        },
        {
          name: "position",
          label: "Position",
          align: "center",
          field: "position",
          width: "350px",
        },
        {
          name: "level",
          label: "Level Of Approval",
          align: "center",
          field: "lvl",
          width: "100px",
        },
        {
          name: "action",
          label: "Action",
          align: "center",
          field: "",
          width: "100px",
        },
      ],
      levels: levelOptions,
      selectedLevelToAdd: null,
      inputtedEmpCode: null,
    };
  },

  computed: {
    ...mapGetters({
      employeeBySelectedDepartment: "leaveModule/selEmpByDept",
    }),
    filteredDeptEmployeeCol() {
      return this.selectedDeptEmployeeCol.filter(
        (col) => col.name !== "level" && col.name !== "action",
      );
    },
  },

  methods: {
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.departmentsOptions = this.departments;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.departmentsOptions = this.departments.filter(
          (option) => option.description.toLowerCase().indexOf(needle) > -1,
        );
      });
    },

    selectedRows() {
      this.selectAll = false;
    },

    selectAllItems() {
      if (this.selectAll) {
        this.selectedItems = this.employees;
      } else {
        this.selectedItems = [];
      }
    },

    async onDepartmentSelect() {
      try {
        if (this.selectedDepartmentToAdd) {
          this.loading = true;

          await helperMethods.delay(500);

          const data = {
            deptCode: this.selectedDepartmentToAdd.deptCode,
            approverCode: this.approverCode,
          };

          await this.$store.dispatch(
            "leaveModule/getActiveEmployeesByDeptCode",
            data,
          );
          this.employees = this.employeeBySelectedDepartment;
          this.loading = false;
        } else {
          this.employees = null;
        }
      } catch (error) {
        this.loading = false;

        console.error(error);
      }
    },

    newData() {
      if (this.addEmployee === true) {
        if (
          !this.selectedDepartmentToAdd.length === 0 ||
          !this.selectedItems.length === 0 ||
          !this.selectedLevelToAdd
        ) {
          this.$q.notify({
            color: "negative",
            position: "center",
            message: "Please input the required fields",
            icon: "report_problem",
            iconColor: "white",
            timeout: 1000,
            progress: true,
          });
          return;
        }
      } else {
        if (
          this.inputtedEmpCode.length === 0 ||
          this.selectedDepartmentToAdd.length === 0 ||
          this.selectedItems.length === 0 ||
          !this.selectedLevelToAdd
        ) {
          this.$q.notify({
            color: "negative",
            position: "center",
            message: "Please input the required fields",
            icon: "report_problem",
            iconColor: "white",
            timeout: 1000,
            progress: true,
          });
          return;
        }
      }

      this.$emit("confirm-add", {
        approverCode: this.inputtedEmpCode,
        selectedDepartment: this.selectedDepartmentToAdd,
        selectedEmployees: this.selectedItems,
        selectedLevelToAdd: this.selectedLevelToAdd,
        addEmployee: this.addEmployee,
      });

      this.selectedDepartmentToAdd = null;
      this.employees = null;
      this.selectedItems = [];
      this.selectedLevelToAdd = null;
      this.inputtedEmpCode = null;
    },
  },
};
</script>
