<template>
  <q-layout>
    <q-page>
      <q-page-container>
        <div class="containermainn">
          <div class="row" style="width: 95%">
            <div v-if="loadingSkeleton" class="col-12">
              <q-skeleton class="q-mt-sm" style="height: 540px; width: 100%">
              </q-skeleton>
            </div>
            <div v-else class="full-width">
              <q-card class="shadowcard">
                <q-card-section>
                  <q-tabs
                    v-model="tab"
                    iindicator-color="text-primary"
                    active-color="text-primary"
                    active-bg-color="yellow-8 text-blue"
                    class="bg-primary text-white shadow-2 row"
                  >
                    <q-tab
                      class="col-6"
                      name="Manage Hierarchy Structure"
                      icon="manage_search"
                      label="Manage Hierarchy Structure"
                    />
                    <q-tab
                      class="col-6"
                      name="Hierarchy Structure"
                      icon="account_tree"
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
                      <div>
                        <q-select
                          v-model="selectedDepartment"
                          use-input
                          hide-selected
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
                          clearable
                        />

                        <q-select
                          fill-input
                          hide-selected
                          input-debounce="0"
                          use-input
                          class="q-mt-xs hoverable-item"
                          v-model="selectedLevel"
                          outlined
                          label="Level"
                          behavior="menu"
                          clearable
                          @filter="filterFn"
                          :options="levels"
                          option-value="value"
                          option-label="label"
                        />

                        <q-select
                          use-input
                          hide-selected
                          fill-input
                          v-model="selectedParentCorporateOne"
                          :disable="selectOption('corporate1')"
                          class="q-mt-xs hoverable-item"
                          outlined
                          input-debounce="0"
                          clearable
                          label="Parent Corporate Officer"
                          @filter="filterFn"
                          :options="departmentOptions"
                          option-value="code"
                          option-label="deptDescription"
                        />

                        <q-select
                          use-input
                          hide-selected
                          fill-input
                          v-model="selectedParentCorporateTwo"
                          :disable="selectOption('division1')"
                          class="q-mt-xs hoverable-item"
                          outlined
                          input-debounce="0"
                          clearable
                          label="Parent Corporate Officer"
                          @filter="filterFn"
                          :options="departmentOptions"
                          option-value="code"
                          option-label="deptDescription"
                        />

                        <q-select
                          use-input
                          hide-selected
                          fill-input
                          v-model="selectedParentDivisionOne"
                          :disable="selectOption('division2')"
                          class="q-mt-xs hoverable-item"
                          outlined
                          input-debounce="0"
                          clearable
                          label="Parent Division One"
                          @filter="filterFn"
                          :options="departmentOptions"
                          option-value="code"
                          option-label="deptDescription"
                        />

                        <q-select
                          use-input
                          hide-selected
                          fill-input
                          v-model="selectedParentDivisionTwo"
                          :disable="selectOption('group')"
                          class="q-mt-xs hoverable-item"
                          outlined
                          input-debounce="0"
                          clearable
                          label="Parent Division Two"
                          @filter="filterFn"
                          :options="departmentOptions"
                          option-value="code"
                          option-label="deptDescription"
                        />

                        <q-select
                          fill-input
                          hide-selected
                          use-input
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
                          fill-input
                          hide-selected
                          use-input
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
                          fill-input
                          hide-selected
                          use-input
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

                      <div class="q-pt-md text-right">
                        <q-btn
                          class="bg-positive text-white text-bold"
                          unelevated
                          label="Submit"
                          @click="submitHierarchy"
                        ></q-btn>
                      </div>
                    </q-tab-panel>

                    <!-- New Hierarchy Structure Tab -->
                    <q-tab-panel
                      name="Hierarchy Structure"
                      class="q-pa-md"
                      style="
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                      "
                    >
                      <q-card>
                        <!-- HEADER -->
                        <q-card-section
                          class="text-h6 text-bold bg-primary text-white"
                        >
                          Organizational Tree
                        </q-card-section>

                        <!-- TREE SECTION (SCROLLABLE ONLY) -->
                        <q-card-section
                          class="q-pa-xs virtual-scroll"
                          style="height: 70vh; overflow-y: auto"
                        >
                          <q-tree
                            class="q-pb-lg tree-with-outline"
                            :nodes="nodes"
                            node-key="id"
                            v-model:expanded="expanded"
                            no-connectors
                            accordion
                          >
                            <template v-slot:default-header="prop">
                              <div class="row items-center full-width q-py-xs">
                                <q-badge
                                  :color="getAlternatingColor(prop.node)"
                                  class="q-mr-sm q-pa-sm"
                                >
                                  {{ getLevelName(prop.node.level) }}
                                </q-badge>

                                <q-badge
                                  color="grey-5"
                                  class="q-mr-sm text-black text-bold q-pa-xs"
                                >
                                  {{ prop.node.code }}
                                </q-badge>

                                <div class="text-bold q-mr-auto">
                                  {{ prop.node.description }}
                                </div>

                                <q-btn
                                  flat
                                  dense
                                  round
                                  color="positive"
                                  icon="add"
                                  size="sm"
                                  @click.stop="openAddDialog(prop.node)"
                                  class="q-mr-xs"
                                >
                                  <q-tooltip>Add Child</q-tooltip>
                                </q-btn>

                                <q-btn
                                  flat
                                  dense
                                  round
                                  color="negative"
                                  icon="remove"
                                  size="sm"
                                  @click.stop="removeNode(prop.node)"
                                >
                                  <q-tooltip>Remove</q-tooltip>
                                </q-btn>
                              </div>
                            </template>
                          </q-tree>
                        </q-card-section>

                        <q-card-actions align="right" class="q-pa-md">
                          <q-btn
                            push
                            class="bg-positive text-white text-bold q-pa-sm"
                            label="Print Excel"
                            @click="printExcel"
                          />
                        </q-card-actions>
                      </q-card>
                    </q-tab-panel>
                  </q-tab-panels>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </q-page-container>
    </q-page>

    <!-- Add Department Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Add New Department</div>
          <div class="text-caption" v-if="selectedParent">
            Parent: {{ selectedParent.description }} ({{ selectedParent.code }})
          </div>
        </q-card-section>

        <q-card-section>
          <q-select
            outlined
            v-model="selectedDepartmentDialog"
            use-input
            input-debounce="0"
            label="Department"
            :options="departmentsForDialog"
            @filter="filterDialogDepartments"
            behavior="menu"
            fill-input
            hide-selected
            class="q-mb-sm"
            option-label="deptDescription"
            option-value="code"
            clearable
            @update:model-value="onDepartmentSelect"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            v-model="newDepartment.code"
            label="Department Code"
            outlined
            dense
            readonly
            class="q-mb-sm"
            bg-color="grey-2"
          />

          <q-input
            v-model="newDepartment.description"
            label="Department Description"
            outlined
            dense
            readonly
            class="q-mb-sm"
            bg-color="grey-2"
          />

          <q-select
            outlined
            v-model="selectedLevelDialog"
            use-input
            input-debounce="0"
            label="Level Name"
            :options="levelOptionsDialog"
            @filter="filterFn"
            behavior="menu"
            fill-input
            hide-selected
            class="q-mb-sm"
            option-label="label"
            option-value="value"
            @update:model-value="onLevelSelect"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            v-model="newDepartment.level"
            label="Level Number"
            outlined
            dense
            readonly
            class="q-mb-md"
            bg-color="grey-2"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Cancel"
            color="negative"
            @click="closeDialog"
            v-close-popup
          />
          <q-btn
            push
            label="Submit"
            color="primary"
            @click="submitNewHierarchy"
            :disable="!isFormValid"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { mapGetters } from "vuex";
import helperMethods from "src/helperMethods";
import { QSpinnerIos } from "quasar";

const levelOptions = [
  { label: "Corporate Officer One", value: 1 },
  { label: "Corporate Officer Two", value: 2 },
  { label: "Division One", value: 3 },
  { label: "Division Two", value: 4 },
  { label: "Group", value: 5 },
  { label: "Department", value: 6 },
  { label: "Section", value: 7 },
  { label: "Area", value: 8 },
];

export default {
  data() {
    return {
      selectedDepartment: null,
      departmentOptions: [],
      selectedLevel: null,
      levels: [],
      selectedParentCorporateOne: null,
      selectedParentCorporateTwo: null,
      selectedParentDivisionOne: null,
      selectedParentDivisionTwo: null,
      selectedParentGroup: null,
      selectedParentDepartment: null,
      selectedParentSection: null,

      nodes: [],
      expanded: [],
      showDialog: false,
      selectedParent: null,
      selectedDepartmentDialog: null,
      departmentsForDialog: [],
      nextId: 1,
      newDepartment: {
        code: "",
        description: "",
        level: "",
        levelName: "",
      },

      tab: "Manage Hierarchy Structure",
      loadingSkeleton: false,
      rawData: [],
      loader: false,

      levelMapping: {
        CorporateOfficer1: 1,
        CorporateOfficer2: 2,
        Department: 3,
        Division1: 4,
        Division2: 5,
        Group: 6,
        Section: 7,
        Area: 8,
      },

      selectedLevelDialog: null,
      levelOptionsDialog: [],
      baseLevelOptionsDialog: [],
    };
  },

  computed: {
    ...mapGetters({
      hiearchy: "hierarchyModule/getHiearchy",
      allDepartmentsGetter: "hierarchyModule/getAllDepartments",
      getRawData: "hierarchyModule/getRawData",
      hierarchyData: "hierarchyModule/getHierarchyData",
    }),

    isFormValid() {
      return (
        this.selectedDepartmentDialog &&
        this.newDepartment.code &&
        this.newDepartment.description
      );
    },
  },

  methods: {
    // First tab methods
    selectOption(option) {
      const levelMap = {
        corporate1: [2, 3, 4, 5, 6, 7, 8],
        division1: [3, 4, 5, 6, 7, 8],
        division2: [4, 5, 6, 7, 8],
        group: [5, 6, 7, 8],
        department: [6, 7, 8],
        section: [7, 8],
        area: [8],
      };

      const levelValue = this.selectedLevel?.value;

      if (levelMap[option]) {
        return !levelMap[option].includes(levelValue);
      }

      return true;
    },

    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.departmentOptions = this.allDepartmentsGetter;
          this.levels = levelOptions;

          // ✅ Reset to the MAPPED levels, not all levels
          this.levelOptionsDialog = this.baseLevelOptionsDialog || levelOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.departmentOptions = this.allDepartmentsGetter.filter(
          (option) => option.deptDescription.toLowerCase().indexOf(needle) > -1,
        );
        this.levels = levelOptions.filter(
          (option) => option.label.toLowerCase().indexOf(needle) > -1,
        );

        const baseOptions = this.baseLevelOptionsDialog || levelOptions;
        this.levelOptionsDialog = baseOptions.filter(
          (option) => option.label.toLowerCase().indexOf(needle) > -1,
        );
      });
    },

    async submitHierarchy() {
      let missingParents = [];

      if (!this.selectedDepartment || !this.selectedLevel) {
        missingParents.push("department, level and the appropriate parent");
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
        parentCorporate1: this.selectedParentCorporateOne?.code,
        parentCorporate2: this.selectedParentCorporateTwo?.code,
        parentDivision2: this.selectedParentDivisionTwo?.code,
        parentDivision1: this.selectedParentDivisionOne?.code,
        parentGroup: this.selectedParentGroup?.code,
        parentDepartment: this.selectedParentDepartment?.code,
        parentSection: this.selectedParentSection?.code,
      };

      const request = await this.$store.dispatch(
        "hierarchyModule/checkDeptData",
        { selectedDepartment: data.code },
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
              message: "Setting new hierarchy / departamental tree",
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
              message: "Success setting new hierarchy / departamental tree",
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });

            await this.getHiearchy(false);

            this.selectedParentCorporateOne = null;
            this.selectedParentCorporateTwo = null;
            this.selectedDepartment = null;
            this.selectedLevel = null;
            this.selectedParentDivisionOne = null;
            this.selectedParentDivisionTwo = null;
            this.selectedParentGroup = null;
            this.selectedParentDepartment = null;
            this.selectedParentSection = null;
          } catch (error) {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "center",
              message: "Error setting new hierarchy / departamental tree",
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            console.error(error);
          } finally {
            helperMethods.enablePointerEvents();
          }
        });
    },

    // Second tab methods (new hierarchy tree)
    getAlternatingColor(node) {
      const depth = this.getNodeDepth(node);
      return depth % 2 === 0 ? "primary" : "positive";
    },

    getNodeDepth(targetNode) {
      let depth = 0;

      const findDepth = (nodes, currentDepth) => {
        for (let node of nodes) {
          if (node.id === targetNode.id) {
            depth = currentDepth;
            return true;
          }
          if (node.children && node.children.length > 0) {
            if (findDepth(node.children, currentDepth + 1)) {
              return true;
            }
          }
        }
        return false;
      };

      findDepth(this.nodes, 0);
      return depth;
    },

    getLevelName(level) {
      if (typeof level === "number") {
        const levelNames = [
          "Corporate Officer 1",
          "Corporate Officer 2",
          "Department",
          "Division 1",
          "Division 2",
          "Group",
          "Section",
          "Area",
        ];
        return levelNames[level - 1] || `Level ${level}`;
      }
      return level.replace(/([A-Z])/g, " $1").trim();
    },

    getNextLevel(currentLevel) {
      const levelOrder = [
        "CorporateOfficer1",
        "CorporateOfficer2",
        "Department",
        "Division1",
        "Division2",
        "Group",
        "Section",
        "Area",
      ];

      const currentIndex = levelOrder.indexOf(currentLevel);
      if (currentIndex !== -1 && currentIndex < levelOrder.length - 1) {
        return levelOrder[currentIndex + 1];
      }
      return currentLevel;
    },

    getLevelNumber(levelKey) {
      return this.levelMapping[levelKey] || 0;
    },

    convertTreeToNodes(treeData) {
      if (!treeData || typeof treeData !== "object") return [];

      const nodes = [];
      let idCounter = 1;

      const processNode = (node, parent = null) => {
        const newNode = {
          id: idCounter++,
          code: node.code,
          description: node.name,
          level: node.level,
          parent: parent,
          children: [],
        };

        if (!parent) {
          this.expanded.push(newNode.id);
        }

        if (node.children && typeof node.children === "object") {
          for (const childKey in node.children) {
            const childNode = processNode(node.children[childKey], node.code);
            newNode.children.push(childNode);
          }
        }

        return newNode;
      };

      for (const key in treeData) {
        nodes.push(processNode(treeData[key]));
      }

      this.nextId = idCounter;
      return nodes;
    },

    openAddDialog(node) {
      this.selectedParent = node;
      this.selectedDepartmentDialog = null;

      const nextLevelKey = this.getNextLevel(node.level);
      const defaultLevel = levelOptions.find(
        (opt) => opt.value === this.getLevelNumber(nextLevelKey),
      );

      this.selectedLevelDialog = defaultLevel;
      this.newDepartment = {
        code: "",
        description: "",
        level: this.getLevelNumber(nextLevelKey),
        levelName: this.getLevelName(nextLevelKey),
      };

      const mapLevel = levelOptions.filter(
        (opt) => opt.value >= this.getLevelNumber(nextLevelKey),
      );

      this.departmentsForDialog = this.allDepartmentsGetter || [];
      this.baseLevelOptionsDialog = mapLevel;
      this.levelOptionsDialog = mapLevel;

      this.showDialog = true;
    },

    filterDialogDepartments(val, update) {
      if (val === "") {
        update(() => {
          this.departmentsForDialog = this.allDepartmentsGetter || [];
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.departmentsForDialog = (this.allDepartmentsGetter || []).filter(
          (dept) => {
            const code = dept.code?.toLowerCase() || "";
            const description = (
              dept.deptDescription ||
              dept.name ||
              ""
            ).toLowerCase();
            return code.includes(needle) || description.includes(needle);
          },
        );
      });
    },

    onDepartmentSelect(selectedCode) {
      const selected = this.departmentsForDialog.find(
        (dept) => dept.code === selectedCode.code,
      );

      if (selected) {
        this.newDepartment.code = selected.code;
        this.newDepartment.description = selected.deptDescription;
      }
    },

    onLevelSelect(selectedLevel) {
      if (selectedLevel) {
        this.newDepartment.level = selectedLevel.value;
        this.newDepartment.levelName = selectedLevel.label;
      }
    },

    closeDialog() {
      this.showDialog = false;
      this.selectedParent = null;
      this.selectedDepartmentDialog = null;
      this.selectedLevelDialog = null;
      this.newDepartment = {
        code: "",
        description: "",
        level: "",
        levelName: "",
      };
    },

    async submitNewHierarchy() {
      if (!this.isFormValid) return;

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
      await helperMethods.delay(100);
      const data = {
        code: this.newDepartment.code,
        description: this.newDepartment.description,
        parent: this.selectedParent.code,
        level: this.newDepartment.level,
      };

      const request = await this.$store.dispatch(
        "hierarchyModule/checkDeptData",
        { selectedDepartment: data.code },
      );
      this.$q.loading.hide();
      helperMethods.enablePointerEvents();
      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure you want to set the parent tree for ${this.selectedDepartmentDialog?.code} - ${this.selectedDepartmentDialog?.deptDescription}?
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
              message: "Setting new hierarchy",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });
            await helperMethods.delay(500);
            await this.$store.dispatch("hierarchyModule/addHierarchy", data);
            this.closeDialog();
            this.$q.loading.hide();
            this.$q.notify({
              color: "green-8",
              position: "center",
              message: "Success setting new hierarchy",
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });

            await this.getHiearchy(false);
          } catch (error) {
            this.$q.loading.hide();
            helperMethods.enablePointerEvents();

            this.$q.notify({
              color: "negative",
              position: "center",
              message: "Error setting new hierarchy",
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            console.error(error);
          }
        });
    },

    async removeNode(nodeToRemove) {
      this.$q
        .dialog({
          title: "Confirm Deletion",
          message: `Are you sure you want to delete "${nodeToRemove.description}" and all its children?`,
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
              message: "Checking for the chosen department data",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });
            await helperMethods.delay(100);
            const data = {
              id: nodeToRemove?.id,
              code: nodeToRemove?.code,
            };
            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Removing department hierarchy.",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });
            await this.$store.dispatch("hierarchyModule/removeHierarchy", data);
            this.$q.loading.hide();
            this.$q.notify({
              color: "green-8",
              position: "center",
              message: "Success removing department hierarchy.",
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });

            await this.getHiearchy(false);
          } catch (error) {
            this.$q.loading.hide();
            helperMethods.enablePointerEvents();
            this.$q.notify({
              color: "negative",
              position: "center",
              message: "Error removing department hierarchy.",
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            console.error(error);
          }
        });
    },

    // Shared methods
    async getHiearchy(showLoading = true) {
      try {
        if (showLoading) {
          this.loadingSkeleton = true;
        }

        const result = await this.$store.dispatch(
          "hierarchyModule/getHiearchy",
        );
        this.rawData = this.getRawData;

        // Convert for new tree view
        const treeData = this.hierarchyData || result?.tree;

        if (treeData) {
          this.nodes = this.convertTreeToNodes(treeData);
        }
      } catch (error) {
        console.error("Error fetching hierarchy data:", error);
      } finally {
        if (showLoading) {
          this.loadingSkeleton = false;
        }
      }
    },

    async getDepartments() {
      try {
        this.loadingSkeleton = true;
        await helperMethods.delay(500);
        await this.$store.dispatch("hierarchyModule/getDepartments");
      } catch (error) {
        console.error(error);
      } finally {
        this.loadingSkeleton = false;
      }
    },

    async printExcel() {
      const notify = this.$q.notify;

      const data = await JSON.parse(JSON.stringify(this.rawData));

      this.$q.loading.show({
        spinner: QSpinnerIos,
        message: "Loading ... fetching data",
        messageColor: "primary",
        backgroundColor: "grey-1",
        spinnerColor: "primary",
        customClass: "custom-loading-style",
        spinnerSize: "7em",
      });
      await helperMethods.delay(500);
      if (typeof Worker !== "undefined") {
        if (typeof this.w === "undefined") {
          this.w = new Worker(new URL("../store/worker.js", import.meta.url));
        }

        // this.w.postMessage({ data });

        this.w.postMessage({
          data,
          module: "hierarchy",
        });

        this.w.onmessage = (event) => {
          this.$q.loading.hide();
          if (event.data.success) {
            const blob = event.data.result;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Organizational_Tree.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            notify({
              color: "green-8",
              position: "center",
              message:
                "Success Generating Report, Please do check your download file and do save it.",
              icon: "check",
              iconColor: "white",
              timeout: 1500,
              progress: true,
            });
            this.step = 1;
            this.selectedFormat = null;
            this.selectedBuilding = null;
            this.selectedDepartment = null;
            this.selectedRoom = null;
            this.dateRange = null;
          } else {
            this.loader = false;
            notify({
              color: "warning",
              position: "center",
              message: "Failed on generating report",
              icon: "check",
              iconColor: "white",
              timeout: 1500,
              progress: true,
            });
          }
        };
      }
    },
  },

  created() {
    this.getHiearchy();
    this.getDepartments();
  },
};
</script>

<style scoped>
.q-tree {
  min-height: 300px;
}
</style>
