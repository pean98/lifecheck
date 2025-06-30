function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function save(data) {
  const sh = SpreadsheetApp.getActive().getSheetByName('Log');
  sh.appendRow([
    new Date(),        // A: Timestamp
    data.date,         // B: 날짜 (yyyy-MM-dd)
    data.period,       // C: 교시
    data.stuId,        // D: 학번
    data.name,         // E: 이름
    data.status        // F: 상태
  ]);
}

function queryByDate(id, date) {
  const rows = SpreadsheetApp
    .getActive()
    .getSheetByName('Log')
    .getDataRange()
    .getValues()
    .slice(1); // 헤더 제외

  const tz = Session.getScriptTimeZone();
  return rows
    .map(r => {
      const cellDate = r[1] instanceof Date
        ? Utilities.formatDate(r[1], tz, 'yyyy-MM-dd')
        : String(r[1]).trim();
      return {
        date:   cellDate,
        period: String(r[2]).trim(),
        stuId:  String(r[3]).trim(),
        name:   String(r[4]),
        status: String(r[5])
      };
    })
    .filter(r => r.stuId === String(id).trim() && r.date === String(date).trim());
}
