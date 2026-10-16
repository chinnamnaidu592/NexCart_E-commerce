import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How does complimentary courier delivery operate?',
    a: 'Every order surpassing the ₹999 threshold qualifies for complimentary expedited courier dispatch. Consignments are packed within 24 hours in moisture-resistant archival crates with signature-required tracking.',
  },
  {
    q: 'What is the considered 30-day return procedure?',
    a: 'The stated return window is 30 days after receipt, with refund processing after warehouse verification. Return requests and refunds are not currently handled through this demo portal.',
  },
  {
    q: 'How is product provenance and authenticity guaranteed?',
    a: 'Each item cataloged on NexCart undergoes strict verification against authorized manufacturer ledgers. High-value watches, computing hardware, and sartorial goods include a numbered physical provenance card.',
  },
  {
    q: 'Can I track my consignment progress in real time?',
    a: 'Your account profile shows order status updates. Live courier tracking and delivery milestone notifications are not available in this demo portal.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="py-10 sm:py-12 bg-[#FAFAF9] border-b border-[#E7E5E4]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-[10px] font-mono font-medium text-[#78716C] uppercase tracking-[0.2em] block mb-1">
            Client Advisory
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1917] tracking-tight">
            Frequently Addressed Inquiries
          </h2>
          <p className="text-xs text-[#78716C] mt-1">
            Essential operational details regarding procurement, delivery, and guarantees.
          </p>
        </div>

        <div className="space-y-2.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-3.5 px-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAFAF9] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base text-[#1C1917] font-medium">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#78716C] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#1C1917]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-[#57534E] leading-relaxed border-t border-[#F5F5F4]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
