import React, { useState } from 'react';
import { 
  Heart, 
  Building, 
  ShieldCheck, 
  Copy, 
  Check, 
  Receipt, 
  Download, 
  ArrowRight,
  Zap,
  CreditCard,
  Sparkles,
  Clock,
  Info,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { DonationRecord } from '../types';
import { JCCFLogo } from '../components/JCCFLogo';

interface GivePageProps {
  onOpenGiveModal: () => void;
}

export const GivePage: React.FC<GivePageProps> = ({ onOpenGiveModal }) => {
  const { settings, recordDonation } = useApp();
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Selected Method (default to manual bank transfer)
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'opay' | 'palmpay' | 'card'>('bank');

  // Confirmation Form State
  const [purpose, setPurpose] = useState('General Fellowship Stewardship & Tithes');
  const [amount, setAmount] = useState('5000');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<DonationRecord | null>(null);

  const officialAccounts = [
    {
      bank: 'Wema Bank',
      accountNumber: '0222953276',
      accountName: 'Joint Christian Campus Fellowship',
      purpose: 'Tithe, Offering & General Support',
      badge: 'Main Fellowship Account',
      recommendedFor: 'Weekly offerings, personal tithes, central evangelism, and administrative needs.'
    },
    {
      bank: 'Wema Bank',
      accountNumber: '0242883780',
      accountName: 'Joint Christian Campus Fellowship',
      purpose: 'Welfare Food Bank, Projects & Mega Praise',
      badge: 'Projects & Welfare Account',
      recommendedFor: 'Student welfare relief, indigent tuition support, sound systems, and Mega Praise logistics.'
    }
  ];

  const handleCopyAccount = (acc: string, label: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedBank(label);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const handleRecordManualTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const reference = bankRef.trim() || `WEMA-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const saved = recordDonation({
        donorName: donorName.trim() || 'Anonymous Kingdom Partner',
        donorEmail: donorEmail.trim() || 'kingdom.partner@futa.edu.ng',
        donorPhone: donorPhone.trim() || undefined,
        amount: numAmount,
        purpose,
        reference,
        paymentMethod: 'Manual Bank Transfer (Wema Bank)',
        status: 'Completed',
        channelDetails: 'Direct Wema Bank Transfer (0222953276 / 0242883780)'
      });

      setCompletedReceipt(saved);

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log(err);
      }
    }, 1000);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-[#171717]">
      
      {/* Page Header in Deep Crimson */}
      <div className="bg-[#8B0000] text-white py-16 sm:py-20 relative overflow-hidden text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20">
            <Heart className="w-3.5 h-3.5 fill-white/80" />
            <span>Kingdom Stewardship & Giving</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
            Partner with the Work of God in <span className="text-white">FUTA</span>
          </h1>
          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
            Your financial seed directly supports indigent student food vouchers, campus evangelism treks, joint assemblies, and Mega Praise logistics.
          </p>

          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-xs text-xs font-semibold text-white border border-white/20">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Direct Bank Transfer (Active)</span>
            </div>
            <button
              onClick={onOpenGiveModal}
              className="px-5 py-2 bg-white text-[#8B0000] hover:bg-[#FDECEC] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Quick Account Modal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        {/* Payment Channels Selector */}
        <div className="mb-10 text-center space-y-3">
          <h2 className="text-2xl font-bold font-heading text-[#171717]">
            Official Giving Channels
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] max-w-xl mx-auto">
            Direct manual transfer to our verified institutional Wema Bank accounts is currently active and open.
          </p>

          <div className="flex flex-wrap justify-center gap-2.5 pt-2">
            <button
              onClick={() => setSelectedMethod('bank')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                selectedMethod === 'bank'
                  ? 'bg-[#B5121B] text-white border-[#B5121B] shadow-sm'
                  : 'bg-white text-[#171717] border-[#E5E5E5] hover:bg-[#FAFAFA]'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Direct Bank Transfer</span>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                selectedMethod === 'bank' ? 'bg-white text-[#B5121B]' : 'bg-[#E6F8F0] text-[#008753]'
              }`}>
                Active
              </span>
            </button>

            <button
              onClick={() => setSelectedMethod('opay')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                selectedMethod === 'opay'
                  ? 'bg-[#00B875]/10 text-[#008753] border-[#00B875]'
                  : 'bg-white text-[#666666] border-[#E5E5E5] hover:bg-[#FAFAFA]'
              }`}
            >
              <div className="w-4 h-4 rounded bg-[#00B875] text-white flex items-center justify-center font-black text-[9px]">
                OP
              </div>
              <span>OPay Direct</span>
              <span className="text-[9px] font-bold bg-[#FFF2DE] text-[#D97706] px-1.5 py-0.5 rounded-full">
                Coming Soon
              </span>
            </button>

            <button
              onClick={() => setSelectedMethod('palmpay')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                selectedMethod === 'palmpay'
                  ? 'bg-[#6F32E2]/10 text-[#6F32E2] border-[#6F32E2]'
                  : 'bg-white text-[#666666] border-[#E5E5E5] hover:bg-[#FAFAFA]'
              }`}
            >
              <div className="w-4 h-4 rounded bg-[#6F32E2] text-white flex items-center justify-center font-black text-[9px]">
                PL
              </div>
              <span>PalmPay Wallet</span>
              <span className="text-[9px] font-bold bg-[#FFF2DE] text-[#D97706] px-1.5 py-0.5 rounded-full">
                Coming Soon
              </span>
            </button>

            <button
              onClick={() => setSelectedMethod('card')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                selectedMethod === 'card'
                  ? 'bg-[#171717] text-white border-[#171717]'
                  : 'bg-white text-[#666666] border-[#E5E5E5] hover:bg-[#FAFAFA]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Card / Web Pay</span>
              <span className="text-[9px] font-bold bg-[#FFF2DE] text-[#D97706] px-1.5 py-0.5 rounded-full">
                Coming Soon
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Content Based on Selected Method */}
        {selectedMethod === 'bank' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Official Wema Bank Accounts */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00603B] bg-[#E6F8F0] px-2.5 py-1 rounded border border-[#B2ECD6]">
                  Active Channel • Direct Bank Transfer
                </span>
                <h2 className="text-2xl font-bold font-heading text-[#171717] mt-3">
                  Verified Institutional Bank Accounts
                </h2>
                <p className="text-xs sm:text-sm text-[#666666] mt-1">
                  Copy the account number corresponding to your giving purpose and transfer via your mobile bank app or USSD:
                </p>
              </div>

              {/* Verified Account Cards */}
              <div className="space-y-4">
                {officialAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-4 hover:border-[#B5121B]/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#FDECEC] text-[#8B0000] flex items-center justify-center font-black">
                          <Building className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#171717]">{acc.bank}</h3>
                          <span className="text-[11px] text-[#666666]">{acc.purpose}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-[#FDECEC] text-[#8B0000] px-2.5 py-1 rounded-full border border-[#F8D0D0]">
                        {acc.badge}
                      </span>
                    </div>

                    {/* Big Copyable Account Number */}
                    <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-[#E5E5E5] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#666666] block font-medium">Account Number</span>
                        <strong className="text-xl sm:text-2xl font-black text-[#171717] font-mono tracking-widest">
                          {acc.accountNumber}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyAccount(acc.accountNumber, acc.accountNumber)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          copiedBank === acc.accountNumber
                            ? 'bg-[#00B875] text-white shadow-xs'
                            : 'bg-[#8B0000] text-white hover:bg-[#B5121B]'
                        }`}
                      >
                        {copiedBank === acc.accountNumber ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Account</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-xs text-[#666666] space-y-1">
                      <div>
                        Account Name: <strong className="text-[#171717]">{acc.accountName}</strong>
                      </div>
                      <p className="text-[11px] text-[#666666] italic">
                        {acc.recommendedFor}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* How it Works Step by Step */}
              <div className="bg-[#FAFAFA] p-5 rounded-2xl border border-[#E5E5E5] space-y-3">
                <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                  How to send your seed:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#E5E5E5]">
                    <span className="font-black text-[#8B0000] block mb-1">Step 1</span>
                    <p className="text-[#666666]">Copy the appropriate 10-digit Wema Bank account number above.</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#E5E5E5]">
                    <span className="font-black text-[#8B0000] block mb-1">Step 2</span>
                    <p className="text-[#666666]">Open your bank app (OPay, PalmPay, GTBank, Kuda, etc.) and select Wema Bank.</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#E5E5E5]">
                    <span className="font-black text-[#8B0000] block mb-1">Step 3</span>
                    <p className="text-[#666666]">Complete transfer and optionally log details on the right to receive a digital receipt.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Log & Confirm Seed Receipt */}
            <div className="lg:col-span-5 text-left">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2.5 py-1 rounded border border-[#F8D0D0]">
                    Stewardship Record
                  </span>
                  <h2 className="text-2xl font-bold font-heading text-[#171717] mt-3">
                    Log Transfer & Receipt
                  </h2>
                  <p className="text-xs text-[#666666] mt-1">
                    Optionally record your completed transfer to receive an official digital receipt for your records.
                  </p>
                </div>

                {completedReceipt ? (
                  <div className="p-6 bg-[#FAFAFA] rounded-2xl border border-[#E5E5E5] text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#FDECEC] text-[#B5121B] flex items-center justify-center mx-auto border-2 border-[#B5121B]">
                      <Receipt className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#171717]">Transfer Recorded!</h3>
                      <p className="text-xs text-[#666666] mt-1">
                        Reference: <strong className="font-mono text-[#8B0000]">{completedReceipt.reference}</strong>
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-[#E5E5E5] text-xs text-left space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#666666]">Donor:</span>
                        <strong className="text-[#171717]">{completedReceipt.donorName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666666]">Cause:</span>
                        <strong className="text-[#B5121B]">{completedReceipt.purpose}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666666]">Amount:</span>
                        <strong className="text-[#8B0000] font-bold text-sm">₦{(Number(completedReceipt?.amount) || 0).toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666666]">Channel:</span>
                        <span className="font-bold">{completedReceipt.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666666]">Date:</span>
                        <span className="text-[#666666]">{completedReceipt.date}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="flex-1 py-2.5 bg-white border border-[#E5E5E5] hover:bg-[#FAFAFA] text-[#171717] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Print Receipt</span>
                      </button>
                      <button
                        onClick={() => setCompletedReceipt(null)}
                        className="flex-1 py-2.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                      >
                        Log Another Seed
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRecordManualTransfer} className="space-y-4">
                    
                    {/* Giving Purpose */}
                    <div>
                      <label className="text-xs font-bold text-[#171717] block mb-1">
                        Designated Cause:
                      </label>
                      <select
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                      >
                        <option value="General Fellowship Stewardship & Tithes">General Fellowship Stewardship & Tithes</option>
                        <option value="Student Welfare Food Bank & Indigent Care">Student Welfare Food Bank & Indigent Care</option>
                        <option value="Mega Praise 2026 Logistics & Sound">Mega Praise 2026 Logistics & Sound</option>
                        <option value="Campus Evangelism & Rural Missions">Campus Evangelism & Rural Missions</option>
                        <option value="JCCF Secretariat & Publications Sponsorship">JCCF Secretariat & Publications Sponsorship</option>
                      </select>
                    </div>

                    {/* Amount Selection */}
                    <div>
                      <label className="text-xs font-bold text-[#171717] block mb-1">
                        Amount Seeded in Naira (₦):
                      </label>
                      <div className="grid grid-cols-5 gap-1.5 mb-2">
                        {['1000', '2000', '5000', '10000', '25000'].map((preset) => (
                          <button
                            type="button"
                            key={preset}
                            onClick={() => setAmount(preset)}
                            className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                              amount === preset
                                ? 'bg-[#B5121B] text-white border-[#B5121B]'
                                : 'bg-[#FAFAFA] text-[#171717] border-[#E5E5E5] hover:bg-[#E5E5E5]'
                            }`}
                          >
                            ₦{Number(preset).toLocaleString()}
                          </button>
                        ))}
                      </div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount in ₦"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none font-bold"
                      />
                    </div>

                    {/* Donor Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#171717] block mb-1">
                          Your Name:
                        </label>
                        <input
                          type="text"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder="e.g. Bro. Emmanuel"
                          className="w-full px-3.5 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#171717] block mb-1">
                          Phone Number (Optional):
                        </label>
                        <input
                          type="text"
                          value={donorPhone}
                          onChange={(e) => setDonorPhone(e.target.value)}
                          placeholder="e.g. 08123456789"
                          className="w-full px-3.5 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Optional Reference */}
                    <div>
                      <label className="text-xs font-bold text-[#171717] block mb-1">
                        Bank App Narration / Ref (Optional):
                      </label>
                      <input
                        type="text"
                        value={bankRef}
                        onChange={(e) => setBankRef(e.target.value)}
                        placeholder="e.g. Transfer session ID or remark"
                        className="w-full px-3.5 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isProcessing ? (
                        <span>Logging Transfer Record...</span>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 fill-white" />
                          <span>Generate Receipt for ₦{Number(amount || 0).toLocaleString()} Seed</span>
                        </>
                      )}
                    </button>

                  </form>
                )}

              </div>
            </div>

          </div>
        ) : (
          /* Graceful Coming Soon Container for OPay / PalmPay / Card */
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E5E5] shadow-xs text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-[#FFF2DE] text-[#D97706] flex items-center justify-center mx-auto border border-[#FDE68A]">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider bg-[#FFF2DE] text-[#D97706] px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Feature in Active Development</span>
              </div>
              <h3 className="text-2xl font-black font-heading text-[#171717]">
                {selectedMethod === 'opay' && 'OPay Direct Online Gateway'}
                {selectedMethod === 'palmpay' && 'PalmPay Instant Wallet Checkout'}
                {selectedMethod === 'card' && 'Debit Card (Mastercard / Visa / Verve) Web Gateway'}
              </h3>
              <p className="text-sm text-[#666666] max-w-lg mx-auto leading-relaxed">
                Automated online API checkout via <strong>{selectedMethod === 'opay' ? 'OPay' : selectedMethod === 'palmpay' ? 'PalmPay' : 'Debit Card Web Pay'}</strong> is currently in integration and will be available in the upcoming release.
              </p>
              <div className="p-4 bg-[#FDECEC] rounded-2xl border border-[#F8D0D0] text-xs font-semibold text-[#8B0000] max-w-md mx-auto">
                Please use the direct manual bank transfer channel to send your seed directly to our verified Wema Bank accounts.
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('bank')}
                className="px-8 py-3.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Building className="w-4 h-4" />
                <span>Switch to Direct Bank Transfer (Available Now)</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
