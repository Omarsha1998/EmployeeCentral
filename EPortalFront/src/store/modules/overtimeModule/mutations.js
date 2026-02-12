import state from "./state";

export default {
  SET_OVERTIME_DETAILS(state, overtimeDetails) {
    state.overtimeDetails = overtimeDetails;
  },

  SET_OVERTIME_PENDING(state, pendingOvertime) {
    state.pendingOvertime = pendingOvertime;
  },

  SET_OVERTIME_PENDING_CANCEL(state, pendingCancelOvertime) {
    state.pendingCancelOvertime = pendingCancelOvertime;
  },

  SET_USER_APPROVED_OVERTIME(state, userApprovedOvertime) {
    state.userApprovedOvertime = userApprovedOvertime;
  },

  SET_USER_REJECTED_OVERTIME(state, userRejectedOvertime) {
    state.userRejectedOvertime = userRejectedOvertime;
  },

  SET_APPROVED_OVERTIME(state, approvedOvertime) {
    state.approvedOvertime = approvedOvertime;
  },

  SET_REJECTED_OVERTIME(state, rejectedOvertime) {
    state.rejectedOvertime = rejectedOvertime;
  },

  SET_PENDING_HRD(state, pendingHrd) {
    state.pendingHrd = pendingHrd;
  },

  SET_USER_APPROVED_CANCEL(state, userApprovedCancel) {
    state.userApprovedCancel = userApprovedCancel;
  },

  SET_USER_REJECTED_CANCEL(state, userRejectedCancel) {
    state.userRejectedCancel = userRejectedCancel;
  },

  SET_REJECTED_CANCEL(state, rejectedCancel) {
    state.rejectedCancel = rejectedCancel;
  },

  SET_APPROVED_CANCEL(state, approvedCancel) {
    state.approvedCancel = approvedCancel;
  },

  SET_PENDING_ACCOMPLISHMENT(state, pendingAccomplishment) {
    state.pendingAccomplishment = pendingAccomplishment;
  },
};
