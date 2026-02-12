<template>
  <q-layout>
    <q-page>
      <q-page-container>
        <div class="containermainn">
          <div class="row" style="width: 95%">
            <q-card class="full-width shadowcard">
              <q-card-section>
                <q-tabs
                  v-model="tab"
                  indicator-color="amber-8"
                  active-color="yellow-8"
                  class="bg-primary text-white shadow-2"
                >
                  <q-tab
                    class="col-6"
                    name="Manage Hierarchy Structure"
                    icon="menu"
                    label="Manage Hierarchy Structure"
                  />
                  <q-tab
                    class="col-6"
                    name="Hierarchy Structure"
                    icon="menu"
                    label="Hierarchy Structure"
                  />
                </q-tabs>
              </q-card-section>

              <q-card-section class="q-pa-none">
                <q-tab-panels
                  v-model="tab"
                  animated
                  transition-prev="slide-right"
                  transition-next="slide-left"
                >
                  <q-tab-panel name="Manage Hierarchy Structure">
                    <div class="q-pa-none">
                      <q-select
                        v-model="selectedDepartment"
                        outlined
                        input-debounce="0"
                        label="Department"
                        behavior="menu"
                        fill-input
                        class="hoverable-item"
                        @filter="filterFn"
                        :options="departmentOptions"
                        option-value="code"
                        option-label="deptDescription"
                      />

                      <q-select
                        class="q-mt-xs hoverable-item"
                        v-model="selectedLevel"
                        outlined
                        input-debounce="0"
                        label="Level"
                        behavior="menu"
                        clearable
                        @filter="filterFn"
                        :options="levelOptions"
                        option-value="value"
                        option-label="label"
                      />
                      <q-select
                        v-model="selectedParentDivision"
                        :disable="selectOption('group')"
                        class="q-mt-xs hoverable-item"
                        outlined
                        input-debounce="0"
                        clearable
                        label="Parent Division"
                        @filter="filterFn"
                        :options="departmentOptions"
                        option-value="code"
                        option-label="deptDescription"
                      />
                      <q-select
                        v-model="selectedParentGroup"
                        :disable="selectOption('department')"
                        class="q-mt-xs hoverable-item"
                        outlined
                        input-debounce="0"
                        clearable
                        label="Parent Group"
                        @filter="filterFn"
                        :options="departmentOptions"
                        option-value="code"
                        option-label="deptDescription"
                      />
                      <q-select
                        v-model="selectedParentDepartment"
                        :disable="selectOption('section')"
                        class="q-mt-xs hoverable-item"
                        outlined
                        input-debounce="0"
                        clearable
                        label="Parent Department"
                        @filter="filterFn"
                        :options="departmentOptions"
                        option-value="code"
                        option-label="deptDescription"
                      />
                      <q-select
                        v-model="selectedParentSection"
                        :disable="selectOption('area')"
                        class="q-mt-xs hoverable-item"
                        outlined
                        input-debounce="0"
                        clearable
                        label="Parent Section"
                        @filter="filterFn"
                        :options="departmentOptions"
                        option-value="code"
                        option-label="deptDescription"
                      />
                    </div>

                    <div class="q-pt-md text-center">
                      <q-btn
                        class="bg-primary text-white text-bold"
                        push
                        label="Submit"
                        @click="submitHierarchy"
                      ></q-btn>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel class="q-pa-none" name="Hierarchy Structure">
                    <div class="q-pl-md q-pr-md">
                      <q-input
                        class="bg-grey-4 full-width"
                        v-model="searchText"
                        placeholder="Search"
                        outlined
                        dense
                        standout
                        clearable
                        :class="[$q.screen.name + '-text2']"
                        input-style="color: #1565c0;"
                        @clear="clearSearchText"
                      />
                      <q-tree
                        v-model="selectedTree"
                        class="q-mt-lg tree-with-outline"
                        :nodes="computedHierarchy"
                        node-key="id"
                        no-connectors
                      />
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page-container>
    </q-page>
  </q-layout>
</template>

<script>
import { mapGetters } from "vuex";
import helperMethods from "src/helperMethods";
import { QSpinnerIos } from "quasar";

export default {
  data() {
    return {
      searchText: "",
      hiearchyData: [],
      selectedTree: null,
      selectedDepartment: null,
      departmentOptions: [],
      selectedLevel: null,
      levelOptions: [
        { label: "Division", value: 1 },
        { label: "Group", value: 2 },
        { label: "Department", value: 3 },
        { label: "Section", value: 4 },
        { label: "Area", value: 5 },
      ],
      selectedParentDivision: null,
      selectedParentGroup: null,
      selectedParentDepartment: null,
      selectedParentSection: null,
      tab: "Manage Hierarchy Structure",
    };
  },

  computed: {
    ...mapGetters({
      hiearchy: "hierarchyModule/getHiearchy",
      allDepartmentsGetter: "hierarchyModule/getAllDepartments",
    }),

    computedHierarchy() {
      const query = this.searchText.toLowerCase();

      const searchNode = (node) => {
        const matches =
          node.label && node.label.toString().toLowerCase().includes(query);
        if (node.children) {
          node.children = node.children
            .map((child) => searchNode(child))
            .filter((child) => child !== null);
        }

        return matches || (node.children && node.children.length > 0)
          ? node
          : null;
      };

      return this.hiearchyData
        .map((item) => searchNode(item))
        .filter((item) => item !== null);

      // return this.hiearchyData.filter((item) => {
      //   return (
      //     item.label && item.label.toString().toLowerCase().includes(query)
      //   );
      // });
    },
  },

  methods: {
    selectOption(option) {
      const levelMap = {
        group: [2, 3, 4, 5],
        department: [3, 4, 5],
        section: [4, 5],
        area: [5],
      };

      const levelValue = this.selectedLevel?.value;

      if (levelMap[option]) {
        return !levelMap[option].includes(levelValue);
      }

      return true;
    },

    clearSearchText() {
      this.searchText = "";
    },

    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.departmentOptions = this.allDepartmentsGetter;
          this.levelOptions = this.levelOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.departmentOptions = this.allDepartmentsGetter.filter((option) =>
          option.deptDescription.toLowerCase().includes(needle),
        );
        this.levelOptions = this.levelOptions.filter((option) =>
          option.label.toLowerCase().includes(needle),
        );
      });
    },

    async getHiearchy() {
      try {
        await this.$store.dispatch("hierarchyModule/getHiearchy");
        this.hiearchyData = this.formatHierarchy(this.hiearchy);
      } catch (error) {
        console.error("Error fetching hierarchy data:", error);
      }
    },

    formatHierarchy(hierarchy) {
      const formatNode = (node) => {
        const formattedNode = {
          label: node.name,
          id: node.code,
          ...node,
        };

        if (node.children) {
          formattedNode.children = Object.keys(node.children).flatMap((key) =>
            node.children[key].map(formatNode),
          );
        } else {
          formattedNode.children = [];
        }

        return formattedNode;
      };

      return Object.keys(hierarchy)
        .map((key) => formatNode(hierarchy[key]))
        .sort((a, b) => a.label.localeCompare(b.label));

      // return Object.keys(hierarchy).map((key) => formatNode(hierarchy[key]));
    },

    async getDepartments() {
      try {
        await this.$store.dispatch("hierarchyModule/getDepartments");
      } catch (error) {
        console.error(error);
      }
    },

    async submitHierarchy() {
      const levelValue = this.selectedLevel?.value;
      let missingParents = [];

      if (!this.selectedDepartment || !this.selectedLevel) {
        missingParents.push("department and level");
      }

      if (!this.selectedDepartment || !this.selectedLevel) {
        missingParents.push(
          "please select department and level and  the appropriate parent",
        );
      }

      if (missingParents.length > 0) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: `Please choose a ${missingParents.join(" and ")}`,
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      helperMethods.disablePointerEvents();
      this.$q.loading.show({
        spinner: QSpinnerIos,
        message: "Checking for the chosen department data",
        messageColor: "primary",
        backgroundColor: "grey-1",
        spinnerColor: "primary",
        customClass: "custom-loading-style",
        spinnerSize: "7em",
      });
      await helperMethods.delay(500);
      const data = {
        selectedDepartment: this.selectedDepartment?.code,
        selectedLevel: this.selectedLevel?.value,
        parentDivision: this.selectedParentDivision?.code,
        parentGroup: this.selectedParentGroup?.code,
        parentDepartment: this.selectedParentDepartment?.code,
        parentSection: this.selectedParentSection?.code,
      };
      const request = await this.$store.dispatch(
        "hierarchyModule/checkDeptData",
        data.selectedDepartment,
      );
      this.$q.loading.hide();
      helperMethods.enablePointerEvents();
      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure you want to set the parent tree for ${this.selectedDepartment?.code} - ${this.selectedDepartment?.deptDescription}?
          Please note that it currently has ${request.body}. If you are unsure about these changes, please check the departmental tree hierarchy for reference.
          If any changes or updates are needed, please proceed with the confirmation.`,
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
          try {
            helperMethods.disablePointerEvents();
            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Setting new hierchy / departamental tree",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });
            await helperMethods.delay(500);
            await this.$store.dispatch("hierarchyModule/setNewHierarchy", data);
            this.$q.loading.hide();
            this.$q.notify({
              color: "green-8",
              position: "center",
              message: "Success setting new hierchy / departamental tree",
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });

            (this.selectedDepartment = null),
              (this.selectedLevel = null),
              (this.selectedParentDivision = null),
              (this.selectedParentGroup = null),
              (this.selectedParentDepartment = null),
              (this.selectedParentSection = null);
          } catch (error) {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "center",
              message: "Error setting new hierchy / departamental tree",
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            console.error(error);
          }
        });
    },
  },

  created() {
    this.getHiearchy();
    this.getDepartments();
  },
};
</script>
