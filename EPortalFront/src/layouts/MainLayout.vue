<template>
  <q-layout view="lHh Lpr lFf" v-if="hasAllValues === true">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="ontoggleLeftDrawer()"
        />
        <q-toolbar-title
          @click="redirectToAnnouncements()"
          style="cursor: pointer"
        >
          {{ app_name }}
        </q-toolbar-title>

        <div>v {{ app_version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <div class="example-row-equal-width">
          <div class="row">
            <!-- <div class="col bg-grey-2">
              <q-avatar size="90px" class="center">
                <img src="../assets/images/uerm-logo.png" alt="uerm-logo" />
              </q-avatar>
            </div> -->
            <div class="col bg-none bg-transparent">
              <!-- <q-avatar style="border-radius: 0; width: 170px; height: 120px;" class="center">
                <img
                  src="../assets/images/uerm-hospital-logo.png"
                  alt="uerm-hospital-logo"
                />
              </q-avatar> -->
              <div
                style="display: flex; justify-content: center"
                class="bg-transparent"
              >
                <img
                  src="../assets/images/uerm-hospital-logo.png"
                  alt="avatar"
                  style="width: 70%; height: 125px"
                />
              </div>
            </div>
          </div>
        </div>

        <q-card-section style="margin: 60px 0">
          <q-avatar size="160px" class="absolute-center">
            <img :src="image_rest_api + employeeID" alt="avatar" />
          </q-avatar>
        </q-card-section>

        <q-item-label header class="text-center">
          <span> {{ employeeID }}</span>
          <br />
          <span style="font-weight: bold; color: black">
            {{ employeeFullName }}
          </span>
        </q-item-label>

        <q-item to="/announcements">
          <q-item-section avatar>
            <q-icon name="message" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Announcements</q-item-label>
          </q-item-section>
        </q-item>

        <q-expansion-item
          class="custom-expansion-item"
          icon="info"
          label="Personnel Information System"
          v-if="hasPISAccess"
        >
          <q-card>
            <q-card-section>
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
          label="Leave Management System"
        >
          <q-card>
            <q-card-section>
              <EssentialLink
                v-for="link in filteredChildren"
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
          <q-card>
            <div>
              <q-card-section
                ><EssentialLink
                  v-for="link in DTRLinks"
                  :key="link.title"
                  v-bind="link"
              /></q-card-section>
            </div>
          </q-card>
        </q-expansion-item>

        <!-- <q-expansion-item
          class="custom-expansion-item"
          icon="assignment_ind"
          label="Faculty Report"
          v-if="facultyAccess"
        >
          <q-card>
            <q-card-section>
              <EssentialLink
                v-for="link in facultyLinks"
                :key="link.title"
                v-bind="link"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item> -->

        <div v-if="facultyAccess">
          <EssentialLink
            v-for="link in facultyLinks"
            :key="link.title"
            v-bind="link"
          />
        </div>

        <div v-if="employeeDeptCode === '5040'">
          <EssentialLink
            v-for="link in departmentLinks"
            :key="link.title"
            v-bind="link"
          />
        </div>

        <!-- <q-expansion-item
          class="custom-expansion-item"
          icon="assignment_ind"
          label="Department Hiearchy"
        >
          <q-card>
            <q-card-section>
              <EssentialLink
                v-for="link in departmentLinks"
                :key="link.title"
                v-bind="link"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item> -->

        <div v-if="dutyRosterAccess">
          <EssentialLink
            v-for="link in dutyRosterLinks"
            :key="link.title"
            v-bind="link"
          />
        </div>

        <!-- <q-expansion-item
          class="custom-expansion-item"
          icon="groups"
          label="Employee Management"
        >
          <q-card>
            <q-card-section>
              <EssentialLink
                v-for="link in employeeMangementLinks"
                :key="link.title"
                v-bind="link"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item> -->

        <q-item clickable @click="onLogout()">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import helperMethods from "../helperMethods.js";

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
    isHR() {
      return this.$store.getters["user_module/is_hr"];
    },
    isPISApprover() {
      return this.$store.getters["user_module/is_pis_approver"];
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
      return dtrLinks.length > 0 ? dtrLinks[0].children : [];
    },
    facultyAccess() {
      return this.$store.getters["user_module/facultyAccess"];
    },
    facultyLinks() {
      const facLinks = this.$store.getters["helpers/facLinks"];
      return facLinks.length > 0 ? facLinks[0].children : [];
    },
    departmentLinks() {
      const deptLinks = this.$store.getters["helpers/departmentHiearchy"];
      return deptLinks.length > 0 ? deptLinks[0].children : [];
    },
    dutyRosterLinks() {
      const dutyLinks = this.$store.getters["helpers/dutyRoster"];
      return dutyLinks.length > 0 ? dutyLinks[0].children : [];
    },
    dutyRosterAccess() {
      return (
        this.$store.getters["user_module/dutyRosterManage"] ||
        this.$store.getters["user_module/dutyRosterCreate"] ||
        this.$store.getters["user_module/dutyRosterView"]
      );
    },

    employeeMangementLinks() {
      const links = this.$store.getters["helpers/employeeManagement"];
      return links.length > 0 ? links[0].children : [];
    },
    // filteredChildren() {
    //   if (this.isLeaveApprover) {
    //     return this.mainLinks[0].children;
    //   } else {
    //     return this.mainLinks[0].children.filter(child => child.title !== 'Leave Authorization' && child.title !== 'Canceled Leave Authorization');
    //   }
    // },

    filteredChildren() {
      let children = this.mainLinks[0].children;

      if (this.isLeaveApprover && this.isPISApprover) {
        return this.employeeLeaveDetailsAccess
          ? children
          : children.filter(
              (child) => child.title !== "Employee Leave Details",
            );
      }

      if (this.isLeaveApprover) {
        return children.filter((child) =>
          this.employeeLeaveDetailsAccess
            ? child.title !== "Approver Details"
            : child.title !== "Employee Leave Details",
        );
      }

      if (this.isPISApprover) {
        return children.filter(
          (child) =>
            child.title !== "Leave Authorization" &&
            child.title !== "Canceled Leave Authorization",
        );
      }

      return this.employeeLeaveDetailsAccess
        ? children.filter(
            (child) =>
              ![
                "Leave Authorization",
                "Canceled Leave Authorization",
                "Approver Details",
              ].includes(child.title),
          )
        : children.filter((child) => child.title === "My Leaves");

      // if (this.isLeaveApprover && this.isPISApprover) {
      //   if (!this.employeeLeaveDetailsAccess) {
      //     return this.mainLinks[0].children.filter(
      //       (child) => child.title !== "Employee Leave Details",
      //     );
      //   }
      //   return this.mainLinks[0].children;
      // } else if (this.isLeaveApprover && !this.isPISApprover) {
      //   if (!this.employeeLeaveDetailsAccess) {
      //     return this.mainLinks[0].children.filter(
      //       (child) => child.title !== "Employee Leave Details",
      //     );
      //   }
      //   return this.mainLinks[0].children.filter(
      //     (child) => child.title !== "Approver Details",
      //   );
      // } else if (!this.isLeaveApprover && this.isPISApprover) {
      //   return this.mainLinks[0].children.filter(
      //     (child) =>
      //       child.title !== "Leave Authorization" &&
      //       child.title !== "Canceled Leave Authorization",
      //   );
      // } else {
      //   if (this.employeeLeaveDetailsAccess) {
      //     return this.mainLinks[0].children.filter(
      //       (child) =>
      //         child.title !== "Leave Authorization" &&
      //         child.title !== "Canceled Leave Authorization" &&
      //         child.title !== "Approver Details",
      //     );
      //   }
      //   return this.mainLinks[0].children.filter(
      //     (child) => child.title === "My Leaves",
      //   );
      // }
    },

    isLeaveApprover() {
      return this.$store.getters["user_module/is_leave_approver"];
    },

    employeeLeaveDetailsAccess() {
      return this.$store.getters["user_module/employeeLeaveDetailsAccess"];
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
    // User is not PIS Approver
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
      await this.$store.dispatch("user_module/logout", this.employeeID);
      helperMethods.refreshPage();
      localStorage.clear();
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

    // DTRLinks: function () {
    //   let DTRList = [
    //     {
    //       title: "Daily Time Record",
    //       icon: "mail",
    //       link: "/other-request",
    //     },
    //     {
    //       title: "Time Adjustment",
    //       icon: "upload",
    //       link: "/attachment-archive",
    //     },
    //   ];
    //   return DTRList;
    // },
    removeTab: function (title) {
      const itemToBeRemoved = { title: title };
      let index = this.essentialLinks.findIndex(
        (x) => x.title === itemToBeRemoved.title,
      );
      this.essentialLinks.splice(index, 1);
    },
  },
});
</script>
