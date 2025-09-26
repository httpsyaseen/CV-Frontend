import { Loader } from "@/components/ui/loader";

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8">
      <Loader size="lg" text="Processing Your Request..." />
    </div>
  );
}
