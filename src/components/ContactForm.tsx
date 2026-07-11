"use client";

import { useState } from "react";
import styles from "@/app/contact/page.module.css";

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  popular: boolean;
}

interface ContactSetting {
  id: number;
  phone: string | null;
  email: string | null;
  address: string | null;
  whatsapp: string | null;
  telegram: string | null;
  facebook: string | null;
  advertisingPlans: string | null;
}

interface ContactFormProps {
  settings: ContactSetting;
}

export default function ContactForm({ settings }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Parse advertising plans
  let plans: Plan[] = [];
  try {
    if (settings.advertisingPlans) {
      plans = JSON.parse(settings.advertisingPlans);
    }
  } catch (e) {
    console.error("Error parsing plans:", e);
  }

  // Handle WhatsApp package redirect
  const handleSubscribe = (planName: string) => {
    const whatsappNum = settings.whatsapp ? settings.whatsapp.replace("+", "") : "218928175897";
    const textMessage = `مرحباً منصة ليبيا بلس 🇱🇾، أود الاستفسار والاشتراك في: [${planName}]. يرجى تزويدي بالتفاصيل وطرق الدفع. شكراً لكم!`;
    const waUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(textMessage)}`;
    window.open(waUrl, "_blank");
  };

  // Handle mock form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });

    // Auto close success banner after 5s
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>تواصل معنا ✉️</h1>
        <p className={styles.subtitle}>
          يسعدنا دائماً الاستماع إليكم والإجابة على استفساراتكم. يرجى ملء النموذج أدناه أو التواصل معنا عبر القنوات الرسمية المباشرة.
        </p>
      </div>

      {/* 2. Contact details & message form split */}
      <section className={styles.contactGrid}>
        
        {/* Left Column: Coordinates */}
        <div className={`${styles.detailsBox} glass-card`}>
          <h2 className={styles.detailsTitle}>معلومات التواصل</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "10px" }}>
            يسعدنا دائماً الاستماع إليكم والإجابة على استفساراتكم.
          </p>

          <div className={styles.contactItem}>
            <div className={styles.iconWrapper}>📍</div>
            <div>
              <div className={styles.itemLabel}>العنوان الرئيسي</div>
              <div className={styles.itemValue}>{settings.address || "طرابلس - ليبيا"}</div>
            </div>
          </div>

          <div className={styles.contactItem}>
            <div className={styles.iconWrapper}>✉️</div>
            <div>
              <div className={styles.itemLabel}>البريد الإلكتروني</div>
              <div className={styles.itemValue}>{settings.email || "info@libyaplus.ly"}</div>
            </div>
          </div>

          <div className={styles.contactItem}>
            <div className={styles.iconWrapper}>📞</div>
            <div>
              <div className={styles.itemLabel}>رقم الهاتف</div>
              <div className={styles.itemValue}>{settings.phone || "+218928175897"}</div>
            </div>
          </div>

          <div className={styles.contactItem}>
            <div className={styles.iconWrapper}>💬</div>
            <div>
              <div className={styles.itemLabel}>رقم الواتساب</div>
              <div className={styles.itemValue}>{settings.whatsapp || "+218928175897"}</div>
            </div>
          </div>

          <div className={styles.contactItem} style={{ marginTop: "10px" }}>
            <a
              href={`https://t.me/${settings.telegram || "libyaplus_ad"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: "0.8rem", padding: "8px 12px" }}
            >
              🔵 تيليجرام
            </a>
            <a
              href={`https://facebook.com/${settings.facebook || "minassaalyawmplus"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: "0.8rem", padding: "8px 12px" }}
            >
              🔵 فيسبوك
            </a>
          </div>
        </div>

        {/* Right Column: Direct Message Form */}
        <div className={`${styles.formBox} glass-card`}>
          <h2 className={styles.detailsTitle} style={{ marginBottom: "20px" }}>أرسل لنا رسالة مباشرة</h2>

          {submitted && (
            <div className={styles.successAlert}>
              ✓ تم إرسال رسالتك بنجاح! وسيتواصل معك فريق الدعم في أقرب وقت ممكن.
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className="form-group">
              <label className="form-label">الاسم بالكامل *</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثال: أحمد علي"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني *</label>
              <input
                type="email"
                className="form-control"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
              />
            </div>

            <div className="form-group className={styles.fullWidth}" style={{ gridColumn: "span 2" }}>
              <label className="form-label">الموضوع / العنوان</label>
              <input
                type="text"
                className="form-control"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="عنوان الرسالة الاستفسارية"
              />
            </div>

            <div className="form-group className={styles.fullWidth}" style={{ gridColumn: "span 2" }}>
              <label className="form-label">محتوى الرسالة *</label>
              <textarea
                className="form-control"
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="اكتب استفسارك أو رسالتك هنا..."
              />
            </div>

            <div style={{ gridColumn: "span 2", marginTop: "10px" }}>
              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                ✉️ إرسال الرسالة الآن
              </button>
            </div>
          </form>
        </div>

      </section>
    </div>
  );
}
