<template>
  <q-layout>
    <q-page-container>
      <div class="containermainn">
        <div class="row" style="width: 95%">
          <div class="col-12">
            <q-card class="bg-grey-2">
              <q-card-section
                :class="['bold-text', $q.screen.name + '-text']"
                class="bg-primary text-white text-center"
              >
                Search Employee Information
              </q-card-section>
              <q-card-section>
                <div class="q-select-container">
                  <q-select
                    v-model="selectedDivision"
                    outlined
                    use-input
                    input-debounce="0"
                    label="Division"
                    behavior="menu"
                    fill-input
                    hide-selected
                    class="hoverable-item"
                    :options="division"
                    option-label="deptDescription"
                    option-value="deptCode"
                    clearable
                    @update:model-value="handleOptions('division')"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-select
                    v-model="selectedGroup"
                    outlined
                    use-input
                    input-debounce="0"
                    label="Group"
                    behavior="menu"
                    fill-input
                    hide-selected
                    class="hoverable-item"
                    clearable
                    :options="group"
                    option-label="deptDescription"
                    option-value="deptCode"
                    @update:model-value="handleOptions('group')"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-select
                    v-model="selectedDepartment"
                    outlined
                    use-input
                    input-debounce="0"
                    label="Department"
                    behavior="menu"
                    fill-input
                    hide-selected
                    class="hoverable-item"
                    clearable
                    :options="department"
                    option-label="deptDescription"
                    option-value="deptCode"
                    @update:model-value="handleOptions('department')"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-select
                    v-model="selectedSection"
                    outlined
                    use-input
                    input-debounce="0"
                    label="Section"
                    behavior="menu"
                    fill-input
                    hide-selected
                    class="hoverable-item"
                    clearable
                    :options="section"
                    option-label="deptDescription"
                    option-value="deptCode"
                    @update:model-value="handleOptions('section')"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-select
                    v-model="selectedArea"
                    outlined
                    use-input
                    input-debounce="0"
                    label="Area of Specialization"
                    behavior="menu"
                    fill-input
                    hide-selected
                    class="hoverable-item"
                    clearable
                    :options="area"
                    option-label="deptDescription"
                    option-value="deptCode"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-input
                    v-model="inputtedEmpCode"
                    class="hoverable-item"
                    input-debounce="0"
                    label="Employee Code"
                    outlined
                    clearable
                    behavior="menu"
                    fill-input
                    hide-selected
                    @filter="filterFn"
                    use-input
                  />

                  <q-input
                    v-model="inputtedFirstName"
                    class="hoverable-item"
                    input-debounce="0"
                    label="First Name"
                    outlined
                    clearable
                    behavior="menu"
                    fill-input
                    hide-selected
                    @filter="filterFn"
                    use-input
                  />

                  <q-input
                    v-model="inputtedLastName"
                    class="hoverable-item"
                    input-debounce="0"
                    label="Last Name"
                    outlined
                    clearable
                    behavior="menu"
                    fill-input
                    hide-selected
                    @filter="filterFn"
                    use-input
                  />

                  <q-input
                    v-model="inputtedMiddleName"
                    class="hoverable-item"
                    input-debounce="0"
                    label="Middle Name"
                    outlined
                    clearable
                    behavior="menu"
                    fill-input
                    hide-selected
                    @filter="filterFn"
                    use-input
                  />

                  <q-select
                    v-model="selectedClass"
                    outlined
                    use-input
                    input-debounce="0"
                    label="Class"
                    behavior="menu"
                    fill-input
                    hide-selected
                    class="hoverable-item"
                    clearable
                    :options="classOption"
                    option-label="description"
                    option-value="class"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-select
                    v-model="selectedWithLicense"
                    outlined
                    use-input
                    input-debounce="0"
                    label="With License"
                    behavior="menu"
                    fill-input
                    hide-selected
                    class="hoverable-item"
                    clearable
                    :options="licenseValue"
                    option-label="label"
                    option-value="value"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-select
                    v-model="selectedGender"
                    outlined
                    use-input
                    input-debounce="0"
                    label="Gender"
                    behavior="menu"
                    fill-input
                    hide-selected
                    class="hoverable-item"
                    clearable
                    :options="genderOptions"
                    option-label="label"
                    option-value="value"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-select
                    v-model="activeValue"
                    outlined
                    use-input
                    input-debounce="0"
                    label="Active"
                    behavior="menu"
                    fill-input
                    hide-selected
                    :options="dropValue"
                    class="hoverable-item"
                    clearable
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </q-card-section>

              <div class="text-center q-pa-md">
                <q-btn
                  class="bg-primary text-white text-bold"
                  label="Search"
                  @click="submitSearch"
                />
              </div>
            </q-card>

            <div class="row q-mt-xl">
              <q-card
                v-for="(employee, index) in displayedEmployee"
                :key="employee.cODE"
                :class="[$q.screen.gt.sm ? 'col-4' : 'col-12', 'employee-card']"
                :style="getCardStyle(index)"
              >
                <img
                  :src="imageApi + employee.cODE"
                  alt="image"
                  style="width: 100%; height: 270px"
                />

                <div>
                  <div class="q-pt-md text-bold text-subtitle2 text-center">
                    {{ employee.fULLNAME }}
                  </div>
                  <div class="q-pa-sm text-center" style="font-size: 13px">
                    <div>
                      {{ employee.dEPT_DESC }}
                    </div>
                    <div>
                      {{ employee.pOS_DESC }}
                    </div>
                    <div>
                      {{ employee.EMP_STATUS_DESC }}
                    </div>
                  </div>
                </div>
              </q-card>
            </div>

            <div class="col-12 q-pb-xl text-center">
              <q-btn
                v-if="employeeInfo.length > displayedEmployee.length"
                class="text-white"
                label="Load More"
                color="primary"
                @click="loadMore"
              />
            </div>
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import helperMethods from "src/helperMethods";
import { mapGetters } from "vuex";
import * as bodyPix from "@tensorflow-models/body-pix";

export default {
  data() {
    return {
      imageApi: process.env.IMAGE_REST_API_URL,
      selectedDivision: null,
      selectedGroup: null,
      selectedDepartment: null,
      selectedSection: null,
      selectedArea: null,
      inputtedEmpCode: null,
      inputtedFirstName: null,
      inputtedLastName: null,
      inputtedMiddleName: null,
      selectedClass: null,
      selectedWithLicense: null,
      selectedGender: null,
      activeValue: { label: "Yes", value: 1 },
      dropValue: [
        { label: "Yes", value: 1 },
        { label: "No", value: 0 },
      ],
      licenseValue: [
        { label: "Yes", value: 1 },
        { label: "No", value: 0 },
      ],
      genderOptions: [
        { label: "Male", value: "M" },
        { label: "Femaile", value: "F" },
      ],
      division: [],
      group: [],
      department: [],
      section: [],
      area: [],
      classOption: [],
      division2nd: [],
      group2nd: [],
      department2nd: [],
      section2nd: [],
      area2nd: [],
      employeeInfo: [],
      displayedCount: 20,
      loadLimit: 20,
    };
  },
  computed: {
    ...mapGetters({
      hierarchyGetter: "hierarchyModule/getHiearchy",
      divisionGetter: "hierarchyModule/getDivision",
      groupGetter: "hierarchyModule/getGroup",
      departmentGetter: "hierarchyModule/getDepartment",
      sectionGetter: "hierarchyModule/getSection",
      areaGetter: "hierarchyModule/getArea",
      classGetter: "employeeModule/getClass",
      employeeInfoGetter: "employeeModule/getEmployeeInfo",
    }),

    columns() {
      if (this.$q.screen.gt.lg) return 5;
      if (this.$q.screen.gt.md) return 4;
      if (this.$q.screen.gt.sm) return 3;
      if (this.$q.screen.gt.xs) return 2;
    },

    displayedEmployee() {
      return this.employeeInfo.slice(0, this.displayedCount);
    },
  },
  methods: {
    loadMore() {
      this.displayedCount += this.loadLimit;
    },

    handleOptions(selectedOption) {
      let division;
      let group;
      let department;
      let section;
      division = this.selectedDivision ? this.selectedDivision.deptCode : null;
      group = this.selectedGroup ? this.selectedGroup.deptCode : null;
      department = this.selectedDepartment
        ? this.selectedDepartment.deptCode
        : null;
      section = this.selectedSection ? this.selectedSection.deptCode : null;

      if (division || group || department || section) {
        this.handleSelection(division, group, department, section);
      } else {
        this.division = this.division2nd;
        this.group = this.group2nd;
        this.department = this.department2nd;
        this.section = this.section2nd;
        this.area = this.area2nd;
      }
    },

    handleSelection(division, group, department, section) {
      const hierarchy = this.hierarchyGetter;

      const data = {
        department: [],
        division: [],
        group: [],
        section: [],
        area: [],
      };

      const processInput = (node, targetArrays) => {
        const { level, code, name, children } = node;
        if (targetArrays[level]) {
          targetArrays[level].push({
            deptCode: code,
            deptDescription: name,
          });
        }

        if (children) {
          for (const childItems of Object.values(children)) {
            for (const childNode of childItems) {
              processInput(
                childNode,
                targetArrays,
                division,
                group,
                department,
                section,
              );
            }
          }
        }
      };

      const processNode = (
        node,
        targetArrays,
        division,
        group,
        deparment,
        section,
      ) => {
        const { level, code, name, children } = node;

        if (division) {
          if (children) {
            for (const childItems of Object.values(children)) {
              for (const childNode of childItems) {
                processInput(childNode, targetArrays);
              }
            }
          }
        }

        if (children) {
          for (const childItems of Object.values(children)) {
            for (const childNode of childItems) {
              if (childNode.code === group) {
                if (childNode.code === group) {
                  targetArrays.Department = [];
                  targetArrays.Section = [];
                  targetArrays.Area = [];
                  processInput(childNode, targetArrays);
                }
              }

              for (const childItems of Object.values(childNode.children)) {
                for (const childNode of childItems) {
                  if (deparment) {
                    if (childNode.code === deparment) {
                      targetArrays.Section = [];
                      processInput(childNode, targetArrays);
                      if (section) {
                        for (const childItems of Object.values(
                          childNode.children,
                        )) {
                          for (const childNode of childItems) {
                            if (childNode.code === section) {
                              targetArrays.Area = [];
                              processInput(childNode, targetArrays);
                            }
                          }
                        }
                      }
                    }
                  }

                  if (section && !deparment) {
                    if (childNode.code === section) {
                      for (const childItems of Object.values(
                        childNode.children,
                      )) {
                        for (const childNode of childItems) {
                          targetArrays.Area = [];
                          processInput(childNode, targetArrays);
                        }
                      }
                    }

                    for (const childItems of Object.values(
                      childNode.children,
                    )) {
                      for (const childNode of childItems) {
                        if (childNode.code === section) {
                          targetArrays.Area = [];
                          processInput(childNode, targetArrays);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      const targetArrays = {
        Division: [],
        Group: [],
        Department: [],
        Section: [],
        Area: [],
      };

      for (const value of Object.values(hierarchy)) {
        processNode(value, targetArrays, division, group, department, section);
      }

      this.division = targetArrays.Division;
      this.group = targetArrays.Group;
      this.department = targetArrays.Department;
      this.section = targetArrays.Section;
      this.area = targetArrays.Area;
    },

    filterFn(val, update) {
      if (val === "") {
        update(() => {});
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
      });
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

      if (totalColumns === 5) {
        if (!isLastInRow) {
          styles.marginRight = "37px";
        }
      }

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
        case 5:
          return "calc(20% - 30px)";
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

    async getHierchy() {
      try {
        await this.$store.dispatch("hierarchyModule/getHiearchy");
        this.division = this.divisionGetter;
        this.group = this.groupGetter;
        this.department = this.departmentGetter;
        this.section = this.sectionGetter;
        this.area = this.areaGetter;
        this.division2nd = this.divisionGetter;
        this.group2nd = this.groupGetter;
        this.department2nd = this.departmentGetter;
        this.section2nd = this.sectionGetter;
        this.area2nd = this.areaGetter;
      } catch (error) {
        console.error(error);
      }
    },

    async getEmployeeClass() {
      try {
        await this.$store.dispatch("employeeModule/getClass");
        this.classOption = this.classGetter;
      } catch (error) {
        console.error(error);
      }
    },

    async submitSearch() {
      if (
        !this.selectedDivision &&
        !this.selectedGroup &&
        !this.selectedDepartment &&
        !this.selectedSection &&
        !this.selectedArea &&
        !this.selectedWithLicense &&
        !this.selectedGender &&
        !this.inputtedEmpCode &&
        !this.inputtedFirstName &&
        !this.inputtedLastName &&
        !this.inputtedMiddleName &&
        !this.selectedClass &&
        !this.selectedWithLicense &&
        !this.selectedGender &&
        !this.activeValue
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Please input the required filled",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      try {
        helperMethods.disablePointerEvents();
        const data = {
          division: this.selectedDivision
            ? this.selectedDivision.deptCode
            : null,
          group: this.selectedGroup ? this.selectedGroup.deptCode : null,
          department: this.selectedDepartment
            ? this.selectedDepartment.deptCode
            : null,
          section: this.selectedSection ? this.selectedSection.deptCode : null,
          area: this.selectedArea ? this.selectedArea.deptCode : null,
          employeeCode: this.inputtedEmpCode,
          firstName: this.inputtedFirstName,
          lastName: this.inputtedLastName,
          middleName: this.inputtedMiddleName,
          selectedClass: this.selectedClass ? this.selectedClass.class : null,
          withLicense: this.selectedWithLicense
            ? this.selectedWithLicense.value
            : null,
          gender: this.selectedGender ? this.selectedGender.value : null,
          active: this.activeValue ? this.activeValue.value : null,
        };

        await this.$store.dispatch("employeeModule/getInformation", data);
        this.employeeInfo = this.employeeInfoGetter;
        helperMethods.enablePointerEvents();
      } catch (error) {
        console.error(error);
      }
    },
  },

  created() {
    this.getHierchy();
    this.getEmployeeClass();
  },
};
</script>
