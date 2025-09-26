import { Loader, CVLoader } from "@/components/ui/loader";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header spacing */}
      <div className="h-20" />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-12 text-foreground">
            Loader Components Showcase
          </h1>

          {/* Grid of different loaders */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Basic Loaders */}
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-card-foreground border-b border-border pb-2">
                Basic Loaders
              </h2>

              <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Small Loader
                </h3>
                <Loader size="sm" text="Loading..." />
              </div>

              <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Medium Loader
                </h3>
                <Loader size="md" text="Processing request..." />
              </div>

              <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Large Loader
                </h3>
                <Loader size="lg" text="Analyzing CV data..." />
              </div>
            </div>

            {/* Specialized Loaders */}
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-card-foreground border-b border-border pb-2">
                CV-Specific Loader
              </h2>

              <div className="bg-card rounded-lg p-12 shadow-sm border border-border">
                <CVLoader />
              </div>

              {/* Full-screen preview */}
              <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Minimal Loader
                </h3>
                <Loader text="" className="py-4" />
              </div>
            </div>
          </div>

          {/* Full-screen loader preview */}
          <div className="mt-16">
            <h2 className="text-xl font-semibold text-card-foreground border-b border-border pb-2 mb-8">
              Full-Screen Loader Preview
            </h2>
            <div className="bg-card rounded-lg shadow-sm border border-border min-h-[400px] flex items-center justify-center">
              <CVLoader />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
