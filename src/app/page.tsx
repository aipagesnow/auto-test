import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Shield, Zap, Mail, BarChart3, Archive } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Archive className="h-5 w-5" />
            </div>
            <span>AutoResponder<span className="text-primary">.pro</span></span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">
              Pricing
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="https://github.com/Start-Automating/auto-responder" target="_blank">
              GitHub
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button size="sm" variant="ghost">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="shadow-lg hover:shadow-primary/20 transition-all">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-40"></div>
          <div className="container px-4 md:px-6 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              v1.0 Now Live
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Never miss an important email again.
            </h1>
            <p className="mt-6 max-w-[600px] text-lg text-muted-foreground md:text-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Automate your Gmail responses with smart rules. Set it and forget it.
              The professional way to handle out-of-office and automated replies.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
                  Start Automating Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://github.com/Start-Automating" target="_blank">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-accent/50">
                  View Demo
                </Button>
              </Link>
            </div>

            {/* UI Mockup / abstract visual */}
            <div className="mt-20 relative w-full max-w-5xl aspect-[16/9] rounded-xl border bg-background/50 shadow-2xl backdrop-blur-sm overflow-hidden animate-in fade-in zoom-in duration-1000 delay-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20"></div>
              <div className="absolute top-4 left-4 right-4 h-8 bg-muted/20 rounded-md flex items-center px-4 gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
              <div className="absolute top-16 left-4 bottom-4 w-64 bg-card rounded-lg border shadow-sm p-4 hidden md:block">
                <div className="h-4 w-24 bg-muted rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-8 w-full bg-primary/10 rounded"></div>
                  <div className="h-8 w-full bg-muted/30 rounded"></div>
                  <div className="h-8 w-full bg-muted/30 rounded"></div>
                </div>
              </div>
              <div className="absolute top-16 left-4 md:left-72 right-4 bottom-4 bg-card rounded-lg border shadow-sm p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div className="h-6 w-32 bg-muted rounded"></div>
                  <div className="h-8 w-24 bg-primary rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-32 rounded-xl bg-muted/10 border border-dashed flex items-center justify-center text-muted-foreground/30 text-4xl font-bold">+</div>
                  <div className="h-32 rounded-xl bg-card border shadow-sm p-4">
                    <div className="h-4 w-20 bg-primary/20 rounded mb-2"></div>
                    <div className="h-3 w-full bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container py-24 px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="group flex flex-col items-center text-center space-y-4 p-6 rounded-2xl transition-all hover:bg-muted/50">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Instand Auto-Reply</h3>
              <p className="text-muted-foreground leading-relaxed">
                Set up rules to reply instantly to specific senders or subjects. Respond faster than humanly possible.
              </p>
            </div>
            <div className="group flex flex-col items-center text-center space-y-4 p-6 rounded-2xl transition-all hover:bg-muted/50">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Activity Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track how many emails you've processed. Visual charts and logs help you stay on top of your automation.
              </p>
            </div>
            <div className="group flex flex-col items-center text-center space-y-4 p-6 rounded-2xl transition-all hover:bg-muted/50">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Secure & Private</h3>
              <p className="text-muted-foreground leading-relaxed">
                Powered by official Google OAuth. Your data stays yours. We modify labels to track state, safely.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-muted/30">
          <div className="container py-24 px-4 md:px-6 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to automate your inbox?</h2>
            <p className="mt-4 max-w-[600px] text-muted-foreground text-lg">
              Join thousands of productive professionals who save time with AutoResponder.
            </p>
            <div className="mt-8">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 shadow-lg shadow-primary/20">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-background">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-semibold">
            <Archive className="h-5 w-5" />
            <span>AutoResponder</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AutoResponder Pro. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
