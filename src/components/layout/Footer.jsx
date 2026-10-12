import React from 'react';
import Link from '@/components/common/Link';
import BrandLogo from '@/components/common/BrandLogo';
import { FOOTER_SECTIONS } from '@/constants/navLinks';
import { Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: Instagram,
  },
  {
    name: 'X (Twitter)',
    href: 'https://x.com',
    customIcon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: Facebook,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: Linkedin,
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    icon: Youtube,
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1C1917] text-[#A8A29E] border-t border-[#292524] pt-12 sm:pt-14 pb-12 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-10 border-b border-[#292524]">
          {/* Brand & Socials Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Brand Logo Component matching navbar styling */}
            <BrandLogo
              variant="light"
              tagline="Objects of Considered Utility"
              href="/"
            />

            <p className="text-xs sm:text-sm text-[#A8A29E] max-w-sm leading-relaxed">
              An independent archival catalog dedicated to certified provenance, enduring materials,
              and seamless international delivery.
            </p>

            {/* Clean row of Social Media Icons (Replaces newsletter per instructions) */}
            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#78716C] block mb-3 font-semibold">
                Connect & Dispatches
              </span>
              <div className="flex items-center gap-2.5 flex-wrap">
                {SOCIAL_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow NexCart on ${item.name}`}
                      className="w-8 h-8 rounded-full bg-[#292524] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#44403C] border border-[#44403C]/70 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105"
                    >
                      {item.customIcon ? (
                        item.customIcon
                      ) : (
                        <Icon className="w-4 h-4 stroke-[1.6]" />
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation link sections */}
          {FOOTER_SECTIONS.map((sec) => (
            <div key={sec.title} className="space-y-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E7E5E4]">
                {sec.title}
              </h4>
              <ul className="space-y-2.5 text-xs">
                {sec.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C] gap-4">
          <p>© {new Date().getFullYear()} NexCart Bureau Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
            <span className="hover:text-[#FAFAF9] transition-colors cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-[#FAFAF9] transition-colors cursor-pointer">Privacy Charter</span>
            <span className="hover:text-[#FAFAF9] transition-colors cursor-pointer">Security Certifications</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
