<template>
  <q-btn
    class="bg-positive text-white"
    label="Print all employee schedule"
    clickable
    @click="generateDataDialog()"
  >
  </q-btn>

  <q-dialog v-model="dataDialog">
    <q-card
      :style="{
        width: $q.screen.lt.sm ? '350px' : $q.screen.lt.md ? '450px' : '500px',
        'min-height': $q.screen.lt.sm
          ? '100px'
          : $q.screen.lt.md
          ? '100px'
          : '100px',
      }"
    >
      <q-card-section class="bg-primary row items-center q-pb-md">
        <div class="text-h6 text-white">Select date</div>
        <q-space></q-space>
        <q-btn
          class="bg-white"
          icon="close"
          push
          round
          dense
          v-close-popup
          @click="closeDateDate"
        ></q-btn>
      </q-card-section>

      <q-card-section class="text-subtitle2">
        <div style="display: flex; justify-content: center; gap: 10px">
          <q-input
            class="bg-grey-3"
            filled
            v-model="dateFrom"
            label="Date From"
            @click="showPopup('dateFromPopup')"
            style="margin-bottom: 5px"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="dateFromPopup" :breakpoint="1440" cover>
                  <div class="q-date-container">
                    <q-date v-model="dateFrom" mask="MM/DD/YYYY"></q-date>
                    <q-btn
                      push
                      icon="close"
                      @click="hidePopup('dateFromPopup')"
                      class="bg-white absolute-top-right"
                      round
                      padding="xs"
                      style="margin: 10px"
                    ></q-btn>
                  </div>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            class="bg-grey-3"
            filled
            v-model="dateTo"
            label="Date To"
            @click="showPopup('dateToPopup')"
            style="margin-bottom: 5px"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="dateToPopup" :breakpoint="1440" cover>
                  <div class="q-date-container">
                    <q-date v-model="dateTo" mask="MM/DD/YYYY"></q-date>
                    <q-btn
                      push
                      icon="close"
                      @click="hidePopup('dateToPopup')"
                      class="bg-white absolute-top-right"
                      round
                      padding="xs"
                      style="margin: 10px"
                    ></q-btn>
                  </div>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div
          class="q-pt-md text-center"
          style="display: flex; justify-content: center; gap: 10px"
        >
          <q-btn
            push
            color="primary"
            class="q-mr-xs"
            @click="getDtr"
            label="Submit"
          />
          <q-btn
            push
            color="red"
            class="q-ml-xs"
            @click="dataDialog = false"
            label="Cancel"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="iframeDia" maximized>
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
          PDF File Schedule of {{ selectedDepartment }} - ({{
            selectedDeptCode
          }})
        </div>
        <q-space></q-space>
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
      ></iframe>
    </q-card>
  </q-dialog>
</template>
<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "../store/helpers/PdfMakeVfsFonts";
import { QSpinnerIos } from "quasar";
import helperMethods from "src/helperMethods";
import { mapGetters } from "vuex";

pdfMake.vfs = pdfFonts;

export default {
  data() {
    return {
      dialogVisible: false,
      pdfUrl: "",
      selectedDeptCode: null,
      dataDialog: false,
      selectedYear: [],
      selectedMonth: [],
      yearOptions: [],
      months: [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
      ],
      dateFrom: null,
      dateTo: null,
      dtrData: [],
      iframeDia: false,
      selectedDepartment: null,
      selectedDeptCode: null,
    };
  },

  props: {
    entry: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters({
      dtrGetter: "dutyRosterModule/getEmployeeDtr",
      imageLogo: "leaveModule/base64Image",
    }),
  },

  methods: {
    async generateDataDialog() {
      const { entry } = this;

      this.selectedDeptCode = entry.deptCode;
      this.dataDialog = true;
    },

    generateYearOptions() {
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 30;
      const endYear = currentYear;
      const yearOptions = [];

      for (let year = endYear; year >= startYear; year--) {
        yearOptions.push({ label: year.toString(), value: year });
      }

      return yearOptions;
    },

    closeDateDate() {
      this.selectedMonth = null;
      this.selectedYear = null;
      this.selectedDepartment = null;
      this.selectedDeptCode = null;
    },

    async getDtr() {
      if (!this.dateFrom || !this.dateTo) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Please select from and to date",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }
      const data = {
        dateFrom: this.formatDate(this.dateFrom),
        dateTo: this.formatDate(this.dateTo),
        deptCode: this.selectedDeptCode,
      };

      try {
        this.$q.loading.show({
          spinner: QSpinnerIos,
          message: "Fetching Daily Time Record Request",
          messageColor: "primary",
          backgroundColor: "grey-1",
          spinnerColor: "primary",
          customClass: "custom-loading-style",
          spinnerSize: "7em",
        });

        await helperMethods.delay(500);
        await this.$store.dispatch("dutyRosterModule/getEmployeeDtr", data);
        this.dtrData = this.dtrGetter;
        this.selectedDepartment = this.dtrData[0].department;
        this.selectedDeptCode = this.dtrData[0].deptCode;
        this.$q.loading.hide();
        this.generatePdf(this.dtrData);
      } catch (error) {
        console.error(error);
      }
    },

    async generatePdf(data) {
      const groupedData = data.reduce((acc, row) => {
        const { code, name, transDateFormat, ...rest } = row;
        if (!acc[code]) {
          acc[code] = { code, name, rows: [], dates: [] };
        }
        if (!acc[code].dates.includes(transDateFormat)) {
          acc[code].dates.push(transDateFormat);
        }
        acc[code].rows.push({ ...rest, transDateFormat });
        return acc;
      }, {});

      const allDates = Array.from(
        new Set(data.map((row) => row.transDateFormat)),
      ).sort();
      const tableHeader = [
        { text: "Code", bold: true },
        { text: "Name", bold: true },
        ...allDates.map((date) => ({ text: date || "", bold: true })),
      ];

      const tableBody = Object.values(groupedData).map((entry) => {
        const rowData = [entry.code, entry.name];
        allDates.forEach((date) => {
          const rowForDate = entry.rows.find(
            (row) => row.transDateFormat === date,
          );
          rowData.push(rowForDate ? rowForDate.schedule : "");
        });
        return rowData;
      });

      tableBody.forEach((row) => {
        while (row.length < tableHeader.length) {
          row.push("");
        }
      });

      const pageWidth = 8.5 * 72;
      const totalPageHeight = 11.69 * 72;
      const margins = 10;
      const numOfDates = allDates.length;

      const fixedCodeWidth = 5;
      const fixedNameWidth = 8;
      const totalWidth = pageWidth - margins * 2;
      const dynamicWidth = totalWidth - fixedCodeWidth - fixedNameWidth;
      let fontSize = Math.max(6, Math.min(10, 100 / numOfDates));
      const headerFont = 10;

      // const docDefinition = {
      //   pageSize: {
      //     width: pageWidth,
      //     height: totalPageHeight,
      //   },
      //   pageMargins: [margins, 0, margins, 0],
      //   background: [
      //     {
      //       image: this.imageLogo,
      //       width: 350,
      //       height: 250,
      //       alignment: "center",
      //       absolutePosition: { x: 0, y: (totalPageHeight - 306) / 2 },
      //     },
      //   ],
      //   content: [
      //     {
      //       text: "\n\nUNIVERSITY OF THE EAST\nRAMON MAGSAYSAY MEMORIAL MEDICAL CENTER, INC.\n64 Aurora Boulevard, Barangay Doña Imelda, Quezon City, 1113 Philippines\nTel.# 718 0861",
      //       style: "header",
      //     },
      //     {
      //       text: `\nSchedule of Department: ${this.selectedDepartment} - (${this.selectedDeptCode}) \n `,
      //       alignment: "left",
      //     },
      //     {
      //       table: {
      //         headerRows: 1,
      //         widths: [
      //           `${fixedCodeWidth}%`,
      //           `${fixedNameWidth}%`,
      //           ...Array(numOfDates).fill(
      //             `${(100 - fixedCodeWidth - fixedNameWidth) / numOfDates}%`,
      //           ),
      //         ],
      //         body: [
      //           tableHeader.map((col) => ({
      //             ...col,
      //             fontSize: fontSize,
      //             alignment: "center",
      //             margin: [0, 0],
      //           })),
      //           ...tableBody.map((row) =>
      //             row.map((cell) => ({
      //               text: cell,
      //               fontSize: fontSize,
      //               alignment: "center",
      //               margin: [0, 0],
      //               noWrap: false,
      //               wordWrap: "break-word",
      //             })),
      //           ),
      //         ],
      //       },
      //       layout: {
      //         fillColor: function (rowIndex, node, columnIndex) {
      //           return rowIndex === 0 ? "#CCCCCC" : null;
      //         },
      //         hLineColor: function (i) {
      //           return "#000000";
      //         },
      //         vLineColor: function (i) {
      //           return "#000000";
      //         },
      //         hLineWidth: function (i) {
      //           return 0.5;
      //         },
      //         vLineWidth: function (i) {
      //           return 0.5;
      //         },
      //         paddingLeft: function (i) {
      //           return 10;
      //         },
      //         paddingRight: function (i) {
      //           return 10;
      //         },
      //         paddingTop: function (i) {
      //           return 5;
      //         },
      //         paddingBottom: function (i) {
      //           return 5;
      //         },
      //       },
      //     },
      //   ],
      //   styles: {
      //     header: {
      //       fontSize: headerFont,
      //       bold: true,
      //       alignment: "center",
      //       margin: [0, 0, 0, 10],
      //     },
      //   },
      // };

      const today = new Date();
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = today.toLocaleDateString("en-US", options);

      const docDefinition = {
        pageSize: {
          width: pageWidth,
          height: totalPageHeight,
        },
        pageMargins: [margins, 0, margins, 0],
        background: [
          {
            image: this.imageLogo,
            width: 350,
            height: 250,
            alignment: "center",
            absolutePosition: { x: 0, y: (totalPageHeight - 306) / 2 },
          },
        ],
        content: [
          {
            text: "\n\nUNIVERSITY OF THE EAST\nRAMON MAGSAYSAY MEMORIAL MEDICAL CENTER, INC.\n64 Aurora Boulevard, Barangay Doña Imelda, Quezon City, 1113 Philippines\nTel.# 718 0861",
            style: "header",
          },
          {
            text: `\nSchedule of Department: ${this.selectedDepartment} - (${this.selectedDeptCode}) \n `,
            alignment: "left",
          },
          {
            table: {
              headerRows: 1,
              widths: [
                `${fixedCodeWidth}%`,
                `${fixedNameWidth}%`,
                ...Array(numOfDates).fill(
                  `${(100 - fixedCodeWidth - fixedNameWidth) / numOfDates}%`,
                ),
              ],
              body: [
                tableHeader.map((col) => ({
                  ...col,
                  fontSize: fontSize,
                  alignment: "center",
                  margin: [0, 0],
                })),
                ...tableBody.map((row) =>
                  row.map((cell) => ({
                    text: cell,
                    fontSize: fontSize,
                    alignment: "center",
                    margin: [0, 0],
                    noWrap: false,
                    wordWrap: "break-word",
                  })),
                ),
              ],
            },
            layout: {
              fillColor: function (rowIndex) {
                return rowIndex === 0 ? "#CCCCCC" : null;
              },
              hLineColor: function () {
                return "#000000";
              },
              vLineColor: function () {
                return "#000000";
              },
              hLineWidth: function () {
                return 0.5;
              },
              vLineWidth: function () {
                return 0.5;
              },
              paddingLeft: function () {
                return 10;
              },
              paddingRight: function () {
                return 10;
              },
              paddingTop: function () {
                return 5;
              },
              paddingBottom: function () {
                return 5;
              },
            },
          },

          // 🔹 Add Space Below Table
          { text: "\n\n\n\n\n\n", fontSize: 12 },

          // 🔹 Prepared By & Approved By Section
          {
            columns: [
              { width: "*", text: "" }, // Empty space to center
              {
                stack: [
                  {
                    canvas: [
                      {
                        type: "line",
                        x1: 0,
                        y1: 0,
                        x2: 150,
                        y2: 0,
                        lineWidth: 1,
                      },
                    ],
                  }, // Line
                  {
                    text: "Prepared By",
                    alignment: "center",
                    margin: [0, 5, 0, 0],
                    fontSize: 10,
                  },
                  {
                    text: `(${formattedDate})`,
                    alignment: "center",
                    fontSize: 8,
                    italics: true,
                    margin: [0, 2, 0, 0],
                  },
                ],
              },
              { width: 50, text: "" },
              {
                stack: [
                  {
                    canvas: [
                      {
                        type: "line",
                        x1: 0,
                        y1: 0,
                        x2: 150,
                        y2: 0,
                        lineWidth: 1,
                      },
                    ],
                  }, // Line
                  {
                    text: "Approved By",
                    alignment: "center",
                    margin: [0, 5, 0, 0],
                    fontSize: 10,
                  },
                ],
              },
              { width: "*", text: "" },
            ],
          },
        ],
        styles: {
          header: {
            fontSize: headerFont,
            bold: true,
            alignment: "center",
            margin: [0, 0, 0, 10],
          },
        },
      };

      pdfMake.createPdf(docDefinition).getBlob((blob) => {
        this.pdfUrl = URL.createObjectURL(blob);
        this.iframeDia = true;
      });
    },

    showPopup(refName) {
      this.$refs[refName].show();
    },

    hidePopup(refName) {
      this.$refs[refName].hide();
    },

    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },

  mounted() {
    this.yearOptions = this.generateYearOptions();
  },
};
</script>
