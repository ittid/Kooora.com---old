import Link from "next/link";
import {
  FaInstagram,
  FaXTwitter,
  FaFacebookF,
  FaWhatsapp,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";
import { footerColumns, socialLinks } from "@/lib/routes";

export default function Footer() {
  return (
    <footer
      className="bg-kooora-page"
      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
    >
      <div className="w-[970px] mx-auto bg-kooora-dark text-white px-6 pt-4 pb-6">
        {/* Logo on the top RIGHT (first in source under RTL) */}
        <div className="flex items-center justify-start mb-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-kooora-gold flex items-center justify-center">
              <span className="text-kooora-dark font-black text-lg">K</span>
            </div>
            <span className="text-kooora-gold font-black text-2xl tracking-wide">
              KOOORA
            </span>
          </Link>
        </div>

        {/* Gold rule */}
        <div className="h-px bg-kooora-gold mb-5" />

        {/* 5 link columns */}
        <div className="grid grid-cols-5 gap-4 text-[13px] mb-6 text-white/90">
          {footerColumns.map((col, i) => (
            <ul key={i} className="space-y-2">
              {col.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-kooora-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>

        {/* Social icons — visual LEFT under RTL = justify-end */}
        <div className="flex justify-end mb-5">
          <div className="grid grid-cols-3 gap-x-2 gap-y-2">
            <SocialIcon
              href={socialLinks.instagram}
              label="Instagram"
              bg="linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)"
            >
              <FaInstagram />
            </SocialIcon>
            <SocialIcon href={socialLinks.twitter} label="X (Twitter)" bg="#000">
              <FaXTwitter />
            </SocialIcon>
            <SocialIcon href={socialLinks.facebook} label="Facebook" bg="#1877f2">
              <FaFacebookF />
            </SocialIcon>
            <SocialIcon href={socialLinks.whatsapp} label="WhatsApp" bg="#25d366">
              <FaWhatsapp />
            </SocialIcon>
            <SocialIcon href={socialLinks.tiktok} label="TikTok" bg="#000">
              <FaTiktok />
            </SocialIcon>
            <SocialIcon href={socialLinks.youtube} label="YouTube" bg="#ff0000">
              <FaYoutube />
            </SocialIcon>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-[12px] text-white/80">
          جميع الحقوق محفوظة لـ كووورة © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  bg,
  children,
}: {
  href: string;
  label: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[15px]"
      style={{ background: bg }}
    >
      {children}
    </a>
  );
}
