import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { ModelForm } from "@/components/admin/ModelForm";

export const dynamic = "force-dynamic";

export default async function NewModelPage() {
  await requireAdmin();

  const featuredCount = await prisma.model.count({ where: { isFeatured: true } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foam">
          Add New Model
        </h1>
        <p className="text-xs sm:text-sm text-foam/60 mt-1">
          Create a new talent profile, upload composite card photos, and configure portfolio videos.
        </p>
      </div>

      <ModelForm featuredCount={featuredCount} />
    </div>
  );
}
