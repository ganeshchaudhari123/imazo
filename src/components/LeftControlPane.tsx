import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Sliders, Cpu, Sparkles, Check, AlertCircle, Camera, Wand2 } from 'lucide-react';
import { CompileConfig, InputMode, TargetEngine } from '../types';

interface LeftControlPaneProps {
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  rawText: string;
  setRawText: (text: string) => void;
  imageBase64: string;
  setImageBase64: (b64: string) => void;
  imagePreview: string;
  setImagePreview: (prev: string) => void;
  imageName: string;
  setImageName: (name: string) => void;
  config: CompileConfig;
  setConfig: React.Dispatch<React.SetStateAction<CompileConfig>>;
  onSynthesize: () => void;
  isCompiling: boolean;
  creditsRemaining: number;
}

const ASPECT_RATIOS = ['9:16', '1:1', '16:9', '3:4', '4:3'];

export const LeftControlPane: React.FC<LeftControlPaneProps> = ({
  inputMode,
  setInputMode,
  rawText,
  setRawText,
  imageBase64,
  setImageBase64,
  imagePreview,
  setImagePreview,
  imageName,
  setImageName,
  config,
  setConfig,
  onSynthesize,
  isCompiling,
  creditsRemaining
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    setUploadError(null);
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setUploadError('Invalid format. Please upload PNG, JPEG, or WEBP.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File exceeds 10MB limit.');
      return;
    }

    setImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      const b64 = dataUrl.split(',')[1];
      setImageBase64(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="workbench-col panel-matrix-left">
      {/* Structural Card Container (Studio Phone Mockup Frame) */}
      <div className="anti-gravity-card">
        {/* Mockup Top Header */}
        <div className="card-top-header">
          <div className="card-header-left">
            <div className="card-header-icon">
              <Wand2 className="w-4 h-4 text-[#a8ff35]" />
            </div>
            <div>
              <h2 className="card-header-title">
                Input Modality Matrix
              </h2>
              <div className="card-header-sub">Reverse Engineer v2</div>
            </div>
          </div>

          {/* Modality Selector Tabs */}
          <div className="modality-tabs">
            <button
              type="button"
              onClick={() => setInputMode('image')}
              className={`modality-tab-btn ${inputMode === 'image' ? 'active' : ''}`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Image
            </button>
            <button
              type="button"
              onClick={() => setInputMode('text')}
              className={`modality-tab-btn ${inputMode === 'text' ? 'active' : ''}`}
            >
              <FileText className="w-3.5 h-3.5" /> Concept
            </button>
          </div>
        </div>

        {/* Dynamic Modality Acquisition Area */}
        {inputMode === 'image' ? (
          <div 
            className={`dropzone-matrix ${isDragActive ? 'active-drag' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
            />
            {imagePreview ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="ref-preview-container">
                  <img src={imagePreview} alt="Reference Artwork" className="ref-preview-img" />
                  <div className="ref-preview-overlay">
                    <UploadCloud className="w-6 h-6 animate-bounce" />
                    <span>Click or Drag to Swap Reference</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#a8ff35] bg-[#070a12] px-3 py-1 rounded-full border border-[#1e293b] truncate max-w-xs">{imageName}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-16 h-16 rounded-3xl bg-[#182238] border border-[#a8ff35]/30 flex items-center justify-center text-[#a8ff35] shadow-[0_0_25px_rgba(168,255,53,0.1)]">
                  <UploadCloud className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <p className="text-sm font-black text-white tracking-wide m-0">Drop Reference Artwork Here</p>
                  <p className="text-xs text-[#94a3b8] mt-1.5 m-0">Supports PNG, JPG, WEBP • Max 10MB verified</p>
                </div>
                <span className="text-[10px] font-mono text-[#a8ff35] uppercase tracking-wider bg-[#a8ff35]/10 px-3 py-1 rounded-full border border-[#a8ff35]/20">
                  AI Reverse Engineering Active
                </span>
              </div>
            )}
            {uploadError && (
              <div className="mt-3 text-xs font-bold text-[#f43f5e] flex items-center gap-1.5 bg-[#f43f5e]/10 px-3 py-1.5 rounded-full">
                <AlertCircle className="w-4 h-4" /> {uploadError}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="section-label-row">
              <span>Raw Conceptual Prompt</span>
              <span className="text-[#a8ff35] lowercase font-mono">0 / 350 chars</span>
            </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g. A futuristic cyber-samurai standing on a skyscraper rooftop in Tokyo during neon rainfall, cinematic 35mm anamorphic lens..."
              className="concept-textarea"
            />
          </div>
        )}

        {/* Artwork Size Selector: Fluid / Wrapped Grid on Mobile */}
        <div>
          <div className="section-label-row">
            <span>Artwork Size</span>
            <span className="text-[#94a3b8] font-mono lowercase">Target Multiplier</span>
          </div>

          <div className="aspect-ratio-grid">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setConfig((prev) => ({ ...prev, aspectRatio: ratio }))}
                className={`aspect-btn ${config.aspectRatio === ratio ? 'selected' : ''}`}
              >
                <span>{ratio}</span>
                <span className="aspect-indicator" />
              </button>
            ))}
          </div>
        </div>

        {/* Cross-Engine Syntax Transpiler: Stacked Vertical Block Grid on Mobile */}
        <div className="pt-2 border-t border-[#1e293b]">
          <div className="section-label-row mt-2">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#a8ff35]" /> Choose Target Engine
            </span>
            <span className="text-[10px] font-mono text-[#a8ff35] bg-[#a8ff35]/10 px-2 py-0.5 rounded">
              Syntax Transpiler
            </span>
          </div>

          <div className="engine-grid mt-2">
            {[
              { id: 'midjourney', name: 'Midjourney V6', desc: 'Separators :: & Weights', params: '--ar --v 6.0' },
              { id: 'flux', name: 'Flux / SDXL', desc: 'Cinematic Camera Path', params: 'Prose & Lighting' },
              { id: 'dalle3', name: 'DALL-E 3', desc: 'Explicit Storytelling', params: 'Narrative Block' },
              { id: 'universal', name: 'Any AI Tool', desc: 'Universal Hybrid Prompt', params: 'Leonardo, Firefly' }
            ].map((eng) => (
              <div
                key={eng.id}
                onClick={() => setConfig((prev) => ({ ...prev, targetEngine: eng.id as TargetEngine }))}
                className={`engine-tab ${config.targetEngine === eng.id ? 'selected active-engine-card' : ''}`}
              >
                <div className="engine-tab-title-row">
                  <span>{eng.name}</span>
                  {config.targetEngine === eng.id && <Check className="w-4 h-4 text-[#a8ff35]" />}
                </div>
                <span className="engine-tab-desc">{eng.desc}</span>
                <span className="engine-tab-pill">{eng.params}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligent Adjustment Sliders (Touch Target Expanded Min 44px) */}
        <div className="sliders-section">
          <div className="section-label-row m-0">
            <span className="flex items-center gap-1.5 text-[#ffffff]">
              <Sliders className="w-3.5 h-3.5 text-[#a8ff35]" /> Token Adjustment Sliders
            </span>
            <span className="text-[10px] text-[#94a3b8] font-mono">Real-time parameters</span>
          </div>

          {/* Stylization Slider */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span>Stylization Index</span>
              <span className="slider-val-pill">{config.stylization}%</span>
            </div>
            <div className="slider-touch-wrapper">
              <input
                type="range"
                min="0"
                max="100"
                value={config.stylization}
                onChange={(e) => setConfig((prev) => ({ ...prev, stylization: Number(e.target.value) }))}
                className="intelligent-slider"
              />
            </div>
            <div className="slider-hints">
              <span>STRICT GEOMETRY</span>
              <span>ARTISTIC FREEDOM</span>
            </div>
          </div>

          {/* Photorealism Slider & Dynamic Jargon Preview */}
          <div className="slider-group mt-1">
            <div className="slider-label-row">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#a8ff35]" /> Photorealism Weight
              </span>
              <span className="slider-val-pill">{config.photorealism}%</span>
            </div>
            <div className="slider-touch-wrapper">
              <input
                type="range"
                min="0"
                max="100"
                value={config.photorealism}
                onChange={(e) => setConfig((prev) => ({ ...prev, photorealism: Number(e.target.value) }))}
                className="intelligent-slider"
              />
            </div>
            <div className="optics-box mt-1">
              <span>Optics Injected: </span>
              {config.photorealism > 70
                ? 'Shutter 1/500s, 85mm prime lens f/1.4, volumetric studio rim lighting'
                : config.photorealism > 30
                ? 'Balanced focal sharpness, natural ambient daylight diffusion'
                : 'Painterly textures, expressive brush geometry, stylized form'}
            </div>
          </div>
        </div>

        {/* Synthesize Action Trigger Button */}
        <button
          type="button"
          onClick={onSynthesize}
          disabled={isCompiling || (inputMode === 'image' && !imageBase64) || creditsRemaining <= 0}
          className="btn-gradient-primary"
        >
          {isCompiling ? (
            <>
              <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
              <span>Compiling Token Stack...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-black" />
              <span>Reverse Engineer & Compile Prompt</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
