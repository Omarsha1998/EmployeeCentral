// importScripts("/excel.js");

// self.onmessage = async (event) => {
//   const { data, module, headers } = event.data;

//   console.log(data, module);

//   console.log(module);

//   let result;
//   try {
//     if (module === "dtr") {
//       result = await generateEmployeeDtr(data, headers);
//       self.postMessage({ success: true, result });
//       return;
//     } else if (module === "hierarchy") {
//       result = await generateHierarchyExcel(data);
//       self.postMessage({ success: true, result });
//     } else {
//       result = await generateUnpaidOvertimeExcel(data);
//       self.postMessage({ success: true, result });
//     }
//   } catch (error) {
//     self.postMessage({ success: false, error: error.message });
//   }
// };

// const generateHierarchyExcel = async (data) => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Organizational Tree");

//   // Define headers based on hierarchy levels
//   const headers = [
//     "Department Code",
//     "Department Name",
//     "Level",
//     "Corporate Officer 1",
//     "Corporate Officer 2",
//     "Division 1",
//     "Division 2",
//     "Group",
//     "Department",
//     "Section",
//     "Area of Assignment",
//   ];

//   // Level mapping
//   const levelMap = {
//     1: "Corporate Officer 1",
//     2: "Corporate Officer 2",
//     3: "Division 1",
//     4: "Division 2",
//     5: "Group",
//     6: "Department",
//     7: "Section",
//     8: "Area",
//   };

//   const headerRow = worksheet.addRow(headers);

//   // Style header row
//   for (const cell of headerRow._cells) {
//     if (cell) {
//       cell.font = { bold: true, color: { argb: "FFFFFF" } };
//       cell.alignment = { horizontal: "center", vertical: "middle" };
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "1976D2" },
//       };
//       cell.border = {
//         top: { style: "thin", color: { argb: "000000" } },
//         left: { style: "thin", color: { argb: "000000" } },
//         bottom: { style: "thin", color: { argb: "000000" } },
//         right: { style: "thin", color: { argb: "000000" } },
//       };
//     }
//   }

//   let columnWidths = headers.map((header) => header.length);

//   // Create a map for quick lookup of items by code
//   const dataMap = {};
//   for (const item of data) {
//     dataMap[item.code] = item;
//   }

//   // Helper function to recursively get all parents and their levels
//   const getParentChain = (item) => {
//     const chain = {};

//     // Recursively traverse up the parent chain
//     const traverseParents = (currentItem) => {
//       if (!currentItem || !currentItem.parent) {
//         return;
//       }

//       const parentCode = currentItem.parent;
//       const parentItem = dataMap[parentCode];

//       if (parentItem) {
//         // Add parent to chain based on ITS level
//         if (parentItem.level >= 1 && parentItem.level <= 8) {
//           chain[parentItem.level] = {
//             code: parentCode,
//             description: parentItem.description || parentItem.name || "",
//           };
//         }

//         // Continue traversing up
//         traverseParents(parentItem);
//       }
//     };

//     traverseParents(item);
//     return chain;
//   };

//   // Process each item in the data
//   for (const item of data) {
//     // Determine the level name
//     const levelName = item.level ? levelMap[item.level] || "" : "";

//     const rowData = [
//       item.code || "",
//       item.description || item.name || "",
//       levelName,
//       "", // Corporate Officer 1
//       "", // Corporate Officer 2
//       "", // Division 1
//       "", // Division 2
//       "", // Group
//       "", // Department
//       "", // Section
//       "", // Area of Assignment
//     ];

//     // Get the complete parent chain
//     const parentChain = getParentChain(item);

//     // Fill in the hierarchy from parent chain
//     // Column indices: 3=CO1, 4=CO2, 5=D1, 6=D2, 7=Group, 8=Dept, 9=Section, 10=Area
//     for (let level = 1; level <= 8; level++) {
//       if (parentChain[level]) {
//         const columnIndex = 2 + level; // 3, 4, 5, 6, 7, 8, 9, 10
//         rowData[columnIndex] = parentChain[level].description;
//       }
//     }

//     // Add the item itself in its own level column
//     if (item.level >= 1 && item.level <= 8) {
//       const columnIndex = 2 + item.level;
//       rowData[columnIndex] = item.description || item.name || "";
//     }

//     const row = worksheet.addRow(rowData);

//     // Style data rows with alternating colors
//     const rowIndex = row.number;
//     const isEvenRow = rowIndex % 2 === 0;

//     for (let i = 0; i < row._cells.length; i++) {
//       const cell = row._cells[i];
//       if (cell) {
//         cell.alignment = {
//           vertical: "middle",
//           horizontal: i === 0 || i === 1 ? "left" : "center",
//         };
//         cell.border = {
//           top: { style: "thin", color: { argb: "CCCCCC" } },
//           left: { style: "thin", color: { argb: "CCCCCC" } },
//           bottom: { style: "thin", color: { argb: "CCCCCC" } },
//           right: { style: "thin", color: { argb: "CCCCCC" } },
//         };

//         // Alternate row colors
//         if (isEvenRow) {
//           cell.fill = {
//             type: "pattern",
//             pattern: "solid",
//             fgColor: { argb: "F5F5F5" },
//           };
//         }

//         // Highlight all filled hierarchy columns (from index 3 to 10)
//         if (i >= 3 && i <= 10 && rowData[i] && rowData[i].trim() !== "") {
//           cell.fill = {
//             type: "pattern",
//             pattern: "solid",
//             fgColor: { argb: "E3F2FD" },
//           };
//           cell.font = { bold: true };
//         }
//       }
//     }

//     // Update column widths
//     for (let colIndex = 0; colIndex < rowData.length; colIndex++) {
//       const cellValue = rowData[colIndex] ? rowData[colIndex].toString() : "";
//       columnWidths[colIndex] = Math.max(
//         columnWidths[colIndex],
//         cellValue.length,
//       );
//     }
//   }

//   // Set column widths
//   for (let i = 0; i < columnWidths.length; i++) {
//     worksheet.getColumn(i + 1).width = Math.min(columnWidths[i] + 2, 50);
//   }

//   // Freeze header row
//   worksheet.views = [{ state: "frozen", ySplit: 1 }];

//   const blob = await workbook.xlsx.writeBuffer().then(
//     (data) =>
//       new Blob([data], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       }),
//   );

//   return blob;
// };

// const generateEmployeeDtr = async (data, headersItem) => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Employee DTR");

//   const headers = headersItem;

//   const headerRow = worksheet.addRow(headers);

//   for (const cell of headerRow._cells) {
//     if (cell) {
//       cell.font = { bold: true };
//       cell.alignment = { horizontal: "center" };
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "D9D9D9" },
//       };
//       cell.border = {
//         top: { style: "thin", color: { argb: "000000" } },
//         left: { style: "thin", color: { argb: "000000" } },
//         bottom: { style: "thin", color: { argb: "000000" } },
//         right: { style: "thin", color: { argb: "000000" } },
//       };
//     }
//   }

//   let columnWidths = [];
//   for (const header of headers) {
//     columnWidths.push(header.length);
//   }

//   for (const item of data) {
//     const rowData = [
//       item.name || "",
//       item.code || "",
//       item.dayOfWeek || "",
//       item.transDateFormat || "",
//       item.calendar || "",
//       item.schedule || "",
//       item.iN || "",
//       item.oUT || "",
//       item.oTTimeIN || "",
//       item.oTTimeOut || "",
//       item.late || "",
//       item.undertime || "",
//     ];

//     const row = worksheet.addRow(rowData);

//     for (const cell of row._cells) {
//       if (cell) {
//         cell.alignment = { vertical: "middle", horizontal: "center" };
//         cell.border = {
//           top: { style: "thin", color: { argb: "000000" } },
//           left: { style: "thin", color: { argb: "000000" } },
//           bottom: { style: "thin", color: { argb: "000000" } },
//           right: { style: "thin", color: { argb: "000000" } },
//         };
//       }
//     }

//     for (let colIndex = 0; colIndex < rowData.length; colIndex++) {
//       columnWidths[colIndex] = Math.max(
//         columnWidths[colIndex],
//         rowData[colIndex].length,
//       );
//     }
//   }

//   for (let i = 0; i < columnWidths.length; i++) {
//     worksheet.getColumn(i + 1).width = columnWidths[i] + 2;
//   }

//   const blob = await workbook.xlsx.writeBuffer().then(
//     (data) =>
//       new Blob([data], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       }),
//   );

//   return blob;
// };

// const generateUnpaidOvertimeExcel = async (data) => {
//   console.log(data);
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Unpaid Overtime");

//   // Define headers
//   const headers = [
//     "Employee Code",
//     "Employee Name",
//     "Employee Class",
//     "Position",
//     "Department",
//     "Department Code",
//     "Service Length",
//     "Dates",
//     "OT 30",
//     "OT 100",
//     "OT 130",
//     "OT 135",
//     "Total Overtime",
//   ];

//   const headerRow = worksheet.addRow(headers);

//   // Style header row
//   for (const cell of headerRow._cells) {
//     if (cell) {
//       cell.font = { bold: true, color: { argb: "FFFFFF" } };
//       cell.alignment = { horizontal: "center", vertical: "middle" };
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "4472C4" },
//       };
//       cell.border = {
//         top: { style: "thin", color: { argb: "000000" } },
//         left: { style: "thin", color: { argb: "000000" } },
//         bottom: { style: "thin", color: { argb: "000000" } },
//         right: { style: "thin", color: { argb: "000000" } },
//       };
//     }
//   }

//   let columnWidths = headers.map((header) => header.length);

//   // Process each item in the data
//   for (const item of data) {
//     const rowData = [
//       item.employeeCode || "",
//       item.employeeName || "",
//       item.employeeClass || "",
//       item.position || "",
//       item.department || "",
//       item.departmentCode || "",
//       item.serviceLength || "",
//       item.dates || "",
//       item["oT 30"] || 0,
//       item["oT 100"] || 0,
//       item["oT 130"] || 0,
//       item["oT 135"] || 0,
//       item.totalOvertime || 0,
//     ];

//     const row = worksheet.addRow(rowData);

//     // Style data rows
//     const rowIndex = row.number;
//     const isEvenRow = rowIndex % 2 === 0;

//     for (let i = 0; i < row._cells.length; i++) {
//       const cell = row._cells[i];
//       if (cell) {
//         cell.alignment = {
//           vertical: "middle",
//           horizontal: i >= 8 ? "right" : "left", // Right align numeric columns
//         };
//         cell.border = {
//           top: { style: "thin", color: { argb: "CCCCCC" } },
//           left: { style: "thin", color: { argb: "CCCCCC" } },
//           bottom: { style: "thin", color: { argb: "CCCCCC" } },
//           right: { style: "thin", color: { argb: "CCCCCC" } },
//         };

//         // Alternate row colors
//         if (isEvenRow) {
//           cell.fill = {
//             type: "pattern",
//             pattern: "solid",
//             fgColor: { argb: "F5F5F5" },
//           };
//         }

//         // Format numeric columns (OT columns and Total)
//         if (i >= 8 && i <= 12) {
//           cell.numFmt = "0.00"; // Two decimal places for overtime values

//           // Highlight Total Overtime column
//           if (i === 12) {
//             cell.font = { bold: true };
//             cell.fill = {
//               type: "pattern",
//               pattern: "solid",
//               fgColor: { argb: isEvenRow ? "E7E6E6" : "D9D9D9" },
//             };
//           }
//         }
//       }
//     }

//     // Update column widths
//     for (let colIndex = 0; colIndex < rowData.length; colIndex++) {
//       const cellValue = rowData[colIndex] ? rowData[colIndex].toString() : "";
//       columnWidths[colIndex] = Math.max(
//         columnWidths[colIndex],
//         cellValue.length,
//       );
//     }
//   }

//   // Set column widths
//   for (let i = 0; i < columnWidths.length; i++) {
//     worksheet.getColumn(i + 1).width = Math.min(columnWidths[i] + 2, 50);
//   }

//   // Freeze header row and first two columns (Employee Code and Name)
//   worksheet.views = [{ state: "frozen", ySplit: 1, xSplit: 2 }];

//   const blob = await workbook.xlsx.writeBuffer().then(
//     (data) =>
//       new Blob([data], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       }),
//   );

//   console.log(blob);

//   return blob;
// };

importScripts("/excel.js");

self.onmessage = async (event) => {
  const { data, module, headers } = event.data;

  let result;
  try {
    if (module === "dtr") {
      result = await generateEmployeeDtr(data, headers);
      self.postMessage({ success: true, result });
      return;
    } else if (module === "hierarchy") {
      result = await generateHierarchyExcel(data);
      self.postMessage({ success: true, result });
      return;
    } else if (module === "unpaidOvertime") {
      // Handle both data formats: direct array or nested in items
      const excelData = data.items || data;

      if (!excelData || excelData.length === 0) {
        throw new Error("No data to generate Excel");
      }

      result = await generateUnpaidOvertimeExcel(excelData);

      self.postMessage({ success: true, result });
      return;
    } else {
      throw new Error(`Unknown module: ${module}`);
    }
  } catch (error) {
    console.error("❌ WORKER ERROR:", error);
    console.error("Error stack:", error.stack);
    self.postMessage({ success: false, error: error.message });
  }
};

const generateHierarchyExcel = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Organizational Tree");

  // Define headers based on hierarchy levels
  const headers = [
    "Department Code",
    "Department Name",
    "Level",
    "Corporate Officer 1",
    "Corporate Officer 2",
    "Division 1",
    "Division 2",
    "Group",
    "Department",
    "Section",
    "Area of Assignment",
  ];

  // Level mapping
  const levelMap = {
    1: "Corporate Officer 1",
    2: "Corporate Officer 2",
    3: "Division 1",
    4: "Division 2",
    5: "Group",
    6: "Department",
    7: "Section",
    8: "Area",
  };

  const headerRow = worksheet.addRow(headers);

  // Style header row
  for (const cell of headerRow._cells) {
    if (cell) {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1976D2" },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    }
  }

  let columnWidths = headers.map((header) => header.length);

  // Create a map for quick lookup of items by code
  const dataMap = {};
  for (const item of data) {
    dataMap[item.code] = item;
  }

  // Helper function to recursively get all parents and their levels
  const getParentChain = (item) => {
    const chain = {};

    // Recursively traverse up the parent chain
    const traverseParents = (currentItem) => {
      if (!currentItem || !currentItem.parent) {
        return;
      }

      const parentCode = currentItem.parent;
      const parentItem = dataMap[parentCode];

      if (parentItem) {
        // Add parent to chain based on ITS level
        if (parentItem.level >= 1 && parentItem.level <= 8) {
          chain[parentItem.level] = {
            code: parentCode,
            description: parentItem.description || parentItem.name || "",
          };
        }

        // Continue traversing up
        traverseParents(parentItem);
      }
    };

    traverseParents(item);
    return chain;
  };

  // Process each item in the data
  for (const item of data) {
    // Determine the level name
    const levelName = item.level ? levelMap[item.level] || "" : "";

    const rowData = [
      item.code || "",
      item.description || item.name || "",
      levelName,
      "", // Corporate Officer 1
      "", // Corporate Officer 2
      "", // Division 1
      "", // Division 2
      "", // Group
      "", // Department
      "", // Section
      "", // Area of Assignment
    ];

    // Get the complete parent chain
    const parentChain = getParentChain(item);

    // Fill in the hierarchy from parent chain
    // Column indices: 3=CO1, 4=CO2, 5=D1, 6=D2, 7=Group, 8=Dept, 9=Section, 10=Area
    for (let level = 1; level <= 8; level++) {
      if (parentChain[level]) {
        const columnIndex = 2 + level; // 3, 4, 5, 6, 7, 8, 9, 10
        rowData[columnIndex] = parentChain[level].description;
      }
    }

    // Add the item itself in its own level column
    if (item.level >= 1 && item.level <= 8) {
      const columnIndex = 2 + item.level;
      rowData[columnIndex] = item.description || item.name || "";
    }

    const row = worksheet.addRow(rowData);

    // Style data rows with alternating colors
    const rowIndex = row.number;
    const isEvenRow = rowIndex % 2 === 0;

    for (let i = 0; i < row._cells.length; i++) {
      const cell = row._cells[i];
      if (cell) {
        cell.alignment = {
          vertical: "middle",
          horizontal: i === 0 || i === 1 ? "left" : "center",
        };
        cell.border = {
          top: { style: "thin", color: { argb: "CCCCCC" } },
          left: { style: "thin", color: { argb: "CCCCCC" } },
          bottom: { style: "thin", color: { argb: "CCCCCC" } },
          right: { style: "thin", color: { argb: "CCCCCC" } },
        };

        // Alternate row colors
        if (isEvenRow) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F5F5F5" },
          };
        }

        // Highlight all filled hierarchy columns (from index 3 to 10)
        if (i >= 3 && i <= 10 && rowData[i] && rowData[i].trim() !== "") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E3F2FD" },
          };
          cell.font = { bold: true };
        }
      }
    }

    // Update column widths
    for (let colIndex = 0; colIndex < rowData.length; colIndex++) {
      const cellValue = rowData[colIndex] ? rowData[colIndex].toString() : "";
      columnWidths[colIndex] = Math.max(
        columnWidths[colIndex],
        cellValue.length,
      );
    }
  }

  // Set column widths
  for (let i = 0; i < columnWidths.length; i++) {
    worksheet.getColumn(i + 1).width = Math.min(columnWidths[i] + 2, 50);
  }

  // Freeze header row
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  const blob = await workbook.xlsx.writeBuffer().then(
    (data) =>
      new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
  );

  return blob;
};

const generateEmployeeDtr = async (data, headersItem) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Employee DTR");

  const headers = headersItem;

  const headerRow = worksheet.addRow(headers);

  for (const cell of headerRow._cells) {
    if (cell) {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9D9D9" },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    }
  }

  let columnWidths = [];
  for (const header of headers) {
    columnWidths.push(header.length);
  }

  for (const item of data) {
    const rowData = [
      item.name || "",
      item.code || "",
      item.dayOfWeek || "",
      item.transDateFormat || "",
      item.calendar || "",
      item.schedule || "",
      item.iN || "",
      item.oUT || "",
      item.oTTimeIN || "",
      item.oTTimeOut || "",
      item.late || "",
      item.undertime || "",
    ];

    const row = worksheet.addRow(rowData);

    for (const cell of row._cells) {
      if (cell) {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
      }
    }

    for (let colIndex = 0; colIndex < rowData.length; colIndex++) {
      columnWidths[colIndex] = Math.max(
        columnWidths[colIndex],
        rowData[colIndex].length,
      );
    }
  }

  for (let i = 0; i < columnWidths.length; i++) {
    worksheet.getColumn(i + 1).width = columnWidths[i] + 2;
  }

  const blob = await workbook.xlsx.writeBuffer().then(
    (data) =>
      new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
  );

  return blob;
};

const generateUnpaidOvertimeExcel = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Unpaid Overtime");

  // Define headers
  const headers = [
    "Employee Code",
    "Employee Name",
    "Employee Class",
    "Position",
    "Department",
    "Department Code",
    "Service Length",
    "Dates",
    "OT 30",
    "OT 100",
    "OT 130",
    "OT 135",
    "Total Overtime",
  ];

  const headerRow = worksheet.addRow(headers);

  // Style header row
  for (const cell of headerRow._cells) {
    if (cell) {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4472C4" },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    }
  }

  let columnWidths = headers.map((header) => header.length);

  // Process each item in the data
  let rowCount = 0;
  for (const item of data) {
    const rowData = [
      item.employeeCode || "",
      item.employeeName || "",
      item.employeeClass || "",
      item.position || "",
      item.department || "",
      item.departmentCode || "",
      item.serviceLength || "",
      item.dates || "",
      item["oT 30"] || 0,
      item["oT 100"] || 0,
      item["oT 130"] || 0,
      item["oT 135"] || 0,
      item.totalOvertime || 0,
    ];

    const row = worksheet.addRow(rowData);

    // Style data rows
    const rowIndex = row.number;
    const isEvenRow = rowIndex % 2 === 0;

    for (let i = 0; i < row._cells.length; i++) {
      const cell = row._cells[i];
      if (cell) {
        cell.alignment = {
          vertical: "middle",
          horizontal: i >= 8 ? "right" : "left", // Right align numeric columns
        };
        cell.border = {
          top: { style: "thin", color: { argb: "CCCCCC" } },
          left: { style: "thin", color: { argb: "CCCCCC" } },
          bottom: { style: "thin", color: { argb: "CCCCCC" } },
          right: { style: "thin", color: { argb: "CCCCCC" } },
        };

        // Alternate row colors
        if (isEvenRow) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F5F5F5" },
          };
        }

        // Format numeric columns (OT columns and Total)
        if (i >= 8 && i <= 12) {
          cell.numFmt = "0.00"; // Two decimal places for overtime values

          // Highlight Total Overtime column
          if (i === 12) {
            cell.font = { bold: true };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: isEvenRow ? "E7E6E6" : "D9D9D9" },
            };
          }
        }
      }
    }

    // Update column widths
    for (let colIndex = 0; colIndex < rowData.length; colIndex++) {
      const cellValue = rowData[colIndex] ? rowData[colIndex].toString() : "";
      columnWidths[colIndex] = Math.max(
        columnWidths[colIndex],
        cellValue.length,
      );
    }

    rowCount++;
  }

  for (let i = 0; i < columnWidths.length; i++) {
    worksheet.getColumn(i + 1).width = Math.min(columnWidths[i] + 2, 50);
  }

  worksheet.views = [{ state: "frozen", ySplit: 1, xSplit: 2 }];

  const blob = await workbook.xlsx.writeBuffer().then(
    (data) =>
      new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
  );

  return blob;
};
