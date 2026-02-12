// src/utils/pdfGenerators.js or src/workers/pdfGenerators.js
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

// PDF Configuration
const pdfConfig = {
  pageSize: "LEGAL",
  pageOrientation: "portrait",
  pageMargins: [15, 15, 15, 15],

  columnWidths: {
    code: 25,
    name: 100,
    auto: "*",
  },

  fontSize: {
    title: 13,
    tableHeader: 6,
    tableCell: 6,
    employeeName: 6,
    department: 5,
    note: 6,
  },

  spacing: {
    titleMargin: [0, 0, 0, 8],
    cellPadding: {
      left: 1,
      right: 1,
      top: 1.5,
      bottom: 1.5,
    },
    employeeNameMargin: [0, 1, 0, 1],
  },

  border: {
    lineWidth: 0.2,
    color: "#000",
  },

  colors: {
    departmentText: "#666666",
    noteBackground: "#f5f5f5",
  },
};

const stackedColumnMapping = {
  "Absences Days": { field: "rawAbsences", label: "Raw Absences" },
  "Absences Hours": { field: "rawAbsencesHours", label: "Raw Absences Hours" },
  Late: { field: "rawLates", label: "Raw Lates" },
  Undertime: { field: "rawUndertime", label: "Raw Undertime" },
  "OT 35": { field: "rawOT35", label: "Raw OT 35" },
  "OT 100": { field: "rawOT100", label: "Raw OT 100" },
  "OT 130": { field: "rawOT130", label: "Raw OT 130" },
  "OT 135": { field: "rawOT135", label: "Raw OT 135" },
  "Diff NP": { field: "rawDiffAM", label: "Raw Diff NP" },
  "Diff PM": { field: "rawDiffPM", label: "Raw Diff PM" },
};

// Filter columns based on report type
const getFilteredColumns = (columns, typeReport) => {
  let cols = columns;

  if (typeReport === "tally") {
    cols = cols.filter((col) => !col.name.startsWith("Raw "));
  }

  return cols.filter((col) => col.name !== "Note");
};

// Generate column widths
const generateColumnWidths = (columns, typeReport) => {
  const finalColumns =
    typeReport === "dailyTimeRecord"
      ? columns.filter((col) => col.name !== "Note")
      : getFilteredColumns(columns, typeReport);

  const columnCount = finalColumns.length;
  const totalWidth = 555; // Changed from 523 to 555

  const codeWidth = 25;
  const nameWidth = typeReport === "dailyTimeRecord" ? 82 : 100;
  const otDates = typeReport === "unpaidOvertime" ? 72 : 100;

  const fixedWidth = codeWidth + nameWidth;
  const remainingColumns = columnCount - 2;
  const remainingWidth = totalWidth - fixedWidth;

  return finalColumns.map((col) => {
    if (col.name === "Code" || col.name === "EmployeeCode") return codeWidth;
    if (col.name === "Name" || col.name === "EmployeeName") return nameWidth;
    if (col.name === "Overtime Dates") return otDates;
    if (typeReport === "tally" && stackedColumnMapping[col.name]) {
      return Math.floor(remainingWidth / remainingColumns);
    }
    return Math.floor(remainingWidth / remainingColumns);
  });
};

// Build table header
const buildTableHeader = (columns, typeReport) => {
  const finalColumns =
    typeReport === "dailyTimeRecord"
      ? columns.filter((col) => col.name !== "Note")
      : getFilteredColumns(columns, typeReport);

  return finalColumns.map((col) => {
    if (typeReport === "tally" && stackedColumnMapping[col.name]) {
      return {
        stack: [
          { text: col.label, style: "tableHeader", alignment: "center" },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 2,
                x2: 35,
                y2: 2,
                lineWidth: 1,
              },
            ],
          },
          {
            text: "Raw " + col.label,
            style: "tableHeader",
            alignment: "center",
            margin: [0, 2, 0, 0],
          },
        ],
        bold: true,
        lineHeight: 0.9,
      };
    }

    return {
      text: col.label,
      style: "tableHeader",
      alignment: "center",
      bold: true,
      lineHeight: 1,
    };
  });
};

// Build table body
const buildTableBody = (columns, items, typeReport, leaveTypes) => {
  const finalColumns =
    typeReport === "dailyTimeRecord"
      ? columns.filter((col) => col.name !== "Note")
      : getFilteredColumns(columns, typeReport);

  const rows = [];

  for (const row of items) {
    const dataRow = finalColumns.map((col) => {
      // Handle Name column
      if (col.name === "Name" || col.name === "EmployeeName") {
        return {
          stack: [
            {
              text:
                typeReport === "dailyTimeRecord" ? row.name : row.employeeName,
              style: "employeeName",
            },
            { text: row.department, style: "departmentName" },
          ],
          alignment: "center",
          margin: pdfConfig.spacing.employeeNameMargin,
        };
      }

      // Handle stacked columns for tally report
      if (typeReport === "tally" && stackedColumnMapping[col.name]) {
        const rawFieldConfig = stackedColumnMapping[col.name];
        const rawFieldName = rawFieldConfig.field;

        const stackContent = [
          {
            text: row[col.field],
            style: "tableCell",
            margin: [0, 0, 0, 0],
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 2,
                x2: 35,
                y2: 2,
                lineWidth: 1,
              },
            ],
          },
          {
            text: row[rawFieldName] ?? 0,
            style: "tableCell",
            alignment: "center",
            margin: [0, 2, 0, 0],
          },
        ];

        return {
          stack: stackContent,
          alignment: "center",
        };
      }

      // Handle Calendar column for dailyTimeRecord
      if (col.name === "Calendar" && typeReport === "dailyTimeRecord") {
        const calendarValue =
          row.onLeave === true
            ? leaveTypes
                ?.find((leave) => leave.value === row.leaveType)
                ?.label?.toUpperCase() || row.calendar
            : row.absent === true && new Date(row.transDate) < new Date()
            ? "ABSENT"
            : row.calendar;

        return {
          text: calendarValue || "-",
          alignment: "center",
          style: "tableCell",
        };
      }

      // Handle Schedule column for dailyTimeRecord
      if (col.name === "Schedule" && typeReport === "dailyTimeRecord") {
        const scheduleValue =
          row.onLeave === true ? "ON LEAVE" : row[col.field];

        return {
          text: scheduleValue || "-",
          alignment: "center",
          style: "tableCell",
        };
      }

      // Default cell rendering
      return {
        text: row[col.field] || "-",
        alignment: "center",
        style: "tableCell",
      };
    });

    rows.push(dataRow);

    // Add note row if exists
    if (row.note && row.note.trim() !== "") {
      rows.push([
        {
          text: `NOTE: ${row.note}`,
          colSpan: finalColumns.length,
          alignment: "left",
          style: "noteCell",
          fillColor: pdfConfig.colors.noteBackground,
          margin: [3, 2, 3, 2],
        },
        ...Array(finalColumns.length - 1).fill({}),
      ]);
    }
  }

  return rows;
};

// Get table layout
const getTableLayout = () => {
  const { border, spacing } = pdfConfig;
  return {
    hLineWidth: () => border.lineWidth,
    vLineWidth: () => border.lineWidth,
    hLineColor: () => border.color,
    vLineColor: () => border.color,
    paddingLeft: () => spacing.cellPadding.left,
    paddingRight: () => spacing.cellPadding.right,
    paddingTop: () => spacing.cellPadding.top,
    paddingBottom: () => spacing.cellPadding.bottom,
    hLineHeight: (i, node) => {
      if (i === 0 || i === 1) {
        return 1;
      }
      return 1;
    },
    paddingTop: (i) => {
      if (i === 0) return 10;
      return spacing.cellPadding.top;
    },
    paddingBottom: (i) => {
      if (i === 0) return 10;
      return spacing.cellPadding.bottom;
    },
  };
};

// Get PDF styles
const getPDFStyles = () => {
  const { fontSize, colors } = pdfConfig;
  return {
    header: {
      fontSize: fontSize.title,
      bold: true,
    },
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
    tableHeader: {
      fontSize: fontSize.tableHeader,
      bold: true,
    },
    tableCell: {
      fontSize: fontSize.tableCell,
    },
    employeeName: {
      fontSize: fontSize.employeeName,
      bold: true,
      margin: [0, 0, 0, 0.5],
    },
    departmentName: {
      fontSize: fontSize.department,
      color: colors.departmentText,
      margin: [0, 0, 0, 0],
    },
    noteCell: {
      fontSize: fontSize.note,
      italics: true,
      bold: true,
      color: "#333333",
    },
  };
};

// Get filename based on report type
const getFileName = (typeReport) => {
  switch (typeReport) {
    case "dailyTimeRecord":
      return "Daily Time Record.pdf";
    case "tally":
      return "Time Data Tally Report.pdf";
    case "unpaidOvertime":
      return "Unpaid Overtime Report.pdf";
    case "print":
      return "Time Data Report.pdf";
    default:
      return "Time Data.pdf";
  }
};

// Main PDF generation function
export const generateDTRPdf = (data, typeReport) => {
  return new Promise((resolve, reject) => {
    try {
      const {
        columns,
        items,
        payrollPeriod,
        classDescription,
        leaveTypes,
        base64Image,
      } = data;

      // Use passed typeReport parameter if data.typeReport is undefined
      const reportType = data.typeReport || typeReport;

      const tableBody = [
        buildTableHeader(columns, reportType),
        ...buildTableBody(columns, items, reportType, leaveTypes),
      ];
      const columnWidths = generateColumnWidths(columns, reportType);
      const totalPageHeight = 14 * 72; // LEGAL height

      // Determine content columns based on report type
      let contentColumns;
      if (reportType !== "dailyTimeRecord") {
        contentColumns = [
          {
            text: `${
              !classDescription ? "All Employee Class" : classDescription
            }`,
            style: "headerSubtitle",
            alignment: "left",
            width: "50%",
          },
          {
            text: `${
              reportType === "unpaidOvertime"
                ? payrollPeriod
                : "Payroll Cut Off: " + payrollPeriod
            }`,
            style: "headerSubtitle",
            alignment: "right",
            width: "50%",
          },
        ];
      } else {
        contentColumns = [
          {
            text: `DAILY TIME RECORD of ${items[0].name} [${items[0].code}]`,
            style: "headerSubtitle",
            alignment: "left",
            width: "50%",
          },
        ];
      }

      const docDefinition = {
        pageMargins: [15, 80, 15, 30],
        pageSize: pdfConfig.pageSize,
        pageOrientation: pdfConfig.pageOrientation,

        header: {
          stack: [
            {
              text: "UNIVERSITY OF THE EAST",
              style: "headerTitle",
              alignment: "center",
              margin: [0, 15, 0, 2],
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
          ],
        },

        background: () => {
          if (base64Image) {
            return {
              image: base64Image,
              opacity: 1,
              width: 350,
              height: 250,
              alignment: "center",
              absolutePosition: {
                x: (367 - 350) / 2,
                y: (totalPageHeight - 306) / 2,
              },
            };
          }
          return null;
        },

        footer: (currentPage, pageCount) => {
          return {
            text: `\nPage ${currentPage} of ${pageCount}`,
            alignment: "right",
            fontSize: 8,
            margin: [0, 0, 10, 5],
            color: "#666666",
          };
        },

        content: [
          {
            columns: contentColumns,
            margin: [0, 15, 0, 5],
          },
          {
            table: {
              headerRows: 1,
              widths: columnWidths,
              body: tableBody,
              dontBreakRows: true,
              keepWithHeaderRows: 1,
            },
            layout: getTableLayout(),
          },
        ],
        styles: getPDFStyles(),
        defaultStyle: {
          alignment: "center",
        },
      };

      const pdfDocGenerator = pdfMake.createPdf(docDefinition);

      // Generate blob and convert to base64
      pdfDocGenerator.getBlob((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            pdfData: reader.result,
            fileName: getFileName(reportType),
          });
        };
        reader.onerror = () => {
          reject(new Error("Failed to read PDF blob"));
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      reject(error);
    }
  });
};
