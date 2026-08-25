import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  HandHeart, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  X,
  Send
} from 'lucide-react';
import { SERVICE_UNITS } from '../data/units';
import { NavigationPage } from '../types';

interface GetInvolvedSectionProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenGiveModal: () => void;
  showAll?: boolean;
}

export const GetInvolvedSection: React.FC<GetInvolvedSectionProps> = ({
  onNavigate,
  onOpenGiveModal,
  showAll = false
}) => {
  const [selectedUnitForModal, setSelectedUnitForModal] = useState<any | null>(null);
  const [volunteerSuccess, setVolunteerSuccess] = useState(false);
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    phone: '',
    email: '',
    faculty: 'SEET (Engineering)',
    level: '100L'
  });

  const pathways = [
    {
      id: 'join',
      title: 'Join a Fellowship',
      description: 'Connect with a vibrant family of campus worshippers in your preferred denomination.',
      icon: Users,
      actionText: 'Browse Fellowships',
      onClick: () => onNavigate('fellowships'),
      badge: 'Spiritual Home'
    },
    {
      id: 'attend',
      title: 'Attend an Event',
      description: 'Join thousands of students at our upcoming Mega Praise, prayer walks, and academic summits.',
      icon: Calendar,
      actionText: 'View Upcoming Events',
      onClick: () => onNavigate('events'),
      badge: 'Experience Revival'
    },
    {
      id: 'volunteer',
      title: 'Volunteer in a Unit',
      description: 'Deploy your gifts in the Central Mass Choir, Media crew, Academic coaching, or Prayer force.',
      icon: HandHeart,
      actionText: 'Explore 8 Ministry Units',
      onClick: () => onNavigate('get-involved'),
      badge: 'Kingdom Service'
    },
    {
      id: 'partner',
      title: 'Partner With Us',
      description: 'Support student welfare food bank, free academic handouts, and campus evangelism.',
      icon: Building2,
      actionText: 'Partner & Give',
      onClick: onOpenGiveModal,
      badge: 'Kingdom Seed'
    }
  ];

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVolunteerSuccess(true);
    setTimeout(() => {
      setVolunteerSuccess(false);
      setSelectedUnitForModal(null);
    }, 2500);
  };

  return (
    <section id="get-involved" className="py-16 sm:py-24 bg-[#FAFAFA] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider mb-3 border border-[#F8D0D0]">
            <HandHeart className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>Serve & Connect</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] font-heading tracking-tight">
            Get Involved in JCCF
          </h2>
          <p className="text-[#666666] mt-3 text-sm sm:text-base leading-relaxed">
            Be part of what God is doing at FUTA. Connect with a fellowship, serve in a ministry unit, and impact fellow students.
          </p>
        </div>

        {/* 4 Involvement Pathway Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pathways.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-[#E5E5E5] hover:border-[#B5121B] transition-all shadow-xs hover:shadow-md flex flex-col justify-between group text-left"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#FDECEC] text-[#B5121B] group-hover:bg-[#B5121B] group-hover:text-white transition-colors flex items-center justify-center border border-[#F8D0D0]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded border border-[#F8D0D0]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-heading text-[#171717] group-hover:text-[#B5121B] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#666666] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-2">
                  <button
                    onClick={item.onClick}
                    className="w-full py-2.5 bg-[#FAFAFA] group-hover:bg-[#B5121B] text-[#171717] group-hover:text-white border border-[#E5E5E5] group-hover:border-[#B5121B] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 8 Ministry Units Grid (When viewed on Full Page or Get Involved tab) */}
        {showAll && (
          <div className="mt-16 pt-16 border-t border-[#E5E5E5]">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h3 className="text-2xl font-bold font-heading text-[#171717]">
                Volunteer in One of Our 8 Ministry Directorates
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] mt-2">
                Every member has a gift. Find the right service team to hone your spiritual and professional capabilities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {SERVICE_UNITS.map((unit) => (
                <div
                  key={unit.id}
                  className="bg-white p-5 rounded-2xl border border-[#E5E5E5] hover:border-[#B5121B] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#FDECEC] text-[#8B0000] px-2 py-0.5 rounded border border-[#F8D0D0]">
                      {unit.shortName}
                    </span>
                    <h4 className="text-sm font-bold text-[#171717] font-heading">
                      {unit.name}
                    </h4>
                    <p className="text-xs text-[#666666] line-clamp-2">
                      {unit.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E5E5E5] space-y-2">
                    <div className="text-[11px] text-[#666666]">
                      Meeting: <strong>{unit.meetingTime}</strong>
                    </div>
                    <button
                      onClick={() => setSelectedUnitForModal(unit)}
                      className="w-full py-2 bg-[#FAFAFA] hover:bg-[#B5121B] text-[#171717] hover:text-white border border-[#E5E5E5] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Join This Unit</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Volunteer Registration Modal */}
      {selectedUnitForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5E5E5] text-left space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded">
                  Volunteer Enlistment
                </span>
                <h3 className="text-base font-bold text-[#171717] font-heading mt-1">
                  Join {selectedUnitForModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUnitForModal(null)}
                className="w-8 h-8 rounded-full bg-[#FAFAFA] hover:bg-[#E5E5E5] text-[#171717] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {volunteerSuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#FDECEC] text-[#B5121B] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#171717]">Registration Received!</h4>
                <p className="text-xs text-[#666666]">
                  The unit leader ({selectedUnitForModal.headName}) will contact you via WhatsApp for rehearsal orientation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Full Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bro. Victor"
                    value={volunteerForm.name}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-[#171717] block mb-1">Phone / WhatsApp:</label>
                    <input
                      type="tel"
                      required
                      placeholder="+234..."
                      value={volunteerForm.phone}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#171717] block mb-1">Level:</label>
                    <select
                      value={volunteerForm.level}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, level: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                    >
                      <option value="100L">100L (Fresher)</option>
                      <option value="200L">200L</option>
                      <option value="300L">300L</option>
                      <option value="400L">400L</option>
                      <option value="500L">500L</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Faculty / School:</label>
                  <select
                    value={volunteerForm.faculty}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, faculty: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                  >
                    <option value="SEET (Engineering)">SEET (Engineering & Technology)</option>
                    <option value="SOC (Computing)">SOC (School of Computing)</option>
                    <option value="SOS (Sciences)">SOS (School of Sciences)</option>
                    <option value="SAAT (Agriculture)">SAAT (Agriculture & Agricultural Tech)</option>
                    <option value="SEMS (Earth & Mineral)">SEMS (Earth & Mineral Sciences)</option>
                    <option value="SET (Environmental)">SET (Environmental Technology)</option>
                    <option value="SLS (Life Sciences)">SLS (Life Sciences)</option>
                    <option value="SMAT (Management)">SMAT (Management Technology)</option>
                    <option value="SPH (Public Health)">SPH (Public Health & Medical)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Enlistment</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
