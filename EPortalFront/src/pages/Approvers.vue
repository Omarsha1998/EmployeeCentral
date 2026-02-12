<template>
  <q-layout>
    <q-page-container>
      <div class="containermainn">
        <div class="row" style="width: 95%">
          <div v-if="loading" class="col-12">
            <q-skeleton
              :style="{ height: '40px', width: '100%' }"
              animation="blink"
            />
            <q-skeleton
              class="q-mt-lg"
              :style="{ height: '800px', width: '100%' }"
              animation="blink"
            />
          </div>

          <div v-else class="col-12 q-pb-lg">
            <div class="row">
              <div :class="[$q.screen.gt.sm ? 'col-10' : 'col-12']">
                <q-input
                  class="bg-grey-3"
                  v-model="searchText"
                  placeholder="Search"
                  dense
                  standout="bg-primary text-white"
                  clearable
                  @clear="clearSearchText"
                />
              </div>
              <div
                class="text-right"
                :class="[$q.screen.gt.sm ? 'col-2' : 'col-12']"
              >
                <q-btn
                  class="bg-blue text-white"
                  :class="[$q.screen.gt.sm ? '' : 'full-width']"
                  :label="
                    $q.screen.gt.md
                      ? 'ADD APPROVER'
                      : $q.screen.width < 1013
                      ? 'ADD APPROVER'
                      : ''
                  "
                  icon="add"
                  @click="getAlLDepartment(null, (addApprover = true))"
                ></q-btn>
              </div>
            </div>
          </div>
          <q-card
            class="bg-grey-1"
            v-for="(doctor, index) in displayedApprovers"
            :key="doctor.code"
            :style="{ borderRadius: '10px', ...getCardStyle(index) }"
          >
            <div
              class="q-pa-none text-center"
              style="
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;
              "
            >
              <div>
                <div
                  class="text-bold text-center text-h6 q-pa-sm text-white bg-primary"
                  style="border-radius: 10px 10px 0 0"
                >
                  {{ doctor.approverName }}
                </div>
                <div class="text-center text-subtitle1 q-pr-sm q-pl-sm">
                  {{ doctor.approverPosition }}
                </div>
                <div
                  class="q-pr-sm q-pl-sm"
                  style="display: flex; justify-content: center"
                >
                  <div>{{ doctor.approverDeptDescription }}</div>
                </div>
                <div
                  class="text-left text-subtitle2 text-bold q-pt-sm q-pr-sm q-pl-sm"
                >
                  DEPARTMENT'S:
                </div>
                <div
                  class="virtual-scroll q-pr-sm q-pl-sm q-pt-sm"
                  style="height: 150px; overflow-y: auto"
                >
                  <div
                    class="row q-pb-sm"
                    v-for="dept in doctor.departments"
                    :key="dept.deptCode"
                  >
                    <q-btn
                      outline
                      dense
                      class="full-width bg-white text-primary"
                      @click="
                        employeesMethod(
                          dept.employeesToApprove,
                          dept.deptDescription,
                          dept.deptCode,
                          dept.lvl,
                          doctor.code,
                        )
                      "
                    >
                      {{ dept.deptDescription }}
                    </q-btn>
                  </div>
                </div>
              </div>
              <div
                class="text-subtitle2 text-bold q-pb-sm q-pr-sm q-pl-sm full-width"
              >
                <q-btn
                  dense
                  class="full-width bg-positive text-white"
                  label="Add"
                  icon="add"
                  @click="getAlLDepartment(doctor.code, (addApprover = false))"
                />
                <q-btn
                  dense
                  class="full-width bg-negative text-white q-mt-xs"
                  label="Remove Approver"
                  @click="removeApprover(doctor.code, doctor.departments)"
                />
              </div>
            </div>
          </q-card>

          <div class="col-12 q-pb-xl text-center">
            <q-btn
              v-if="approverDetails.length > displayedApprovers.length"
              class="text-white"
              label="Load More"
              color="primary"
              @click="loadMore"
            />
          </div>
        </div>
      </div>

      <q-dialog v-model="employeesDialog">
        <q-card
          class="bg-grey-2"
          style="max-width: 1000px; max-height: 700px"
          :class="['bold-text', $q.screen.name + '-text']"
        >
          <q-card-section
            class="bg-primary row items-center q-pa-md"
            style="position: sticky; top: 0; z-index: 1; min-width: 400px"
          >
            <div class="text-white text-bold">
              {{ selectedDeptDesc }}
            </div>

            <q-space></q-space>
            <q-btn
              class="bg-white text-primary"
              icon="close"
              input-debounce="0"
              push
              round
              dense
              v-close-popup
            ></q-btn>
          </q-card-section>
          <q-card-section
            class="text-center"
            v-if="computedEmployees.length === 0"
          >
            <h6>
              Level {{ levelOfApproval }} approval on all Employee's of
              {{ selectedDeptDesc }}
            </h6>
          </q-card-section>
          <q-card-section v-else>
            <q-virtual-scroll
              class="virtual-scroll"
              type="table"
              style="max-height: 500px; min-width: 700px"
              :virtual-scroll-item-size="48"
              :virtual-scroll-sticky-size-start="48"
              :virtual-scroll-sticky-size-end="32"
              :items="computedEmployees"
            >
              <template v-slot:before>
                <thead class="sticky-thead">
                  <tr>
                    <th v-for="col in selectedDeptEmployeeCol" :key="col.name">
                      {{ col.label }}
                    </th>
                  </tr>
                </thead>
              </template>

              <template v-slot="{ item: row }">
                <q-tr :key="row.employeeCode">
                  <q-td
                    v-for="col in selectedDeptEmployeeCol"
                    :key="col.name"
                    class="text-center"
                    :style="{ width: col.width }"
                  >
                    <template v-if="col.name === 'action'">
                      <q-btn
                        push
                        label="Remove"
                        class="bg-negative text-white"
                        @click="
                          deleteEmployee(
                            row.employeeCode,
                            this.selectedDeptCode,
                            row.lvl,
                            this.approverCode,
                          )
                        "
                      />
                    </template>
                    <template v-else-if="col.name === 'position'">
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
          </q-card-section>
          <div class="text-right q-pr-md q-pb-md">
            <q-btn
              push
              class="bg-negative text-white"
              label="Remove this department to approve"
              @click="
                removeDepartment(this.approverCode, this.selectedDeptCode)
              "
            ></q-btn>
          </div>
        </q-card>
      </q-dialog>

      <q-dialog v-model="addDialog">
        <q-card
          class="bg-grey-2"
          style="max-width: 1000px; max-height: 700px"
          :class="['bold-text', $q.screen.name + '-text']"
        >
          <q-card-section
            class="bg-primary row items-center q-pa-md"
            style="position: sticky; top: 0; z-index: 1; min-width: 650px"
          >
            <div class="text-white text-bold">
              ADD DEPARTMENT'S / EMPLOYEE'S TO APPROVE
            </div>

            <q-space></q-space>
            <q-btn
              class="bg-white text-primary"
              icon="close"
              input-debounce="0"
              push
              round
              dense
              v-close-popup
            ></q-btn>
          </q-card-section>

          <q-card-section>
            <addTable
              :departments="departments"
              :addEmployee="true"
              :approverCode="approverCode"
              @confirm-add="handleConfirmAdd"
            />
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="addApproverDialog">
        <q-card
          class="bg-grey-2"
          style="max-width: 1000px; max-height: 800px"
          :class="['bold-text', $q.screen.name + '-text']"
        >
          <q-card-section
            class="bg-primary row items-center q-pa-md"
            style="position: sticky; top: 0; z-index: 1; min-width: 650px"
          >
            <div class="text-white text-bold">ADD APPROVER</div>

            <q-space></q-space>
            <q-btn
              class="bg-white text-primary"
              icon="close"
              input-debounce="0"
              push
              round
              dense
              v-close-popup
            ></q-btn>
          </q-card-section>

          <q-card-section>
            <addTable
              :departments="departments"
              :addEmployee="false"
              @confirm-add="handleConfirmAdd"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>
<script>
import { QSpinnerIos } from "quasar";
import helperMethods from "src/helperMethods";
import { mapGetters } from "vuex";
import addTable from "../components/addApproverEmployee.vue";
let departmentOptions = [];

export default {
  data() {
    return {
      approverDetails: [],
      employeesDialog: false,
      selectedDeptEmployee: null,
      selectedDeptDesc: null,
      selectedDeptCode: null,
      approverCode: null,
      selectedLevel: null,
      loadLimit: 20,
      displayedCount: 20,
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
      addDialog: false,
      departments: null,
      selectedDepartmentToAdd: null,
      employees: null,
      levelOfApproval: null,
      selectAll: false,
      selectedItems: [],
      selectedLevelToAdd: null,
      searchText: "",
      addApproverDialog: false,
      addApprover: false,
      inputtedApprover: null,
      loading: true,
    };
  },

  components: {
    addTable,
  },

  computed: {
    ...mapGetters({
      appEmpDetails: "leaveModule/appemp",
      allDept: "leaveModule/allDept",
      employeeBySelectedDepartment: "leaveModule/selEmpByDept",
    }),

    computedApproverDetails() {
      if (Array.isArray(this.approverDetails)) {
        const query = this.searchText.toLowerCase();
        return this.approverDetails
          .filter((row) => {
            return (
              (row.code && row.code.toString().toLowerCase().includes(query)) ||
              (row.approverName &&
                row.approverName.toString().toLowerCase().includes(query)) ||
              (row.approverDeptDescription &&
                row.approverDeptDescription
                  .toString()
                  .toLowerCase()
                  .includes(query))
            );
          })
          .sort((a, b) => {
            return a.approverName
              .toLowerCase()
              .localeCompare(b.approverName.toLowerCase());
          });
      }
    },

    computedEmployees() {
      if (Array.isArray(this.selectedDeptEmployee)) {
        return this.selectedDeptEmployee.sort((a, b) =>
          a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase()),
        );
      }
    },

    columns() {
      if (this.$q.screen.gt.md) return 4;
      if (this.$q.screen.gt.sm) return 3;
      if (this.$q.screen.gt.xs) return 2;
    },

    displayedApprovers() {
      return this.computedApproverDetails.slice(0, this.displayedCount);
    },
  },

  methods: {
    loadMore() {
      this.displayedCount += this.loadLimit;
    },

    clearSearchText() {
      this.searchText = "";
    },

    getCardStyle(index) {
      const totalColumns = this.columns;
      const isFirstInRow = index % totalColumns === 0;
      const isLastInRow = (index + 1) % totalColumns === 0;

      const styles = {
        marginLeft: "0px",
        marginRight: "0px",
        marginBottom: "50px",
        width: this.getCardWidth(totalColumns),
      };

      if (totalColumns === 4) {
        if (!isLastInRow) {
          styles.marginRight = "40px";
        }
      }

      if (totalColumns === 3) {
        if (!isLastInRow) {
          styles.marginRight = "45px";
        }
      }

      if (totalColumns === 2) {
        if (!isLastInRow) {
          styles.marginRight = "60px";
        }
      }

      return styles;
    },

    getCardWidth(totalColumns) {
      switch (totalColumns) {
        case 4:
          return "calc(25% - 30px)";
        case 3:
          return "calc(33.33% - 30px)";
        case 2:
          return "calc(50% - 30px)";
        default:
          return "100%";
      }
    },

    async getApproverDetails() {
      try {
        await this.$store.dispatch("leaveModule/getApproverDetails");
        this.loading = false;
        this.approverDetails = this.appEmpDetails;
      } catch (error) {
        console.error("Error fetching approver details:", error);
      }
    },

    employeesMethod(
      employeesDetails,
      departmentDesc,
      departmentCode,
      lvl,
      approverCode,
    ) {
      this.employeesDialog = true;
      this.selectedDeptEmployee = employeesDetails;
      this.selectedDeptDesc = departmentDesc;
      this.selectedDeptCode = departmentCode;
      this.approverCode = approverCode;
      this.levelOfApproval = lvl;
    },

    async deleteEmployee(employeeCode, departmentCode, lvl, approverCode) {
      const data = {
        approverCode: approverCode,
        employeeCode: employeeCode,
        lvl: lvl,
        deptCode: departmentCode,
      };

      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure you want to remove Employee: ${employeeCode} to approve by ${approverCode}`,
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
          titleClass: "custom-title-class",
        })
        .onOk(async () => {
          this.$q.loading.show({
            spinner: QSpinnerIos,
            message: "Removing employee to approve, Please wait ...",
            messageColor: "primary",
            backgroundColor: "grey-1",
            spinnerColor: "primary",
            customClass: "custom-loading-style",
            spinnerSize: "7em",
          });
          try {
            await helperMethods.delay(1000);
            await this.$store.dispatch(
              "leaveModule/removeEmployeeToApprove",
              data,
            );
            await this.getApproverDetails();
            this.$q.loading.hide();
            this.employeesDialog = false;
            this.$q.notify({
              color: "positive",
              position: "center",
              message: `Success removing Employee: ${employeeCode} to approve by ${approverCode}}`,
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          } catch (error) {
            this.$q.loading.hide();
            console.error(error);
          }
        })
        .onDismiss(() => {});
    },

    async getAlLDepartment(approverCode, addApprover) {
      try {
        await this.$store.dispatch("leaveModule/getAllDepartment");
        this.departments = this.allDept;

        if (addApprover === false) {
          this.addDialog = true;
        } else {
          this.addApproverDialog = true;
        }
        this.approverCode = approverCode;
      } catch (error) {
        console.error(error);
      }
    },

    async handleConfirmAdd(data) {
      const {
        approverCode,
        selectedDepartment,
        selectedEmployees,
        selectedLevelToAdd,
        addEmployee,
      } = data;

      this.selectedDepartmentToAdd = selectedDepartment;
      this.selectedItems = selectedEmployees;
      this.selectedLevelToAdd = selectedLevelToAdd;
      this.inputtedApprover = approverCode;
      if (addEmployee === true) {
        await this.addToApprove(this.approverCode);
      } else {
        await this.addingApprover(this.inputtedApprover);
      }
    },

    async addToApprove(approverCode) {
      if (
        !this.selectedLevelToAdd ||
        this.selectedItems.length === 0 ||
        this.selectedDepartmentToAdd.length === 0
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

      const employeeCodesToUpdate = this.selectedItems
        .map((item) => item.employeeCode)
        .join(",");

      const data = {
        deptCode: this.selectedDepartmentToAdd.deptCode,
        lvl: this.selectedLevelToAdd.value,
        employeeCodes: employeeCodesToUpdate,
        approverCode: approverCode,
      };

      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure you want to add this Employee's: ${employeeCodesToUpdate} to approve by Approver: ${approverCode}'}`,
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
          titleClass: "custom-title-class",
        })
        .onOk(async () => {
          try {
            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Adding employee to approve, Please wait ...",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });
            await helperMethods.delay(500);
            await this.$store.dispatch("leaveModule/updateToApprove", data);
            await this.getApproverDetails();
            this.$q.loading.hide();
            this.addDialog = false;
            this.$q.notify({
              color: "positive",
              position: "center",
              message: `Success adding Employee's: ${employeeCodesToUpdate} / Department's: ${this.selectedDepartmentToAdd.deptCode} to approve`,
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            this.selectedDepartmentToAdd = null;
            this.selectedLevelToAdd = null;
            this.selectedItems = null;
          } catch (error) {
            this.$q.loading.hide();
            if (error.response.status === 422) {
              this.$q.notify({
                color: "negative",
                position: "center",
                message: `${error.response.data.body}`,
                icon: "report_problem",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
              return;
            }
            console.error(error);
          }
        })
        .onDismiss(() => {});
    },

    async addingApprover(approverCode) {
      const employeeCodesToUpdate = this.selectedItems
        .map((item) => item.employeeCode)
        .join(",");

      const data = {
        departmentCode: this.selectedDepartmentToAdd.deptCode,
        employeeCodes: employeeCodesToUpdate,
        lvl: this.selectedLevelToAdd.value,
        approverCode: approverCode,
      };

      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure you want to add this Employee's: ${approverCode} as an Approver of ${approverCode} Department of: ${this.selectedDepartmentToAdd.deptCode}'`,
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
          titleClass: "custom-title-class",
        })
        .onOk(async () => {
          try {
            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Adding approver, Please wait ...",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });
            await helperMethods.delay(1000);
            await this.$store.dispatch("leaveModule/addingApprover", data);
            await this.getApproverDetails();
            this.$q.loading.hide();
            this.addApproverDialog = false;
            this.$q.notify({
              color: "positive",
              position: "center",
              message: `Success adding Employee's: ${approverCode} as an Approver of / Department's: ${this.selectedDepartmentToAdd.deptCode}, Employee's: ${employeeCodesToUpdate}`,
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            this.selectedDepartmentToAdd = null;
            this.selectedLevelToAdd = null;
            this.selectedItems = null;
          } catch (error) {
            this.$q.loading.hide();
            if (error.response.status === 422) {
              this.$q.notify({
                color: "negative",
                position: "center",
                message: `${error.response.data.body}`,
                icon: "report_problem",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
              return;
            }
            console.error(error);
          }
        })
        .onDismiss(() => {});
    },

    async removeApprover(approverCode, departmentsData) {
      const extractedDepartmentsData = departmentsData.map((department) => ({
        deptCode: department.deptCode,
        lvl: department.lvl,
      }));

      const data = {
        approverCode: approverCode,
        departments: extractedDepartmentsData,
      };

      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure you want to add this remove Employee's: ${approverCode} as an Approver'`,
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
          titleClass: "custom-title-class",
        })
        .onOk(async () => {
          try {
            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Removing approver, Please wait ...",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });
            await helperMethods.delay(1000);
            await this.$store.dispatch("leaveModule/removingApprover", data);
            await this.getApproverDetails();
            this.$q.loading.hide();

            this.$q.notify({
              color: "positive",
              position: "center",
              message: `Successfully removed Employee: ${approverCode} as an Approver`,
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          } catch (error) {
            this.$q.loading.hide();

            console.error(error);
          }
        })
        .onDismiss(() => {});
    },

    async removeDepartment(approverCode, deptCode) {
      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure you want to remove Department: ${deptCode} to approve by Employee's: ${approverCode}'`,
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
          titleClass: "custom-title-class",
        })
        .onOk(async () => {
          try {
            const data = {
              approverCode: approverCode,
              deptCode: deptCode,
            };

            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Removing department to approve, Please wait ...",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });
            await helperMethods.delay(1000);
            await this.$store.dispatch("leaveModule/removeDepartment", data);
            await this.getApproverDetails();
            this.employeesDialog = false;
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "center",
              message: `Successfully removed Department: ${deptCode} to approve by ${approverCode}`,
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          } catch (error) {
            console.error(error);
          }
        })
        .onDismiss(() => {});
    },
  },

  created() {
    this.getApproverDetails();
  },
};
</script>
