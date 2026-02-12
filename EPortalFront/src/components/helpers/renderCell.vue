<template>
  <span>{{ renderCell(row, col) }}</span>
</template>

<script>
export default {
  props: {
    row: Object,
    col: Object,
    LeaveTypeLabels: Object,
    userCode: String,
    cancelView: Boolean,
  },

  methods: {
    renderCell(row, col) {
      const { field, name } = col;

      if (field === "leaveType" && this.LeaveTypeLabels) {
        return this.LeaveTypeLabels[row[field]] || "-";
      }

      const dateFields = [
        "transDate",
        "dateOfOvertime",
        "overtimeCreated",
        "transDateFormat",
      ];
      if (dateFields.includes(field)) {
        return this.formatDateTime(row[field]);
      }

      if (name === "Date Approved") {
        if (this.cancelView) {
          return this.formatDateTime(row.cancelledByLevel2DateTime);
        }
        if (row.approvedByLevel1 === this.userCode) {
          return this.formatDateTime(row.approvedByLevel1DateTime);
        }
        if (row.approvedByLevel2 === this.userCode) {
          return this.formatDateTime(row.approvedByLevel2DateTime);
        }
        return this.formatDateTime(row.approvedByLevel2DateTime);
      }

      if (name === "Date Rejected") {
        if (row.rejectedByLevel1 === this.userCode) {
          return this.formatDateTime(row.rejectedByLevel1DateTime);
        }
        if (row.rejectedByLevel2 === this.userCode) {
          return this.formatDateTime(row.rejectedByLevel2DateTime);
        }
        if (row.rejectedByLevel1 === null) {
          return this.formatDateTime(row.rejectedByLevel1DateTime);
        }
        return this.formatDateTime(row.rejectedByLevel1DateTime);
      }

      if (name === "Approved Hours") {
        return row.approvedHours ? row.approvedHours : "-";
      }

      if (name === "Time") {
        if (row.timeFrom && row.timeTo) {
          return `${row.timeFrom} - ${row.timeTo}`;
        }

        if (row.tIME_FROM && row.tIME_TO) {
          return `${this.formatTimeTo12Hours(
            row.tIME_FROM,
          )} - ${this.formatTimeTo12Hours(row.tIME_TO)}`;
        }

        return "-";
      }

      if (name === "Status" || name === "Work Load" || name === "Reason") {
        return row[field] ?? "";
      }

      if (name === "Date") {
        if (row.dateLeavedFrom && row.dateLeavedTo) {
          return `${this.formatDateTime(
            row.dateLeavedFrom,
          )} - ${this.formatDateTime(row.dateLeavedTo)}`;
        }
        return "-";
      }

      return row[field] ?? "-";
    },

    // renderCell(row, col) {
    //   if (col.field === "leaveType" && this.LeaveTypeLabels) {
    //     return this.LeaveTypeLabels[row[col.field]];
    //   } else if (
    //     col.field === "dateLeavedFrom" ||
    //     col.field === "dateLeavedTo" ||
    //     col.field === "transDate" ||
    //     col.field === "dateOfOvertime" ||
    //     col.field === "overtimeCreated"
    //   ) {
    //     return this.formatDateTime(row[col.field]);
    //   } else if (col.field === "tIME_FROM" || col.field === "tIME_TO") {
    //     return this.formatTimeTo12Hours(row[col.field]);
    //   } else if (col.name === "Date Approved" && this.cancelView === false) {
    //     if (
    //       row.approvedByLevel1 !== null &&
    //       row.approvedByLevel1 == this.userCode
    //     ) {
    //       return this.formatDateTime(row.approvedByLevel1DateTime);
    //     } else if (
    //       row.approvedByLevel2 !== null &&
    //       row.approvedByLevel2 == this.userCode
    //     ) {
    //       return this.formatDateTime(row.approvedByLevel2DateTime);
    //     } else {
    //       return this.formatDateTime(row.approvedByLevel2DateTime);
    //     }
    //   } else if (col.name === "Date Approved" && this.cancelView === true) {
    //     return this.formatDateTime(row.cancelledByLevel2DateTime);
    //   } else if (col.name === "Date Rejected") {
    //     if (
    //       row.rejectedByLevel1 !== null &&
    //       row.rejectedByLevel1 == this.userCode
    //     ) {
    //       return this.formatDateTime(row.rejectedByLevel1DateTime);
    //     } else if (
    //       row.rejectedByLevel2 !== null &&
    //       row.rejectedByLevel2 == this.userCode
    //     ) {
    //       return this.formatDateTime(row.rejectedByLevel2DateTime);
    //     } else if (row.rejectedByLevel1 === null) {
    //       return this.formatDateTime(row.rejectedByLevel1DateTime);
    //     } else {
    //       return this.formatDateTime(row.rejectedByLevel1DateTime);
    //     }
    //   } else if (col.name === "Approved Hours") {
    //     if (!row.approvedHours) {
    //       return "-";
    //     }
    //     return row.approvedHours;
    //   } else {
    //     return row[col.field];
    //   }
    // },

    // formatDateTime(dateTimeString) {
    //   const options = {
    //     year: "numeric",
    //     month: "numeric",
    //     day: "numeric",
    //   };
    //   const dateTime = new Date(dateTimeString);
    //   return dateTime.toLocaleDateString(undefined, options);
    // },

    formatDateTime(dateTimeString) {
      const options = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString("en-PH", options);
    },

    formatTimeTo12Hours(Time) {
      const dateObj = new Date(Time); // Convert string/ISO date to Date object
      if (isNaN(dateObj)) {
        return ""; // or return original Time or handle invalid input
      }
      return dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    },
  },
};
</script>
