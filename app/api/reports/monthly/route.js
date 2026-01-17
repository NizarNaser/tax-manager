export const runtime = "nodejs";
import { generateMonthlyExcel } from '../../../../utils/excel';
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

async function isAdmin() {
    const session = await getServerSession(authOptions);
    if (!session) return false;
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").split(",");
    return adminEmails.includes(session.user.email);
}


export async function GET(req) {
    if (!(await isAdmin())) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
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
