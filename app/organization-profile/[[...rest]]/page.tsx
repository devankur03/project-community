"use client";

import { OrganizationProfile, OrganizationSwitcher, useOrganization } from "@clerk/nextjs";

export default function OrganizationProfilePage() {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return <div className="flex justify-center py-12 px-6"><div className="h-96 w-full max-w-2xl animate-pulse rounded-xl bg-muted" /></div>;
  }

  if (!organization) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 px-6 text-center">
        <h2 className="text-xl font-semibold text-foreground">No organization selected</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Select or create an organization to manage its profile.
        </p>
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/organization-profile"
          afterSelectOrganizationUrl="/organization-profile"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center py-12 px-6">
      <OrganizationProfile routing="path" path="/organization-profile" />
    </div>
  );
}
