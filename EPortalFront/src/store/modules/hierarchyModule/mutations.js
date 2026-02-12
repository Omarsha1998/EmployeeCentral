export default {
  // SET_HIEARCHY(
  //   state,
  //   {
  //     corporateOfficer1,
  //     corporateOfficer2,
  //     division1,
  //     division2,
  //     group,
  //     department,
  //     section,
  //     area,
  //     hierarchyData,
  //     rawData,
  //   },
  // ) {
  //   state.rawData = rawData;
  //   state.hiearchy = hierarchyData;
  //   state.corporateOfficer1 = corporateOfficer1;
  //   state.corporateOfficer2 = corporateOfficer2;
  //   state.division1 = division1;
  //   state.division2 = division2;
  //   state.groups = group;
  //   state.departments = department;
  //   state.sections = section;
  //   state.areas = area;
  // },

  SET_HIEARCHY(state, payload) {
    state.corporateOfficer1 = payload.corporateOfficer1;
    state.corporateOfficer2 = payload.corporateOfficer2;
    state.division1 = payload.division1;
    state.division2 = payload.division2;
    state.group = payload.group;
    state.department = payload.department;
    state.section = payload.section;
    state.area = payload.area;
    state.hierarchyData = payload.hierarchyData;
    state.rawData = payload.rawData;
  },

  SET_DEPARTMENTS(state, departments) {
    state.departments = departments;
  },
};
