import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    fellowship: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        fellowship: '',
        subject: '',
        message: ''
      });
    }, 3500);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E5E5E5] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider border border-[#F8D0D0]">
            <MessageSquare className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>Central Secretariat Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-[#171717] tracking-tight">
            Contact <span className="text-[#B5121B]">JCCF FUTA</span>
          </h1>
          <p className="text-sm sm:text-base text-[#666666] max-w-2xl mx-auto leading-relaxed">
            Have questions regarding fellowship registration, welfare relief, academic coaching, or Mega Praise? Reach out to our executive secretariat.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details Left */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] space-y-6 shadow-xs">
              <h2 className="text-xl font-bold font-heading text-[#171717]">
                Secretariat Location & Inquiries
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-[#666666]">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FDECEC] text-[#B5121B] flex items-center justify-center shrink-0 border border-[#F8D0D0]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#171717] block">Physical Secretariat:</strong>
                    <span>Chapel Pavilion, Adjacent South Gate Entrance, Federal University of Technology, Akure, Ondo State.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FDECEC] text-[#B5121B] flex items-center justify-center shrink-0 border border-[#F8D0D0]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#171717] block">Executive Lines:</strong>
                    <span>President: +234 803 111 2233</span>
                    <span className="block">PRO Desk: +234 813 888 9900</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FDECEC] text-[#B5121B] flex items-center justify-center shrink-0 border border-[#F8D0D0]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#171717] block">Official Email:</strong>
                    <span>secretariat.jccf@futa.edu.ng</span>
                    <span className="block">pro.jccf@futa.edu.ng</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FDECEC] text-[#B5121B] flex items-center justify-center shrink-0 border border-[#F8D0D0]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#171717] block">Secretariat Working Hours:</strong>
                    <span>Monday - Friday: 9:00 AM - 6:00 PM</span>
                    <span className="block">Sundays: 2:00 PM - 7:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Right */}
          <div className="lg:col-span-7 text-left">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2.5 py-1 rounded border border-[#F8D0D0]">
                  Direct Message
                </span>
                <h2 className="text-2xl font-bold font-heading text-[#171717] mt-3">
                  Send an Inquiry to Secretariat
                </h2>
                <p className="text-xs text-[#666666] mt-1">
                  We reply to all student requests, pastoral inquiries, and fellowship updates promptly.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 bg-[#FAFAFA] rounded-2xl border border-[#E5E5E5] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#FDECEC] text-[#B5121B] flex items-center justify-center mx-auto border border-[#B5121B]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#171717]">Message Received!</h3>
                  <p className="text-xs text-[#666666]">
                    Thank you. The Public Relations Office (Jayeoba Peace Olamide) will review and follow up with you.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#171717] block mb-1">Full Name:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sis. Grace"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#171717] block mb-1">Email Address:</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. grace@futa.edu.ng"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#171717] block mb-1">Phone / WhatsApp:</label>
                      <input
                        type="tel"
                        required
                        placeholder="+234..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#171717] block mb-1">Campus Fellowship / Status:</label>
                      <input
                        type="text"
                        placeholder="e.g. RCF FUTA / 100L Fresher"
                        value={formData.fellowship}
                        onChange={(e) => setFormData({ ...formData, fellowship: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#171717] block mb-1">Subject / Category:</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                    >
                      <option value="">Select subject...</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Student Welfare / Food Assistance">Student Welfare / Food Assistance</option>
                      <option value="Academic Tutorial Coaching">Academic Tutorial Coaching</option>
                      <option value="Fellowship Verification">Fellowship Verification</option>
                      <option value="Mega Praise 2026 Participation">Mega Praise 2026 Participation</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#171717] block mb-1">Your Message:</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Write your message or question here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Secretariat</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
