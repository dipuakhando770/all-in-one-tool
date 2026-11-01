import InteractiveImageCropper from "@/components/image-cropper";
import type { Locale } from "@/lib/i18n";

export default async function CropperPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-2xl font-bold">Interactive Image Cropper</h1>
      <div className="mt-6">
        <InteractiveImageCropper />
      </div>
    </div>
  );
}
