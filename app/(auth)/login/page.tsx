import { Suspense } from "react";
import AuthNavbar from "@/components/auth/auth-navbar";
import LoginForm from "@/components/auth/login-form";
import FeaturedCourse from "@/components/auth/featured-course";
import NeuralNetwork from "@/components/backgrounds/neural-network";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <NeuralNetwork />

      <AuthNavbar />

      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-start gap-10 px-4 py-24 pt-28 sm:px-6 md:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-0 lg:pt-24">
        <div className="max-w-xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-400">
            Welcome to Synapse
          </p>

          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl tracking-tight text-foreground">
            Build knowledge
            <br />
            that lasts.
          </h1>

          <p className="mt-4 max-w-xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Turn your study notes into an intelligent learning system with AI flashcards & spaced repetition.
          </p>

          <div className="mt-6">
            <Suspense fallback={
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                <span>Loading login portal...</span>
              </div>
            }>
              <LoginForm />
            </Suspense>
          </div>
        </div>

        <div className="w-full lg:pt-4">
          <FeaturedCourse />
        </div>
      </section>
    </main>
  );
}
