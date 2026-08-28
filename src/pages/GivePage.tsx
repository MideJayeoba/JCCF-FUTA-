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
  RefreshCw,
  CreditCard,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { DonationRecord } from '../types';

interface GivePageProps {
  onOpenGiveModal: () => void;
}

export const GivePage: React.FC<GivePageProps> = ({ onOpenGiveModal }) => {
  const { settings, recordDonation } = useApp();
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Online Form State
  const [purpose, setPurpose] = useState('Student Welfare Food Bank & Indigent Care');
  const [amount, setAmount] = useState('5000');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [selectedGateway, setSelectedGateway] = useState<'opay' | 'palmpay' | 'bank' | 'card'>('opay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<DonationRecord | null>(null);

  const bankAccounts = [
    {
      bank: 'First Bank of Nigeria',
      accountName: 'Joint Christian Campus Fellowship FUTA',
      accountNumber: '2034981120',
      tag: 'General Fellowship & Tithes'
    },
    {
      bank: 'Guaranty Trust Bank (GTBank)',
      accountName: 'JCCF FUTA - Welfare & Missions',
      accountNumber: '0129384756',
      tag: 'Welfare Food Bank & Indigent Care'
    },
    {
      bank: 'Zenith Bank PLC',
      accountName: 'JCCF FUTA - Mega Praise & Projects',
      accountNumber: '1018273645',
      tag: 'Mega Praise 2026 & Sound Project'
    }
  ];

  const handleCopyAccount = (acc: string, label: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedBank(label);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const method = selectedGateway === 'opay' ? 'OPay' : selectedGateway === 'palmpay' ? 'PalmPay' : selectedGateway === 'bank' ? 'Bank Transfer' : 'Card';
      const prefix = selectedGateway === 'opay' ? 'OPAY-' : selectedGateway === 'palmpay' ? 'PLMP-' : selectedGateway === 'bank' ? 'BNK-' : 'CRD-';
      const reference = prefix + Math.floor(10000000 + Math.random() * 90000000);

      const saved = recordDonation({
        donorName: donorName.trim() || 'Anonymous Kingdom Partner',
        donorEmail: donorEmail.trim() || 'kingdom.partner@futa.edu.ng',
        donorPhone: donorPhone.trim() || undefined,
        amount: numAmount,
        purpose,
        reference,
        paymentMethod: method,
        status: 'Completed',
        channelDetails: `${method} Portal Direct Giving`
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
    }, 1200);
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
            Partner with the Move of God in <span className="text-white">FUTA</span>
          </h1>
          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
            Your financial seed directly supports indigent student food vouchers, campus evangelism treks, joint assemblies, and Mega Praise logistics.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onOpenGiveModal}
              className="px-6 py-3 bg-white text-[#8B0000] hover:bg-[#FDECEC] font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-[#8B0000]" />
              <span>Launch Instant OPay / PalmPay Modal</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Fintech Gateways & Bank Accounts */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2.5 py-1 rounded border border-[#F8D0D0]">
                Method 1: Direct Mobile Fintech (OPay & PalmPay)
              </span>
              <h2 className="text-2xl font-bold font-heading text-[#171717] mt-3">
                Zero-Fee Student Wallets
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] mt-1">
                Instantly transfer from your OPay or PalmPay app using official merchant numbers:
              </p>
            </div>

            {/* OPay Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#00B875]/30 hover:border-[#00B875] transition-all shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00B875] text-white flex items-center justify-center font-black text-xs">
                    OP
                  </div>
                  <span className="text-xs font-bold text-[#008753]">OPay Digital Wallet</span>
                </div>
                <span className="text-[10px] font-bold bg-[#00B875]/15 text-[#008753] px-2 py-0.5 rounded">
                  Instant Auto-Credit
                </span>
              </div>

              <div className="flex items-center justify-between bg-[#FAFAFA] p-3 rounded-xl border border-[#E5E5E5]">
                <div>
                  <span className="text-[10px] text-[#666666] block">OPay Merchant Number:</span>
                  <strong className="text-lg font-black text-[#171717] font-mono tracking-wider">
                    {settings.opayMerchantAccount}
                  </strong>
                </div>
                <button
                  onClick={() => handleCopyAccount(settings.opayMerchantAccount, 'opay')}
                  className="px-3.5 py-2 bg-[#00B875]/10 hover:bg-[#00B875] text-[#008753] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedBank === 'opay' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBank === 'opay' ? 'Copied!' : 'Copy OPay'}</span>
                </button>
              </div>

              <div className="text-xs text-[#666666]">
                Beneficiary Name: <strong className="text-[#171717]">{settings.opayMerchantName}</strong>
              </div>
            </div>

            {/* PalmPay Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#6F32E2]/30 hover:border-[#6F32E2] transition-all shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#6F32E2] text-white flex items-center justify-center font-black text-xs">
                    PL
                  </div>
                  <span className="text-xs font-bold text-[#6F32E2]">PalmPay Integrated Wallet</span>
                </div>
                <span className="text-[10px] font-bold bg-[#6F32E2]/15 text-[#6F32E2] px-2 py-0.5 rounded">
                  Zero Transfer Fees
                </span>
              </div>

              <div className="flex items-center justify-between bg-[#FAFAFA] p-3 rounded-xl border border-[#E5E5E5]">
                <div>
                  <span className="text-[10px] text-[#666666] block">PalmPay Merchant Number:</span>
                  <strong className="text-lg font-black text-[#171717] font-mono tracking-wider">
                    {settings.palmpayMerchantAccount}
                  </strong>
                </div>
                <button
                  onClick={() => handleCopyAccount(settings.palmpayMerchantAccount, 'palmpay')}
                  className="px-3.5 py-2 bg-[#6F32E2]/10 hover:bg-[#6F32E2] text-[#6F32E2] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedBank === 'palmpay' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBank === 'palmpay' ? 'Copied!' : 'Copy PalmPay'}</span>
                </button>
              </div>

              <div className="text-xs text-[#666666]">
                Beneficiary Name: <strong className="text-[#171717]">{settings.palmpayMerchantName}</strong>
              </div>
            </div>

            {/* Commercial Banks */}
            <div className="pt-2">
              <h3 className="text-sm font-bold text-[#171717] mb-3">Commercial Bank Accounts:</h3>
              <div className="space-y-3">
                {bankAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-xl border border-[#E5E5E5] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#8B0000]">{acc.tag}</span>
                      <span className="text-[11px] text-[#666666]">{acc.bank}</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#FAFAFA] p-2.5 rounded-lg border border-[#E5E5E5]">
                      <strong className="text-sm font-mono text-[#171717]">{acc.accountNumber}</strong>
                      <button
                        onClick={() => handleCopyAccount(acc.accountNumber, acc.bank)}
                        className="text-xs font-bold text-[#B5121B] hover:underline cursor-pointer"
                      >
                        {copiedBank === acc.bank ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Giving Checkout */}
          <div className="lg:col-span-6 text-left">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2.5 py-1 rounded border border-[#F8D0D0]">
                  Method 2: Integrated Online Giving
                </span>
                <h2 className="text-2xl font-bold font-heading text-[#171717] mt-3">
                  Direct Seed Giving
                </h2>
                <p className="text-xs text-[#666666] mt-1">
                  Instant processing with verifiable reference and downloadable receipt.
                </p>
              </div>

              {completedReceipt ? (
                <div className="p-6 bg-[#FAFAFA] rounded-2xl border border-[#E5E5E5] text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#FDECEC] text-[#B5121B] flex items-center justify-center mx-auto border-2 border-[#B5121B]">
                    <Receipt className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#171717]">Giving Confirmed!</h3>
                    <p className="text-xs text-[#666666] mt-1">
                      Reference: <strong className="font-mono text-[#8B0000]">{completedReceipt.reference}</strong>
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#E5E5E5] text-xs text-left space-y-1.5">
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
                      <span className="text-[#666666]">Gateway:</span>
                      <span className="font-bold">{completedReceipt.paymentMethod}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCompletedReceipt(null)}
                    className="w-full py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Give Another Seed
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProcessPayment} className="space-y-4">
                  
                  {/* Gateway Selector */}
                  <div>
                    <label className="text-xs font-bold text-[#171717] block mb-1">
                      Choose Payment Method:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedGateway('opay')}
                        className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          selectedGateway === 'opay'
                            ? 'bg-[#00B875]/10 border-[#00B875] text-[#008753] ring-2 ring-[#00B875]/30'
                            : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#666666]'
                        }`}
                      >
                        <div className="w-5 h-5 rounded bg-[#00B875] text-white flex items-center justify-center font-black text-[10px]">
                          OP
                        </div>
                        <span className="text-[10px]">OPay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedGateway('palmpay')}
                        className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          selectedGateway === 'palmpay'
                            ? 'bg-[#6F32E2]/10 border-[#6F32E2] text-[#6F32E2] ring-2 ring-[#6F32E2]/30'
                            : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#666666]'
                        }`}
                      >
                        <div className="w-5 h-5 rounded bg-[#6F32E2] text-white flex items-center justify-center font-black text-[10px]">
                          PL
                        </div>
                        <span className="text-[10px]">PalmPay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedGateway('bank')}
                        className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          selectedGateway === 'bank'
                            ? 'bg-[#B5121B] text-white border-[#B5121B]'
                            : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#666666]'
                        }`}
                      >
                        <Building className="w-5 h-5" />
                        <span className="text-[10px]">Bank</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedGateway('card')}
                        className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          selectedGateway === 'card'
                            ? 'bg-[#B5121B] text-white border-[#B5121B]'
                            : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#666666]'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span className="text-[10px]">Card</span>
                      </button>
                    </div>
                  </div>

                  {/* Giving Purpose */}
                  <div>
                    <label className="text-xs font-bold text-[#171717] block mb-1">
                      Giving Purpose:
                    </label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                    >
                      <option value="Student Welfare Food Bank & Indigent Care">Student Welfare Food Bank & Indigent Care</option>
                      <option value="Mega Praise 2026 Logistics & Sound">Mega Praise 2026 Logistics & Sound</option>
                      <option value="General Fellowship Stewardship & Tithes">General Fellowship Stewardship & Tithes</option>
                      <option value="Campus Evangelism & Rural Missions">Campus Evangelism & Rural Missions</option>
                      <option value="JCCF Secretariat & Publications Sponsorship">JCCF Secretariat & Publications Sponsorship</option>
                    </select>
                  </div>

                  {/* Amount Selection */}
                  <div>
                    <label className="text-xs font-bold text-[#171717] block mb-1">
                      Amount in Naira (₦):
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
                        Your Name (Optional):
                      </label>
                      <input
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="e.g. Sis. Deborah"
                        className="w-full px-3.5 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#171717] block mb-1">
                        Phone Number:
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

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying with {selectedGateway.toUpperCase()} Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 fill-white" />
                        <span>Seed ₦{Number(amount || 0).toLocaleString()} via {selectedGateway === 'opay' ? 'OPay' : selectedGateway === 'palmpay' ? 'PalmPay' : selectedGateway === 'bank' ? 'Bank Transfer' : 'Card'}</span>
                      </>
                    )}
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
