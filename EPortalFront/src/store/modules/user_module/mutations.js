export default {
  SET_NEW_VALUES(state, data) {
    state.token = data.token || null;
    state.employee_id = data.employee_id || null;
    state.employee_full_name = data.employee_full_name || null;
    state.employeeDeptCode = data.deptCode || null;
    state.isOfficer = data.isOfficer || false;
    state.position = data.position || null;
    state.has_work_experience = data.has_work_experience || false;
    state.is_license = data.is_license || false;
    state.deptDescription = data.deptDescription || null;
    state.posDescription = data.posDescription || null;

    state.access_rights = data.access_rights || {};
    state.access_rights.has_pis_access =
      data.access_rights?.has_pis_access || false;
    state.access_rights.is_pis_approver =
      data.access_rights?.is_pis_approver || false;
    state.access_rights.is_leave_approver =
      data.access_rights?.is_leave_approver || false;
    state.access_rights.facultyReportAccess =
      data.access_rights?.facultyReportAccess || false;
    state.access_rights.dutyRosterManage =
      data.access_rights?.dutyRosterManage || false;
    state.access_rights.dutyRosterCreate =
      data.access_rights?.dutyRosterCreate || false;
    state.access_rights.dutyRosterView =
      data.access_rights?.dutyRosterView || false;
    state.access_rights.employeeLeaveDetailsAccess =
      data.access_rights?.employeeLeaveDetails || false;
    state.access_rights.approverDetails =
      data.access_rights?.approverDetails || false;
    state.access_rights.eventAccess = data.access_rights?.eventAccess || false;
    state.access_rights.unpaidOvertime =
      data.access_rights?.unpaidOvertime || false;
  },

  SET_DEFAULT_VALUES(state) {
    state.token = null;
    state.employee_id = null;
    state.employee_full_name = null;
    state.employeeDeptCode = null;
    state.isOfficer = null;
    state.position = null;
    state.has_work_experience = false;
    state.is_license = false;
    state.isAdmin = false;

    // Ensure access_rights is properly reset
    state.access_rights = {
      has_pis_access: false,
      is_pis_approver: false,
      is_leave_approver: false,
      facultyReportAccess: false,
      dutyRosterManage: false,
      dutyRosterCreate: false,
      dutyRosterView: false,
      employeeLeaveDetailsAccess: false,
      eventAccess: false,
      unpaidOvertimeReport: false,
    };
  },
};
