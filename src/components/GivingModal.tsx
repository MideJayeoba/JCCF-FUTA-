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
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { DonationRecord } from '../types';
import { JCCFLogo } from './JCCFLogo';

interface GivingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentGateway = 'bank' | 'opay' | 'palmpay' | 'card';

export const GivingModal: React.FC<GivingModalProps> = ({ isOpen, onClose }) => {
  const { settings, recordDonation } = useApp();

  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('bank');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Giving Form State (Optional logging)
  const [showLogForm, setShowLogForm] = useState(false);
  const [purpose, setPurpose] = useState('General Fellowship Stewardship & Tithes');
  const [amount, setAmount] = useState('5000');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [transferRef, setTransferRef] = useState('');
  
  // Checkout & Simulation States
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<DonationRecord | null>(null);

  const officialAccounts = [
    {
      bank: 'Wema Bank',
      accountNumber: '0222953276',
      accountName: 'Joint Christian Campus Fellowship',
      purpose: 'Tithe, Offering & General Support',
      badge: 'Primary Account'
    },
    {
      bank: 'Wema Bank',
      accountNumber: '0242883780',
      accountName: 'Joint Christian Campus Fellowship',
      purpose: 'Welfare Food Bank, Projects & Mega Praise',
      badge: 'Projects & Welfare'
    }
  ];

  // Handle Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        resetAndClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleLogManualTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const reference = transferRef.trim() || `WEMA-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const savedDonation = recordDonation({
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
    }, 1000);
  };

  const resetAndClose = () => {
    setCompletedReceipt(null);
    setIsProcessing(false);
    setShowLogForm(false);
    setSelectedGateway('bank');
    onClose();
  };

  return (
    <div 
      onClick={resetAndClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#171717]/85 backdrop-blur-xs animate-in fade-in overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E5E5E5] flex flex-col max-h-[92vh] text-left my-auto"
      >
        
        {/* Header */}
        <div className="bg-[#8B0000] text-white p-6 relative">
          <button
            onClick={resetAndClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-1 bg-white rounded-full shrink-0 shadow-xs">
              <JCCFLogo size={36} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-[#FAFAFA] px-2 py-0.5 rounded">
                  Official Stewardship Channel
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white flex items-center gap-2">
                <span>Kingdom Giving & Support</span>
              </h2>
            </div>
          </div>
          <p className="text-xs text-white/80 mt-2">
            Send directly to verified institutional bank accounts of the <strong>Joint Christian Campus Fellowship (JCCF FUTA)</strong>.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Completed Receipt State */}
          {completedReceipt ? (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-white p-1 flex items-center justify-center mx-auto border-2 border-[#B5121B] shadow-md">
                <JCCFLogo size={56} />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B0000] block">
                  Transfer Logged Successfully
                </span>
                <h3 className="text-2xl font-black text-[#171717] font-heading mt-0.5">
                  Thank You for Your Seed!
                </h3>
                <p className="text-xs text-[#666666] mt-1 max-w-md mx-auto">
                  Your seed record has been logged in the JCCF Central Stewardship database. May God multiply your seed and bless the work in FUTA!
                </p>
              </div>

              {/* Receipt Box */}
              <div className="p-5 bg-[#FAFAFA] rounded-2xl border border-[#E5E5E5] text-left text-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                  <span className="text-[11px] font-bold text-[#666666] uppercase">Reference ID</span>
                  <strong className="font-mono text-[#8B0000] font-bold">{completedReceipt.reference}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Donor Name:</span>
                  <strong className="text-[#171717]">{completedReceipt.donorName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Ministry Cause:</span>
                  <strong className="text-[#B5121B]">{completedReceipt.purpose}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Amount Seeded:</span>
                  <strong className="text-[#8B0000] font-bold text-sm">₦{(Number(completedReceipt?.amount) || 0).toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Payment Channel:</span>
                  <span className="font-semibold text-[#171717]">{completedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Date & Time:</span>
                  <span className="text-[#666666]">{completedReceipt.date}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-[#FAFAFA] hover:bg-[#E5E5E5] text-[#171717] font-bold text-xs rounded-xl border border-[#E5E5E5] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
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
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#171717]">
                    Payment Methods:
                  </label>
                  <span className="text-[10px] font-bold text-[#008753] bg-[#E6F8F0] px-2 py-0.5 rounded-full border border-[#B2ECD6]">
                    Direct Transfer Available
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {/* Bank Transfer (Active) */}
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('bank')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 relative ${
                      selectedGateway === 'bank'
                        ? 'bg-[#B5121B] text-white border-[#B5121B] ring-2 ring-[#B5121B]/30'
                        : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#171717] hover:bg-[#E5E5E5]'
                    }`}
                  >
                    <Building className="w-5 h-5" />
                    <span className="font-bold text-[11px]">Bank Transfer</span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      selectedGateway === 'bank' ? 'bg-white text-[#B5121B]' : 'bg-[#E6F8F0] text-[#008753]'
                    }`}>
                      Active
                    </span>
                  </button>

                  {/* OPay (Coming Soon) */}
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('opay')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 opacity-80 hover:opacity-100 ${
                      selectedGateway === 'opay'
                        ? 'bg-[#00B875]/10 border-[#00B875] text-[#008753] ring-2 ring-[#00B875]/30'
                        : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#666666] hover:bg-[#E5E5E5]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-md bg-[#00B875] text-white flex items-center justify-center font-black text-[9px]">
                      OP
                    </div>
                    <span className="font-bold text-[11px]">OPay</span>
                    <span className="text-[9px] bg-[#FFF2DE] text-[#D97706] px-1 py-0.2 rounded-full font-bold">
                      Soon
                    </span>
                  </button>

                  {/* PalmPay (Coming Soon) */}
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('palmpay')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 opacity-80 hover:opacity-100 ${
                      selectedGateway === 'palmpay'
                        ? 'bg-[#6F32E2]/10 border-[#6F32E2] text-[#6F32E2] ring-2 ring-[#6F32E2]/30'
                        : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#666666] hover:bg-[#E5E5E5]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-md bg-[#6F32E2] text-white flex items-center justify-center font-black text-[9px]">
                      PL
                    </div>
                    <span className="font-bold text-[11px]">PalmPay</span>
                    <span className="text-[9px] bg-[#FFF2DE] text-[#D97706] px-1 py-0.2 rounded-full font-bold">
                      Soon
                    </span>
                  </button>

                  {/* Card / Web (Coming Soon) */}
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('card')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 opacity-80 hover:opacity-100 ${
                      selectedGateway === 'card'
                        ? 'bg-[#171717] text-white border-[#171717] ring-2 ring-[#171717]/30'
                        : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#666666] hover:bg-[#E5E5E5]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-bold text-[11px]">Card / Web</span>
                    <span className="text-[9px] bg-[#FFF2DE] text-[#D97706] px-1 py-0.2 rounded-full font-bold">
                      Soon
                    </span>
                  </button>
                </div>
              </div>

              {/* ================= GATEWAY 1: BANK TRANSFER (AVAILABLE & PRIMARY) ================= */}
              {selectedGateway === 'bank' && (
                <div className="space-y-4">
                  
                  {/* Status Banner */}
                  <div className="p-3 bg-[#E6F8F0] rounded-xl border border-[#B2ECD6] text-xs text-[#00603B] flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-[#008753] mt-0.5" />
                    <div>
                      <span className="font-bold block">Direct Manual Transfer (Currently Active)</span>
                      <span>Copy the official Wema Bank account details below and transfer via your mobile banking app or USSD.</span>
                    </div>
                  </div>

                  {/* Verified Accounts List */}
                  <div className="space-y-3">
                    {officialAccounts.map((acc, idx) => (
                      <div 
                        key={idx}
                        className="bg-[#FAFAFA] p-4 rounded-2xl border border-[#E5E5E5] space-y-2.5 transition-all hover:border-[#B5121B]/40 hover:bg-white"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-[#8B0000]">{acc.bank}</span>
                            <span className="text-[10px] font-bold bg-[#FDECEC] text-[#8B0000] px-2 py-0.5 rounded-full border border-[#F8D0D0]">
                              {acc.badge}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#666666]">{acc.purpose}</span>
                        </div>

                        {/* Account Number Box with 1-Click Copy */}
                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#E5E5E5]">
                          <div>
                            <span className="text-[10px] text-[#666666] block font-medium">Account Number</span>
                            <strong className="text-lg font-black text-[#171717] font-mono tracking-wider">
                              {acc.accountNumber}
                            </strong>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopy(acc.accountNumber, acc.accountNumber)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              copiedText === acc.accountNumber
                                ? 'bg-[#00B875] text-white shadow-xs'
                                : 'bg-[#FDECEC] text-[#8B0000] hover:bg-[#B5121B] hover:text-white'
                            }`}
                          >
                            {copiedText === acc.accountNumber ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Account</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="text-[11px] text-[#666666]">
                          Beneficiary: <strong className="text-[#171717]">{acc.accountName}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Transfer Logging Accordion / Section */}
                  {!showLogForm ? (
                    <div className="pt-1 text-center">
                      <button
                        type="button"
                        onClick={() => setShowLogForm(true)}
                        className="text-xs font-bold text-[#8B0000] hover:text-[#B5121B] hover:underline cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Already sent? Click here to log your transfer & get a receipt (Optional)</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleLogManualTransfer} className="p-4 bg-[#FAFAFA] rounded-2xl border border-[#E5E5E5] space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                        <h4 className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
                          <Receipt className="w-4 h-4 text-[#8B0000]" />
                          <span>Record Bank Transfer for Confirmation</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowLogForm(false)}
                          className="text-[11px] text-[#666666] hover:text-[#171717] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[11px] font-bold text-[#666666] block mb-1">Your Name:</label>
                          <input
                            type="text"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            placeholder="e.g. Bro. David"
                            className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[#666666] block mb-1">Amount Sent (₦):</label>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount in ₦"
                            required
                            className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#171717] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[#666666] block mb-1">Designated Cause:</label>
                        <select
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:outline-none"
                        >
                          <option value="General Fellowship Stewardship & Tithes">General Fellowship Stewardship & Tithes</option>
                          <option value="Student Welfare Food Bank & Indigent Care">Student Welfare Food Bank & Indigent Care</option>
                          <option value="Mega Praise 2026 Logistics & Sound">Mega Praise 2026 Logistics & Sound</option>
                          <option value="Campus Evangelism & Rural Missions">Campus Evangelism & Rural Missions</option>
                          <option value="JCCF Secretariat & Publications Sponsorship">JCCF Secretariat & Publications Sponsorship</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[#666666] block mb-1">Transfer Reference / Bank Narration (Optional):</label>
                        <input
                          type="text"
                          value={transferRef}
                          onChange={(e) => setTransferRef(e.target.value)}
                          placeholder="e.g. Session1234 / Bank App Ref"
                          className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isProcessing ? 'Generating Confirmation Receipt...' : 'Confirm Transfer & Generate Receipt'}
                      </button>
                    </form>
                  )}

                </div>
              )}

              {/* ================= COMING SOON VIEW FOR OPAY / PALMPAY / CARD ================= */}
              {selectedGateway !== 'bank' && (
                <div className="p-6 bg-[#FAFAFA] rounded-2xl border border-[#E5E5E5] text-center space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-[#FFF2DE] text-[#D97706] flex items-center justify-center mx-auto border border-[#FDE68A]">
                    <Clock className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-[#FFF2DE] text-[#D97706] px-2.5 py-0.5 rounded-full mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Feature In Progress</span>
                    </div>
                    <h3 className="text-base font-bold text-[#171717]">
                      {selectedGateway === 'opay' && 'OPay Direct Online Checkout'}
                      {selectedGateway === 'palmpay' && 'PalmPay Instant Wallet Gateway'}
                      {selectedGateway === 'card' && 'Debit Card (Mastercard / Visa / Verve) Web Pay'}
                    </h3>
                    <p className="text-xs text-[#666666] mt-2 max-w-sm mx-auto leading-relaxed">
                      Automated checkout with <strong>{selectedGateway === 'opay' ? 'OPay' : selectedGateway === 'palmpay' ? 'PalmPay' : 'Debit Card Web Pay'}</strong> is currently in integration and will be available in the upcoming update.
                    </p>
                    <p className="text-xs font-semibold text-[#8B0000] mt-2">
                      Please use the direct manual bank transfer option to send your seed to our verified Wema Bank accounts.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('bank')}
                      className="px-6 py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                    >
                      <Building className="w-4 h-4" />
                      <span>Switch to Direct Bank Transfer (Available Now)</span>
                    </button>
                  </div>
                </div>
              )}

            </>
          )}

        </div>

      </div>
    </div>
  );
};
