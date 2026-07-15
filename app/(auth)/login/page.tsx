import AuthNavbar from "@/components/auth/auth-navbar";
import GoogleButton from "@/components/auth/google-button";
import FeaturedCourse from "@/components/auth/featured-course";
import NeuralNetwork from "@/components/backgrounds/neural-network";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090B] text-white">
      <NeuralNetwork />

      <AuthNavbar />

      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-start gap-10 px-4 py-24 pt-28 sm:px-6 md:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-0 lg:pt-24">
        <div className="max-w-xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-indigo-400">
            Welcome to Synapse
          </p>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Build knowledge
            <br />
            that lasts.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400 sm:mt-8 sm:text-lg">
            Turn your notes into a beautiful learning system inspired by
            Spotify's simplicity and Netflix's immersive experience.
          </p>

          <div className="mt-8 max-w-sm sm:mt-12">
            <GoogleButton />
          </div>
        </div>

        <div className="w-full lg:pt-4">
          <FeaturedCourse />
        </div>
      </section>
    </main>
  );
}
