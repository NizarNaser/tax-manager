export const runtime = "nodejs";
import { generateMonthlyExcel } from '../../../../utils/excel';


export async function GET(req) {
try {
const url = new URL(req.url);
const userId = url.searchParams.get('userId');
const year = parseInt(url.searchParams.get('year'));
const month = parseInt(url.searchParams.get('month'));


if (!userId || !year || !month) return new Response(JSON.stringify({ error: 'Missing params' }), { status: 400 });


const buffer = await generateMonthlyExcel(userId, year, month);
return new Response(buffer, {
status: 200,
headers: {
'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
'Content-Disposition': `attachment; filename="report-${year}-${month}.xlsx"`,
},
});
} catch (err) {
return new Response(JSON.stringify({ error: err.message }), { status: 500 });
}
}
