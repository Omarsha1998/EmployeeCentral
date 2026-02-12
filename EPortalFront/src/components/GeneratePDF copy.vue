<template>
  <q-item class="hoverable-item" clickable @click="generatePDFForEntry()">
    <q-item-section>
      <q-item-label>Print PDF</q-item-label>
    </q-item-section>
  </q-item>
  <!-- <div class="bg-positive text-white" style="width: 100%;">
      <q-btn clickable @click="generatePDFForEntry" label="Print PDF" color="primary" style="line-height: 50%; width: 100%;">
        <q-icon class="pdf-icon q-ml-xs" name="picture_as_pdf" size="20px"/>
      </q-btn>
    </div> -->
  <!-- <iframe
        :src="pdfUrl"
        style="width: 100%; height: 100%; border: none"
      ></iframe> -->

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
          {{ type === "overtime" ? "Overtime" : "Leave" }} PDF Application
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

      dialogVisible: false,
      pdfUrl: "",
    };
  },

  props: {
    entry: {
      type: Object,
      required: true,
    },
    type: String,
  },

  computed: {
    // base64Image() {
    //   return this.$store.getters["leaveModule/base64Image"];
    // },

    ...mapGetters({ base64Image: "leaveModule/getBgImage" }),

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

    formatDate(date) {
      const formattedDate = date.split("T")[0]; // Extracts the date part before 'T'
      return formattedDate;
    },

    loadAndConvertToBase64() {
      this.$store.dispatch("leaveModule/loadAndConvertToBase64", logoPath);
    },

    async fetchUserLeaveDetails(userCode, leaveType) {
      const data = {
        employeeId: userCode,
        leaveType: leaveType,
      };
      try {
        await this.$store.dispatch(
          "leaveModule/fetchUserLeaveBalancesDetails",
          data,
        );
      } catch (error) {
        console.error("Failed to get User Leave Balance");
      }
    },

    async generatePDFForEntry() {
      const { entry, type } = this;

      const currentDate = new Date().toLocaleDateString();
      const leaveDetails = [];
      const leaveDetails2 = [];
      const signDetails = [];
      const signDetails2 = [];
      const processedPositions = [];

      const userCode = type === "overtime" ? entry.employeeCode : entry.iDCode;

      if (type === "overtime") {
        this.generateOvertimePDF(
          entry,
          leaveDetails,
          leaveDetails2,
          signDetails,
          signDetails2,
        );
      } else {
        this.fetchUserLeaveDetails(userCode, entry.leaveType).then(() => {
          const userBalanceDetails =
            this.$store.state.leaveModule.userBalanceDetails;
          const leaveTypeOrder = { VL: 1, SL: 2, EL: 3 };
          userBalanceDetails.sort(
            (a, b) => leaveTypeOrder[a.leaveType] - leaveTypeOrder[b.leaveType],
          );

          let position = "";
          let department = "";
          let employeeStatus = "";

          userBalanceDetails.forEach((userEntry) => {
            position = userEntry.position;
            department = userEntry.department;
            employeeStatus = userEntry.employeeStatus;

            const leaveTypeLabels = this.LeaveTypeLabels[userEntry.leaveType];
            let additionalMessage = "";

            if (userEntry.leaveType === null || userEntry.remaining === 0) {
              leaveDetails.push([
                {
                  text: userEntry.remaining.toString(),
                  alignment: "center",
                  border: [false, false, false, false],
                  style: "dp",
                  decoration: "underline",
                  decorationColor: "black",
                },
                {
                  text: "No available leave credit for: " + leaveTypeLabels,
                  alignment: "left",
                  border: [false, false, false, false],
                  style: "dp1",
                },
              ]);

              leaveDetails2.push([
                {
                  text: userEntry.remaining.toString(),
                  alignment: "center",
                  border: [false, false, false, false],
                  style: "dp",
                  decoration: "underline",
                  decorationColor: "black",
                },
                {
                  text: "No available leave credit for: " + leaveTypeLabels,
                  alignment: "left",
                  border: [false, false, false, false],
                  style: "dp1",
                },
              ]);
            } else {
              if (userEntry.leaveType === "SL") {
                additionalMessage =
                  " (Attach Medical Certificate issued by the Infirmary Physician)";
              }

              if (userEntry.leaveType === "EL") {
                additionalMessage =
                  " (Attach proof of emergency such as calamity, death, serious illness, and serious accident of a member of the immediate family)";
              }

              leaveDetails.push([
                {
                  text: userEntry.remaining.toString(),
                  alignment: "center",
                  border: [false, false, false, false],
                  style: "dp",
                  decoration: "underline",
                  decorationColor: "black",
                },
                {
                  text: leaveTypeLabels + additionalMessage,
                  alignment: "left",
                  border: [false, false, false, false],
                  style: "dp1",
                },
              ]);

              leaveDetails2.push([
                {
                  text: userEntry.remaining.toString(),
                  alignment: "center",
                  border: [false, false, false, false],
                  style: "dp",
                  decoration: "underline",
                  decorationColor: "black",
                },
                {
                  text: leaveTypeLabels + additionalMessage,
                  alignment: "left",
                  border: [false, false, false, false],
                  style: "dp1",
                },
              ]);
            }

            if (!processedPositions.includes(userEntry.position)) {
              processedPositions.push(userEntry.position);

              if (userEntry.Class === "OF") {
                signDetails.push([
                  {
                    text: `EMPLOYEE SIGNATURE`,
                    alignment: "center",
                    border: [false, false, false, false],
                    style: "dp",
                  },
                  {
                    text: `APPROVED BY:\nSENIOR VICE PRESIDENT / \nVICE PRESIDENT`,
                    alignment: "center",
                    border: [false, false, false, false],
                    style: "dp",
                  },
                  {
                    text: `RECEIVED BY:\nHUMAN RESOURCE PERSONEL`,
                    alignment: "center",
                    border: [false, false, false, false],
                    style: "dp",
                  },
                ]);
              } else {
                signDetails.push([
                  {
                    text: `EMPLOYEE SIGNATURE`,
                    alignment: "center",
                    border: [false, false, false, false],
                    style: "dp",
                  },
                  {
                    text: `APPROVED BY:\nDEPARTMENT HEAD`,
                    alignment: "center",
                    border: [false, false, false, false],
                    style: "dp",
                  },
                  {
                    text: `RECEIVED BY:\nHUMAN RESOURCE PERSONEL`,
                    alignment: "center",
                    border: [false, false, false, false],
                    style: "dp",
                  },
                ]);
              }

              if (userEntry.Class === "OF") {
                signDetails2.push([
                  {
                    text: `EMPLOYEE SIGNATURE`,
                    alignment: "center",
                    border: [false, false, false, false],
                    style: "dp",
                  },
                  {
                    text: `APPROVED BY:\nSENIOR VICE PRESIDENT / \nVICE PRESIDENT`,
                    alignment: "center",
                    border: [false, false, false, false],
                    style: "dp",
                  },
                  {
                    text: `RECEIVED BY:\nHUMAN RESOURCE PERSONEL`,
                    alignment: "center",
                    border: [false, false, false, false],
                    style: "dp",
                  },
                ]);
              } else {
                signDetails2.push([
                  {
                    text: `EMPLOYEE SIGNATURE`,
                    alignment: "center",
                    border: [false, false, false, false],
                    style: "dp",
                  },
                  {
                    text: `APPROVED BY:\nDEPARTMENT HEAD`,
                    alignment: "center",
                    border: [false, false, false, false],
                    style: "dp",
                  },
                  {
                    text: `RECEIVED BY:\nHUMAN RESOURCE PERSONEL`,
                    alignment: "center",
                    border: [false, false, false, false],
                    style: "dp",
                  },
                ]);
              }
            }
          });

          // Generate PDF for leave application
          this.generateLeavePDF(
            entry,
            position,
            department,
            employeeStatus,
            leaveDetails,
            signDetails,
          );
        });
      }

      // await this.$store
      //   .dispatch("leaveModule/loadAndConvertToBase64", logoPath)
      //   .then(async () => {
      //     // const base64Image = this.$store.state.leaveModule.base64Image;
      //   });

      // const base64Image = this.$store.state.leaveModule.base64Image;
    },

    generateOvertimePDF(
      entry,
      leaveDetails,
      leaveDetails2,
      signDetails,
      signDetails2,
    ) {
      const position = entry.position || "N/A";
      const department = entry.departmentDesc || "N/A";
      const employeeStatus = entry.employeeStatus || "N/A";

      signDetails.push([
        {
          text: `EMPLOYEE SIGNATURE`,
          alignment: "center",
          border: [false, false, false, false],
          style: "dp",
        },
        {
          text: `APPROVED BY:\nDEPARTMENT HEAD`,
          alignment: "center",
          border: [false, false, false, false],
          style: "dp",
        },
        {
          text: `RECEIVED BY:\nHUMAN RESOURCE PERSONEL`,
          alignment: "center",
          border: [false, false, false, false],
          style: "dp",
        },
      ]);

      this.generatePDFDocument(
        entry,
        position,
        department,
        employeeStatus,
        leaveDetails,
        signDetails,
        "OVERTIME APPLICATION FORM",
      );
    },

    generateLeavePDF(
      entry,
      position,
      department,
      employeeStatus,
      leaveDetails,
      signDetails,
    ) {
      this.generatePDFDocument(
        entry,
        position,
        department,
        employeeStatus,
        leaveDetails,
        signDetails,
        "LEAVE APPLICATION FORM",
      );
    },

    generatePDFDocument(
      entry,
      position,
      department,
      employeeStatus,
      leaveDetails,
      signDetails,
      formTitle,
    ) {
      const base64Image = this.base64Image;
      const totalPageHeight = 11.69 * 72;
      const nestedTableHeight = 0.5 * totalPageHeight;

      const docDefinition = {
        pageSize: {
          width: 8.5 * 72,
          height: totalPageHeight,
        },
        pageMargins: [10, 0, 10, 0],
        // Only add background if base64Image exists and is not null
        ...(base64Image && {
          background: [
            {
              image: base64Image,
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
              heights: [nestedTableHeight],
              body: [
                [
                  {
                    border: [false, false, false, false],
                    stack: [
                      { text: "\n" },
                      {
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
                      },
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
                      // {
                      //   text: "UNIVERSITY OF THE EAST RAMON MAGSAYSAY MEMORIAL MEDICAL CENTER, INC",
                      //   style: "header",
                      //   alignment: "center",
                      // },
                      { text: "\n" },
                      {
                        text: formTitle,
                        alignment: "center",
                        style: "app",
                      },
                      { text: "\n" },
                      {
                        table: {
                          widths: ["*", "*", "*"],
                          body: [
                            [
                              {
                                text: [
                                  { text: "DATE FILED: ", style: "dp1" },
                                  {
                                    text: this.formatDate(
                                      entry.transDate || entry.overtimeCreated,
                                    ),
                                    style: "dp",
                                  },
                                ],
                                border: [false, false, false, false],
                              },
                              {
                                text: ``,
                                border: [false, false, false, false],
                              },
                              {
                                text: ``,
                                border: [false, false, false, false],
                              },
                            ],
                          ],
                        },
                      },
                      {
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
                                text: `${entry.employeeCode || entry.iDCode}`,
                                alignment: "center",
                                border: [false, false, false, false],
                                style: "dp1",
                                fillColor: "#cccccc",
                              },
                              {
                                text: `${
                                  entry.lastName || entry.employeeName
                                }, ${entry.firstName || ""} ${
                                  entry.middleInitial || ""
                                }.`,
                                alignment: "center",
                                border: [false, false, false, false],
                                style: "dp1",
                                fillColor: "#cccccc",
                              },
                              {
                                text: position,
                                alignment: "center",
                                border: [false, false, false, false],
                                style: "dp1",
                                fillColor: "#cccccc",
                              },
                              {
                                text: department + " " + "DEPARTMENT",
                                alignment: "center",
                                border: [false, false, false, false],
                                style: "dp1",
                                fillColor: "#cccccc",
                              },
                              {
                                text: employeeStatus,
                                alignment: "center",
                                border: [false, false, false, false],
                                style: "dp1",
                                fillColor: "#cccccc",
                              },
                            ],
                          ],
                        },
                      },
                      { text: "\n" },
                      { text: " ", fontSize: 5 },
                      // Only show leave details section for leave applications
                      ...(formTitle === "LEAVE APPLICATION FORM"
                        ? [
                            {
                              text: "Leave Details",
                              alignment: "center",
                              style: "app",
                            },
                            {
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
                                  ...leaveDetails,
                                ],
                              },
                            },
                            { text: " ", fontSize: 8 },
                            {
                              text: "Leave Application Details",
                              alignment: "center",
                              style: "app",
                            },
                            { text: " ", fontSize: 5 },
                            {
                              table: {
                                widths: ["20%", "10%", "15%", "15%", "40%"],
                                body: [
                                  [
                                    {
                                      text: "Leave Type",
                                      alignment: "center",
                                      style: "dp",
                                    },
                                    {
                                      text: "Days",
                                      alignment: "center",
                                      style: "dp",
                                    },
                                    {
                                      text: "Date From",
                                      alignment: "center",
                                      style: "dp",
                                    },
                                    {
                                      text: "Date To",
                                      alignment: "center",
                                      style: "dp",
                                    },
                                    {
                                      text: "Reason",
                                      alignment: "center",
                                      style: "dp",
                                    },
                                  ],
                                  [
                                    {
                                      text: this.LeaveTypeLabels[
                                        entry.leaveType
                                      ],
                                      alignment: "center",
                                      style: "dp1",
                                    },
                                    {
                                      text: entry.daysOfLeave,
                                      alignment: "center",
                                      style: "dp1",
                                    },
                                    {
                                      text: this.formatDateTime(
                                        entry.dateLeavedFrom,
                                      ),
                                      alignment: "center",
                                      style: "dp1",
                                    },
                                    {
                                      text: this.formatDateTime(
                                        entry.dateLeavedTo,
                                      ),
                                      alignment: "center",
                                      style: "dp1",
                                    },
                                    {
                                      text: entry.reasonForLeave,
                                      alignment: "center",
                                      style: "dp1",
                                    },
                                  ],
                                ],
                              },
                            },
                          ]
                        : [
                            // Overtime specific content
                            {
                              text: "Overtime Application Details",
                              alignment: "center",
                              style: "app",
                            },
                            { text: " ", fontSize: 5 },
                            {
                              table: {
                                widths: ["50%", "11%", "15%", "12%", "12%"],
                                body: [
                                  [
                                    {
                                      text: "Work Load",
                                      alignment: "center",
                                      style: "dp",
                                    },
                                    {
                                      text: "Work Hours",
                                      alignment: "center",
                                      style: "dp",
                                    },
                                    {
                                      text: "Overtime Date",
                                      alignment: "center",
                                      style: "dp",
                                    },
                                    {
                                      text: "Time From",
                                      alignment: "center",
                                      style: "dp",
                                    },
                                    {
                                      text: "Time To",
                                      alignment: "center",
                                      style: "dp",
                                    },
                                  ],
                                  [
                                    {
                                      text: entry.workLoad,
                                      alignment: "center",
                                      style: "dp1",
                                    },
                                    {
                                      text: entry.workHours,
                                      alignment: "center",
                                      style: "dp1",
                                    },
                                    {
                                      text: this.formatDate(
                                        entry.dateOfOvertime,
                                      ),
                                      alignment: "center",
                                      style: "dp1",
                                    },
                                    {
                                      text: entry.timeFrom,
                                      alignment: "center",
                                      style: "dp1",
                                    },
                                    {
                                      text: entry.timeTo,
                                      alignment: "center",
                                      style: "dp1",
                                    },
                                  ],
                                ],
                              },
                            },
                          ]),
                      { text: "\n" },
                      {
                        table: {
                          width: ["*", "*"],
                          body: [
                            [
                              {
                                text:
                                  formTitle === "LEAVE APPLICATION FORM"
                                    ? "Leave Status:"
                                    : "Overtime Status:",
                                alignment: "left",
                                border: [false, false, false, false],
                                style: "ls",
                              },
                              {
                                text: entry.status.toUpperCase(),
                                alignment: "left",
                                border: [false, false, false, false],
                                style: "app",
                              },
                            ],
                          ],
                        },
                      },
                    ],
                  },
                ],
              ],
            },
          },
        ],
        styles: {
          header: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
          headerr: { fontSize: 20, bold: true, margin: [0, 0, 0, 10] },
          app: { fontSize: 11, bold: true },
          dp: { fontSize: 9, bold: true },
          dp1: { fontSize: 9, bold: false },
          foot: { fontSize: 7, bold: true },
          ls: { fontSize: 10 },
          headerTitle: {
            fontSize: 11,
            bold: true,
            color: "#000000",
          },
          headerSubtitle: {
            fontSize: 10,
            bold: true,
            color: "#000000",
          },
          headerAddress: {
            fontSize: 8,
            color: "#333333",
          },
        },
      };

      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBlob((blob) => {
        this.pdfUrl = URL.createObjectURL(blob);
        this.dialogVisible = true;
      });
    },

    downloadPDF() {
      const link = document.createElement("a");
      link.href = this.pdfUrl;
      link.download =
        this.type === "overtime"
          ? "Overtime_Application.pdf"
          : "Leave_Application.pdf";
      link.click();
    },

    // async generatePDFForEntry() {
    //   const { entry, type } = this;
    //   console.log(entry, type);

    //   // if (type !== "overtime") {

    //   // }
    //   // if (
    //   //   !entry ||
    //   //   !entry.iDCode ||
    //   //   !entry.lastName ||
    //   //   !entry.firstName ||
    //   //   !entry.middleInitial ||
    //   //   !entry.leaveId ||
    //   //   !entry.daysOfLeave ||
    //   //   !entry.tIME_FROM ||
    //   //   !entry.tIME_TO ||
    //   //   !entry.dateLeavedFrom ||
    //   //   !entry.dateLeavedTo ||
    //   //   !entry.leaveType ||
    //   //   !entry.reasonForLeave
    //   // ) {
    //   //   console.error("Invalid entry data.");
    //   //   return;
    //   // }

    //   const currentDate = new Date().toLocaleDateString();
    //   const leaveDetails = [];
    //   const leaveDetails2 = [];
    //   const signDetails = [];
    //   const signDetails2 = [];
    //   const processedPositions = [];

    //   const userCode = type === "overtime" ? entry.employeeCode : entry.iDCode;

    //   await this.$store.dispatch(
    //     "leaveModule/loadAndConvertToBase64",
    //     logoPath,
    //   );

    //   if (type !== "overtime") {

    //   }

    //   this.fetchUserLeaveDetails(userCode, entry.leaveType).then(() => {
    //     const userBalanceDetails =
    //       this.$store.state.leaveModule.userBalanceDetails;
    //     const leaveTypeOrder = { VL: 1, SL: 2, EL: 3 };
    //     userBalanceDetails.sort(
    //       (a, b) => leaveTypeOrder[a.leaveType] - leaveTypeOrder[b.leaveType],
    //     );

    //     let position = "";
    //     let department = "";
    //     let employeeStatus = "";

    //     userBalanceDetails.forEach((userEntry) => {
    //       position = userEntry.position;
    //       department = userEntry.department;
    //       employeeStatus = userEntry.employeeStatus;

    //       const leaveTypeLabels = this.LeaveTypeLabels[userEntry.leaveType];
    //       let additionalMessage = "";

    //       if (userEntry.leaveType === null || userEntry.remaining === 0) {
    //         leaveDetails.push([
    //           {
    //             text: userEntry.remaining.toString(),
    //             alignment: "center",
    //             border: [false, false, false, false],
    //             style: "dp",
    //             decoration: "underline",
    //             decorationColor: "black",
    //           },
    //           {
    //             text: "No available leave credit for: " + leaveTypeLabels,
    //             alignment: "left",
    //             border: [false, false, false, false],
    //             style: "dp1",
    //           },
    //         ]);

    //         leaveDetails2.push([
    //           {
    //             text: userEntry.remaining.toString(),
    //             alignment: "center",
    //             border: [false, false, false, false],
    //             style: "dp",
    //             decoration: "underline",
    //             decorationColor: "black",
    //           },
    //           {
    //             text: "No available leave credit for: " + leaveTypeLabels,
    //             alignment: "left",
    //             border: [false, false, false, false],
    //             style: "dp1",
    //           },
    //         ]);
    //       } else {
    //         if (userEntry.leaveType === "SL") {
    //           additionalMessage =
    //             " (Attach Medical Certificate issued by the Infirmary Physician)";
    //         }

    //         if (userEntry.leaveType === "EL") {
    //           additionalMessage =
    //             " (Attach proof of emergency such as calamity, death, serious illness, and serious accident of a member of the immediate family)";
    //         }

    //         leaveDetails.push([
    //           {
    //             text: userEntry.remaining.toString(),
    //             alignment: "center",
    //             border: [false, false, false, false],
    //             style: "dp",
    //             decoration: "underline",
    //             decorationColor: "black",
    //           },
    //           {
    //             text: leaveTypeLabels + additionalMessage,
    //             alignment: "left",
    //             border: [false, false, false, false],
    //             style: "dp1",
    //           },
    //         ]);

    //         leaveDetails2.push([
    //           {
    //             text: userEntry.remaining.toString(),
    //             alignment: "center",
    //             border: [false, false, false, false],
    //             style: "dp",
    //             decoration: "underline",
    //             decorationColor: "black",
    //           },
    //           {
    //             text: leaveTypeLabels + additionalMessage,
    //             alignment: "left",
    //             border: [false, false, false, false],
    //             style: "dp1",
    //           },
    //         ]);
    //       }

    //       // Check if signatures for the current position have already been added
    //       if (!processedPositions.includes(userEntry.position)) {
    //         processedPositions.push(userEntry.position);

    //         if (userEntry.Class === "OF") {
    //           signDetails.push([
    //             {
    //               text: `EMPLOYEE SIGNATURE`,
    //               alignment: "center",
    //               border: [false, false, false, false],
    //               style: "dp",
    //             },
    //             {
    //               text: `APPROVED BY:\nSENIOR VICE PRESIDENT / \nVICE PRESIDENT`,
    //               alignment: "center",
    //               border: [false, false, false, false],
    //               style: "dp",
    //             },
    //             {
    //               text: `RECEIVED BY:\nHUMAN RESOURCE PERSONEL`,
    //               alignment: "center",
    //               border: [false, false, false, false],
    //               style: "dp",
    //             },
    //           ]);
    //         } else {
    //           signDetails.push([
    //             {
    //               text: `EMPLOYEE SIGNATURE`,
    //               alignment: "center",
    //               border: [false, false, false, false],
    //               style: "dp",
    //             },
    //             {
    //               text: `APPROVED BY:\nDEPARTMENT HEAD`,
    //               alignment: "center",
    //               border: [false, false, false, false],
    //               style: "dp",
    //             },
    //             {
    //               text: `RECEIVED BY:\nHUMAN RESOURCE PERSONEL`,
    //               alignment: "center",
    //               border: [false, false, false, false],
    //               style: "dp",
    //             },
    //           ]);
    //         }

    //         // Similar block for signDetails2
    //         if (userEntry.Class === "OF") {
    //           signDetails2.push([
    //             {
    //               text: `EMPLOYEE SIGNATURE`,
    //               alignment: "center",
    //               border: [false, false, false, false],
    //               style: "dp",
    //             },
    //             {
    //               text: `APPROVED BY:\nSENIOR VICE PRESIDENT / \nVICE PRESIDENT`,
    //               alignment: "center",
    //               border: [false, false, false, false],
    //               style: "dp",
    //             },
    //             {
    //               text: `RECEIVED BY:\nHUMAN RESOURCE PERSONEL`,
    //               alignment: "center",
    //               border: [false, false, false, false],
    //               style: "dp",
    //             },
    //           ]);
    //         } else {
    //           signDetails2.push([
    //             {
    //               text: `EMPLOYEE SIGNATURE`,
    //               alignment: "center",
    //               border: [false, false, false, false],
    //               style: "dp",
    //             },
    //             {
    //               text: `APPROVED BY:\nDEPARTMENT HEAD`,
    //               alignment: "center",
    //               border: [false, false, false, false],
    //               style: "dp",
    //             },
    //             {
    //               text: `RECEIVED BY:\nHUMAN RESOURCE PERSONEL`,
    //               alignment: "center",
    //               border: [false, false, false, false],
    //               style: "dp",
    //             },
    //           ]);
    //         }
    //       }
    //     });

    //     const totalPageHeight = 11.69 * 72;
    //     const nestedTableHeight = 0.5 * totalPageHeight;

    //     const docDefinition = {
    //       pageSize: {
    //         width: 8.5 * 72,
    //         height: totalPageHeight,
    //       },
    //       pageMargins: [10, 0, 10, 0],
    //       background: [
    //         {
    //           image: this.base64Image,
    //           width: 350,
    //           height: 250,
    //           alignment: "center",
    //           absolutePosition: { x: 0, y: (totalPageHeight - 306) / 2 },
    //         },
    //       ],
    //       content: [
    //         {
    //           table: {
    //             widths: ["*"],
    //             heights: [nestedTableHeight],
    //             body: [
    //               [
    //                 {
    //                   border: [false, false, false, false],
    //                   stack: [
    //                     { text: "\n" },
    //                     {
    //                       table: {
    //                         widths: ["*"],
    //                         body: [
    //                           [
    //                             {
    //                               text: "HRD FORM NO.____REVISED 2019",
    //                               alignment: "left",
    //                               border: [false, false, false, false],
    //                               style: "foot",
    //                             },
    //                           ],
    //                         ],
    //                       },
    //                     },
    //                     { text: "\n" },
    //                     {
    //                       text: "UNIVERSITY OF THE EAST RAMON MAGSAYSAY MEMORIAL MEDICAL CENTER, INC",
    //                       style: "header",
    //                       alignment: "center",
    //                     },
    //                     { text: "\n" },
    //                     {
    //                       text: "LEAVE APPLICATION FORM",
    //                       alignment: "center",
    //                       style: "app",
    //                     },
    //                     { text: "\n" },
    //                     {
    //                       table: {
    //                         widths: ["*", "*", "*"],
    //                         body: [
    //                           [
    //                             {
    //                               text: [
    //                                 { text: "DATE FILED: ", style: "dp1" },
    //                                 {
    //                                   text: this.formatDate(entry.transDate),
    //                                   style: "dp",
    //                                 },
    //                               ],
    //                               border: [false, false, false, false],
    //                             },
    //                             {
    //                               text: ``,
    //                               border: [false, false, false, false],
    //                             },
    //                             {
    //                               text: ``,
    //                               border: [false, false, false, false],
    //                             },
    //                           ],
    //                         ],
    //                       },
    //                     },
    //                     {
    //                       table: {
    //                         widths: ["12.5%", "25%", "25%", "25%", "12.5%"],
    //                         body: [
    //                           [
    //                             {
    //                               text: "CODE",
    //                               alignment: "center",
    //                               border: [false, false, false, false],
    //                               style: "dp",
    //                               fillColor: "#cccccc",
    //                             },
    //                             {
    //                               text: "NAME",
    //                               alignment: "center",
    //                               border: [false, false, false, false],
    //                               style: "dp",
    //                               fillColor: "#cccccc",
    //                             },
    //                             {
    //                               text: "POSITION",
    //                               alignment: "center",
    //                               border: [false, false, false, false],
    //                               style: "dp",
    //                               fillColor: "#cccccc",
    //                             },
    //                             {
    //                               text: "DEPARTMENT",
    //                               alignment: "center",
    //                               border: [false, false, false, false],
    //                               style: "dp",
    //                               fillColor: "#cccccc",
    //                             },
    //                             {
    //                               text: "STATUS",
    //                               alignment: "center",
    //                               border: [false, false, false, false],
    //                               style: "dp",
    //                               fillColor: "#cccccc",
    //                             },
    //                           ],
    //                           [
    //                             {
    //                               text: `${entry.iDCode}`,
    //                               alignment: "center",
    //                               border: [false, false, false, false],
    //                               style: "dp1",
    //                               fillColor: "#cccccc",
    //                             },
    //                             {
    //                               text: `${entry.lastName}, ${entry.firstName} ${entry.middleInitial}.`,
    //                               alignment: "center",
    //                               border: [false, false, false, false],
    //                               style: "dp1",
    //                               fillColor: "#cccccc",
    //                             },
    //                             {
    //                               text: position,
    //                               alignment: "center",
    //                               border: [false, false, false, false],
    //                               style: "dp1",
    //                               fillColor: "#cccccc",
    //                             },
    //                             {
    //                               text: department + " " + "DEPARTMENT",
    //                               alignment: "center",
    //                               border: [false, false, false, false],
    //                               style: "dp1",
    //                               fillColor: "#cccccc",
    //                             },
    //                             {
    //                               text: employeeStatus,
    //                               alignment: "center",
    //                               border: [false, false, false, false],
    //                               style: "dp1",
    //                               fillColor: "#cccccc",
    //                             },
    //                           ],
    //                         ],
    //                       },
    //                     },
    //                     { text: "\n" },
    //                     { text: " ", fontSize: 5 },
    //                     {
    //                       text: "Leave Details",
    //                       alignment: "center",
    //                       style: "app",
    //                     },
    //                     {
    //                       table: {
    //                         widths: ["25%", "75%"],
    //                         body: [
    //                           [
    //                             {
    //                               text: "CREDITS",
    //                               alignment: "center",
    //                               border: [false, false, false, false],
    //                               style: "dp",
    //                             },
    //                             {
    //                               text: "LEAVE TYPE",
    //                               border: [false, false, false, false],
    //                               style: "dp",
    //                             },
    //                           ],
    //                           ...leaveDetails,
    //                         ],
    //                       },
    //                     },
    //                     { text: " ", fontSize: 8 },
    //                     {
    //                       text: "Leave Application Details",
    //                       alignment: "center",
    //                       style: "app",
    //                     },
    //                     { text: " ", fontSize: 5 },
    //                     {
    //                       table: {
    //                         widths: ["20%", "10%", "15%", "15%", "40%"],
    //                         body: [
    //                           [
    //                             {
    //                               text: "Leave Type",
    //                               alignment: "center",
    //                               style: "dp",
    //                             },
    //                             {
    //                               text: "Days",
    //                               alignment: "center",
    //                               style: "dp",
    //                             },
    //                             {
    //                               text: "Date From",
    //                               alignment: "center",
    //                               style: "dp",
    //                             },
    //                             {
    //                               text: "Date To",
    //                               alignment: "center",
    //                               style: "dp",
    //                             },
    //                             {
    //                               text: "Reason",
    //                               alignment: "center",
    //                               style: "dp",
    //                             },
    //                           ],
    //                           [
    //                             {
    //                               text: this.LeaveTypeLabels[entry.leaveType],
    //                               alignment: "center",
    //                               style: "dp1",
    //                             },
    //                             {
    //                               text: entry.daysOfLeave,
    //                               alignment: "center",
    //                               style: "dp1",
    //                             },
    //                             {
    //                               text: this.formatDateTime(
    //                                 entry.dateLeavedFrom,
    //                               ),
    //                               alignment: "center",
    //                               style: "dp1",
    //                             },
    //                             {
    //                               text: this.formatDateTime(entry.dateLeavedTo),
    //                               alignment: "center",
    //                               style: "dp1",
    //                             },
    //                             {
    //                               text: entry.reasonForLeave,
    //                               alignment: "center",
    //                               style: "dp1",
    //                             },
    //                           ],
    //                         ],
    //                       },
    //                     },
    //                     { text: "\n" },
    //                     {
    //                       table: {
    //                         width: ["*", "*"],
    //                         body: [
    //                           [
    //                             {
    //                               text: "Leave Status:",
    //                               alignment: "left",
    //                               border: [false, false, false, false],
    //                               style: "ls",
    //                             },
    //                             {
    //                               text: entry.status.toUpperCase(),
    //                               alignment: "left",
    //                               border: [false, false, false, false],
    //                               style: "app",
    //                             },
    //                           ],
    //                         ],
    //                       },
    //                     },
    //                   ],
    //                 },
    //               ],
    //             ],
    //           },
    //         },
    //       ],
    //       styles: {
    //         header: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
    //         headerr: { fontSize: 20, bold: true, margin: [0, 0, 0, 10] },
    //         app: { fontSize: 11, bold: true },
    //         dp: { fontSize: 9, bold: true },
    //         dp1: { fontSize: 9, bold: false },
    //         foot: { fontSize: 7, bold: true },
    //         ls: { fontSize: 10 },
    //       },
    //     };

    //     const pdfDoc = pdfMake.createPdf(docDefinition);
    //     pdfDoc.getBlob((blob) => {
    //       this.pdfUrl = URL.createObjectURL(blob);
    //       this.dialogVisible = true;
    //     });
    //   });
    // },
  },
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
