import { createStore, createLogger } from "vuex";
import middleware from "./middleware.js";

import other_requests_module from "./modules/other_requests_module";
import my_requests_module from "./modules/my_requests_module";
import personal_informations_module from "./modules/personal_informations_module";
import family_backgrounds_module from "./modules/family_backgrounds_module";
import educational_backgrounds_module from "./modules/educational_backgrounds_module";
import employee_dependents_module from "./modules/employee_dependents_module";
import my_employee_dependents_module from "./modules/my_employee_dependents_module";
import accumulated_discounts_summary_module from "./modules/accumulated_discounts_summary_module";
import maintenance_module from "./modules/maintenance_module";
import work_experiences_module from "./modules/work_experiences_module";
import licenses_module from "./modules/licenses_module";
import trainings_or_seminars_module from "./modules/trainings_or_seminars_module";
import attachment_archives_module from "./modules/attachment_archives_module";
import export_personal_informations_module from "./modules/export_personal_informations_module";
import user_module from "./modules/user_module";
import helpers from "./helpers";
import leaveModule from "./modules/leaveModule";
import announcementModule from "./modules/announcementModule";
import DTRModule from "./modules/DTRModule/index.js";
import facultyModule from "./modules/facultyModule";
import hierarchyModule from "./modules/hierarchyModule/index.js";
import dutyRosterModule from "./modules/dutyRosterModule/index.js";
import employeeModule from "./modules/employeeModule/index.js";
import overtimeModule from "./modules/overtimeModule/index.js";
import configModule from "./configModule.js";

const plugins = [];

if (process.env.ENV_CONDITION === "DEV") plugins.push(createLogger());

const Store = createStore({
  modules: {
    other_requests_module,
    my_requests_module,
    personal_informations_module,
    family_backgrounds_module,
    educational_backgrounds_module,
    work_experiences_module,
    licenses_module,
    trainings_or_seminars_module,
    attachment_archives_module,
    my_employee_dependents_module,
    employee_dependents_module,
    accumulated_discounts_summary_module,
    export_personal_informations_module,
    maintenance_module,
    user_module,
    helpers,
    leaveModule,
    announcementModule,
    DTRModule,
    facultyModule,
    hierarchyModule,
    dutyRosterModule,
    employeeModule,
    overtimeModule,
    configModule,
  },
  plugins: [...plugins, middleware],
});

export default Store;
