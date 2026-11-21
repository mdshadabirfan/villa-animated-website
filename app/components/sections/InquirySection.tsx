"use client";

import React, { useState, memo } from "react";
import { useInView } from "../../hooks/useInView";

function InquirySectionComponent() {
  const [headerRef, headerInView] = useInView<HTMLDivElement>({ threshold: 0.15 });
  const [formRef, formInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [advisoryRef, advisoryInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fullName: "",
    entityName: "",
    email: "",
    phone: "",
    representation: "Principal",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="inquire"
      className="relative z-10 bg-zinc-950 px-6 sm:px-12 md:px-20 lg:px-28 py-32 sm:py-44 border-t border-zinc-900 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`space-y-6 max-w-3xl transition-all duration-1000 ease-out ${
            headerInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-[0.3em]">
              05 / Private Acquisition & Advisory
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.12]">
            Request the Confidential Architectural Dossier
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
            Villa Horizon is offered exclusively under private placement. Principals,
            family offices, and accredited brokers are invited to request the complete
            140-page architectural portfolio, construction provenance documents,
            and schedule a confidential private site walkthrough.
          </p>
        </div>

        {/* 2-Column: Form & Advisory Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Interactive Form */}
          <div
            ref={formRef}
            className={`lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-1000 ease-out ${
              formInView
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-12 scale-[0.98]"
            }`}
          >
            {submitted ? (
              <div className="py-16 text-center space-y-5">
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-white">
                  Dossier Request Received
                </h3>
                <p className="text-sm text-zinc-400 font-light max-w-md mx-auto leading-relaxed">
                  Thank you, {formData.fullName || "Sir/Madam"}. Our architectural advisory
                  desk has received your transmission and will dispatch the confidential
                  credentials directly to your secure email within four business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="fullName"
                      className="font-mono text-xs text-zinc-400 uppercase tracking-wider block"
                    >
                      Full Legal Name *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder="e.g. Sterling Vance"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 text-white placeholder-zinc-600 font-light text-sm focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="entityName"
                      className="font-mono text-xs text-zinc-400 uppercase tracking-wider block"
                    >
                      Entity / Family Office
                    </label>
                    <input
                      id="entityName"
                      name="entityName"
                      type="text"
                      placeholder="e.g. Vance Meridian Trust"
                      value={formData.entityName}
                      onChange={(e) =>
                        setFormData({ ...formData, entityName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 text-white placeholder-zinc-600 font-light text-sm focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="font-mono text-xs text-zinc-400 uppercase tracking-wider block"
                    >
                      Confidential Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="advisory@entity.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 text-white placeholder-zinc-600 font-light text-sm focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="font-mono text-xs text-zinc-400 uppercase tracking-wider block"
                    >
                      Direct Telephone *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+1 (310) 555-0198"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 text-white placeholder-zinc-600 font-light text-sm focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="representation"
                    className="font-mono text-xs text-zinc-400 uppercase tracking-wider block"
                  >
                    Buyer Representation
                  </label>
                  <select
                    id="representation"
                    name="representation"
                    value={formData.representation}
                    onChange={(e) =>
                      setFormData({ ...formData, representation: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 text-white font-light text-sm focus:outline-none focus:border-white/40 transition-colors cursor-pointer"
                  >
                    <option value="Principal">Direct Principal / Buyer</option>
                    <option value="FamilyOffice">Family Office Executive</option>
                    <option value="LicensedBroker">Licensed Buyer&apos;s Broker</option>
                    <option value="ArchitecturalAdvisor">Architectural Representative</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="font-mono text-xs text-zinc-400 uppercase tracking-wider block"
                  >
                    Confidential Notes & Preferred Walkthrough Date
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Specify target acquisition timeline, specific architectural questions, or requested private helicopter / site transit arrangements..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 text-white placeholder-zinc-600 font-light text-sm focus:outline-none focus:border-white/40 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-mono text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  Transmit Confidential Request
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Advisory Details */}
          <div
            ref={advisoryRef}
            className="lg:col-span-5 space-y-8"
          >
            <div
              className={`p-8 rounded-3xl bg-zinc-900/20 border border-zinc-800/60 hover:border-white/30 hover:-translate-y-1.5 transition-all duration-700 ease-out space-y-6 shadow-[0_15px_40px_rgba(0,0,0,0.3)] ${
                advisoryInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block">
                Direct Architectural Advisory
              </span>

              <div className="space-y-4">
                <p className="text-xl font-light text-white">
                  Alistair Stirling &amp; Partners
                </p>
                <p className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
                  Private Coastal Architecture Practice
                </p>
                <div className="pt-2 text-sm text-zinc-400 font-light space-y-1">
                  <p>1200 Pacific Coast Highway · Suite 800</p>
                  <p>Pacific Palisades, California 90272</p>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800/80 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-zinc-500 uppercase">Telephone</span>
                  <span className="text-white">+1 (310) 892-4400</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-zinc-500 uppercase">Secure Desk</span>
                  <span className="text-white">advisory@villahorizon.com</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-zinc-500 uppercase">Encryption</span>
                  <span className="text-emerald-400 font-medium">PGP Key Verified</span>
                </div>
              </div>
            </div>

            <div
              className={`p-8 rounded-3xl bg-zinc-900/10 border border-zinc-800/40 hover:border-white/20 transition-all duration-700 ease-out space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)] ${
                advisoryInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] block">
                Site Walkthrough Protocol
              </span>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                All physical inspections of the residence require a 48-hour advance notice
                and executed Non-Disclosure Agreement (NDA). Helipad and private marine vessel
                docking coordinates will be provided following credential validation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const InquirySection = memo(InquirySectionComponent);
export default InquirySection;
