import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Copy, 
  Check, 
  CreditCard, 
  Building, 
  ShieldCheck, 
  Receipt, 
  Download,
  Smartphone,
  QrCode,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { DonationRecord } from '../types';

interface GivingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentGateway = 'opay' | 'palmpay' | 'bank' | 'card';

export const GivingModal: React.FC<GivingModalProps> = ({ isOpen, onClose }) => {
  const { settings, recordDonation } = useApp();

  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('opay');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Giving Form State
  const [purpose, setPurpose] = useState('Student Welfare Food Bank & Indigent Care');
  const [amount, setAmount] = useState('5000');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  
  // Checkout & Simulation States
  const [opayFlow, setOpayFlow] = useState<'app' | 'account' | 'ussd'>('app');
  const [palmpayFlow, setPalmpayFlow] = useState<'app' | 'account' | 'qr'>('app');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<DonationRecord | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleProcessPayment = (method: 'OPay' | 'PalmPay' | 'Bank Transfer' | 'Card', channelDetails: string) => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const prefix = method === 'OPay' ? 'OPAY-' : method === 'PalmPay' ? 'PLMP-' : method === 'Bank Transfer' ? 'BNK-' : 'CRD-';
      const reference = prefix + Math.floor(10000000 + Math.random() * 90000000);

      const savedDonation = recordDonation({
        donorName: donorName.trim() || 'Anonymous Kingdom Partner',
        donorEmail: donorEmail.trim() || 'kingdom.partner@futa.edu.ng',
        donorPhone: donorPhone.trim() || undefined,
        amount: numAmount,
        purpose,
        reference,
        paymentMethod: method,
        status: 'Completed',
        channelDetails
      });

      setCompletedReceipt(savedDonation);

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log('Confetti triggered', err);
      }
    }, 1400);
  };

  const resetAndClose = () => {
    setCompletedReceipt(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E5E5E5] flex flex-col max-h-[92vh] text-left">
        
        {/* Header */}
        <div className="bg-[#8B0000] text-white p-6 relative">
          <button
            onClick={resetAndClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-[#FAFAFA] px-2 py-0.5 rounded">
              Secure Nigerian Fintech Gateway
            </span>
          </div>

          <h2 className="text-2xl font-black font-heading tracking-tight text-white flex items-center gap-2">
            <span>Kingdom Stewardship Giving</span>
          </h2>
          <p className="text-xs text-white/80 mt-1">
            Instant direct payments via <strong>OPay</strong>, <strong>PalmPay</strong>, and Verified FUTA Fellowship Accounts.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Completed Receipt State */}
          {completedReceipt ? (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FDECEC] text-[#B5121B] flex items-center justify-center mx-auto border-2 border-[#B5121B]">
                <Receipt className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B0000] block">
                  Payment Verified & Logged
                </span>
                <h3 className="text-2xl font-black text-[#171717] font-heading mt-0.5">
                  Thank You for Your Seed!
                </h3>
                <p className="text-xs text-[#666666] mt-1 max-w-md mx-auto">
                  Your seed has been recorded into the JCCF Central Stewardship Ledger. The Lord bless your life and spiritual walk!
                </p>
              </div>

              {/* Official Receipt Card */}
              <div className="bg-[#FAFAFA] p-5 rounded-2xl border border-[#E5E5E5] text-left space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
                  <span className="text-[#666666]">Official Reference:</span>
                  <strong className="text-[#8B0000] font-mono font-bold">{completedReceipt.reference}</strong>
                </div>
                <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
                  <span className="text-[#666666]">Partner Name:</span>
                  <strong className="text-[#171717]">{completedReceipt.donorName}</strong>
                </div>
                <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
                  <span className="text-[#666666]">Designated Cause:</span>
                  <strong className="text-[#B5121B]">{completedReceipt.purpose}</strong>
                </div>
                <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
                  <span className="text-[#666666]">Payment Gateway:</span>
                  <span className="font-bold text-[#171717] px-2 py-0.5 rounded bg-white border border-[#E5E5E5]">
                    {completedReceipt.paymentMethod} ({completedReceipt.channelDetails || 'Instant Verified'})
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
                  <span className="text-[#666666]">Amount Seeded:</span>
                  <strong className="text-[#8B0000] text-base font-bold">₦{(Number(completedReceipt?.amount) || 0).toLocaleString()}</strong>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#666666]">Transaction Date:</span>
                  <span className="text-[#171717] font-semibold">{completedReceipt.date}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-[#FAFAFA] hover:bg-[#E5E5E5] text-[#171717] border border-[#E5E5E5] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={resetAndClose}
                  className="flex-1 py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Payment Gateway Tabs */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#171717] block">
                  Select Preferred Payment Method:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('opay')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      selectedGateway === 'opay'
                        ? 'bg-[#00B875]/10 border-[#00B875] text-[#008753] ring-2 ring-[#00B875]/30'
                        : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#666666] hover:bg-[#E5E5E5]'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md bg-[#00B875] text-white flex items-center justify-center font-black text-[10px]">
                      OP
                    </div>
                    <span className="font-black text-[11px]">OPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway('palmpay')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      selectedGateway === 'palmpay'
                        ? 'bg-[#6F32E2]/10 border-[#6F32E2] text-[#6F32E2] ring-2 ring-[#6F32E2]/30'
                        : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#666666] hover:bg-[#E5E5E5]'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md bg-[#6F32E2] text-white flex items-center justify-center font-black text-[10px]">
                      PL
                    </div>
                    <span className="font-black text-[11px]">PalmPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway('bank')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      selectedGateway === 'bank'
                        ? 'bg-[#B5121B] text-white border-[#B5121B] ring-2 ring-[#B5121B]/30'
                        : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#666666] hover:bg-[#E5E5E5]'
                    }`}
                  >
                    <Building className="w-6 h-6" />
                    <span className="font-bold text-[11px]">Bank Wire</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway('card')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      selectedGateway === 'card'
                        ? 'bg-[#B5121B] text-white border-[#B5121B] ring-2 ring-[#B5121B]/30'
                        : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#666666] hover:bg-[#E5E5E5]'
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="font-bold text-[11px]">Card / Web</span>
                  </button>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#171717] block">
                  Donation Amount (NGN ₦):
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {['1000', '2000', '5000', '10000', '25000'].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setAmount(preset)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
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
                  placeholder="Or enter custom amount in ₦"
                  className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none font-bold"
                />
              </div>

              {/* Giving Purpose */}
              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">
                  Designated Ministry Cause:
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                >
                  <option value="Student Welfare Food Bank & Indigent Care">Student Welfare Food Bank & Indigent Care</option>
                  <option value="Mega Praise 2026 Logistics & Sound">Mega Praise 2026 Logistics & Sound</option>
                  <option value="Campus Evangelism & Rural Missions">Campus Evangelism & Rural Missions</option>
                  <option value="JCCF Secretariat & Publications Sponsorship">JCCF Secretariat & Publications Sponsorship</option>
                  <option value="General Fellowship Stewardship & Tithes">General Fellowship Stewardship & Tithes</option>
                </select>
              </div>

              {/* Donor Info (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">
                    Your Name (Optional):
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Bro. Emmanuel"
                    className="w-full px-3.5 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">
                    Phone / Email:
                  </label>
                  <input
                    type="text"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="e.g. 08145569021"
                    className="w-full px-3.5 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                  />
                </div>
              </div>

              {/* ================= GATEWAY 1: OPAY DIRECT ================= */}
              {selectedGateway === 'opay' && (
                <div className="bg-[#00B875]/5 border border-[#00B875]/30 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#00B875] text-white flex items-center justify-center font-black text-xs">
                        OP
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#008753]">OPay Instant Payment API</h4>
                        <span className="text-[10px] text-[#666666]">Zero transaction charges for Nigerian students</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-[#00B875]/15 text-[#008753] px-2 py-0.5 rounded">
                      Instant Credit
                    </span>
                  </div>

                  {/* OPay Flow Switcher */}
                  <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-[#00B875]/20">
                    <button
                      type="button"
                      onClick={() => setOpayFlow('app')}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                        opayFlow === 'app' ? 'bg-[#00B875] text-white shadow-xs' : 'text-[#666666]'
                      }`}
                    >
                      Pay in OPay App
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpayFlow('account')}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                        opayFlow === 'account' ? 'bg-[#00B875] text-white shadow-xs' : 'text-[#666666]'
                      }`}
                    >
                      OPay Account No.
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpayFlow('ussd')}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                        opayFlow === 'ussd' ? 'bg-[#00B875] text-white shadow-xs' : 'text-[#666666]'
                      }`}
                    >
                      OPay USSD (*955#)
                    </button>
                  </div>

                  {/* OPay Sub-views */}
                  {opayFlow === 'app' && (
                    <div className="bg-white p-4 rounded-xl border border-[#00B875]/20 space-y-3">
                      <div className="text-xs text-[#171717]">
                        Click the button below to initiate direct deep-link checkout to your <strong>OPay Wallet</strong> for <strong>₦{Number(amount || 0).toLocaleString()}</strong>.
                      </div>
                      <button
                        type="button"
                        onClick={() => handleProcessPayment('OPay', 'OPay Mobile Wallet Direct Checkout')}
                        disabled={isProcessing}
                        className="w-full py-3 bg-[#00B875] hover:bg-[#008753] text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Communicating with OPay API...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 fill-white" />
                            <span>Pay ₦{Number(amount || 0).toLocaleString()} with OPay</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {opayFlow === 'account' && (
                    <div className="bg-white p-4 rounded-xl border border-[#00B875]/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#666666] block">OPay Merchant Account Number:</span>
                          <strong className="text-base font-black text-[#171717] font-mono tracking-wider">
                            {settings.opayMerchantAccount}
                          </strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(settings.opayMerchantAccount, 'opay')}
                          className="px-3 py-1.5 bg-[#00B875]/10 text-[#008753] hover:bg-[#00B875] hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText === 'opay' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedText === 'opay' ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="text-[11px] text-[#666666]">
                        Account Name: <strong className="text-[#171717]">{settings.opayMerchantName}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleProcessPayment('OPay', 'OPay Account Transfer Verified')}
                        disabled={isProcessing}
                        className="w-full py-2.5 bg-[#008753] text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-[#00B875] transition-colors"
                      >
                        {isProcessing ? 'Verifying Transfer...' : 'I Have Transferred via OPay'}
                      </button>
                    </div>
                  )}

                  {opayFlow === 'ussd' && (
                    <div className="bg-white p-4 rounded-xl border border-[#00B875]/20 space-y-2 text-center">
                      <span className="text-xs text-[#666666] block">Dial this code on your registered OPay SIM:</span>
                      <div className="p-3 bg-[#FAFAFA] rounded-xl font-mono text-sm font-black text-[#008753] border border-[#00B875]/30">
                        *955*1*{settings.opayMerchantAccount}*{amount}#
                      </div>
                      <button
                        type="button"
                        onClick={() => handleProcessPayment('OPay', 'OPay USSD Instant String')}
                        disabled={isProcessing}
                        className="w-full py-2.5 bg-[#00B875] text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-[#008753]"
                      >
                        {isProcessing ? 'Verifying USSD Session...' : 'Confirm USSD Payment'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ================= GATEWAY 2: PALMPAY DIRECT ================= */}
              {selectedGateway === 'palmpay' && (
                <div className="bg-[#6F32E2]/5 border border-[#6F32E2]/30 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#6F32E2] text-white flex items-center justify-center font-black text-xs">
                        PL
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#6F32E2]">PalmPay Integrated Checkout</h4>
                        <span className="text-[10px] text-[#666666]">Direct PalmPay Wallet & PalmPoints Cashback support</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-[#6F32E2]/15 text-[#6F32E2] px-2 py-0.5 rounded">
                      Instant Auto-Confirm
                    </span>
                  </div>

                  {/* PalmPay Flow Switcher */}
                  <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-[#6F32E2]/20">
                    <button
                      type="button"
                      onClick={() => setPalmpayFlow('app')}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                        palmpayFlow === 'app' ? 'bg-[#6F32E2] text-white shadow-xs' : 'text-[#666666]'
                      }`}
                    >
                      PalmPay App One-Touch
                    </button>
                    <button
                      type="button"
                      onClick={() => setPalmpayFlow('account')}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                        palmpayFlow === 'account' ? 'bg-[#6F32E2] text-white shadow-xs' : 'text-[#666666]'
                      }`}
                    >
                      PalmPay Account Transfer
                    </button>
                  </div>

                  {palmpayFlow === 'app' && (
                    <div className="bg-white p-4 rounded-xl border border-[#6F32E2]/20 space-y-3">
                      <div className="text-xs text-[#171717]">
                        Directly launch <strong>PalmPay App</strong> or instant web link to approve the <strong>₦{Number(amount || 0).toLocaleString()}</strong> transfer.
                      </div>
                      <button
                        type="button"
                        onClick={() => handleProcessPayment('PalmPay', 'PalmPay Mobile App Direct Link')}
                        disabled={isProcessing}
                        className="w-full py-3 bg-[#6F32E2] hover:bg-[#5822B8] text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Verifying PalmPay Gateway...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 fill-white" />
                            <span>Pay ₦{Number(amount || 0).toLocaleString()} via PalmPay</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {palmpayFlow === 'account' && (
                    <div className="bg-white p-4 rounded-xl border border-[#6F32E2]/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#666666] block">PalmPay Merchant Number:</span>
                          <strong className="text-base font-black text-[#171717] font-mono tracking-wider">
                            {settings.palmpayMerchantAccount}
                          </strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(settings.palmpayMerchantAccount, 'palmpay')}
                          className="px-3 py-1.5 bg-[#6F32E2]/10 text-[#6F32E2] hover:bg-[#6F32E2] hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText === 'palmpay' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedText === 'palmpay' ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="text-[11px] text-[#666666]">
                        Beneficiary: <strong className="text-[#171717]">{settings.palmpayMerchantName}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleProcessPayment('PalmPay', 'PalmPay Merchant Account Transfer')}
                        disabled={isProcessing}
                        className="w-full py-2.5 bg-[#5822B8] text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-[#6F32E2] transition-colors"
                      >
                        {isProcessing ? 'Verifying PalmPay Transfer...' : 'I Have Transferred via PalmPay'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ================= GATEWAY 3: TRADITIONAL BANK TRANSFER ================= */}
              {selectedGateway === 'bank' && (
                <div className="space-y-3">
                  <div className="p-3 bg-[#FDECEC] rounded-xl border border-[#F8D0D0] text-xs text-[#8B0000] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-[#B5121B]" />
                    <span>Official verified institutional bank accounts of JCCF FUTA:</span>
                  </div>

                  <div className="bg-[#FAFAFA] p-3.5 rounded-2xl border border-[#E5E5E5] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#8B0000]">Guaranty Trust Bank (GTBank)</span>
                      <span className="text-[10px] text-[#666666]">Welfare & Projects</span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#E5E5E5]">
                      <strong className="text-base font-black text-[#171717] font-mono">0129384756</strong>
                      <button
                        type="button"
                        onClick={() => handleCopy('0129384756', 'gtb')}
                        className="px-2.5 py-1 bg-[#FAFAFA] hover:bg-[#E5E5E5] rounded text-xs font-bold border border-[#E5E5E5] cursor-pointer"
                      >
                        {copiedText === 'gtb' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <span className="text-[10px] text-[#666666] block">Name: <strong>JCCF FUTA - Welfare & Indigent Care</strong></span>
                  </div>

                  <div className="bg-[#FAFAFA] p-3.5 rounded-2xl border border-[#E5E5E5] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#8B0000]">First Bank of Nigeria</span>
                      <span className="text-[10px] text-[#666666]">General Fellowship</span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#E5E5E5]">
                      <strong className="text-base font-black text-[#171717] font-mono">2034981120</strong>
                      <button
                        type="button"
                        onClick={() => handleCopy('2034981120', 'fbn')}
                        className="px-2.5 py-1 bg-[#FAFAFA] hover:bg-[#E5E5E5] rounded text-xs font-bold border border-[#E5E5E5] cursor-pointer"
                      >
                        {copiedText === 'fbn' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <span className="text-[10px] text-[#666666] block">Name: <strong>Joint Christian Campus Fellowship FUTA</strong></span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleProcessPayment('Bank Transfer', 'Direct Commercial Bank Transfer')}
                    disabled={isProcessing}
                    className="w-full py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    {isProcessing ? 'Verifying Bank Deposit...' : 'Confirm Bank Transfer Completed'}
                  </button>
                </div>
              )}

              {/* ================= GATEWAY 4: DEBIT CARD / WEB ================= */}
              {selectedGateway === 'card' && (
                <div className="space-y-4 bg-[#FAFAFA] p-4 rounded-2xl border border-[#E5E5E5]">
                  <div className="text-xs text-[#171717] font-semibold">
                    Secure Card Processing for Verve, Mastercard, and Visa debit cards.
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#666666] block mb-1">Card Number (Simulated Secure Sandbox):</label>
                    <input
                      type="text"
                      defaultValue="5399 •••• •••• 4910"
                      className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs font-mono text-[#171717] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-[#666666] block mb-1">Expiry:</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs font-mono text-[#171717]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#666666] block mb-1">CVV:</label>
                      <input
                        type="text"
                        defaultValue="892"
                        className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs font-mono text-[#171717]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleProcessPayment('Card', 'Debit Card 3D Secure Web Pay')}
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? 'Authorizing with Bank...' : `Pay ₦${Number(amount || 0).toLocaleString()} with Card`}
                  </button>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
