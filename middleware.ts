
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-up", "/sign-in", "/", "/home"]);
const isPublicApiRoute = createRouteMatcher(["/api/videos"]);

export default clerkMiddleware( async(auth, req) => {
    const { userId } = await auth(); 
    const currentUrl = new URL(req.url);
    const isAccessingDashboard = currentUrl.pathname === "/home";
    const isApiRequest = currentUrl.pathname.startsWith("/api");

    // logged in users going to public routes → redirect to home
    if (userId && isPublicRoute(req) && !isAccessingDashboard) {
        return NextResponse.redirect(new URL("/home", req.url));
    }

    // not logged in
    if (!userId) {
        if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }
        if (isApiRequest && !isPublicApiRoute(req)) {
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
