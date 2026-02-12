import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import helperMethods from "../helperMethods.js";
import Store from "../store/index.js";
import { Cookies } from "quasar";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
    routes: [
      {
        path: "/",
        redirect: "/announcements",
        component: () => import("layouts/NewLayout.vue"),
        children: [
          {
            path: "/announcements",
            name: "/Announcements",
            meta: {
              title: "Announcements",
              requiresAuth: true,
            },
            component: () => import("src/pages/Announcements.vue"),
          },
          {
            path: "/calendar-event",
            name: "/Calendar-Event",
            meta: {
              title: "Calendar Event Input",
              requiresAuth: true,
            },
            component: () => import("src/pages/CalendarEventInput.vue"),
          },
          {
            path: "/policy",
            name: "/policy",
            meta: {
              title: "Policies",
              requiresAuth: true,
            },
            component: () => import("src/pages/Policies.vue"),
          },
          {
            path: "/other-request",
            name: "/OtherRequest",
            meta: {
              title: "Other Request",
              requiresAuth: true,
            },
            component: () => import("src/pages/OtherRequest.vue"),
          },
          {
            path: "/my-request",
            name: "/MyRequest",
            meta: {
              title: "My Request",
              requiresAuth: true,
            },
            component: () => import("src/pages/MyRequest.vue"),
          },
          {
            path: "/personal-information",
            name: "PersonalInformation",
            meta: {
              title: "Personal Information",
              requiresAuth: true,
            },
            component: () => import("src/pages/PersonalInformation.vue"),
          },
          {
            path: "/family-background",
            name: "FamilyBackground",
            meta: {
              title: "Family Background",
              requiresAuth: true,
            },
            component: () => import("src/pages/FamilyBackground.vue"),
          },
          {
            path: "/educational-background",
            name: "EducationalBackground",
            meta: {
              title: "Educational Background",
              requiresAuth: true,
            },
            component: () => import("src/pages/EducationalBackground.vue"),
          },
          {
            path: "/my-employee-dependent",
            name: "MyEmployeeDependent",
            meta: {
              title: "My Employee Dependent",
              requiresAuth: true,
            },
            component: () => import("src/pages/MyEmployeeDependent.vue"),
          },
          {
            path: "/employee-dependent",
            name: "EmployeeDependent",
            meta: {
              title: "Employee Dependent",
              requiresAuth: true,
            },
            component: () => import("src/pages/EmployeeDependent.vue"),
          },
          {
            path: "/accumulated-discounts-summary",
            name: "AccumulatedDiscountsSummary",
            meta: {
              title: "Accumulated Discounts Summary",
              requiresAuth: true,
            },
            component: () =>
              import("src/pages/AccumulatedDiscountsSummary.vue"),
          },
          {
            path: "/training-or-seminar",
            name: "TrainingOrSeminar",
            meta: {
              title: "Training/Seminar",
              requiresAuth: true,
            },
            component: () => import("src/pages/TrainingOrSeminar.vue"),
          },
          {
            path: "/work-experience",
            name: "WorkExperience",
            meta: {
              title: "Work Experience",
              requiresAuth: true,
            },
            component: () => import("src/pages/WorkExperience.vue"),
          },
          {
            path: "/attachment-archive",
            name: "AttachmentArchive",
            meta: {
              title: "Attachment Archive",
              requiresAuth: true,
            },
            component: () => import("src/pages/AttachmentArchive.vue"),
          },
          {
            path: "/export-personal-information",
            name: "ExportPersonalInformation",
            meta: {
              title: "Export Personal Information",
              requiresAuth: true,
            },
            component: () => import("src/pages/ExportPersonalInformation.vue"),
          },
          {
            path: "/license",
            name: "License",
            meta: {
              title: "License",
              requiresAuth: true,
            },
            component: () => import("src/pages/License.vue"),
          },
          {
            path: "/maintenance",
            name: "Maintenance",
            meta: {
              title: "Maintenance",
              requiresAuth: true,
            },
            component: () => import("src/pages/Maintenance.vue"),
          },

          //Leave Module
          {
            path: "",
            meta: {
              title: "Leave Management",
              requiresAuth: true,
            },
            children: [
              {
                path: "/Leave",
                component: () => import("src/pages/LeaveDetails.vue"),
              },
              {
                path: "/LeaveOperation",
                component: () => import("src/pages/LeaveOperation.vue"),
              },
              {
                path: "/CanceledLeave",
                component: () => import("src/pages/LeaveCancelOperation.vue"),
              },
              {
                path: "/EmployeeLeaveDetails",
                component: () => import("src/pages/EmployeeLeaveDetails.vue"),
              },
              {
                path: "/ApproverDetails",
                component: () => import("src/pages/Approvers.vue"),
              },
            ],
          },
          // {
          //   path: "/Leave",
          //   meta: {
          //     title: "My Leaves",
          //     requiresAuth: true,
          //   },
          //   children: [
          //     {
          //       path: "",
          //       component: () => import("src/pages/LeaveDetails.vue"),
          //     },
          //   ],
          // },
          // {
          //   path: "/LeaveOperation",
          //   meta: {
          //     title: "Leave Authorization",
          //     requiresAuth: true,
          //   },
          //   children: [
          //     {
          //       path: "",
          //       component: () => import("src/pages/LeaveOperation.vue"),
          //     },
          //   ],
          // },
          // {
          //   path: "/CanceledLeave",
          //   meta: {
          //     title: "Canceled Leave Authorization",
          //     requiresAuth: true,
          //   },
          //   children: [
          //     {
          //       path: "",
          //       component: () => import("src/pages/CancelLeave.vue"),
          //     },
          //   ],
          // },
          // {
          //   path: "/EmployeeLeaveDetails",
          //   meta: {
          //     title: "Employee Leave Details",
          //     requiresAuth: true,
          //   },
          //   children: [
          //     {
          //       path: "",
          //       component: () => import("src/pages/EmployeeLeaveDetails.vue"),
          //     },
          //   ],
          // },
          // {
          //   path: "/EmployeeDetails",
          //   meta: {
          //     title: "Employee Details",
          //     requiresAuth: true,
          //   },
          //   children: [
          //     {
          //       path: "",
          //       component: () => import("src/pages/EmployeeDetails.vue"),
          //     },
          //   ],
          // },
          // {
          //   path: "/ApproverDetails",
          //   meta: {
          //     title: "Approver Details",
          //     requiresAuth: true,
          //   },
          //   children: [
          //     {
          //       path: "",
          //       component: () => import("src/pages/Approvers.vue"),
          //     },
          //   ],
          // },
          //Leave Module

          //Dailty Time Record Module
          {
            path: "",
            meta: {
              title: "DTR Time Record",
              requiresAuth: true,
            },
            children: [
              {
                path: "/MyDTR",
                component: () => import("src/pages/DTRPage.vue"),
              },
              {
                path: "/EmployeeDtrRecord",
                component: () => import("src/pages/EmployeeDtrRecord.vue"),
              },
              {
                path: "/DTRFinalization",
                component: () => import("src/pages/DtrFinalization.vue"),
              },
            ],
          },
          // {
          //   path: "/EmployeeDtrRecord",
          //   meta: {
          //     title: "Employee Daily Time Record",
          //     requiresAuth: true,
          //   },
          //   children: [
          //     {
          //       path: "",
          //       component: () => import("src/pages/EmployeeDtrRecord.vue"),
          //     },
          //   ],
          // },
          //Dailty Time Record Module

          //Faculty Module
          {
            path: "",
            meta: {
              title: "Faculty Report",
              requiresAuth: true,
            },
            children: [
              {
                path: "/FacultyLoad",
                component: () => import("src/pages/FacultyReport.vue"),
              },
            ],
          },
          //Faculty Module

          //Hierarchy Module
          {
            path: "",
            meta: {
              title: "Hierarchy Management",
              requiresAuth: true,
            },
            children: [
              {
                path: "HierarchyManagement",
                component: () => import("src/pages/HierarchyManagement.vue"),
              },
            ],
          },
          //Hierarchy Module

          //Duty Roster Module
          {
            path: "",
            meta: {
              title: "Duty Roster",
              requiresAuth: true,
            },
            children: [
              {
                path: "DutyRoster",
                component: () => import("src/pages/DutyRoster.vue"),
              },
            ],
          },
          //Duty Roster Module

          //Overtime Module
          {
            path: "",
            meta: {
              title: "Overtime Management",
              requiresAuth: true,
            },
            children: [
              {
                path: "/MyOvertime",
                component: () => import("src/pages/OvetimeDetails.vue"),
              },
              {
                path: "/OvertimeAuthorization",
                component: () => import("src/pages/OvertimeOperation.vue"),
              },
              {
                path: "/OvertimeCancelAuthorization",
                component: () =>
                  import("src/pages/OvertimeCancelOperation.vue"),
              },
              {
                path: "/OvertimeHrdReview",
                component: () => import("src/pages/OvertimeHrdReview.vue"),
              },
              {
                path: "/UnpaidOvertime",
                component: () => import("src/pages/UnpaidReportOvertime.vue"),
              },
            ],
          },

          //Overtime Module
        ],
      },
      {
        path: "/account/login/:userHash?",
        name: "Login",
        meta: {
          title: "Login",
        },
        component: () => import("pages/Login.vue"),
      },
      {
        path: "/update-license",
        name: "UpdateLicense",
        meta: {
          title: "Update License",
          requiresAuth: true,
        },
        component: () => import("pages/UpdateLicense.vue"),
      },
      {
        // path: '/:catchAll(.*)*',
        path: "/:pathMatch(.*)*",
        name: "PageNotFound",
        meta: {
          title: "Page Not Found",
        },
        component: () => import("src/pages/PageNotFound.vue"),
      },
    ],
  });

  Router.beforeEach(async (to, from, next) => {
    helperMethods.setPageTitle(to.meta.title + " - " + process.env.APP_NAME);
    let tofullPathLowerCase = to.fullPath.toLowerCase();

    if (to.fullPath !== from.path && from.path !== "/") {
      localStorage.setItem("showHeadApproveCard", "true");
      localStorage.setItem("showPendingAccomplish", "false");
      localStorage.setItem("showMyApproved", "false");
      localStorage.setItem("showMyRejected", "false");
    }
    if (
      helperMethods.getCookie("token") !== undefined &&
      !Store.getters["user_module/has_all_values"]
    )
      await Store.dispatch(
        "user_module/setNewValues",
        helperMethods.getCookie("token"),
      );
    // #endregion

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      // #region Validation_IsNotAuthenticated
      if (!Store.getters["user_module/has_all_values"])
        return next("/account/login");
      // #endregion

      // #region Validation_IsNotLicensed
      if (
        !Store.getters["user_module/is_license"] &&
        (tofullPathLowerCase.includes("/license") ||
          tofullPathLowerCase.includes("/update-license"))
      )
        return next("/");
      // #endregion

      if (
        tofullPathLowerCase.includes("/employeedtrrecord") ||
        tofullPathLowerCase.includes("/dtrfinalization")
      ) {
        Store.state.DTRModule.dtrDetails = [];
      }
      // #region Validation_DoNotHavePISAccess
      const allowedRoutes = [
        "/other-request",
        "/my-request",
        "/personal-information",
        "/family-background",
        "/educational-background",
        "/license",
        "/update-license",
        "/training-or-seminar",
        "/attachment-archive",
        "/export-personal-information",
        "/maintenance",
      ];
      const isRestrictedRoute = allowedRoutes.some((route) =>
        tofullPathLowerCase.includes(route),
      );
      if (!Store.getters["user_module/has_pis_access"] && isRestrictedRoute)
        return next("/");
      // #endregion

      // #region Validation_IsLicensed
      if (
        Store.getters["user_module/is_license"] &&
        Store.getters["user_module/has_pis_access"]
      ) {
        if (Store.getters["licenses_module/licenses"] === null)
          await Store.dispatch(
            "licenses_module/get",
            Store.getters["user_module/employee_id"],
          );
        const dateToday = helperMethods.getDateToday();
        for (
          let index = 0;
          index < Store.getters["licenses_module/licenses"].length;
          ++index
        ) {
          const isLatestLicenseUploaded =
            Store.getters["licenses_module/licenses"][index]
              .is_latest_license_uploaded;
          const licenseExpirationDate =
            Store.getters["licenses_module/licenses"][index].expiration_date;
          const totalDays = helperMethods.daysBetweenTwoDates(
            licenseExpirationDate,
            dateToday,
          );

          if (
            totalDays <= process.env.START_NOTIF_DAYS &&
            !tofullPathLowerCase.includes("update-license") &&
            helperMethods.getCookie("not_exposed_notification_index") ===
              undefined &&
            !isLatestLicenseUploaded
          ) {
            if (
              helperMethods.getCookie("exposed_license_indexes") === undefined
            )
              helperMethods.createCookie(
                "not_exposed_notification_index",
                index.toString(),
              );
            else {
              let array = helperMethods
                .getCookie("exposed_license_indexes")
                .split(" ");
              if (!array.includes(index.toString()))
                helperMethods.createCookie(
                  "not_exposed_notification_index",
                  index.toString(),
                );
            }
          }
        }
      }

      if (
        helperMethods.getCookie("not_exposed_notification_index") !==
          undefined &&
        !tofullPathLowerCase.includes("update-license")
      )
        return next("/update-license");
      if (
        helperMethods.getCookie("not_exposed_notification_index") ===
          undefined &&
        tofullPathLowerCase.includes("update-license")
      )
        return next(from);
      // #endregion

      // #region Validation_IsNotHREmployee
      if (
        !Store.getters["user_module/is_pis_approver"] &&
        (tofullPathLowerCase.includes("/other-request") ||
          tofullPathLowerCase.includes("/attachment-archive") ||
          tofullPathLowerCase.includes("/export-personal-information") ||
          tofullPathLowerCase.includes("/maintenance") ||
          tofullPathLowerCase.includes("/employee-dependent") ||
          tofullPathLowerCase.includes("/accumulated-discounts-summary"))
      )
        return next("/my-request");
      // #endregion

      // #region Validation_IsNotApproverEmployee
      if (
        !Store.getters["user_module/is_leave_approver"] &&
        tofullPathLowerCase.includes("leaveoperation") &&
        tofullPathLowerCase.includes("cancelleave")
      )
        return next("/");
      // #endregion'

      // #region Validation_IsUserDontHavePreviousWorkExperiences
      if (
        !Store.getters["user_module/has_work_experience"] &&
        tofullPathLowerCase.includes("/work-experience")
      )
        return next("/");
      // #endregion

      return next();
    } else {
      // #region Validation_IsAuthenticated
      if (
        Store.getters["user_module/has_all_values"] &&
        tofullPathLowerCase.includes("/account/login")
      )
        return next(from);
      // #endregion
      return next();
    }
  });

  return Router;
});
