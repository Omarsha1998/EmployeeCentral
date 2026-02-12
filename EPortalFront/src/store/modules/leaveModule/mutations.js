export default {
  SET_LEAVE_DATA(state, data) {
    state.leaveData = data;
  },

  SET_LEAVE_DETAILS(state, leaveDetails) {
    // for (const leave of leaveDetails) {
    //   leave.transDate = new Date(leave.transDate);
    // }

    // console.log(leaveDetails);

    state.leaveDetails = leaveDetails;
  },

  SET_UPDATE_LEAVE(state, updatedLeave) {
    const leaveIndex = state.leaveDetails.findIndex(
      (leave) => leave.leaveId === updatedLeave.editedLeaveID,
    );
    if (leaveIndex !== -1) {
      state.leaveDetails = [...state.leaveDetails];
      state.leaveDetails[leaveIndex] = updatedLeave;
    }
  },

  SET_PENDING_DETAILS(state, pendingDetails) {
    // if (pendingDetails.lvl1Pending) {
    //     pendingDetails.lvl1Pending.forEach((leave) => {
    //         leave.tIME_FROM = new Date(leave.tIME_FROM);
    //         leave.tIME_TO = new Date(leave.tIME_TO);
    //     });
    // }

    // if (pendingDetails.lvl2Pending) {
    //     pendingDetails.lvl2Pending.forEach((leave) => {
    //         leave.tIME_FROM = new Date(leave.tIME_FROM);
    //         leave.tIME_TO = new Date(leave.tIME_TO);
    //     });
    // }
    // if (pendingDetails.lvl1Pending) {
    //   for (const leave of pendingDetails.lvl1Pending) {
    //     leave.tIME_FROM = new Date(leave.tIME_FROM);
    //     leave.tIME_TO = new Date(leave.tIME_TO);
    //   }
    // }

    // if (pendingDetails.lvl2Pending) {
    //   for (const leave of pendingDetails.lvl2Pending) {
    //     leave.tIME_FROM = new Date(leave.tIME_FROM);
    //     leave.tIME_TO = new Date(leave.tIME_TO);
    //   }
    // }

    // if (pendingDetails) {
    //   for (const leave of pendingDetails) {
    //     leave.tIME_FROM = new Date(leave.tIME_FROM);
    //     leave.tIME_TO = new Date(leave.tIME_TO);
    //   }
    // }

    state.pendingDetails = pendingDetails;
  },

  SET_BALANCE_DETAILS(state, balanceDetails) {
    state.balanceDetails = balanceDetails;
  },

  CLEAR_LEAVE_DETAILS(state) {
    state.leaveDetails = null;
  },

  setBase64Image(state, base64Image) {
    state.base64Image = base64Image;
  },

  SET_APPROVED_DETAILS(state, approvedDetails) {
    state.approvedDetails = approvedDetails;
  },

  SET_REJECTED_DETAILS(state, rejectedDetails) {
    state.rejectedDetails = rejectedDetails;
  },

  SET_BALANCE_USERBALANCEDETAILS(state, userBalanceDetails) {
    state.userBalanceDetails = userBalanceDetails;
  },

  SET_LEAVE_LEDGER(state, leaveLedgerDetails) {
    state.leaveLedgerDetails = leaveLedgerDetails;
  },

  INCREMENT_403_ERRORS(state) {
    state.numberOf403Errors++;
  },

  RESET_403_ERRORS(state) {
    state.numberOf403Errors = 0;
  },

  SET_USERAPPROVED_DETAILS(state, userApprovedLeave) {
    state.userApprovedLeave = userApprovedLeave;
  },

  SET_USERREJECTED_DETAILS(state, userRejectedLeave) {
    state.userRejectedLeave = userRejectedLeave;
  },

  SET_CANCEL_PENDING(state, cancelPending) {
    if (cancelPending) {
      for (const leave of cancelPending) {
        leave.tIME_FROM = new Date(leave.tIME_FROM);
        leave.tIME_TO = new Date(leave.tIME_TO);
      }
    }
    state.cancelPending = cancelPending;
  },

  SET_APPROVERS_DETAILS(state, approversDetails) {
    state.approversDetails = approversDetails;
  },

  SET_USERAPPROVED_CANCEL(state, userApprovedCancel) {
    state.userApprovedCancel = userApprovedCancel;
  },

  SET_USERREJECTED_CANCEL(state, userRejectedCancel) {
    state.userRejectedCancel = userRejectedCancel;
  },

  SET_REJECTED_CANCEL(state, rejectedCancel) {
    state.rejectedCancel = rejectedCancel;
  },

  SET_APPROVED_CANCEL(state, approvedCancel) {
    state.approvedCancel = approvedCancel;
  },

  SET_LEAVE_TYPES(state, leaveTypes) {
    state.leaveTypes = leaveTypes;
  },

  SET_EMP_DETAILS(state, empDetails) {
    if (empDetails.leaveDetails) {
      empDetails.leaveDetails.forEach((leave) => {
        leave.tIME_FROM = new Date(leave.tIME_FROM);
        leave.tIME_TO = new Date(leave.tIME_TO);
      });
      state.empDetails = empDetails;
    }
  },

  SET_APPEMP_DETAILS(state, appemp) {
    state.appemp = appemp;
  },

  SET_ALL_DEPARTMENT(state, allDept) {
    state.allDept = allDept;
  },

  SET_EMPBY_DEPTCODE(state, selEmpByDept) {
    state.selEmpByDept = selEmpByDept;
  },
};
