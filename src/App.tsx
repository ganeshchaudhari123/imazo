/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Header } from './components/Header';
import { LeftControlPane } from './components/LeftControlPane';
import { RightInspectorPane } from './components/RightInspectorPane';
import { HistoryDrawer } from './components/HistoryDrawer';
import { CompileConfig, CompileResponsePayload, InputMode, PromptHistoryItem, UserProfile } from './types';
import { CheckCircle2, Sparkles, Wand2, Award } from 'lucide-react';
import neonMesh from './assets/images/neon_lime_mesh_1782310823304.jpg';
import abstractMatrix from './assets/images/abstract_matrix_bg_1782310844642.jpg';
import { gsap } from 'gsap';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>({
    id: 'usr_imazo_9981',
    name: 'Alex Mercer (Creator)',
    email: 'alex.mercer@studio.ai',
    tier: 'Free',
    creditsRemaining: 15,
    creditLimit: 15
  });

  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Multi-modal input states
  const [inputMode, setInputMode] = useState<InputMode>('image');
  const [rawText, setRawText] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageName, setImageName] = useState('');

  // Compiler parameters
  const [config, setConfig] = useState<CompileConfig>({
    stylization: 75,
    photorealism: 85,
    aspectRatio: '16:9',
    targetEngine: 'midjourney'
  });

  // Output states
  const [compileResult, setCompileResult] = useState<CompileResponsePayload | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  // Initial load
  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.warn('Simulated backend sync:', err));

    fetch('/api/history')
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.warn('Simulated history sync:', err));
  }, []);

  // Synthesize Token Stack Handler
  const handleSynthesize = async () => {
    if (profile.creditsRemaining <= 0) {
      alert('Daily rate limit exceeded for your current tier. Please switch to Premium Tier or replenish credits.');
      return;
    }

    setIsCompiling(true);
    setCompileResult(null);

    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputMode,
          rawText,
          imageBase64,
          mimeType: 'image/png',
          config
        })
      });

      const data: CompileResponsePayload = await response.json();
      setCompileResult(data);

      if (data.success) {
        setProfile((prev) => ({ ...prev, creditsRemaining: data.creditsRemaining }));
        // Refresh history
        const histRes = await fetch('/api/history');
        const histData = await histRes.json();
        setHistory(histData);
      } else {
        alert(data.error || 'Failover circuit interrupted');
      }
    } catch (error: any) {
      console.error('Network route interruption:', error);
      alert('Failover circuit retry triggered. Please re-queue request.');
    } finally {
      setIsCompiling(false);
    }
  };

  // Tier toggle
  const handleToggleTier = async () => {
    setIsUpgrading(true);
    const targetTier = profile.tier === 'Free' ? 'Premium' : 'Free';
    try {
      const res = await fetch('/api/profile/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: targetTier })
      });
      const updated = await res.json();
      setProfile(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpgrading(false);
    }
  };

  // Replenish credits
  const handleReplenish = async () => {
    const res = await fetch('/api/profile/replenish', { method: 'POST' });
    const updated = await res.json();
    setProfile(updated);
  };

  // Clear history
  const handleClearHistory = async () => {
    await fetch('/api/history', { method: 'DELETE' });
    setHistory([]);
  };

  // Load from history selection
  const handleSelectHistoryItem = (item: PromptHistoryItem) => {
    setInputMode(item.inputType);
    if (item.inputType === 'text') {
      setRawText(item.inputSummary);
    } else if (item.assetPreview) {
      setImagePreview(item.assetPreview);
      const b64 = item.assetPreview.split(',')[1];
      if (b64) setImageBase64(b64);
    }
    setConfig(item.config);
    setCompileResult({
      success: true,
      prompt: item.prompt,
      engineUsed: item.nodeRoute,
      latencyMs: item.latencyMs,
      creditsRemaining: profile.creditsRemaining
    });
  };

  // Quick populate concept from featured cards
  const handleQuickPopulate = (concept: string) => {
    setInputMode('text');
    setRawText(concept);
  };

  // GSAP Orchestration Script for Entrance Validation
  useEffect(() => {
    const animateDashboardEntrance = () => {
      const dashboardTimeline = gsap.timeline();
      // Sweep Navigation & Studio Kit Header from top screen edge
      dashboardTimeline.to(".studio-header, #imazo-nav", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      });
      // Stagger Split Panel Configuration Workspace Arrays (Left & Right Matrix panes)
      dashboardTimeline.to([".panel-matrix-left", ".panel-matrix-right"], {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power4.out"
      }, "-=0.4");
      // Slide-in Featured Showcase Style Thumbnails dynamically via horizontal offsets
      dashboardTimeline.fromTo(".style-card-item",
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.2)" },
        "-=0.5"
      );
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      // 1. Logo fades in with dramatic character scale expansion
      tl.to("#preloader-logo-text", {
        opacity: 1,
        scale: 1,
        letterSpacing: "12px",
        duration: 1.2,
        ease: "power4.out"
      });
      // 2. Progress tracker ticks to 100% concurrently
      tl.to("#preloader-progress-bar", {
        width: "100%",
        duration: 1.5,
        ease: "power2.inOut"
      }, "-=0.8");
      // 3. Explosive dissolve and dashboard revelation sequence
      tl.to("#imazo-preloader", {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power4.in",
        onComplete: () => {
          const preloaderEl = document.getElementById("imazo-preloader");
          if (preloaderEl) preloaderEl.style.display = "none";
          // Trigger Dashboard Structural Entrance Components Animation
          animateDashboardEntrance();
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="imazo-app-container">
      {/* Main Application Entrance Overlay */}
      <div 
        id="imazo-preloader" 
        style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100vh', 
          background: '#070a12', 
          zIndex: 9999, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center'
        }}
      >
        <div className="preloader-content" style={{ textAlign: 'center' }}>
          <h1 
            id="preloader-logo-text" 
            style={{
              fontSize: '4rem', 
              fontWeight: 900, 
              color: '#ffffff', 
              letterSpacing: '8px', 
              margin: 0, 
              opacity: 0, 
              transform: 'scale(0.8)'
            }}
          >
            IMAZO.AI
          </h1>
          <div 
            id="preloader-progress-track"
            style={{
              width: '180px', 
              height: '2px', 
              background: '#1e293b', 
              marginTop: '20px', 
              borderRadius: '4px', 
              overflow: 'hidden', 
              position: 'relative'
            }}
          >
            <div 
              id="preloader-progress-bar" 
              style={{
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '0%', 
                height: '100%', 
                background: '#a8ff35'
              }}
            />
          </div>
        </div>
      </div>

      {/* Global subtle abstract backdrop */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none mix-blend-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${abstractMatrix})` }}
      />

      <Header
        profile={profile}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onToggleTier={handleToggleTier}
        onReplenishCredits={handleReplenish}
        isUpgrading={isUpgrading}
      />

      <main className="imazo-main">
        
        {/* Studio Showcase Introductory Banner */}
        <div className="imazo-hero">
          <div 
            className="imazo-hero-bg"
            style={{ backgroundImage: `url(${neonMesh})` }}
          />
          <div className="imazo-hero-glow" />
          
          <div className="hero-content">
            <div className="hero-tag-row">
              <span className="studio-tag">
                STUDIO KIT V2.0
              </span>
              <span className="studio-subtag">100% Function & Routing Preserved</span>
              <span className="founder-badge !bg-[#070a12] !border-[#a8ff35]/30">
                <Award className="w-3.5 h-3.5 text-[#a8ff35]" />
                Founder is <span>Ganesh Chaudhari</span>
              </span>
            </div>

            <h1 className="hero-title">
              AI Generate Prompt <br />
              <span>Reverse Studio</span> UI Kit
            </h1>
            
            <p className="hero-desc">
              Turn any inspirational image or rough conceptual text into deterministic, production-ready prompt weights formatted natively for Midjourney V6, Flux, and DALL-E 3.
            </p>
          </div>

          {/* Green Checkmark Pillars (Horizontally scrollable on mobile) */}
          <div className="hero-pillars">
            {[
              { label: '50+ Screens Matrix', sub: 'Multi-Engine Transpiler' },
              { label: '375+ Components', sub: 'Real-time Token Weights' },
              { label: 'Easy Customize', sub: 'Intelligent Jargon Injection' },
              { label: 'Style Guide Included', sub: 'SLA < 1800ms Node Circuit' }
            ].map((pillar, i) => (
              <div key={i} className="pillar-card">
                <div className="pillar-icon">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="pillar-text">
                  <span className="pillar-label">{pillar.label}</span>
                  <span className="pillar-sub">{pillar.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Split Workbench */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="imazo-workbench"
        >
          {/* Left Workbench: Modality Acquisition */}
          <LeftControlPane
            inputMode={inputMode}
            setInputMode={setInputMode}
            rawText={rawText}
            setRawText={setRawText}
            imageBase64={imageBase64}
            setImageBase64={setImageBase64}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            imageName={imageName}
            setImageName={setImageName}
            config={config}
            setConfig={setConfig}
            onSynthesize={handleSynthesize}
            isCompiling={isCompiling}
            creditsRemaining={profile.creditsRemaining}
          />

          {/* Right Showcase: Real-Time Output & Benchmark Presets */}
          <RightInspectorPane
            compileResult={compileResult}
            targetEngine={config.targetEngine}
            isCompiling={isCompiling}
            onQuickPopulateConcept={handleQuickPopulate}
          />
        </motion.div>
      </main>

      {/* Slide-over Tracking History */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onSelectHistory={handleSelectHistoryItem}
      />

      {/* Footer Branding & Founder Attribution */}
      <footer className="imazo-footer">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#a8ff35] animate-ping" />
          <span className="font-mono text-white font-bold">IMAZO STUDIO KIT V2.0</span>
          <span>• Founder is <strong className="text-[#a8ff35]">Ganesh Chaudhari</strong></span>
        </div>
        <div className="flex items-center gap-6 font-mono text-[11px] text-[#94a3b8]">
          <span className="text-[#a8ff35]">Neon Acid Lime (#a8ff35)</span>
          <span className="text-white">Matte Pitch Black (#070a12)</span>
          <span>SLA &lt; 1800ms</span>
        </div>
      </footer>
    </div>
  );
}
