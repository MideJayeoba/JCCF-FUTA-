import React from 'react';
import { HistorySection } from '../components/HistorySection';
import { PodcastFeature } from '../components/PodcastFeature';
import { JCCFLogo } from '../components/JCCFLogo';
import { 
  ShieldCheck, 
  Target, 
  Compass, 
  Award, 
  ArrowRight, 
  BookOpen, 
  Flame, 
  CheckCircle2, 
  Music, 
  Users, 
  Radio,
  FileText,
  HeartHandshake,
  Sparkles
} from 'lucide-react';
import { NavigationPage } from '../types';

interface AboutPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      
      {/* Page Hero Header */}
      <div className="bg-white border-b border-[#E5E5E5] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="flex justify-center">
            <div className="p-1 rounded-full bg-white shadow-md border border-[#E5E5E5] hover:scale-105 transition-transform duration-300">
              <JCCFLogo size={90} />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider border border-[#F8D0D0]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>The Joint Christian Campus Fellowship, FUTA (The Household)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-[#171717] tracking-tight">
            “Till we all come in the <span className="text-[#B5121B]">unity of faith</span>”
          </h1>
          <p className="text-sm sm:text-base text-[#666666] max-w-3xl mx-auto leading-relaxed">
            The apex coordinating body uniting 25 registered Christian campus fellowships across the Federal University of Technology, Akure. Non-denominational, independent, and steadfast under the leading of the Holy Spirit.
          </p>
          <div className="pt-2 text-xs font-mono text-[#8B0000] bg-[#FDECEC] inline-block px-3 py-1 rounded-md border border-[#F8D0D0]">
            Scriptural Anchor: Ephesians 4:13
          </div>
        </div>
      </div>

      {/* Featured JCCF Origins Podcast: Pastor Kola & Folien Eniola */}
      <PodcastFeature videoId="iYdKX5jpYIw" />

      {/* Vision & Mission (Articles 1 & 2) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Vision Box */}
          <div className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-3xl border border-[#E5E5E5] shadow-xs flex flex-col justify-between text-left space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FDECEC] text-[#B5121B] flex items-center justify-center border border-[#F8D0D0]">
                <Target className="w-6 h-6" />
              </div>
              <div className="inline-block text-[10px] font-black uppercase tracking-wider bg-[#FDECEC] text-[#8B0000] px-2.5 py-0.5 rounded border border-[#F8D0D0]">
                Article 2, Section 1
              </div>
              <h2 className="text-2xl font-bold font-heading text-[#171717]">
                Our Vision
              </h2>
              <p className="text-base sm:text-lg text-[#171717] font-medium leading-relaxed italic border-l-4 border-[#B5121B] pl-4 py-1">
                “Raising a people that will come in the unity of the faith, and of the knowledge of the Son of God, unto a perfect man, unto the measure of the stature of the fullness of Christ.”
              </p>
            </div>
            <div className="text-xs text-[#666666] pt-4 border-t border-[#E5E5E5]">
              Ephesians 4:13 • Foundational Mandate of the Household
            </div>
          </div>

          {/* Mission Box (7 Constitutional Aims) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E5E5E5] shadow-xs text-left space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FDECEC] text-[#B5121B] flex items-center justify-center border border-[#F8D0D0]">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider bg-[#FDECEC] text-[#8B0000] px-2.5 py-0.5 rounded inline-block border border-[#F8D0D0]">
                    Article 2, Section 2
                  </div>
                  <h2 className="text-2xl font-bold font-heading text-[#171717]">
                    Our Mission & Aims
                  </h2>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#333333]">
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B5121B] shrink-0 mt-0.5" />
                <span>To foster unity among Christian fellowships/Christian groups on campus.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B5121B] shrink-0 mt-0.5" />
                <span>To harmonise activities, appropriate time, and venue for various programmes to avoid/resolve clashes.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B5121B] shrink-0 mt-0.5" />
                <span>To organise edifying Household programmes (Combined prayers, Teaching weekends, Change of Pulpit).</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B5121B] shrink-0 mt-0.5" />
                <span>To serve as a link between the University authority and registered Christian fellowships.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B5121B] shrink-0 mt-0.5" />
                <span>To guard against strange doctrines and maintain sound biblical truth.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B5121B] shrink-0 mt-0.5" />
                <span>To ensure the total well-being of Christians on campus.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] sm:col-span-2 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B5121B] shrink-0 mt-0.5" />
                <span>To serve as a spiritual guide upon the land of FUTA.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Logo & Emblem Breakdown (Article 1, Section 2) */}
      <div className="py-16 bg-white border-y border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider border border-[#F8D0D0]">
              <Sparkles className="w-3.5 h-3.5 text-[#B5121B]" />
              <span>Article 1: Section 2 • The Official Seal</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#171717]">
              The Meaning of the Logo & Emblem
            </h2>
            <p className="text-xs sm:text-sm text-[#666666]">
              Every symbol and color in the official JCCF seal represents a foundational spiritual covenant.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Center Emblem Showcase (4 cols on large screens) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 bg-[#FAFAFA] rounded-3xl border border-[#E5E5E5] text-center space-y-4 shadow-xs">
              <div className="p-3 bg-white rounded-full shadow-lg border border-[#E5E5E5] hover:rotate-3 transition-transform duration-300">
                <JCCFLogo size={180} />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-[#171717]">
                  Official Crest of JCCF FUTA
                </h3>
                <p className="text-xs text-[#666666] max-w-xs mt-1">
                  The supreme constitutional emblem of the Joint Christian Campus Fellowship, Federal University of Technology, Akure.
                </p>
              </div>
            </div>

            {/* The 6 Constitutional Meanings (8 cols) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1.5 hover:border-[#B5121B]/40 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#FDECEC] text-[#B5121B] flex items-center justify-center font-bold text-[11px]">
                    01
                  </div>
                  <h4 className="text-sm font-bold text-[#171717]">The Dove</h4>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Represents the <strong>SPIRIT OF GOD</strong> leading and directing the affairs of the Household.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1.5 hover:border-[#B5121B]/40 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#FDECEC] text-[#B5121B] flex items-center justify-center font-bold text-[11px]">
                    02
                  </div>
                  <h4 className="text-sm font-bold text-[#171717]">The Book</h4>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Represents the <strong>WORD OF GOD</strong> as the supreme authority on all matters of faith and doctrine.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1.5 hover:border-[#B5121B]/40 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#FDECEC] text-[#B5121B] flex items-center justify-center font-bold text-[11px]">
                    03
                  </div>
                  <h4 className="text-sm font-bold text-[#171717]">The Olive Branch</h4>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  In the mouth of the Dove, represents <strong>PEACE AND COVENANT REASSURANCE</strong> that the family of God on campus is sheltered from floods.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1.5 hover:border-[#B5121B]/40 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#FDECEC] text-[#B5121B] flex items-center justify-center font-bold text-[11px]">
                    04
                  </div>
                  <h4 className="text-sm font-bold text-[#171717]">Green Inner Unbroken Circle</h4>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Represents the <strong>ONENESS OF THE TRINITY</strong> and <strong>CONSTANT GROWTH & FRUITFULNESS</strong> across all fellowships.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1.5 hover:border-[#B5121B]/40 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#FDECEC] text-[#B5121B] flex items-center justify-center font-bold text-[11px]">
                    05
                  </div>
                  <h4 className="text-sm font-bold text-[#171717]">Red Outer Unbroken Circle</h4>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Represents the <strong>BLOOD OF REDEMPTION</strong> through faith in the sacrificial death of our Lord Jesus Christ.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1.5 hover:border-[#B5121B]/40 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#FDECEC] text-[#B5121B] flex items-center justify-center font-bold text-[11px]">
                    06
                  </div>
                  <h4 className="text-sm font-bold text-[#171717]">The Yellow Glow & Stars</h4>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Represents the <strong>GLORY OF CHRIST</strong> radiating through consecrated believers across the university campus.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Visual Timeline Section */}
      <HistorySection />

      {/* The 5 Household Units & Administration (Article 5) */}
      <div className="py-16 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider border border-[#F8D0D0]">
              <Users className="w-3.5 h-3.5 text-[#B5121B]" />
              <span>Article 5: Structure & Governance</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#171717]">
              The Five Household Service Units
            </h2>
            <p className="text-xs sm:text-sm text-[#666666]">
              Coordinating operations, ministrations, logistics, and communication under the Household Executives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
            <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded">
                Unit I
              </span>
              <h3 className="text-sm font-bold text-[#171717]">The Choir Unit</h3>
              <p className="text-xs text-[#666666]">Serves as the JCCF Mass Choir and the central music ministry in all Household programmes.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded">
                Unit II
              </span>
              <h3 className="text-sm font-bold text-[#171717]">The Drama Unit</h3>
              <p className="text-xs text-[#666666]">Ministers the undiluted Word through anointed stage drama, scriptwriting, and theatrical arts.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded">
                Unit III
              </span>
              <h3 className="text-sm font-bold text-[#171717]">The Publicity Unit</h3>
              <p className="text-xs text-[#666666]">Responsible for information dissemination, circulars, digital media, and the official JCCF website.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded">
                Unit IV
              </span>
              <h3 className="text-sm font-bold text-[#171717]">The Ushering Unit</h3>
              <p className="text-xs text-[#666666]">Maintains sanctuary orderliness, venue preparation, welcoming guests, and offerings counting.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded">
                Unit V
              </span>
              <h3 className="text-sm font-bold text-[#171717]">The Organizing Unit</h3>
              <p className="text-xs text-[#666666]">Handles technical maintenance (sound, musical, light), stage logistics, vehicle fleet, and recording.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Official JCCF Anthem (Appendix IV) */}
      <div className="py-16 bg-[#FAFAFA] border-b border-[#E5E5E5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider border border-[#F8D0D0]">
            <Music className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>Appendix IV</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-[#171717]">
            The JCCF Anthem
          </h2>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E5E5E5] shadow-xs text-center space-y-6">
            <div className="space-y-2 text-sm sm:text-base text-[#171717] font-medium leading-relaxed">
              <p className="font-bold text-[#B5121B]">
                Joint Christian Campus fellowship, JCCF<br />
                Joint Christian Campus fellowship, JCCF<br />
                Joint Christian Campus fellowship, We are one.
              </p>
            </div>

            <div className="w-16 h-0.5 bg-[#B5121B]/30 mx-auto" />

            <div className="space-y-2 text-xs sm:text-sm text-[#444444] leading-relaxed italic">
              <p>
                Jesus Christ the Lord’s the one who unites us<br />
                Jesus Christ the Lord’s the one who unites us as one<br />
                We will rise by faith in Christ and take this land for God.<br />
                <span className="font-bold not-italic text-[#171717]">We are one.....</span>
              </p>
            </div>

            <div className="w-16 h-0.5 bg-[#B5121B]/30 mx-auto" />

            <div className="space-y-1 text-xs sm:text-sm text-[#444444] leading-relaxed">
              <p>
                We are Christian soldiers led by Jesus Christ<br />
                <strong className="text-[#B5121B]">Praise the Lord!</strong><br />
                We can see the Victory<br />
                For we are one in Christ<br />
                For we are one in Christ!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Callout */}
      <div className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl font-bold font-heading text-[#171717]">
            25 Registered Member Fellowships
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] max-w-xl mx-auto">
            Discover the constituent fellowship families formally affiliated with the Household under the reviewed constitution.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('fellowships')}
              className="px-7 py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Member Fellowships Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
