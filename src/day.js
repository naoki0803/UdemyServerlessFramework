const dayjs = require('dayjs')

const date = dayjs()
console.log("date", date);


const formattedDate = date.format("YYYY-MM-DD HH:mm:ss");
console.log("formattedDate", formattedDate); // 日付文字列


const startDate = date.format("YYYY-MM-01");
const endDate = date.add(1, "months").format("YYYY-MM-01");

console.log("startDate", startDate);
console.log("endDate", endDate);