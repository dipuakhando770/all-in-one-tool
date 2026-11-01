import BackgroundRemoverUI from "@/components/background-remover-ui";

export default function BgRemoverPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-2xl font-bold">Background Remover</h1>
      <div className="mt-6">
        <BackgroundRemoverUI />
      </div>
    </div>
  );
}
