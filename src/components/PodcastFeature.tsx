import React, { useState } from 'react';
import { 
  Play, 
  ExternalLink, 
  Sparkles, 
  Radio, 
  Volume2, 
  Users, 
  Clock, 
  Flame, 
  ShieldCheck,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { extractYouTubeId, getYouTubeEmbedUrl } from '../lib/youtube';

interface PodcastFeatureProps {
  videoId?: string;
}

export const PodcastFeature: React.FC<PodcastFeatureProps> = ({
  videoId = 'iYdKX5jpYIw'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(videoId, true);

  return (
    <section className="bg-white border-b border-[#E5E5E5] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Badge & Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider border border-[#F8D0D0]">
              <Radio className="w-3.5 h-3.5 text-[#B5121B] animate-pulse" />
              <span>Household Podcast • Origin Stories</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#171717] tracking-tight">
              How JCCF Started: <span className="text-[#B5121B]">The Genesis Conversation</span>
            </h2>
            <p className="text-sm sm:text-base text-[#666666] max-w-2xl leading-relaxed">
              Listen to the firsthand recount of how the Joint Christian Campus Fellowship (JCCF) emerged at FUTA, told through an intimate podcast session with Pastor Kola and Folien Eniola.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAFAFA] hover:bg-[#FDECEC] hover:text-[#B5121B] text-[#171717] border border-[#E5E5E5] rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Media Frame & Story Insights Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Video Container (7 cols) */}
          <div className="lg:col-span-7 bg-[#171717] rounded-3xl overflow-hidden shadow-xl border border-[#E5E5E5] flex flex-col justify-center relative group min-h-[300px] sm:min-h-[400px]">
            {isPlaying ? (
              <iframe
                src={embedUrl}
                title="How JCCF Started — Pastor Kola & Folien Eniola"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full aspect-video border-0"
              />
            ) : (
              <div className="relative w-full h-full aspect-video flex items-center justify-center">
                <img
                  src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                  onError={(e) => {
                    // Fallback to hqdefault if maxres not available
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                  }}
                  alt="How JCCF Started — Pastor Kola & Folien Eniola Podcast"
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-85 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                  <button
                    onClick={() => setIsPlaying(true)}
                    title="Play podcast episode"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#B5121B] hover:bg-[#8B0000] text-white flex items-center justify-center shadow-2xl transition-all transform group-hover:scale-110 cursor-pointer"
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1.5 text-white" />
                  </button>
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full text-white/90 border border-white/10">
                      Click to Stream Full Podcast Episode
                    </span>
                    <h3 className="text-base sm:text-xl font-bold font-heading text-white line-clamp-2 max-w-lg mx-auto pt-1">
                      Pastor Kola & Folien Eniola on the Birth of JCCF FUTA
                    </h3>
                  </div>
                </div>

                {/* Episode Tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[#B5121B] text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                    Featured Podcast
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Episode Context & Key Themes (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5E5] shadow-xs flex flex-col justify-between text-left space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDECEC] text-[#B5121B] flex items-center justify-center font-bold text-sm">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#8B0000] block">
                    Historical Foundation Series
                  </span>
                  <h4 className="text-lg font-bold font-heading text-[#171717]">
                    About This Episode
                  </h4>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
                Discover the foundational story of the <strong>Joint Christian Campus Fellowship (JCCF)</strong> at FUTA. This special session features <strong>Pastor Kola and Folien Eniola</strong> as they share deep historical insights into the vision, prayer encounters, and spiritual covenants that shaped the Household into what it is today.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-[#E5E5E5]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666] block">
                  Key Takeaways in this Video:
                </span>
                <div className="flex items-start gap-2.5 text-xs text-[#333333]">
                  <CheckCircle2 className="w-4 h-4 text-[#B5121B] shrink-0 mt-0.5" />
                  <span>The spiritual burden that birthed the vision for campus fellowship unity.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#333333]">
                  <CheckCircle2 className="w-4 h-4 text-[#B5121B] shrink-0 mt-0.5" />
                  <span>Early breakthroughs, prayer gatherings, and foundational challenges overcome.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#333333]">
                  <CheckCircle2 className="w-4 h-4 text-[#B5121B] shrink-0 mt-0.5" />
                  <span>The timeless mandate of Ephesians 4:13 for current and future generations.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between flex-wrap gap-2 text-xs text-[#666666] bg-[#FAFAFA] p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B5121B]" />
                <span>Featuring: <strong>Pst. Kola & Folien Eniola</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-[#8B0000] font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>Foundational Lore</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
