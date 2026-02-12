<template>
  <div class="pdf-generator">
    <div class="bg-positive text-white" style="width: 100%">
      <q-btn
        @click="generatePDFForEntry"
        label="Print PDF"
        color="primary"
        style="line-height: 50%; width: 100%"
      >
        <q-icon class="pdf-icon q-ml-xs" name="picture_as_pdf" size="20px" />
      </q-btn>
    </div>
  </div>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import logoPath from "../assets/images/logouerm.jpg";

export default {
  data() {
    return {
      LeaveTypes: [
        { label: "Vacation Leave", value: "VL" },
        { label: "Sick Leave", value: "SL" },
        { label: "Emergency Leave", value: "EL" },
        { label: "Birthday Leave", value: "BL" },
        { label: "Leave Without Pay", value: "LWOP" },
        { label: "Magna Carta", value: "MGL" },
        { label: "Maternity Leave", value: "ML" },
        { label: "Official Leave", value: "OL" },
        { label: "Parental Leave", value: "PRL" },
        { label: "Paternity Leave", value: "PL" },
        { label: "Sabbatical Leave", value: "SBL" },
        { label: "Study Leave", value: "STL" },
        { label: "Union Leave", value: "UL" },
      ],
    };
  },

  props: {
    entry: {
      type: Object,
      required: true,
    },
  },

  computed: {
    base64Image() {
      return this.$store.getters["leaveModule/base64Image"];
    },

    LeaveTypeLabels() {
      return this.LeaveTypes.reduce((acc, { value, label }) => {
        acc[value] = label;
        return acc;
      }, {});
    },
  },

  methods: {
    formatDateTime(dateTimeString) {
      const options = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString(undefined, options);
    },

    async fetchUserLeaveDetails(userCode) {
      const employeeID = userCode;
      try {
        await this.$store.dispatch(
          "leaveModule/fetchUserLeaveBalancesDetails",
          employeeID,
        );
      } catch (error) {
        console.error("Failed to get User Leave Balance");
      }
    },

    async generatePDFForEntry() {},
  },
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
