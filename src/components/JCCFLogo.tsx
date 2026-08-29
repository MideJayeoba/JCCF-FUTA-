import React from 'react';
import logoImage from '../assets/jccf-logo.png';

interface JCCFLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  priority?: boolean;
}

/**
 * Official JCCF FUTA Crest & Emblem
 * Renders the uploaded official JCCF logo image directly from assets
 * with customizable sizing via CSS/props.
 */
export const JCCFLogo: React.FC<JCCFLogoProps> = ({
  className = '',
  size = 40,
  showText = false,
  textColor = '#171717',
  subtextColor = '#666666',
}) => {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src={logoImage}
        alt="Joint Christian Campus Fellowship, FUTA Official Crest"
        style={{ width: dimension, height: dimension, minWidth: dimension, minHeight: dimension }}
        className="shrink-0 object-contain select-none"
        loading="eager"
        decoding="sync"
      />

      {showText && (
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span
              style={{ color: textColor }}
              className="text-base sm:text-lg font-black tracking-tight font-heading leading-tight block"
            >
              JCCF FUTA
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FDECEC] text-[#8B0000] border border-[#F8D0D0]">
              Official
            </span>
          </div>
          <span
            style={{ color: subtextColor }}
            className="block text-[11px] font-medium leading-tight"
          >
            Joint Christian Campus Fellowship
          </span>
        </div>
      )}
    </div>
  );
};
