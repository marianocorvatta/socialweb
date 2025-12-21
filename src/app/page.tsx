import ConnectButton from "@/components/landing/ConnectButton";
import Alert from "@/components/ui/Alert";

interface HomeProps {
  searchParams: Promise<{ error?: string }>;
}

export const metadata = {
  title: "Instagram Web Generator",
  description: "Genera tu sitio web profesional desde tu perfil de Instagram",
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const error = params.error;

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          Instagram Web Generator
        </h1>

        {error && (
          <div className="mb-6">
            <Alert variant="error" title="Error">
              <pre className="overflow-x-auto">{error}</pre>
            </Alert>
          </div>
        )}

        <div className="text-center py-20">
          <p className="text-gray-600 mb-6">
            Conecta tu cuenta de Instagram para generar tu web
          </p>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
