"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { cn } from "@/lib/utils";

export default function BackgroundBeamsDemo() {
  return (
    <div className={cn(
      "h-[40rem] w-full rounded-md bg-background relative flex flex-col items-center justify-center antialiased"
    )}>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className={cn(
          "relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground text-center font-sans font-bold"
        )}>
          Join the waitlist
        </h1>
        <p></p>
        <p className="text-muted-foreground max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Welcome to MailJet, the best transactional email service on the web.
          We provide reliable, scalable, and customizable email solutions for
          your business. Whether you&apos;re sending order confirmations,
          password reset emails, or promotional campaigns, MailJet has got you
          covered.
        </p>
        <input
          type="text"
          placeholder="hi@manuarora.in"
          className="rounded-lg border border-input focus:ring-2 focus:ring-ring w-full relative z-10 mt-4 bg-input placeholder:text-muted-foreground p-2"
        />
      </div>
      <BackgroundBeams />
    </div>
  );
}
