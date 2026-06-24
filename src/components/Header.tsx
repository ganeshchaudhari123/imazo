import React from 'react';
import { Wand2, History, Zap, ShieldAlert, CheckCircle2, ArrowUpRight, Award } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  onOpenHistory: () => void;
  onToggleTier: () => void;
  onReplenishCredits: () => void;
  isUpgrading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenHistory,
  onToggleTier,
  onReplenishCredits,
  isUpgrading
}) => {
  const creditPercent = Math.max(0, Math.min(100, (profile.creditsRemaining / profile.creditLimit) * 100));

  return (
    <header id="imazo-nav" className="imazo-header studio-header">
      {/* Brand Identity & Founder Info */}
      <div className="header-brand">
        <div className="header-logo-icon">
          <Wand2 className="w-5 h-5 text-[#a8ff35]" />
        </div>
        <div className="header-brand-text">
          <div className="header-title-row">
            <h1 className="header-title">
              IMAZO<span>.AI</span>
            </h1>
            <span className="header-badge-kit">STUDIO KIT</span>
            <div className="founder-badge" title="Visionary Architect & Creator">
              <Award className="w-3.5 h-3.5 text-[#a8ff35]" />
              Founder is <span>Ganesh Chaudhari</span>
            </div>
          </div>
          <p className="header-subtitle">
            Reverse Prompt Engineering & Token Optimization Matrix
          </p>
        </div>
      </div>

      {/* Production Controls & Quota Indicators */}
      <div className="header-controls">
        {/* Desktop Detailed Quota Gauge */}
        <div className="quota-badge-desktop">
          <div className="quota-info">
            <div className="quota-label-row">
              <span className="quota-label">
                <Zap className="w-3.5 h-3.5 text-[#a8ff35]" /> Token Quota
              </span>
              <span className="quota-value">
                {profile.creditsRemaining} / {profile.creditLimit}
              </span>
            </div>
            <div className="quota-progress-track">
              <div 
                className="quota-progress-fill"
                style={{ width: `${creditPercent}%`, backgroundColor: profile.creditsRemaining <= 3 ? '#f43f5e' : '#a8ff35' }}
              />
            </div>
          </div>
          {profile.creditsRemaining < profile.creditLimit && (
            <button
              onClick={onReplenishCredits}
              title="Replenish daily tester credits"
              className="btn-quota-reset"
            >
              Reset
            </button>
          )}
        </div>

        {/* Mobile Collapsed Compact Quota Indicator */}
        <div className="quota-badge-mobile" title="Remaining Daily Tokens">
          <Zap className="w-4 h-4 text-[#a8ff35] fill-[#a8ff35]" />
          <span>{profile.creditsRemaining}</span>
        </div>

        {/* Tier Toggle Switch */}
        <button
          onClick={onToggleTier}
          disabled={isUpgrading}
          className={`imazo-btn-secondary ${profile.tier === 'Premium' ? 'premium-active' : ''}`}
          title="Toggle Membership Tier"
        >
          {profile.tier === 'Premium' ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#a8ff35]" />
              <span className="btn-text-full">Premium Member</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-[#94a3b8]" />
              <span className="btn-text-full">Free Tier</span>
              <span className="upgrade-pill-cta desktop-only">
                UPGRADE <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            </>
          )}
        </button>

        {/* History Modal Trigger */}
        <button
          onClick={onOpenHistory}
          className="imazo-btn-secondary"
          title="Inspect reverse engineering prompt history"
        >
          <History className="w-4 h-4 text-[#a8ff35]" />
          <span className="btn-text-full">History</span>
        </button>
      </div>
    </header>
  );
};
