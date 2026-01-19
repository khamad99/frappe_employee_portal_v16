const ExcelJS = require('exceljs');
const XLSX = require('xlsx');

async function testDate() {
	console.log("--- Generating Excel with Date: 2025-01-15 ---");
	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet('Expenses');

	sheet.addTable({
		name: 'ExpensesTable',
		ref: 'A1',
		headerRow: true,
		totalsRow: false,
		style: { theme: 'TableStyleLight9', showRowStripes: true },
		columns: [{ name: 'Date' }],
		rows: [
			[new Date('2025-01-15')], // Row 2
		],
	});

	const buffer = await workbook.xlsx.writeBuffer();

	console.log("--- Parsing ---");
	// Parse normally
	const readWorkbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
	const firstSheet = readWorkbook.Sheets[readWorkbook.SheetNames[0]];
	const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

	const rawDate = rows[1][0]; // Row 2, Col 1
	console.log("Raw Value:", rawDate);
	console.log("Type:", typeof rawDate);

	if (rawDate instanceof Date) {
		console.log("toISOString():", rawDate.toISOString());
		console.log("toUTCString():", rawDate.toUTCString());
		console.log("toString() (Local):", rawDate.toString());
		console.log("getDate():", rawDate.getDate());
		console.log("getUTCDate():", rawDate.getUTCDate());

		// Test Fix: Add 12 Hours
		const d_fix = new Date(rawDate);
		d_fix.setHours(d_fix.getHours() + 12);
		console.log("\n--- After Adding 12 Hours ---");
		console.log("toISOString():", d_fix.toISOString());
		console.log("Date Part (ISO split):", d_fix.toISOString().split('T')[0]);
		console.log("getDate():", d_fix.getDate());
	}
}

testDate();
