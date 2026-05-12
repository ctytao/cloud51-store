import type { Metadata } from "next";
import { CONTACT, zaloUrl, telUrl } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Về Cloud51 Store — Uy tín từ 2019",
  description: "Cloud51 Store — Hệ thống bán lẻ Apple & Dịch vụ iCloud uy tín hàng đầu.",
};

export default function AboutPage() {
  return (
    <div className="fade-in">
      <div className="about-h">
        <h1>Trust & Reliability</h1>
        <p>Cloud51 Store — Hệ thống bán lẻ Apple & Dịch vụ iCloud uy tín hàng đầu.</p>
      </div>

      <div className="trust-card">
        <div className="trust-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div className="trust-info">
          <h3>Hàng chính hãng 100%</h3>
          <p>Bảo hành 12 tháng Apple Vietnam, đầy đủ hoá đơn chứng từ.</p>
        </div>
      </div>

      <div className="trust-card">
        <div className="trust-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
          </svg>
        </div>
        <div className="trust-info">
          <h3>Trả góp 0% iCloud</h3>
          <p>Xét duyệt 15 phút, không chứng minh thu nhập, bảo mật tuyệt đối.</p>
        </div>
      </div>

      <div className="trust-card">
        <div className="trust-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div className="trust-info">
          <h3>Mở khoá iCloud</h3>
          <p>Dịch vụ chuyên nghiệp, tỷ lệ thành công cao, hoàn tiền 100%.</p>
        </div>
      </div>

      <div className="trust-card">
        <div className="trust-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="trust-info">
          <h3>Hoạt động từ 2019</h3>
          <p>Hơn 5 năm kinh nghiệm, hàng nghìn khách hàng hài lòng.</p>
        </div>
      </div>

      <div className="sec-hd">
        <div className="sec-h">Get In Touch</div>
        <div className="sec-title">Connect with Us</div>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <a href={zaloUrl(CONTACT.zalo)} target="_blank" rel="noopener noreferrer" className="btn btn-p" style={{ width: "100%", marginBottom: 12 }}>
          Zalo: {CONTACT.zalo.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}
        </a>
        <a href={telUrl(CONTACT.phone)} className="btn btn-s" style={{ width: "100%" }}>
          Hotline: {CONTACT.phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}
        </a>
      </div>
    </div>
  );
}
