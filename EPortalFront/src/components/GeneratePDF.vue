<template>
  <q-item class="hoverable-item" clickable @click="generatePDFForEntry()">
    <q-item-section>
      <q-item-label>
        {{ multiple ? "Print Pending PDF" : "Print PDF" }}
      </q-item-label>
    </q-item-section>
  </q-item>

  <q-dialog v-model="dialogVisible" maximized>
    <q-card
      :class="[
        'bold-text',
        $q.screen.name + '-text',
        $q.screen.name + '-width',
        $q.screen.name + '-min-height',
      ]"
    >
      <q-card-section class="bg-primary text-white row items-center q-pb-md">
        <div class="bg-primary text-white text-bold">
          {{ type === "overtime" ? "Overtime" : "Leave" }} PDF Application{{
            multiple ? "s" : ""
          }}
        </div>
        <q-space></q-space>
        <q-btn
          class="bg-yellow-10 text-white text-bold q-mr-lg"
          label="Download"
          push
          @click="downloadPDF"
        />
        <q-btn
          class="bg-white text-blue"
          icon="close"
          push
          round
          dense
          v-close-popup
        ></q-btn>
      </q-card-section>

      <iframe
        v-if="pdfUrl"
        :src="pdfUrl"
        style="width: 100%; height: 100%; border: none"
        id="pdfViewer"
      ></iframe>
    </q-card>
  </q-dialog>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake";
import logoPath from "../assets/images/uerm-hospital-logo.png";
import pdfFonts from "../store/helpers/PdfMakeVfsFonts";
import { mapGetters } from "vuex";

pdfMake.vfs = pdfFonts;

// Constants
const LEAVE_TYPES = [
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
];

export default {
  name: "PDFGenerator",

  props: {
    entry: {
      type: [Object, Array],
      required: true,
    },
    type: {
      type: String,
      default: "leave", // Changed from required to default
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      dialogVisible: false,
      pdfUrl: "",
    };
  },

  computed: {
    ...mapGetters({ base64Image: "leaveModule/getBgImage" }),

    leaveTypeLabels() {
      return LEAVE_TYPES.reduce((acc, { value, label }) => {
        acc[value] = label;
        return acc;
      }, {});
    },

    processedEntries() {
      let entries = Array.isArray(this.entry) ? this.entry : [this.entry];

      if (this.multiple) {
        entries = entries.filter(
          (item) =>
            item.status === "Pending" || item.status === "PendingLevel2",
        );
      }

      return entries;
    },

    formTitle() {
      if (this.multiple) {
        return this.type === "overtime"
          ? "PENDING OVERTIME APPLICATIONS"
          : "PENDING LEAVE APPLICATIONS";
      }
      return this.type === "overtime"
        ? "OVERTIME APPLICATION FORM"
        : "LEAVE APPLICATION FORM";
    },
  },

  methods: {
    // ==================== DATE FORMATTING ====================
    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    },

    getCurrentDate() {
      return this.formatDate(new Date().toISOString());
    },

    // ==================== NAME FORMATTING ====================
    formatEmployeeName(entry) {
      const lastName = entry.lastName || entry.employeeName || "";
      const firstName = entry.firstName || "";
      const middleInitial = entry.middleInitial || "";

      return `${lastName}, ${firstName} ${middleInitial}.`
        .trim()
        .replace(/,\s*\.$/, ".");
    },

    // ==================== PDF GENERATION ENTRY POINT ====================
    async generatePDFForEntry() {
      if (this.processedEntries.length === 0) {
        this.showWarning("No entries found to generate PDF");
        return;
      }

      try {
        const firstEntry = this.processedEntries[0];
        const employeeInfo = await this.buildEmployeeInfo(firstEntry);
        const leaveCredits = await this.getLeaveCredits(firstEntry);
        const tableRows = this.buildTableRows();

        this.generatePDF({
          tableRows,
          employeeInfo,
          leaveCredits,
        });
      } catch (error) {
        console.error("PDF generation failed:", error);
        this.showWarning("Failed to generate PDF");
      }
    },

    // ==================== EMPLOYEE INFO SECTION ====================
    async buildEmployeeInfo(entry) {
      let position = "N/A";
      let department = "N/A";
      let employeeStatus = "N/A";

      if (this.type === "overtime") {
        position = entry.position || "N/A";
        department = entry.departmentDesc || "N/A";
        employeeStatus = entry.employeeStatus || "N/A";
      } else {
        const userCode = entry.iDCode;
        await this.fetchUserLeaveDetails(userCode, entry.leaveType);
        const userBalanceDetails =
          this.$store.state.leaveModule.userBalanceDetails;

        if (userBalanceDetails && userBalanceDetails.length > 0) {
          position = userBalanceDetails[0].position;
          department = userBalanceDetails[0].department;
          employeeStatus = userBalanceDetails[0].employeeStatus;
        }
      }

      return {
        code: entry.employeeCode || entry.iDCode,
        name: this.formatEmployeeName(entry),
        position,
        department,
        employeeStatus,
      };
    },

    // ==================== LEAVE CREDITS SECTION ====================
    async getLeaveCredits(entry) {
      // Don't show leave credits for overtime
      if (this.type === "overtime") {
        return null;
      }

      const userCode = entry.iDCode;

      if (this.multiple) {
        // For multiple entries, get unique leave types
        const uniqueLeaveTypes = [
          ...new Set(this.processedEntries.map((e) => e.leaveType)),
        ];

        if (uniqueLeaveTypes.length === 1) {
          // All same leave type - show credits for that one type
          await this.fetchUserLeaveDetails(userCode, uniqueLeaveTypes[0]);
          return this.buildLeaveCreditsSection();
        } else {
          // Different leave types - show credits for all types found
          await this.fetchUserLeaveDetails(userCode, null);
          return this.buildLeaveCreditsSection(uniqueLeaveTypes);
        }
      } else {
        // Single entry - show credits for that leave type
        await this.fetchUserLeaveDetails(userCode, entry.leaveType);
        return this.buildLeaveCreditsSection();
      }
    },

    async fetchUserLeaveDetails(userCode, leaveType) {
      try {
        await this.$store.dispatch(
          "leaveModule/fetchUserLeaveBalancesDetails",
          {
            employeeId: userCode,
            leaveType: leaveType, // Can be null to fetch all types
          },
        );
      } catch (error) {
        console.error("Failed to get User Leave Balance:", error);
        throw error;
      }
    },

    buildLeaveCreditsSection(filterLeaveTypes = null) {
      const userBalanceDetails =
        this.$store.state.leaveModule.userBalanceDetails;

      if (!userBalanceDetails || userBalanceDetails.length === 0) {
        return null;
      }

      let filteredDetails = userBalanceDetails;

      // If we have specific leave types to show (for multiple with different types)
      if (filterLeaveTypes && filterLeaveTypes.length > 0) {
        filteredDetails = userBalanceDetails.filter((detail) =>
          filterLeaveTypes.includes(detail.leaveType),
        );
      }

      if (filteredDetails.length === 0) {
        return null;
      }

      const leaveTypeOrder = { VL: 1, SL: 2, EL: 3 };
      filteredDetails.sort(
        (a, b) =>
          (leaveTypeOrder[a.leaveType] || 999) -
          (leaveTypeOrder[b.leaveType] || 999),
      );

      return filteredDetails.map((userEntry) => {
        const leaveTypeLabel =
          this.leaveTypeLabels[userEntry.leaveType] || userEntry.leaveType;
        const additionalMessage = this.getLeaveTypeMessage(userEntry.leaveType);

        return [
          {
            text: userEntry.remaining.toString(),
            alignment: "center",
            border: [false, false, false, false],
            style: "dp",
            decoration: "underline",
            decorationColor: "black",
          },
          {
            text: leaveTypeLabel + additionalMessage,
            alignment: "left",
            border: [false, false, false, false],
            style: "dp1",
          },
        ];
      });
    },

    getLeaveTypeMessage(leaveType) {
      const messages = {
        SL: " (Attach Medical Certificate issued by the Infirmary Physician)",
        EL: " (Attach proof of emergency such as calamity, death, serious illness, and serious accident of a member of the immediate family)",
      };
      return messages[leaveType] || "";
    },

    // ==================== TABLE BUILDING ====================
    buildTableRows() {
      const headerRow = this.createHeaderRow();
      const dataRows = this.processedEntries.map((entry) =>
        this.createDataRow(entry),
      );

      return [headerRow, ...dataRows];
    },

    createHeaderRow() {
      if (this.type === "overtime") {
        return [
          {
            text: "Work Load",
            alignment: "center",
            style: "dp",
            fillColor: "#cccccc",
          },
          {
            text: "Hours",
            alignment: "center",
            style: "dp",
            fillColor: "#cccccc",
          },
          {
            text: "OT Date",
            alignment: "center",
            style: "dp",
            fillColor: "#cccccc",
          },
          {
            text: "From",
            alignment: "center",
            style: "dp",
            fillColor: "#cccccc",
          },
          {
            text: "To",
            alignment: "center",
            style: "dp",
            fillColor: "#cccccc",
          },
          {
            text: "Status",
            alignment: "center",
            style: "dp",
            fillColor: "#cccccc",
          },
        ];
      }

      // Leave headers
      return [
        {
          text: "Leave Type",
          alignment: "center",
          style: "dp",
          fillColor: "#cccccc",
        },
        {
          text: "Days",
          alignment: "center",
          style: "dp",
          fillColor: "#cccccc",
        },
        {
          text: "Date From",
          alignment: "center",
          style: "dp",
          fillColor: "#cccccc",
        },
        {
          text: "Date To",
          alignment: "center",
          style: "dp",
          fillColor: "#cccccc",
        },
        {
          text: "Reason",
          alignment: "center",
          style: "dp",
          fillColor: "#cccccc",
        },
        {
          text: "Status",
          alignment: "center",
          style: "dp",
          fillColor: "#cccccc",
        },
      ];
    },

    createDataRow(entry) {
      if (this.type === "overtime") {
        return [
          { text: entry.workLoad || "N/A", alignment: "center", style: "dp1" },
          { text: entry.workHours || "N/A", alignment: "center", style: "dp1" },
          {
            text: this.formatDate(entry.dateOfOvertime),
            alignment: "center",
            style: "dp1",
          },
          { text: entry.timeFrom || "N/A", alignment: "center", style: "dp1" },
          { text: entry.timeTo || "N/A", alignment: "center", style: "dp1" },
          {
            text: (entry.status || "").toUpperCase(),
            alignment: "center",
            style: "dp1",
          },
        ];
      }

      // Leave data row
      return [
        {
          text:
            this.leaveTypeLabels[entry.leaveType] || entry.leaveType || "N/A",
          alignment: "center",
          style: "dp1",
        },
        { text: entry.daysOfLeave || "N/A", alignment: "center", style: "dp1" },
        {
          text: this.formatDate(entry.dateLeavedFrom),
          alignment: "center",
          style: "dp1",
        },
        {
          text: this.formatDate(entry.dateLeavedTo),
          alignment: "center",
          style: "dp1",
        },
        {
          text: entry.reasonForLeave || "N/A",
          alignment: "center",
          style: "dp1",
        },
        {
          text: (entry.status || "").toUpperCase(),
          alignment: "center",
          style: "dp1",
        },
      ];
    },

    getColumnWidths() {
      if (this.type === "overtime") {
        return ["30%", "10%", "15%", "15%", "15%", "15%"];
      }
      return ["20%", "10%", "15%", "15%", "30%", "10%"];
    },

    // ==================== PDF DOCUMENT CREATION ====================
    generatePDF({ tableRows, employeeInfo, leaveCredits }) {
      const docDefinition = this.createDocDefinition({
        tableRows,
        employeeInfo,
        leaveCredits,
      });

      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBlob((blob) => {
        this.pdfUrl = URL.createObjectURL(blob);
        this.dialogVisible = true;
      });
    },

    createDocDefinition({ tableRows, employeeInfo, leaveCredits }) {
      const totalPageHeight = 11.69 * 72;

      return {
        pageSize: {
          width: 8.5 * 72,
          height: totalPageHeight,
        },
        pageMargins: [10, 0, 10, 0],
        ...(this.base64Image && {
          background: [
            {
              image: this.base64Image,
              width: 350,
              height: 250,
              alignment: "center",
              absolutePosition: { x: 0, y: (totalPageHeight - 306) / 2 },
            },
          ],
        }),
        content: [
          {
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    border: [false, false, false, false],
                    stack: this.buildContentStack({
                      tableRows,
                      employeeInfo,
                      leaveCredits,
                    }),
                  },
                ],
              ],
            },
          },
        ],
        styles: this.getPdfStyles(),
      };
    },

    buildContentStack({ tableRows, employeeInfo, leaveCredits }) {
      const content = [
        { text: "\n" },
        this.createFormNumberSection(),
        ...this.createHeaderSection(),
        { text: "\n" },
        { text: this.formTitle, alignment: "center", style: "app" },
        { text: "\n" },
        this.createDateGeneratedSection(),
        this.createEmployeeInfoTable(employeeInfo),
        { text: "\n" },
        { text: " ", fontSize: 5 },
      ];

      // Add leave credits section (for both single and multiple leave applications)
      if (leaveCredits && leaveCredits.length > 0) {
        content.push(
          { text: "Leave Details", alignment: "center", style: "app" },
          this.createLeaveCreditsTable(leaveCredits),
          { text: " ", fontSize: 8 },
        );
      }

      // Add main application details table
      content.push(
        { text: " ", fontSize: 5 },
        this.createMainTable(tableRows),
        { text: "\n" },
        this.createSignatureSection(),
      );

      return content;
    },

    // ==================== PDF SECTIONS ====================
    createFormNumberSection() {
      return {
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: "HRD FORM NO.____REVISED 2019",
                alignment: "left",
                border: [false, false, false, false],
                style: "foot",
              },
            ],
          ],
        },
      };
    },

    createHeaderSection() {
      return [
        {
          text: "UNIVERSITY OF THE EAST",
          style: "headerTitle",
          alignment: "center",
          margin: [0, 5, 0, 2],
        },
        {
          text: "RAMON MAGSAYSAY MEMORIAL MEDICAL CENTER, INC.",
          style: "headerSubtitle",
          alignment: "center",
          margin: [0, 0, 0, 2],
        },
        {
          text: "64 Aurora Boulevard, Barangay Doña Imelda, Quezon City, 1113 Philippines",
          style: "headerAddress",
          alignment: "center",
          margin: [0, 0, 0, 1],
        },
        {
          text: "Tel.# 8-715-0861 loc. 364",
          style: "headerAddress",
          alignment: "center",
          margin: [0, 0, 0, 5],
        },
      ];
    },

    createDateGeneratedSection() {
      return {
        table: {
          widths: this.multiple ? ["50%", "50%"] : ["*", "*", "*"],
          body: [
            this.multiple
              ? [
                  {
                    text: [
                      { text: "DATE GENERATED: ", style: "dp1" },
                      { text: this.getCurrentDate(), style: "dp" },
                    ],
                    border: [false, false, false, false],
                  },
                ]
              : [
                  {
                    text: [
                      { text: "DATE GENERATED: ", style: "dp1" },
                      { text: this.getCurrentDate(), style: "dp" },
                    ],
                    border: [false, false, false, false],
                  },
                  { text: "", border: [false, false, false, false] },
                  { text: "", border: [false, false, false, false] },
                ],
          ],
        },
      };
    },

    createEmployeeInfoTable(employeeInfo) {
      return {
        table: {
          widths: ["12.5%", "25%", "25%", "25%", "12.5%"],
          body: [
            [
              {
                text: "CODE",
                alignment: "center",
                border: [false, false, false, false],
                style: "dp",
                fillColor: "#cccccc",
              },
              {
                text: "NAME",
                alignment: "center",
                border: [false, false, false, false],
                style: "dp",
                fillColor: "#cccccc",
              },
              {
                text: "POSITION",
                alignment: "center",
                border: [false, false, false, false],
                style: "dp",
                fillColor: "#cccccc",
              },
              {
                text: "DEPARTMENT",
                alignment: "center",
                border: [false, false, false, false],
                style: "dp",
                fillColor: "#cccccc",
              },
              {
                text: "STATUS",
                alignment: "center",
                border: [false, false, false, false],
                style: "dp",
                fillColor: "#cccccc",
              },
            ],
            [
              {
                text: employeeInfo.code,
                alignment: "center",
                border: [false, false, false, false],
                style: "dp1",
                fillColor: "#cccccc",
              },
              {
                text: employeeInfo.name,
                alignment: "center",
                border: [false, false, false, false],
                style: "dp1",
                fillColor: "#cccccc",
              },
              {
                text: employeeInfo.position,
                alignment: "center",
                border: [false, false, false, false],
                style: "dp1",
                fillColor: "#cccccc",
              },
              {
                text: employeeInfo.department + " DEPARTMENT",
                alignment: "center",
                border: [false, false, false, false],
                style: "dp1",
                fillColor: "#cccccc",
              },
              {
                text: employeeInfo.employeeStatus,
                alignment: "center",
                border: [false, false, false, false],
                style: "dp1",
                fillColor: "#cccccc",
              },
            ],
          ],
        },
      };
    },

    createLeaveCreditsTable(leaveCredits) {
      return {
        table: {
          widths: ["25%", "75%"],
          body: [
            [
              {
                text: "CREDITS",
                alignment: "center",
                border: [false, false, false, false],
                style: "dp",
              },
              {
                text: "LEAVE TYPE",
                border: [false, false, false, false],
                style: "dp",
              },
            ],
            ...leaveCredits,
          ],
        },
      };
    },

    createMainTable(tableRows) {
      return {
        table: {
          widths: this.getColumnWidths(),
          body: tableRows,
        },
      };
    },

    createSignatureSection() {
      return {
        table: {
          widths: ["*", "*", "*"],
          body: [
            [
              {
                text: "EMPLOYEE SIGNATURE",
                alignment: "center",
                border: [false, false, false, false],
                style: "dp",
              },
              {
                text: "APPROVED BY:\nDEPARTMENT HEAD",
                alignment: "center",
                border: [false, false, false, false],
                style: "dp",
              },
              {
                text: "RECEIVED BY:\nHUMAN RESOURCE PERSONEL",
                alignment: "center",
                border: [false, false, false, false],
                style: "dp",
              },
            ],
          ],
        },
      };
    },

    getPdfStyles() {
      return {
        header: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
        headerr: { fontSize: 20, bold: true, margin: [0, 0, 0, 10] },
        app: { fontSize: 11, bold: true },
        dp: { fontSize: 9, bold: true },
        dp1: { fontSize: 9, bold: false },
        foot: { fontSize: 7, bold: true },
        ls: { fontSize: 10 },
        headerTitle: { fontSize: 11, bold: true, color: "#000000" },
        headerSubtitle: { fontSize: 10, bold: true, color: "#000000" },
        headerAddress: { fontSize: 8, color: "#333333" },
      };
    },

    // ==================== DOWNLOAD & NOTIFICATIONS ====================
    downloadPDF() {
      const link = document.createElement("a");
      link.href = this.pdfUrl;
      const fileName = this.multiple
        ? `${
            this.type === "overtime" ? "Overtime" : "Leave"
          }_Applications_Pending.pdf`
        : `${this.type === "overtime" ? "Overtime" : "Leave"}_Application.pdf`;
      link.download = fileName;
      link.click();
    },

    showWarning(message) {
      this.$q.notify({
        type: "warning",
        message,
        position: "top",
      });
    },
  },
};
</script>
