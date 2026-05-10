import { clerkClient, clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

export default clerkMiddleware(async (auth, request: NextRequest) => {

  try {

    const { userId, orgId } = await auth();
    const { pathname } = request.nextUrl;

    // Protect /admin — redirect non-admins to home
    if (pathname.startsWith('/admin')) {
      if (!userId) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      if (!user.publicMetadata?.isAdmin) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    if (userId && !orgId) {

      const client = await clerkClient();

      const { data: memberships } = await client.users.getOrganizationMembershipList({ userId });

      if (memberships.length === 0) {

        const user = await client.users.getUser(userId);

        const baseName = user.firstName
          ? `${user.firstName}'s Organization`
          : `Organization for ${user.emailAddresses[0].emailAddress}`;
        
          console.log(baseName)

        // Append a sanitized suffix from userId to keep slugs unique
        const suffix = userId.toLowerCase().replace(/[^a-z0-9]/g, '').slice(-6);
        const slug = `${baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${suffix}`;
 console.log(slug,"===========")
        await client.organizations.createOrganization({
          name: baseName,
         // slug,
          createdBy: userId, // automatically adds user as org:admin member
        });
      }
    }

  } catch (err) {
    console.error("Error in Clerk middleware:", err);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
