import { Button } from "@/components/ui/button";
import React from "react";
import { Shield } from "lucide-react";
import Link from "next/link";

export default function SmartLockLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-600">SecureGate</h1>
        </div>
        <Link href="/auth/login">
          <Button className="cursor-pointer rounded-xl bg-blue-600 px-6 py-6 font-medium text-white hover:bg-blue-700">
            Get Started
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="mt-16 px-6 text-center">
        <h2 className="text-5xl leading-tight font-bold md:text-6xl">
          <span className="text-blue-600">Smart Security</span> <br /> For Your
          Home
        </h2>
      </section>

      {/* Features */}
      <section id="features" className="mt-24 px-8">
        <h3 className="mb-12 text-center text-3xl font-bold">Features</h3>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Remote Access",
              desc: "Lock and unlock your door from anywhere using your smartphone.",
              color: "from-blue-500 to-blue-700",
            },
            {
              title: "Biometric Security",
              desc: "Advanced fingerprint recognition for secure and fast access.",
              color: "from-purple-500 to-purple-700",
            },
            {
              title: "Real-Time Alerts",
              desc: "Get instant notifications on any door activity.",
              color: "from-pink-500 to-red-500",
            },
          ].map((f, i) => (
            <div
              key={i}
              className={"rounded-2xl bg-gradient-to-br p-[2px] " + f.color}
            >
              <div className="h-full rounded-2xl bg-white p-6 shadow-md transition hover:scale-105">
                <h4 className="text-xl font-semibold">{f.title}</h4>
                <p className="mt-3 text-gray-600">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="mt-24 px-8 text-center">
        <h3 className="mb-10 text-3xl font-bold">How It Works</h3>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            "Install the smart lock on your door",
            "Connect it to your Wi-Fi network",
            "Control access via mobile or web app",
          ].map((step, i) => (
            <div
              key={i}
              className="rounded-2xl border-t-4 border-blue-500 bg-white p-6 shadow-md"
            >
              <div className="mb-4 text-4xl font-bold text-blue-600">
                {i + 1}
              </div>
              <p className="text-gray-700">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24 px-6 text-center">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-12 text-white shadow-lg">
          <h3 className="text-4xl font-bold">Upgrade Your Security Today</h3>
          <p className="mt-4 text-blue-100">
            Join thousands of users securing their homes with SecureGate.
          </p>
          <Button className="mt-6 cursor-pointer rounded-2xl bg-white px-8 py-3 font-semibold text-blue-600 hover:bg-gray-100">
            Get Started
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="mt-24 border-t border-gray-300 px-8 py-10 text-center text-gray-500"
      >
        <p>© {new Date().getFullYear()} SecureGate. All rights reserved.</p>
      </footer>
    </div>
  );
}
