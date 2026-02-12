import helper from "../../../helperMethods.js";

export default {
  SET_DTR_DETAILS(state, dtrDetails) {
    // state.dtrDetails = dtrDetails;'

    const bad = dtrDetails.find((emp) => !Array.isArray(emp.dtr));

    state.dtrDetails = dtrDetails.map((employee) => ({
      ...employee,
      dtr: helper.formatDtrData(employee.dtr),
    }));
  },

  SET_EMPLOYEE_NODTR(state, noDtrEmployee) {
    state.noDtrEmployee = noDtrEmployee;
  },

  SET_EMPLOYEE_CLASS(state, employeeClass) {
    state.employeeClass = employeeClass;
  },

  // UPDATE_DTR_DETAILS(state, updatedDtrDetails) {
  //   if (!Array.isArray(updatedDtrDetails) || updatedDtrDetails.length === 0)
  //     return;

  //   const updatedRecord = updatedDtrDetails[0];
  //   const { code, transDate } = updatedRecord;

  //   const employee = state.dtrDetails.find((emp) => emp.code === code);

  //   const dtrRecordIndex = employee.dtr.findIndex(
  //     (record) => record.code === code && record.transDate === transDate,
  //   );

  //   employee.dtr[dtrRecordIndex] = {
  //     ...employee.dtr[dtrRecordIndex],
  //     ...updatedRecord,
  //   };
  // },

  UPDATE_DTR_DETAILS(state, updatedDtrDetails) {
    if (!Array.isArray(updatedDtrDetails) || updatedDtrDetails.length === 0)
      return;

    const updatedRecord = helper.formatDtrData(updatedDtrDetails)[0];
    const { code, transDate } = updatedRecord;

    const employee = state.dtrDetails.find((emp) => emp.code === code);

    const dtrRecordIndex = employee.dtr.findIndex(
      (record) => record.code === code && record.transDate === transDate,
    );

    employee.dtr[dtrRecordIndex] = {
      ...employee.dtr[dtrRecordIndex],
      ...updatedRecord,
    };
  },
};
