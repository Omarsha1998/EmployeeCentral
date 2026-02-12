<!-- <template>
  <q-layout view="lHh Lpr lff">
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="290"
      :breakpoint="0"
      style="position: relative; background: transparent"
    >
      <q-btn
        flat
        round
        dense
        size="lg"
        icon="close"
        class="drawer-close-btn"
        style="position: absolute; right: 10px; top: 10px; z-index: 1"
        @click="ontoggleLeftDrawer"
      />

      <div
        class="q-pa-none text-center drawerStyle"
        style="
          position: absolute;
          inset: 5px 10px 5px 10px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          height: calc(100% - 10px);
        "
      >
        <div style="position: sticky; top: 0">
          <q-card-section style="margin: 75px 0">
            <div class="avatar-container">
              <q-avatar size="160px" class="absolute-center avatar-pop">
                <img :src="image_rest_api + employeeID" alt="avatar" />
              </q-avatar>
            </div>
          </q-card-section>

          <div header class="text-center q-pb-lg">
            <div
              class="text-subtitle1 text-bold q-pa-none"
              style="
                word-break: break-word;
                white-space: normal;
                line-height: 1.2;
              "
            >
              {{ employeeFullName }}
            </div>
            <div
              class="text-caption text-grey-8 q-pa-none text-bold q-mt-xs"
              style="
                word-break: break-word;
                white-space: normal;
                line-height: 1.2;
              "
            >
              {{ employeePosition }}
              <br />
              {{ employeeDeptDesc }}
            </div>
          </div>
        </div>

        <div
          class="drawerScroll q-pa-none"
          style="
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
          "
        >
          <q-list style="flex: 1">
            <q-item to="/announcements">
              <q-item-section avatar>
                <q-icon name="message" />
              </q-item-section>
              <q-item-section class="custom-expansion-item">
                <q-item-label>Announcements</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="eventAccess" to="/calendar-event">
              <q-item-section avatar>
                <q-icon name="edit_calendar" />
              </q-item-section>
              <q-item-section class="custom-expansion-item">
                <q-item-label>Calendar Event Input</q-item-label>
              </q-item-section>
            </q-item>

            <q-item to="/policy" class="outlined-item">
              <q-item-section avatar>
                <q-icon name="edit_calendar" />
              </q-item-section>
              <q-item-section class="custom-expansion-item">
                <q-item-label>Document's and Policies</q-item-label>
              </q-item-section>
            </q-item>

            <q-expansion-item
              class="custom-expansion-item"
              icon="info"
              label="Personnel Information System"
              v-if="hasPISAccess"
            >
              <q-card class="q-pa-none q-ma-none">
                <q-card-section class="q-pl-md q-pt-none q-pb-none q-pr-none">
                  <EssentialLink
                    v-for="link in essentialLinks"
                    :key="link.title"
                    v-bind="link"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              class="custom-expansion-item"
              icon="event_busy"
              label="Leave Management"
            >
              <q-card class="q-pa-none q-ma-none">
                <q-card-section class="q-pl-md q-pt-none q-pb-none q-pr-none">
                  <EssentialLink
                    v-for="link in filterLeaveChildren"
                    :key="link.title"
                    v-bind="link"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              v-if="employeeDeptCode === '5040' || employeeID === '3779'"
              class="custom-expansion-item"
              icon="manage_history"
              label="Overtime Management"
            >
              <q-card class="q-pa-none q-ma-none">
                <q-card-section class="q-pl-md q-pt-none q-pb-none q-pr-none">
                  <EssentialLink
                    v-for="link in overtimeManagement"
                    :key="link.title"
                    v-bind="link"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              class="custom-expansion-item"
              icon="schedule"
              label="DTR Management"
            >
              <q-card class="q-pa-none q-ma-none">
                <q-card-section class="q-pl-md q-pt-none q-pb-none q-pr-none">
                  <EssentialLink
                    v-for="link in DTRLinks"
                    :key="link.title"
                    v-bind="link"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <div class="custom-expansion-item" v-if="facultyAccess">
              <EssentialLink
                v-for="link in facultyLinks"
                :key="link.title"
                v-bind="link"
              />
            </div>

            <div
              class="custom-expansion-item"
              v-if="employeeDeptCode === '5040'"
            >
              <EssentialLink
                v-for="link in departmentLinks"
                :key="link.title"
                v-bind="link"
              />
            </div>

            <div class="custom-expansion-item" v-if="dutyRosterAccess">
              <EssentialLink
                v-for="link in dutyRosterLinks"
                :key="link.title"
                v-bind="link"
              />
            </div>
          </q-list>
          <div>
            <q-btn
              style="width: 90%"
              unelevated
              class="bg-negative text-white"
              icon="logout"
              name="logout"
              label="logout"
              @click="onLogout()"
            />
            <div
              style="display: flex; justify-content: center; margin-top: 10px"
            >
              <img
                src="../assets/images/uerm-hospital-logo.png"
                alt="logo"
                style="width: 60%; height: auto; max-height: 100px"
              />
            </div>
          </div>
        </div>
      </div>
    </q-drawer>

    <q-header
      class="bg-primary"
      :style="leftDrawerOpen ? 'border-bottom-left-radius: 10px' : ''"
    >
      <q-toolbar>
        <q-btn
          v-if="!leftDrawerOpen"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="ontoggleLeftDrawer"
        />

        <q-toolbar-title
          @click="redirectToAnnouncements()"
          style="cursor: pointer"
        >
          {{ app_name }}
        </q-toolbar-title>
        <q-space />

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template> -->

<template>
  <q-layout view="lHh Lpr lff">
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="290"
      :breakpoint="0"
      style="position: relative; background: transparent"
    >
      <q-btn
        flat
        round
        dense
        size="lg"
        icon="close"
        class="drawer-close-btn"
        style="position: absolute; right: 10px; top: 10px; z-index: 1"
        @click="ontoggleLeftDrawer"
      />

      <div
        class="q-pa-none text-center drawerStyle"
        style="
          position: absolute;
          inset: 5px 10px 5px 10px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          height: calc(100% - 10px);
        "
      >
        <div class="q-pa-none" style="position: sticky; top: 0">
          <div style="padding: 10px 0 0 0; text-align: center">
            <img
              src="../assets/images/uerm-hospital-logo.png"
              alt="logo"
              style="
                width: 90%;
                height: auto;
                max-height: 120px;
                object-fit: contain;
              "
            />
          </div>
          <div header class="text-center q-pb-md">
            <div
              class="text-caption text-grey-8 q-pa-none text-bold q-mt-xs"
              style="
                word-break: break-word;
                white-space: normal;
                line-height: 1.2;
              "
            >
              University of East Ramon Magsaysay Memorial Medical Center Inc.
            </div>
          </div>
        </div>

        <!-- Scrollable Menu Items -->
        <div
          class="drawerScroll q-pa-none"
          style="
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            padding-bottom: 80px;
          "
        >
          <q-list style="flex: 1">
            <q-item to="/announcements">
              <q-item-section avatar>
                <q-icon name="message" />
              </q-item-section>
              <q-item-section class="custom-expansion-item">
                <q-item-label>Announcements</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="eventAccess" to="/calendar-event">
              <q-item-section avatar>
                <q-icon name="edit_calendar" />
              </q-item-section>
              <q-item-section class="custom-expansion-item">
                <q-item-label>Calendar Event Input</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="policyRule" to="/policy">
              <q-item-section avatar>
                <q-icon name="security" />
              </q-item-section>
              <q-item-section class="custom-expansion-item">
                <q-item-label>Policies & Processes</q-item-label>
              </q-item-section>
              <!-- <q-badge class="q-mr-sm text-bold" color="yellow-10" floating
                >New</q-badge
              > -->
            </q-item>

            <q-expansion-item
              class="custom-expansion-item"
              icon="info"
              label="Personnel Information System"
              v-if="hasPISAccess"
            >
              <q-card class="q-pa-none q-ma-none">
                <q-card-section class="q-pl-md q-pt-none q-pb-none q-pr-none">
                  <EssentialLink
                    v-for="link in essentialLinks"
                    :key="link.title"
                    v-bind="link"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              class="custom-expansion-item"
              icon="event_busy"
              label="Leave Management"
            >
              <q-card class="q-pa-none q-ma-none">
                <q-card-section class="q-pl-md q-pt-none q-pb-none q-pr-none">
                  <EssentialLink
                    v-for="link in filterLeaveChildren"
                    :key="link.title"
                    v-bind="link"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              v-if="
                employeeDeptCode === '5040' ||
                employeeID === '3779' ||
                employeeID === '8958'
              "
              class="custom-expansion-item"
              icon="manage_history"
              label="Overtime Management"
            >
              <q-card class="q-pa-none q-ma-none">
                <q-card-section class="q-pl-md q-pt-none q-pb-none q-pr-none">
                  <EssentialLink
                    v-for="link in overtimeManagement"
                    :key="link.title"
                    v-bind="link"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              class="custom-expansion-item"
              icon="schedule"
              label="DTR Management"
            >
              <q-card class="q-pa-none q-ma-none">
                <q-card-section class="q-pl-md q-pt-none q-pb-none q-pr-none">
                  <EssentialLink
                    v-for="link in DTRLinks"
                    :key="link.title"
                    v-bind="link"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <div class="custom-expansion-item" v-if="facultyAccess">
              <EssentialLink
                v-for="link in facultyLinks"
                :key="link.title"
                v-bind="link"
              />
            </div>

            <div
              class="custom-expansion-item"
              v-if="employeeDeptCode === '5040'"
            >
              <EssentialLink
                v-for="link in departmentLinks"
                :key="link.title"
                v-bind="link"
              />
            </div>

            <div class="custom-expansion-item" v-if="dutyRosterAccess">
              <EssentialLink
                v-for="link in dutyRosterLinks"
                :key="link.title"
                v-bind="link"
              />
            </div>
          </q-list>
        </div>

        <!-- Floating Logout Button -->
        <div
          style="
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            z-index: 100;
          "
        >
          <q-btn
            style="width: 100%"
            unelevated
            class="bg-negative text-white"
            icon="logout"
            name="logout"
            label="logout"
            @click="onLogout()"
          />
        </div>
      </div>
    </q-drawer>

    <q-header
      class="bg-primary"
      :style="leftDrawerOpen ? 'border-bottom-left-radius: 10px' : ''"
    >
      <q-toolbar>
        <q-btn
          v-if="!leftDrawerOpen"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="ontoggleLeftDrawer"
        />

        <q-toolbar-title
          @click="redirectToAnnouncements()"
          style="cursor: pointer"
        >
          {{ app_name }}
        </q-toolbar-title>
        <q-space />

        <q-btn flat round dense>
          <q-avatar class="avatar-pop" size="40px">
            <img :src="image_rest_api + employeeID" alt="avatar" />
          </q-avatar>
          <q-menu class="no-hover">
            <q-card style="min-width: 250px">
              <q-card-section class="text-center q-pb-sm">
                <q-avatar size="80px" class="q-mb-sm">
                  <img :src="image_rest_api + employeeID" alt="avatar" />
                </q-avatar>
                <div class="text-subtitle1 text-bold">
                  {{ employeeFullName }}
                </div>
                <div class="text-caption text-grey-7">
                  {{ employeePosition }}
                </div>
                <div class="text-caption text-grey-7">
                  {{ employeeDeptDesc }}
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section class="q-pa-xs">
                <q-item clickable v-close-popup @click="onLogout">
                  <q-item-section avatar>
                    <q-icon name="logout" color="negative" />
                  </q-item-section>
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-card-section>
            </q-card>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import helperMethods from "../helperMethods.js";
import { QSpinnerIos } from "quasar";

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
  },
  computed: {
    hasAllValues() {
      return this.$store.getters["user_module/has_all_values"];
    },
    employeeID() {
      return this.$store.getters["user_module/employee_id"];
    },
    employeeFullName() {
      return this.$store.getters["user_module/employee_full_name"];
    },
    employeeDeptCode() {
      return this.$store.getters["user_module/employeeDeptCode"];
    },
    employeeDeptDesc() {
      return this.$store.getters["user_module/deptDescription"];
    },
    employeePosition() {
      return this.$store.getters["user_module/posDescription"];
    },
    isHR() {
      return this.$store.getters["user_module/is_hr"];
    },
    isPISApprover() {
      return this.$store.getters["user_module/is_pis_approver"];
    },
    policyRule() {
      return this.$store.getters["user_module/policyRule"];
    },
    isLicense() {
      return this.$store.getters["user_module/is_license"];
    },
    hasWorkExperience() {
      return this.$store.getters["user_module/has_work_experience"];
    },
    hasPISAccess() {
      return this.$store.getters["user_module/has_pis_access"];
    },
    mainLinks() {
      return this.$store.getters["helpers/mainLinks"];
    },

    DTRLinks() {
      const dtrLinks = this.$store.getters["helpers/DTRLinks"];
      const dtrFinalization =
        this.$store.getters["user_module/dtrFinalization"];

      const filteredDtrLinks = dtrLinks[0].children;

      return filteredDtrLinks.filter((child) => {
        if (
          !this.employeeDtrDetailsAccess &&
          child.title === "Employee Search DTR"
        ) {
          return false;
        }

        if (!dtrFinalization && child.title === "DTR Finalization") {
          return false;
        }

        return true;
      });
    },

    facultyAccess() {
      return this.$store.getters["user_module/facultyAccess"];
    },
    facultyLinks() {
      const facLinks = this.$store.getters["helpers/facLinks"];
      return facLinks?.[0]?.children ?? [];
    },
    departmentLinks() {
      const deptLinks = this.$store.getters["helpers/departmentHiearchy"];
      return deptLinks?.[0]?.children ?? [];
    },
    dutyRosterLinks() {
      const dutyLinks = this.$store.getters["helpers/dutyRoster"];
      return dutyLinks?.[0]?.children ?? [];
    },
    dutyRosterAccess() {
      return (
        this.$store.getters["user_module/dutyRosterManage"] ||
        this.$store.getters["user_module/dutyRosterCreate"] ||
        this.$store.getters["user_module/dutyRosterView"]
      );
    },
    approverDetailsAccess() {
      return this.$store.getters["user_module/approverDetailsAccess"];
    },
    employeeMangementLinks() {
      const links = this.$store.getters["helpers/employeeManagement"];
      return links?.[0]?.children ?? [];
    },
    eventAccess() {
      return this.$store.getters["user_module/eventAccess"];
    },

    overtimeManagement() {
      const links = this.$store.getters["helpers/overtimeManagement"];
      const unpaidOvertime = this.$store.getters["user_module/unpaidOvertime"];
      const children = links?.[0]?.children ?? [];

      if (!unpaidOvertime) {
        return children.filter(
          (link) => link.title !== "Unpaid Overtime Report",
        );
      }

      return children;
    },

    filterLeaveChildren() {
      let children = this.mainLinks[0].children;

      let allowedLinks = ["My Leaves"];

      if (this.isLeaveApprover) {
        allowedLinks.push(
          "Leave Authorization",
          "Canceled Leave Authorization",
        );
      }

      if (this.approverDetailsAccess) {
        allowedLinks.push("Approver Details");
      }

      if (this.employeeLeaveDetailsAccess) {
        allowedLinks.push("Employee Leave Details");
      }

      return children.filter((child) => allowedLinks.includes(child.title));
    },

    isLeaveApprover() {
      return this.$store.getters["user_module/is_leave_approver"];
    },

    employeeLeaveDetailsAccess() {
      return this.$store.getters["user_module/employeeLeaveDetailsAccess"];
    },

    employeeDtrDetailsAccess() {
      return this.$store.getters["user_module/employeeDtrDetailsAccess"];
    },
  },

  data: function () {
    return {
      app_name: process.env.APP_NAME,
      app_version: process.env.APP_VERSION,
      image_rest_api: process.env.IMAGE_REST_API_URL,
      essentialLinks: this.getLinkLists(),
      leftDrawerOpen: false,
    };
  },
  created: function () {
    if (this.isPISApprover === false) {
      this.removeTab("Other Request");
      this.removeTab("Attachment Archive");
      this.removeTab("Export Personal Information");
      this.removeTab("Maintenance");
      this.removeTab("Employee Dependent");
      this.removeTab("Accumulated Discounts Summary");
    }

    // User is not license
    if (this.isLicense === false) {
      this.removeTab("License");
    }

    // Check if there is no previous work experiences
    if (this.hasWorkExperience === false) {
      this.removeTab("Work Experience");
    }
  },
  methods: {
    redirectToAnnouncements: function () {
      // Redirect to the announcements page
      this.$router.push("/announcements");
    },
    redirect: function () {
      helperMethods.redirect("/");
    },
    ontoggleLeftDrawer: function () {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    onLogout: async function () {
      this.$q.loading.show({
        spinner: QSpinnerIos,
        message: "Logging out",
        messageColor: "primary",
        backgroundColor: "grey-1",
        spinnerColor: "primary",
        customClass: "custom-loading-style",
        spinnerSize: "7em",
      });

      try {
        await helperMethods.delay(100);
        await this.$store.dispatch("user_module/logout", this.employeeID);
        this.$q.loading.hide();
        helperMethods.refreshPage();
        localStorage.clear();
      } catch (error) {
        console.error("Error in logging out.", error);
      }
    },
    getLinkLists: function () {
      let linksList = [
        {
          title: "Other Request",
          icon: "mail",
          link: "/other-request",
        },
        {
          title: "My Request",
          icon: "notes",
          link: "/my-request",
        },

        {
          title: "Personal Information",
          icon: "person",
          link: "/personal-information",
        },
        {
          title: "Family Background",
          icon: "favorite",
          link: "/family-background",
        },
        {
          title: "Educational Background",
          icon: "school",
          link: "/educational-background",
        },
        {
          title: "Work Experience",
          icon: "work",
          link: "/work-experience",
        },
        {
          title: "License",
          icon: "newspaper",
          link: "/license",
        },
        {
          title: "Training/Seminar",
          icon: "event",
          link: "/training-or-seminar",
        },
        {
          title: "Attachment Archive",
          icon: "upload",
          link: "/attachment-archive",
        },
        {
          title: "Export Personal Information",
          icon: "download",
          link: "/export-personal-information",
        },
        {
          title: "Maintenance",
          icon: "settings",
          link: "/maintenance",
        },
        {
          title: "My Employee Dependent",
          icon: "family_restroom",
          link: "/my-employee-dependent",
        },
        {
          title: "Employee Dependent",
          icon: "account_tree",
          link: "/employee-dependent",
        },
        {
          title: "Accumulated Discounts Summary",
          icon: "summarize",
          link: "/accumulated-discounts-summary",
        },
      ];
      return linksList;
    },

    removeTab: function (title) {
      const itemToBeRemoved = { title: title };
      let index = this.essentialLinks.findIndex(
        (x) => x.title === itemToBeRemoved.title,
      );
      this.essentialLinks.splice(index, 1);
    },

    checkScreenSize() {
      if (this.$q.screen.width < 900) {
        this.leftDrawerOpen = false;
      }
    },
  },

  mounted() {
    this.checkScreenSize();
  },
});
</script>
