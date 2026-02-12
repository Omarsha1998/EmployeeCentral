// generateExcel.js
// importScripts("/excel.js");

const generateExcel = async (data) => {
  console.log("Generating Excel with data:", data);

  try {
    const XLSX = self.XLSX;

    if (!XLSX) {
      throw new Error(
        "XLSX library not loaded. Make sure /excel.js exists in public folder.",
      );
    }

    const worksheetData = data.map((item) => ({
      EmployeeCode: item.employeeCode || "",
      EmployeeName: item.employeeName || "",
      EmployeeClass: item.employeeClass || "",
      Position: item.position || "",
      Department: item.department || "",
      DepartmentCode: item.departmentCode || "",
      ServiceLengths: item.serviceLength || "",
      Dates: item.dates || "",
      "OT 30": item["oT 30"] || 0,
      "OT 100": item["oT 100"] || 0,
      "OT 130": item["oT 130"] || 0,
      "OT 135": item["oT 135"] || 0,
      TotalOvertime: item.totalOvertime || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 15 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Unpaid Overtime Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return blob;
  } catch (error) {
    console.error("Error generating Excel:", error);
    throw new Error(`Excel generation failed: ${error.message}`);
  }
};
