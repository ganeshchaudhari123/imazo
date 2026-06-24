import React, { useState } from 'react';
import { Copy, Check, Terminal, Cpu, Clock, ShieldCheck, Wand2, Layers, Star } from 'lucide-react';
import { CompileResponsePayload, TargetEngine } from '../types';

interface RightInspectorPaneProps {
  compileResult: CompileResponsePayload | null;
  targetEngine: TargetEngine;
  isCompiling: boolean;
  onQuickPopulateConcept?: (concept: string) => void;
}

const FEATURED_STYLES = [
  { title: 'Cyberpunk Neon Street', style: 'Volumetric fog, neon asphalt, f/1.4 prime', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80', engine: 'midjourney' },
  { title: 'Neoclassical Atrium', style: 'Chiaroscuro ambient lighting, 35mm anamorphic', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80', engine: 'flux' },
  { title: 'Anime Fantasy Avatar', style: 'Cel-shaded lineart, vibrant pastel bloom', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80', engine: 'midjourney' },
  { title: 'Sci-Fi Mecha Robot', style: 'Hyper photorealistic titanium armor geometry', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80', engine: 'dalle3' }
];

export const RightInspectorPane: React.FC<RightInspectorPaneProps> = ({
  compileResult,
  targetEngine,
  isCompiling,
  onQuickPopulateConcept
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!compileResult || !compileResult.prompt) return;
    navigator.clipboard.writeText(compileResult.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const activePrompt = compileResult?.prompt || 'Synthesize your asset on the left to extract an optimized token matrix... Or click a Featured Style below to instantly benchmark prompts!';
  const engineBadgeName = targetEngine === 'midjourney' ? 'Midjourney V6' : targetEngine === 'flux' ? 'Flux / SDXL' : targetEngine === 'dalle3' ? 'DALL-E 3' : 'Any AI Tool';

  // Quick heuristic token analyzer for visual breakdown chips
  const renderTokenPills = (text: string) => {
    if (!compileResult?.success) return null;

    const weightTokens = text.match(/\b[\w\s-]+::[\d.]+/g) || [];
    const paramTokens = text.match(/--[\w.]+(\s+[\w.]+)?/g) || [];

    return (
      <div className="token-breakdown-area">
        <span className="w-full text-[10px] font-black uppercase tracking-wider text-[#a8ff35] mb-1 flex items-center gap-1.5 font-mono">
          <Layers className="w-3.5 h-3.5" /> Token Stack Breakdown
        </span>
        {weightTokens.map((t, i) => (
          <span key={`wt-${i}`} className="token-pill weight">
            {t}
          </span>
        ))}
        {paramTokens.map((t, i) => (
          <span key={`pm-${i}`} className="token-pill param">
            {t}
          </span>
        ))}
        {weightTokens.length === 0 && paramTokens.length === 0 && (
          <span className="token-pill">
            High-Cohesion Narrative Prose Block
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="workbench-col panel-matrix-right">
      {/* Studio Phone / Inspector Card Mockup Frame */}
      <div className="anti-gravity-card justify-between">
        
        {/* Top Header & Output Area */}
        <div className="flex flex-col gap-5">
          <div className="card-top-header m-0">
            <div className="card-header-left">
              <div className="card-header-icon">
                <Terminal className="w-4 h-4 text-[#a8ff35]" />
              </div>
              <div>
                <h2 className="card-header-title">
                  Output Synthesis Workbench
                </h2>
                <div className="card-header-sub">Ready for Generation</div>
              </div>
            </div>

            {/* Target Engine Status Pill */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#182238] border border-[#a8ff35]/40 text-[#a8ff35] text-xs font-black font-mono">
              <Cpu className="w-3.5 h-3.5" />
              <span>{engineBadgeName}</span>
            </div>
          </div>

          {/* Formatted Prompt Output Box */}
          <div className="flex flex-col gap-3">
            <div className="section-label-row m-0">
              <span className="flex items-center gap-1.5 text-[#ffffff]">
                <Wand2 className="w-3.5 h-3.5 text-[#a8ff35]" /> Compiled Token Stack
              </span>
              {compileResult?.success && (
                <span className="text-[10px] font-mono text-[#a8ff35] bg-[#a8ff35]/10 px-2 py-0.5 rounded">
                  {compileResult.prompt.length} CHARS
                </span>
              )}
            </div>

            <div className={`compiled-output-box ${isCompiling ? 'compiling animate-pulse' : ''}`}>
              {isCompiling ? (
                <div className="flex flex-col items-center justify-center m-auto gap-3 text-center py-10">
                  <div className="w-8 h-8 rounded-full border-3 border-[#a8ff35] border-t-transparent animate-spin" />
                  <p className="text-xs font-mono text-[#a8ff35] m-0">Synthesizing token grammar across distributed Gemini nodes...</p>
                </div>
              ) : (
                <>
                  <p className="compiled-prompt-text">
                    {activePrompt}
                  </p>
                  
                  {renderTokenPills(activePrompt)}
                </>
              )}
            </div>
          </div>

          {/* Copy Trigger Button */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!compileResult?.success || isCompiling}
            className={copied ? 'btn-gradient-primary !bg-[#10b981] !text-white !shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'btn-gradient-primary'}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 animate-bounce stroke-[3]" />
                <span>Copied Token Stack to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 stroke-[2.5]" />
                <span>Copy Engine-Formatted Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* Featured Styles Showcase: CSS Flex Row with horizontal swipe on mobile */}
        <div className="showcase-section">
          <div className="section-label-row m-0">
            <span className="flex items-center gap-1.5 text-[#ffffff]">
              <Star className="w-3.5 h-3.5 text-[#a8ff35] fill-[#a8ff35]" /> Featured Styles Showcase
            </span>
            <span className="text-[10px] text-[#94a3b8] font-mono lowercase">Instant presets</span>
          </div>

          <div className="showcase-grid">
            {FEATURED_STYLES.map((fs, idx) => (
              <div
                key={idx}
                onClick={() => onQuickPopulateConcept && onQuickPopulateConcept(fs.title + ' :: ' + fs.style)}
                className="showcase-card style-card-item"
              >
                <div className="showcase-img-wrap">
                  <img src={fs.image} alt={fs.title} className="showcase-img" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-transparent to-transparent pointer-events-none" />
                  <span className="showcase-engine-badge">
                    {fs.engine}
                  </span>
                </div>
                <div className="showcase-info">
                  <span className="showcase-title">{fs.title}</span>
                  <span className="showcase-desc">{fs.style}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom SLA Bar */}
        <div className="sla-status-bar">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#a8ff35]" />
            <span className="text-[#94a3b8]">Processing SLA: </span>
            <span className="font-bold text-white">
              {compileResult?.latencyMs ? `${compileResult.latencyMs}ms` : '< 1800ms Target'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#a8ff35]" />
            <span className="text-[#94a3b8]">Node Circuit: </span>
            <span className="text-[11px] text-[#a8ff35] bg-[#182238] px-2.5 py-0.5 rounded-full border border-[#a8ff35]/30 font-bold">
              {compileResult?.engineUsed || 'Distributed_Gemini_Pool'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
