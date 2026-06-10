"use client";

import { useEffect, useState } from "react";

// Add a type for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // Default to true to prevent hydration mismatch/flicker
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isPwa = window.matchMedia("(display-mode: standalone)").matches || 
                  (window.navigator as any).standalone === true;
    setIsStandalone(isPwa);

    // If already installed, don't show
    if (isPwa) {
      return;
    }

    // Detect iOS
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Show prompt after a short delay for iOS
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }

    // For Android/Desktop: Listen for the install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-full duration-500">
        <div className="mx-auto flex max-w-sm items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-slate-800">Install BillTrack</p>
              {isIOS ? (
                <p className="text-[11px] leading-tight text-slate-500 mt-0.5">
                  Tap <span className="font-bold">Share</span>, then <span className="font-bold">Add to Home Screen</span>
                </p>
              ) : (
                <p className="text-[11px] leading-tight text-slate-500 mt-0.5">
                  Add to home screen for quick access
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isIOS && (
              <button
                onClick={handleInstallClick}
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 active:scale-95 transition-transform"
              >
                Install
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Spacer to push body content so the last bill doesn't hide behind the fixed prompt */}
      <div className="h-32 shrink-0 w-full" aria-hidden="true" />
    </>
  );
}
