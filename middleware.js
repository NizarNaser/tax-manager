import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").split(",");
        const isAdmin = adminEmails.includes(token?.email);

        // If authenticated but not admin, and trying to access protected routes
        if (!isAdmin && req.nextUrl.pathname !== "/") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/",
        },
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/invoices/:path*",
        "/reports/:path*",
        "/settings/:path*",
    ],
};
