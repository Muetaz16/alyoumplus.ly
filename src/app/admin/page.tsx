"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import db from "@/lib/db";
import { adminLoginAction } from "@/lib/actions";
import { toDirectImageUrl, getYouTubeThumbnail } from "@/lib/utils";
import styles from "./page.module.css";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Video {
  id: number;
  title: string;
  description: string | null;
  type: string;
  url: string;
  thumbnail: string | null;
  views: number;
  likes: number;
  isFeatured: boolean;
  categoryId: number | null;
  category?: Category | null;
  createdAt?: any;
}

interface ContactSetting {
  id: number;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  telegram: string;
  facebook: string;
  advertisingPlans: string;
  exchangeUsd?: string | null;
  exchangeEur?: string | null;
  exchangeGbp?: string | null;
}

export default function AdminPage() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Data states
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<ContactSetting | null>(null);
  const [loading, setLoading] = useState(true);

  // Search input state
  const [searchQuery, setSearchQuery] = useState("");

  // Active navigation tab: separated youtube-videos, reels, and interactive widgets!
  const [activeTab, setActiveTab] = useState<"overview" | "youtube-videos" | "reels" | "vr360" | "categories" | "live-control" | "settings" | "interactive-widgets">("overview");

  // Form states for Live Panel
  const [liveTitle, setLiveTitle] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [liveIsFeatured, setLiveIsFeatured] = useState(false);
  const [liveDescription, setLiveDescription] = useState("");

  // Sync Live form states with fetched videos array
  useEffect(() => {
    const currentLive = videos.find((v) => v.type === "LIVE");
    if (currentLive) {
      setLiveTitle(currentLive.title || "البث المباشر لقناة ليبيا بلس");
      setLiveUrl(currentLive.url || "");
      setLiveIsFeatured(currentLive.isFeatured);
      setLiveDescription(currentLive.description || "");
    }
  }, [videos]);

  // Form states for Interactive Ticker and Poll Widgets
  const [pollQuestion, setPollQuestion] = useState("ما هي نوعية التغطية الإعلامية التي تود رؤيتها بكثافة أكبر على منصة ليبيا بلس؟");
  const [pollOption1, setPollOption1] = useState("التغطيات الإخبارية المباشرة للأحداث المحلية");
  const [pollOption2, setPollOption2] = useState("تقارير الفيديو الوثائقية والبرامج السياسية");
  const [pollOption3, setPollOption3] = useState("مقاطع الريلز القصيرة والتغطيات الميدانية الخفيفة");
  const [pollVotes1, setPollVotes1] = useState(154);
  const [pollVotes2, setPollVotes2] = useState(108);
  const [pollVotes3, setPollVotes3] = useState(78);
  const [tickerTextarea, setTickerTextarea] = useState("");

  // Role and multi-user administrative states
  const [currentUserRole, setCurrentUserRole] = useState("ADMIN");
  const [currentUserName, setCurrentUserName] = useState("رئيس التحرير");
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "EDITOR",
  });

  // Modal display toggles
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Form states
  const [videoForm, setVideoForm] = useState({
    id: "",
    title: "",
    description: "",
    type: "YOUTUBE", // "REEL", "LIVE", "YOUTUBE"
    url: "",
    thumbnail: "",
    categoryId: "",
    isFeatured: false,
  });

  const [categoryForm, setCategoryForm] = useState({
    id: "",
    name: "",
    slug: "",
  });

  const [settingsForm, setSettingsForm] = useState({
    phone: "",
    email: "",
    address: "",
    whatsapp: "",
    telegram: "",
    facebook: "",
    advertisingPlans: "",
    exchangeUsd: "",
    exchangeEur: "",
    exchangeGbp: "",
  });

  const [statusMessage, setStatusMessage] = useState("");

  // 1. Authenticate locally on mount
  useEffect(() => {
    const authSession = localStorage.getItem("libyaplus_admin_auth");
    if (authSession === "true") {
      setIsAuthenticated(true);
      setCurrentUserRole(localStorage.getItem("libyaplus_admin_role") || "ADMIN");
      setCurrentUserName(localStorage.getItem("libyaplus_admin_name") || "رئيس التحرير");
    }
  }, []);

  // 2. Fetch all dashboard data if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [videosData, catsData, settingsData, tickerDoc, pollDoc, usersData] = await Promise.all([
        db.video.findMany(),
        db.category.findMany(),
        db.contactSetting.findFirst(),
        db.generalSetting.findUnique({ where: { id: "ticker" } }),
        db.generalSetting.findUnique({ where: { id: "poll" } }),
        db.adminUser.findMany()
      ]);

      setVideos(videosData);
      setCategories(catsData);
      setSettings(settingsData);
      setAdminUsers(usersData || []);

      // Pre-populate settings form
      if (settingsData) {
        setSettingsForm({
          phone: settingsData.phone || "",
          email: settingsData.email || "",
          address: settingsData.address || "",
          whatsapp: settingsData.whatsapp || "",
          telegram: settingsData.telegram || "",
          facebook: settingsData.facebook || "",
          advertisingPlans: settingsData.advertisingPlans || "",
          exchangeUsd: settingsData.exchangeUsd || "",
          exchangeEur: settingsData.exchangeEur || "",
          exchangeGbp: settingsData.exchangeGbp || "",
        });
      }

      // Pre-populate ticker and poll forms
      const ticker = tickerDoc as any;
      if (ticker && ticker.items) {
        setTickerTextarea(ticker.items.join("\n"));
      }
      const poll = pollDoc as any;
      if (poll) {
        setPollQuestion(poll.question || "");
        setPollOption1(poll.option1 || "");
        setPollOption2(poll.option2 || "");
        setPollOption3(poll.option3 || "");
        setPollVotes1(poll.votes1 || 0);
        setPollVotes2(poll.votes2 || 0);
        setPollVotes3(poll.votes3 || 0);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lockscreen gate submission (Secure DB-driven lockscreen matching)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Authenticate with Server Action
      const result = await adminLoginAction(email, password);

      if (result.success && result.user) {
        localStorage.setItem("libyaplus_admin_auth", "true");
        localStorage.setItem("libyaplus_admin_role", result.user.role || "ADMIN");
        localStorage.setItem("libyaplus_admin_name", result.user.name || "رئيس التحرير");

        setCurrentUserRole(result.user.role || "ADMIN");
        setCurrentUserName(result.user.name || "رئيس التحرير");
        setIsAuthenticated(true);
        setAuthError("");
        fetchDashboardData();
      } else {
        setAuthError(result.error || "البريد الإلكتروني أو كلمة المرور خاطئة!");
      }
    } catch (err: any) {
      console.error(err);
      setAuthError("حدث خطأ أثناء الاتصال بالخادم للتحقق من بيانات الدخول.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("libyaplus_admin_auth");
    localStorage.removeItem("libyaplus_admin_role");
    localStorage.removeItem("libyaplus_admin_name");
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  const handleSaveLive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveUrl.trim()) {
      alert("يرجى إدخال رابط البث المباشر من يوتيوب أولاً.");
      return;
    }

    const currentLive = videos.find((v) => v.type === "LIVE");
    const isEditing = !!currentLive;

    try {
      if (isEditing) {
        await db.video.update({
          where: { id: currentLive.id },
          data: {
            title: liveTitle,
            description: liveDescription,
            url: liveUrl,
            isFeatured: liveIsFeatured,
          }
        });
      } else {
        await db.video.create({
          data: {
            title: liveTitle,
            description: liveDescription,
            type: "LIVE",
            url: liveUrl,
            isFeatured: liveIsFeatured,
            categoryId: null,
            thumbnail: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&auto=format&fit=crop",
          }
        });
      }
      triggerStatus("تم تحديث إعدادات البث المباشر بنجاح! ✓");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الاتصال بالخادم لتحديث البث.");
    }
  };

  const handleSaveInteractiveWidgets = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const items = tickerTextarea
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      await Promise.all([
        db.generalSetting.upsert({
          where: { id: "ticker" },
          create: { items },
          update: { items }
        }),
        db.generalSetting.upsert({
          where: { id: "poll" },
          create: {
            question: pollQuestion,
            option1: pollOption1,
            option2: pollOption2,
            option3: pollOption3,
            votes1: Number(pollVotes1) || 0,
            votes2: Number(pollVotes2) || 0,
            votes3: Number(pollVotes3) || 0,
          },
          update: {
            question: pollQuestion,
            option1: pollOption1,
            option2: pollOption2,
            option3: pollOption3,
            votes1: Number(pollVotes1) || 0,
            votes2: Number(pollVotes2) || 0,
            votes3: Number(pollVotes3) || 0,
          }
        })
      ]);

      triggerStatus("تم حفظ وتحديث إعدادات استطلاع الرأي وشريط الأخبار بنجاح! ✓");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ الإعدادات التفاعلية.");
    }
  };

  // ==========================================
  // USERS CRUD HANDLERS
  // ==========================================
  const openAddUser = () => {
    setUserForm({
      id: "",
      name: "",
      email: "",
      password: "",
      role: "EDITOR",
    });
    setShowUserModal(true);
  };

  const openEditUser = (user: any) => {
    setUserForm({
      id: user.id.toString(),
      name: user.name || "",
      email: user.email,
      password: user.password,
      role: user.role || "EDITOR",
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.email.trim() || !userForm.name.trim()) {
      alert("يرجى ملء الحقول المطلوبة.");
      return;
    }

    const isEditing = !!userForm.id;
    try {
      if (isEditing) {
        const payload: any = {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
        };
        if (userForm.password && userForm.password.trim()) {
          payload.password = userForm.password;
        }
        await db.adminUser.update({
          where: { id: parseInt(userForm.id) },
          data: payload,
        });
        triggerStatus("تم تحديث بيانات العضو بنجاح! ✓");
      } else {
        if (!userForm.password.trim()) {
          alert("كلمة المرور مطلوبة لإضافة عضو جديد.");
          return;
        }

        // Prevent creating duplicate emails
        const existing = adminUsers.find(
          (u) => u.email.toLowerCase() === userForm.email.toLowerCase()
        );
        if (existing) {
          alert("البريد الإلكتروني المدخل مسجل بالفعل لعضو آخر!");
          return;
        }

        // Save metadata in Prisma DB including the password
        await db.adminUser.create({
          data: {
            name: userForm.name,
            email: userForm.email,
            role: userForm.role,
            password: userForm.password,
          },
        });
        triggerStatus("تم إضافة العضو الجديد بنجاح! ✓");
      }
      setShowUserModal(false);
      fetchDashboardData();
    } catch (err: any) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ بيانات العضو.");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (userId === 99) {
      alert("لا يمكن حذف الحساب الرئيسي للمنصة!");
      return;
    }
    if (confirm("هل أنت متأكد من رغبتك في حذف حساب هذا العضو نهائياً؟")) {
      try {
        await db.adminUser.delete({ where: { id: userId } });
        triggerStatus("تم حذف حساب العضو بنجاح! ✓");
        fetchDashboardData();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("حدث خطأ أثناء محاولة حذف العضو.");
      }
    }
  };

  // Status flashes
  const triggerStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(""), 4000);
  };

  // ==========================================
  // VIDEOS CRUD HANDLERS
  // ==========================================
  const openAddVideo = (defaultType: "YOUTUBE" | "REEL" | "VR360") => {
    setVideoForm({
      id: "",
      title: "",
      description: "",
      type: defaultType,
      url: "",
      thumbnail: "",
      categoryId: "",
      isFeatured: false,
    });
    setShowVideoModal(true);
  };

  const openEditVideo = (video: Video) => {
    setVideoForm({
      id: video.id.toString(),
      title: video.title,
      description: video.description || "",
      type: video.type,
      url: video.url,
      thumbnail: video.thumbnail || "",
      categoryId: video.categoryId ? video.categoryId.toString() : "",
      isFeatured: video.isFeatured,
    });
    setShowVideoModal(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!videoForm.id;

    try {
      const payload = {
        title: videoForm.title,
        description: videoForm.description,
        type: videoForm.type,
        url: videoForm.url,
        thumbnail: "",
        categoryId: videoForm.categoryId ? parseInt(videoForm.categoryId) : null,
        isFeatured: videoForm.isFeatured,
      };

      if (isEditing) {
        await db.video.update({
          where: { id: parseInt(videoForm.id) },
          data: payload,
        });
      } else {
        await db.video.create({
          data: payload,
        });
      }

      triggerStatus(isEditing ? "تم تعديل المحتوى بنجاح! ✓" : "تم إضافة المحتوى بنجاح! ✓");
      setShowVideoModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ الفيديو.");
    }
  };

  const handleDeleteVideo = async (id: number) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الفيديو نهائياً؟")) return;

    try {
      await db.video.delete({
        where: { id },
      });
      triggerStatus("تم حذف الفيديو بنجاح! ✓");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("فشل حذف الفيديو.");
    }
  };

  // ==========================================
  // CATEGORIES CRUD HANDLERS
  // ==========================================
  const openAddCategory = () => {
    setCategoryForm({ id: "", name: "", slug: "" });
    setShowCategoryModal(true);
  };

  const openEditCategory = (cat: Category) => {
    setCategoryForm({
      id: cat.id.toString(),
      name: cat.name,
      slug: cat.slug,
    });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!categoryForm.id;

    try {
      const payload = {
        name: categoryForm.name,
        slug: categoryForm.slug,
      };

      if (isEditing) {
        await db.category.update({
          where: { id: parseInt(categoryForm.id) },
          data: payload,
        });
      } else {
        await db.category.create({
          data: payload,
        });
      }

      triggerStatus(isEditing ? "تم تعديل القسم بنجاح! ✓" : "تم إضافة القسم بنجاح! ✓");
      setShowCategoryModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ القسم.");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("عند حذف هذا القسم، سيتم إلغاء تصنيف الفيديوهات التابعة له دون حذفها. هل تود المتابعة؟")) return;

    try {
      await db.category.delete({
        where: { id },
      });
      triggerStatus("تم حذف القسم بنجاح! ✓");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("فشل حذف القسم.");
    }
  };

  // ==========================================
  // SETTINGS HANDLER
  // ==========================================
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify plans JSON is valid
    try {
      if (settingsForm.advertisingPlans) {
        JSON.parse(settingsForm.advertisingPlans);
      }
    } catch (err) {
      alert("خطأ: بنية خطط الأسعار الإعلانية ليست كائن JSON صالح! يرجى تصحيح الأقواس والمحتوى.");
      return;
    }

    try {
      const payload = {
        phone: settingsForm.phone,
        email: settingsForm.email,
        address: settingsForm.address,
        whatsapp: settingsForm.whatsapp,
        telegram: settingsForm.telegram,
        facebook: settingsForm.facebook,
        advertisingPlans: settingsForm.advertisingPlans,
        exchangeUsd: settingsForm.exchangeUsd,
        exchangeEur: settingsForm.exchangeEur,
        exchangeGbp: settingsForm.exchangeGbp,
      };

      await db.contactSetting.upsert({
        where: { id: 1 },
        update: payload,
        create: { id: 1, ...payload },
      });

      triggerStatus("تم حفظ إعدادات التواصل وخطط الإعلانات بنجاح! ✓");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("فشل حفظ الإعدادات.");
    }
  };

  // Filter videos based on search inputs
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lockscreen component (Authentication Gate)
  if (!isAuthenticated) {
    return (
      <div className={styles.lockScreenContainer}>
        <div className={styles.lockCard}>
          <div className={styles.shieldIcon}>
            <img src="/logl.png" alt="ليبيا بلس" style={{ height: "65px", objectFit: "contain" }} />
          </div>
          <h2 style={{ fontSize: "1.4rem", margin: "0", color: "#ffffff", fontWeight: "800" }}>بوابة المشرفين الآمنة</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "0" }}>
            سجل دخولك بالبريد الإلكتروني وكلمة المرور لإدارة منصة ليبيا بلس الرقمية.
          </p>
          <form onSubmit={handleLogin} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="form-group" style={{ margin: 0, textAlign: "right" }}>
              <label className="form-label" style={{ color: "#cbd5e1" }}>البريد الإلكتروني *</label>
              <input
                type="email"
                className="form-control"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                style={{ direction: "ltr" }}
              />
            </div>
            <div className="form-group" style={{ margin: 0, textAlign: "right" }}>
              <label className="form-label" style={{ color: "#cbd5e1" }}>كلمة المرور *</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="off"
                style={{ direction: "ltr" }}
              />
            </div>
            {authError && <p style={{ color: "#ef4444", fontSize: "0.825rem", textAlign: "center", margin: 0 }}>{authError}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "8px", background: "#da9127", border: "none" }}>
              🔑 تسجيل الدخول الآمن
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardShell}>

      {/* 1. Header Topbar */}
      <header className={styles.topBar}>
        <div className={styles.brandText}>
          <img src="/logl.png" alt="ليبيا بلس" style={{ height: "38px", objectFit: "contain" }} />
          <span style={{ fontSize: "1.05rem", fontWeight: "850", color: "#ffffff" }}>لوحة التحكم الذكية</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/" prefetch={false} className="btn btn-secondary" style={{ fontSize: "0.85rem", padding: "8px 16px" }}>
            📺 منصة العرض
          </Link>
        </div>
      </header>

      {/* Status Notifications Flasher */}
      {statusMessage && (
        <div style={{ position: "fixed", top: "85px", left: "20px", background: "rgba(16,185,129,0.9)", backdropFilter: "blur(12px)", color: "#fff", padding: "14px 26px", borderRadius: "14px", zIndex: 2000, fontWeight: "700", fontSize: "0.9rem", boxShadow: "0 8px 25px rgba(0,0,0,0.4)", border: "1px solid rgba(16,185,129,0.3)" }}>
          {statusMessage}
        </div>
      )}

      {/* 2. Right-to-Left main dashboard layout */}
      <div className={styles.mainGrid}>

        {/* Main Content Area (Left Side) */}
        <main className={styles.contentArea}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
              <span style={{ fontSize: "1.2rem", color: "#64748b" }}>جاري تحميل البيانات...</span>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW PANEL */}
              {activeTab === "overview" && (
                <div className="fade-in">

                  {/* Greetings Header block */}
                  <div className={styles.panelHeader}>
                    <h2 className={styles.panelTitle}>مرحباً بك في لوحة التحكم 👋</h2>
                    <p className={styles.panelSubtitle}>نظرة عامة على أداء منصة ليبيا بلس اليوم.</p>
                  </div>

                  {/* Dashboard Statistics Widgets */}
                  <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                      <div className={styles.statDetails}>
                        <div className={styles.statNum}>{videos.filter((v) => v.type === "YOUTUBE").length}</div>
                        <div className={styles.statLabel}>أخبار وتقارير</div>
                      </div>
                      <div className={styles.statIconWrapper} style={{ backgroundColor: "rgba(14, 165, 233, 0.08)", color: "#0284c7" }}>
                        📰
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statDetails}>
                        <div className={styles.statNum}>{videos.filter((v) => v.type === "REEL").length}</div>
                        <div className={styles.statLabel}>فيديوهات ريلز</div>
                      </div>
                      <div className={styles.statIconWrapper} style={{ backgroundColor: "rgba(16, 185, 129, 0.08)", color: "#10b981" }}>
                        📱
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statDetails}>
                        <div className={styles.statNum}>{categories.length}</div>
                        <div className={styles.statLabel}>أقسام مصنفة</div>
                      </div>
                      <div className={styles.statIconWrapper} style={{ backgroundColor: "rgba(245, 158, 11, 0.08)", color: "#d97706" }}>
                        📁
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statDetails}>
                        <div className={styles.statNum}>
                          {videos.filter((v) => v.type === "LIVE" && v.isFeatured).length > 0 ? "نشط" : "مغلق"}
                        </div>
                        <div className={styles.statLabel}>حالة البث المباشر</div>
                      </div>
                      <div className={styles.statIconWrapper} style={{ backgroundColor: "rgba(239, 68, 68, 0.08)", color: "#dc2626" }}>
                        🔴
                      </div>
                    </div>
                  </div>

                  {/* Recent items list */}
                  <div className={styles.panelHeader} style={{ marginTop: "35px", marginBottom: "18px" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#ffffff" }}>آخر المحتويات المضافة حديثاً</h3>
                  </div>

                  <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th>الملصق</th>
                          <th>العنوان</th>
                          <th>النوع</th>

                          <th>القسم</th>
                          <th>الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {videos.slice(0, 6).map((video) => (
                          <tr key={video.id}>
                            <td>
                              <img src={video.thumbnail || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100"} className={styles.avatar} alt="" />
                            </td>
                            <td style={{ fontWeight: "650", color: "#ffffff" }}>{video.title}</td>
                            <td>
                              <span className={`${styles.rowBadge} ${video.type === "REEL" ? styles.badgeReel : video.type === "LIVE" ? styles.badgeLive : video.type === "VR360" ? styles.badgeReel : styles.badgeYoutube}`}>
                                {video.type === "REEL" ? "ريلز" : video.type === "LIVE" ? "لايف مباشر" : video.type === "VR360" ? "360 درجة" : "أخبار"}
                              </span>
                            </td>

                            <td>{video.category ? video.category.name : "غير مصنف"}</td>
                            <td>
                              <span className={styles.statusPill}>● منشور</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: LIVE STREAM CONTROL CENTER */}
              {activeTab === "live-control" && (
                <div className="fade-in">
                  <div className={styles.panelHeader}>
                    <h2 className={styles.panelTitle}>غرفة التحكم بالبث المباشر (لايف) 🔴</h2>
                    <p className={styles.panelSubtitle}>تحرير رابط يوتيوب المباشر ووسم البث النشط على المنصة.</p>
                  </div>

                  <div style={{ padding: "35px", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px", margin: "0 auto", background: "rgba(17, 19, 28, 0.85)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>

                    {/* Live Broadcast Status Banner */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "20px",
                      borderRadius: "16px",
                      background: liveIsFeatured ? "rgba(220, 38, 38, 0.06)" : "rgba(100, 116, 139, 0.04)",
                      border: liveIsFeatured ? "1px solid rgba(220, 38, 38, 0.2)" : "1px solid rgba(100, 116, 139, 0.1)",
                      transition: "all 0.3s ease"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <span style={{ fontSize: "2rem" }}>
                          {liveIsFeatured ? "🔴" : "⚫"}
                        </span>
                        <div>
                          <h4 style={{ margin: 0, fontSize: "1.1rem", color: "#ffffff", fontWeight: "800" }}>
                            {liveIsFeatured ? "البث المباشر نشط الآن" : "البث المباشر متوقف حالياً"}
                          </h4>
                          <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#94a3b8", fontWeight: "500" }}>
                            {liveIsFeatured ? "يظهر البث المباشر للزوار في شريط البانر بالصفحة الرئيسية وصفحة البث المخصص." : "يظهر للزوار لوحة الانتظار والترقب بالبث التجريبي."}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          type="button"
                          onClick={() => setLiveIsFeatured(true)}
                          className="btn"
                          style={{ fontSize: "0.85rem", padding: "8px 16px", background: liveIsFeatured ? "#da9127" : "rgba(255,255,255,0.05)", color: liveIsFeatured ? "#fff" : "#94a3b8", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
                        >
                          ▶ تشغيل البث
                        </button>
                        <button
                          type="button"
                          onClick={() => setLiveIsFeatured(false)}
                          className="btn"
                          style={{ fontSize: "0.85rem", padding: "8px 16px", background: !liveIsFeatured ? "#ef4444" : "rgba(255,255,255,0.05)", color: !liveIsFeatured ? "#fff" : "#94a3b8", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
                        >
                          ⏸ إيقاف البث
                        </button>
                      </div>
                    </div>

                    {/* Live URL Form */}
                    <form onSubmit={handleSaveLive} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: "750" }}>
                          رابط فيديو البث المباشر من يوتيوب *
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          required
                          value={liveUrl}
                          onChange={(e) => setLiveUrl(e.target.value)}
                          placeholder="مثال: https://www.youtube.com/watch?v=..."
                          style={{ width: "100%", fontSize: "0.95rem", direction: "ltr" }}
                        />
                        <span style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "6px", display: "block" }}>
                          💡 الصق رابط البث المباشر كاملاً وسيقوم النظام بتجهيز شاشة العرض للمشاهدين.
                        </span>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: "750" }}>
                          عنوان التغطية أو البث
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={liveTitle}
                          onChange={(e) => setLiveTitle(e.target.value)}
                          placeholder="مثال: البث المباشر لقناة ليبيا بلس - تغطية شاملة"
                          style={{ width: "100%" }}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: "750" }}>
                          وصف البث والتغطية
                        </label>
                        <textarea
                          className="form-control"
                          rows={4}
                          value={liveDescription}
                          onChange={(e) => setLiveDescription(e.target.value)}
                          placeholder="اكتب هنا تفاصيل البث المباشر الحالي لتعريف الزوار..."
                          style={{ width: "100%" }}
                        />
                      </div>

                      <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: "12px 30px", fontSize: "0.95rem", background: "#da9127", border: "none" }}>
                          💾 حفظ وتطبيق إعدادات البث
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 3: YOUTUBE VIDEOS */}
              {activeTab === "youtube-videos" && (
                <div className="fade-in">

                  {/* Panel info header */}
                  <div className={styles.panelHeader}>
                    <h2 className={styles.panelTitle}>الأخبار والتقارير (فيديوهات يوتيوب) 📰</h2>
                    <p className={styles.panelSubtitle}>عرض وتعديل كافة الأخبار والتقارير وفيديوهات يوتيوب المنشورة في الموقع.</p>
                  </div>

                  {/* Search and filter header bar inside card wrapper */}
                  <div className={styles.tableWrapper}>
                    <div className={styles.tableHeaderBar}>
                      <div className={styles.searchInputWrapper}>
                        <input
                          type="text"
                          className={styles.searchInput}
                          placeholder="البحث عن عنوان الفيديو..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className={styles.searchIcon}>🔍</span>
                      </div>
                      <button onClick={() => openAddVideo("YOUTUBE")} className="btn btn-primary" style={{ background: "#da9127", border: "none", fontSize: "0.85rem", padding: "8px 16px" }}>
                        ➕ إضافة فيديو جديد
                      </button>
                    </div>

                    <div className={styles.cardsGrid}>
                      {filteredVideos.filter(v => v.type === "YOUTUBE").map((video) => (
                        <div key={video.id} className={styles.newsCard}>
                          <img src={getYouTubeThumbnail(video.url) || video.thumbnail || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500"} className={styles.newsCardImage} alt="" />
                          <div className={styles.newsCardContent}>
                            <h3 className={styles.newsCardTitle}>{video.title}</h3>
                            <div className={styles.newsCardMeta}>
                              <span className={styles.rowBadge} style={{ background: "rgba(245, 158, 11, 0.1)", color: "#fbbf24" }}>{video.category ? video.category.name : "غير مصنف"}</span>
                              {video.isFeatured && <span className={styles.rowBadge} style={{ background: "rgba(16, 185, 129, 0.1)", color: "#34d399" }}>⭐ مميز</span>}
                            </div>
                          </div>
                          <div className={styles.newsCardActions}>
                            <button onClick={() => openEditVideo(video)} className={`${styles.cardActionBtn} ${styles.cardActionEdit}`}>
                              ✏️ تعديل
                            </button>
                            <button onClick={() => handleDeleteVideo(video.id)} className={`${styles.cardActionBtn} ${styles.cardActionDelete}`}>
                              🗑️ حذف
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: REELS SHORT VIDEOS */}
              {activeTab === "reels" && (
                <div className="fade-in">

                  {/* Panel info header */}
                  <div className={styles.panelHeader}>
                    <h2 className={styles.panelTitle}>إيجاز ريلز (فيديوهات قصيرة) 📱</h2>
                    <p className={styles.panelSubtitle}>تعديل وإضافة فيديوهات الريلز العمودية القصيرة وتفاعلاتها الحية.</p>
                  </div>

                  {/* Search and filter header bar inside card wrapper */}
                  <div className={styles.tableWrapper}>
                    <div className={styles.tableHeaderBar}>
                      <div className={styles.searchInputWrapper}>
                        <input
                          type="text"
                          className={styles.searchInput}
                          placeholder="البحث عن عنوان الريلز..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className={styles.searchIcon}>🔍</span>
                      </div>
                      <button onClick={() => openAddVideo("REEL")} className="btn btn-primary" style={{ background: "#da9127", border: "none", fontSize: "0.85rem", padding: "8px 16px" }}>
                        ➕ إضافة مقطع ريلز
                      </button>
                    </div>

                    <div className={styles.cardsGrid}>
                      {filteredVideos.filter(v => v.type === "REEL").map((video) => (
                        <div key={video.id} className={styles.newsCard}>
                          <img src={getYouTubeThumbnail(video.url) || video.thumbnail || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500"} className={styles.newsCardImage} alt="" />
                          <div className={styles.newsCardContent}>
                            <h3 className={styles.newsCardTitle}>{video.title}</h3>
                            <div className={styles.newsCardMeta}>
                              <span className={styles.rowBadge} style={{ background: "rgba(14, 165, 233, 0.1)", color: "#38bdf8" }}>ريلز</span>
                              <span className={styles.statusPill}>● منشور</span>
                            </div>
                          </div>
                          <div className={styles.newsCardActions}>
                            <button onClick={() => openEditVideo(video)} className={`${styles.cardActionBtn} ${styles.cardActionEdit}`}>
                              ✏️ تعديل
                            </button>
                            <button onClick={() => handleDeleteVideo(video.id)} className={`${styles.cardActionBtn} ${styles.cardActionDelete}`}>
                              🗑️ حذف
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: VR360 VIDEOS */}
              {activeTab === "vr360" && (
                <div className="fade-in">

                  {/* Panel info header */}
                  <div className={styles.panelHeader}>
                    <h2 className={styles.panelTitle}>فيديوهات 360 درجة (الواقع الافتراضي) 🌐</h2>
                    <p className={styles.panelSubtitle}>إدارة وتعديل فيديوهات 360 درجة التفاعلية المعروضة على المنصة.</p>
                  </div>

                  {/* Search and filter header bar inside card wrapper */}
                  <div className={styles.tableWrapper}>
                    <div className={styles.tableHeaderBar}>
                      <div className={styles.searchInputWrapper}>
                        <input
                          type="text"
                          className={styles.searchInput}
                          placeholder="البحث عن عنوان الفيديو..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className={styles.searchIcon}>🔍</span>
                      </div>
                      <button onClick={() => openAddVideo("VR360")} className="btn btn-primary" style={{ background: "#da9127", border: "none", fontSize: "0.85rem", padding: "8px 16px" }}>
                        ➕ إضافة فيديو 360
                      </button>
                    </div>

                    <div className={styles.cardsGrid}>
                      {filteredVideos.filter(v => v.type === "VR360").map((video) => (
                        <div key={video.id} className={styles.newsCard}>
                          <img src={getYouTubeThumbnail(video.url) || video.thumbnail || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500"} className={styles.newsCardImage} alt="" />
                          <div className={styles.newsCardContent}>
                            <h3 className={styles.newsCardTitle}>{video.title}</h3>
                            <div className={styles.newsCardMeta}>
                              <span className={styles.rowBadge} style={{ background: "rgba(14, 165, 233, 0.1)", color: "#38bdf8" }}>{video.category ? video.category.name : "غير مصنف"}</span>
                              <span className={styles.statusPill}>● منشور</span>
                            </div>
                          </div>
                          <div className={styles.newsCardActions}>
                            <button onClick={() => openEditVideo(video)} className={`${styles.cardActionBtn} ${styles.cardActionEdit}`}>
                              ✏️ تعديل
                            </button>
                            <button onClick={() => handleDeleteVideo(video.id)} className={`${styles.cardActionBtn} ${styles.cardActionDelete}`}>
                              🗑️ حذف
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CATEGORIES CRUD */}
              {activeTab === "categories" && (
                <div className="fade-in">
                  <div className={styles.panelHeader}>
                    <h2 className={styles.panelTitle}>إدارة تصنيفات الأقسام 📁</h2>
                    <p className={styles.panelSubtitle}>إدارة تصنيفات التقارير والفيديوهات لتنظيم التصفح الذكي.</p>
                  </div>

                  <div className={styles.tableWrapper}>
                    <div className={styles.tableHeaderBar} style={{ justifyContent: "flex-end" }}>
                      <button onClick={openAddCategory} className="btn btn-primary" style={{ background: "#da9127", border: "none", fontSize: "0.85rem", padding: "8px 16px" }}>
                        ➕ إضافة قسم جديد
                      </button>
                    </div>

                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th>الرقم</th>
                          <th>اسم القسم</th>
                          <th>الوسم الرابط (Slug)</th>
                          <th>الفيديوهات الملحقة</th>
                          <th>الخيارات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((cat) => (
                          <tr key={cat.id}>
                            <td>{cat.id}</td>
                            <td style={{ fontWeight: "650", color: "#ffffff" }}>{cat.name}</td>
                            <td style={{ direction: "ltr", textAlign: "right" }}>{cat.slug}</td>
                            <td>
                              {videos.filter((v) => v.categoryId === cat.id).length} فيديو
                            </td>
                            <td>
                              <div className={styles.optionsMenuWrapper}>
                                <button onClick={() => openEditCategory(cat)} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                                  ✏️ تعديل
                                </button>
                                <button onClick={() => handleDeleteCategory(cat.id)} className="btn btn-danger" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                                  🗑️ حذف
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: SETTINGS MANAGEMENT */}
              {activeTab === "settings" && (
                <div className="fade-in">
                  <div className={styles.panelHeader}>
                    <h2 className={styles.panelTitle}>إعدادات التواصل وخطط الإعلانات ⚙️</h2>
                    <p className={styles.panelSubtitle}>تغيير خطوط الدعم الفني، روابط التواصل، وتعريف باقات إعلانات ليبيا بلس.</p>
                  </div>

                  <div style={{ padding: "35px", background: "rgba(17, 19, 28, 0.85)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", maxWidth: "800px", margin: "0 auto", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
                    <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div className="form-group">
                          <label className="form-label">📞 رقم الهاتف *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={settingsForm.phone}
                            onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">✉️ البريد الإلكتروني للمنصة *</label>
                          <input
                            type="email"
                            className="form-control"
                            value={settingsForm.email}
                            onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                            required
                            style={{ direction: "ltr" }}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">📍 العنوان الفعلي للمقر</label>
                        <input
                          type="text"
                          className="form-control"
                          value={settingsForm.address}
                          onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                        <div className="form-group">
                          <label className="form-label">💬 معرف واتساب</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="مثل: 218928175897"
                            value={settingsForm.whatsapp}
                            onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">✈️ معرف تلغرام</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="مثل: libyaplus_ad"
                            value={settingsForm.telegram}
                            onChange={(e) => setSettingsForm({ ...settingsForm, telegram: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">👤 معرف فيسبوك</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="مثل: libyaplus.official"
                            value={settingsForm.facebook}
                            onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })}
                          />
                        </div>
                      </div>

                      <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                        <h3 style={{ fontSize: "1rem", color: "#334155", marginTop: 0, marginBottom: "15px", fontWeight: "700" }}>💱 تحديث أسعار الصرف (السوق الموازي)</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">🇺🇸 الدولار (USD)</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="مثل: 7.15"
                              value={settingsForm.exchangeUsd || ""}
                              onChange={(e) => setSettingsForm({ ...settingsForm, exchangeUsd: e.target.value })}
                              style={{ direction: "ltr", textAlign: "right" }}
                            />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">🇪🇺 اليورو (EUR)</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="مثل: 7.75"
                              value={settingsForm.exchangeEur || ""}
                              onChange={(e) => setSettingsForm({ ...settingsForm, exchangeEur: e.target.value })}
                              style={{ direction: "ltr", textAlign: "right" }}
                            />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">🇬🇧 الباوند (GBP)</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="مثل: 9.05"
                              value={settingsForm.exchangeGbp || ""}
                              onChange={(e) => setSettingsForm({ ...settingsForm, exchangeGbp: e.target.value })}
                              style={{ direction: "ltr", textAlign: "right" }}
                            />
                          </div>
                        </div>
                      </div>



                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: "12px 35px", fontSize: "0.95rem", background: "#da9127", border: "none" }}>
                          💾 حفظ باقات الدعم والإعلانات
                        </button>
                      </div>

                    </form>
                  </div>
                </div>
              )}

              {activeTab === "interactive-widgets" && (
                <div className="fade-in">
                  <div className={styles.panelHeader}>
                    <h2 className={styles.panelTitle}>شريط الأخبار واستطلاعات الرأي 🗳️</h2>
                    <p className={styles.panelSubtitle}>تحديث شريط الأخبار المتحرك على الصفحة الرئيسية وإدارة خيارات وأصوات استطلاع الرأي التفاعلي.</p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px", maxWidth: "850px", margin: "0 auto" }}>

                    {/* news ticker section */}
                    <div style={{ padding: "30px", background: "rgba(17, 19, 28, 0.85)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
                      <form onSubmit={handleSaveInteractiveWidgets} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                        <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#ffffff", margin: 0, borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "12px" }}>
                          🔴 إدارة شريط الأخبار العاجلة المتحرك
                        </h3>

                        <div className="form-group">
                          <label className="form-label" style={{ fontWeight: "700" }}>محتوى الأخبار العاجلة (كل سطر يمثل خبراً مستقلاً) *</label>
                          <textarea
                            className="form-control"
                            rows={5}
                            required
                            value={tickerTextarea}
                            onChange={(e) => setTickerTextarea(e.target.value)}
                            placeholder="اكتب هنا كل سطر يمثل خبراً عاجلاً عاجلاً..."
                            style={{ padding: "14px", borderRadius: "12px", lineHeight: "1.6" }}
                          />
                          <span style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "6px", display: "block" }}>
                            💡 سيتم دمج هذه الأسطر تلقائياً وفصلها بنقاط مضيئة متحركة في شريط الصفحة الرئيسية.
                          </span>
                        </div>

                        <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#ffffff", margin: "15px 0 0 0", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "12px" }}>
                          🗳️ إدارة استطلاع الرأي التفاعلي
                        </h3>

                        <div className="form-group">
                          <label className="form-label" style={{ fontWeight: "700" }}>سؤال الاستطلاع النشط *</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            value={pollQuestion}
                            onChange={(e) => setPollQuestion(e.target.value)}
                            style={{ padding: "12px", borderRadius: "10px" }}
                          />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: "700" }}>الخيار الأول *</label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              value={pollOption1}
                              onChange={(e) => setPollOption1(e.target.value)}
                              style={{ padding: "12px", borderRadius: "10px" }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: "700" }}>أصوات الخيار الأول</label>
                            <input
                              type="number"
                              className="form-control"
                              required
                              value={pollVotes1}
                              onChange={(e) => setPollVotes1(Number(e.target.value) || 0)}
                              style={{ padding: "12px", borderRadius: "10px" }}
                            />
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: "700" }}>الخيار الثاني *</label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              value={pollOption2}
                              onChange={(e) => setPollOption2(e.target.value)}
                              style={{ padding: "12px", borderRadius: "10px" }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: "700" }}>أصوات الخيار الثاني</label>
                            <input
                              type="number"
                              className="form-control"
                              required
                              value={pollVotes2}
                              onChange={(e) => setPollVotes2(Number(e.target.value) || 0)}
                              style={{ padding: "12px", borderRadius: "10px" }}
                            />
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: "700" }}>الخيار الثالث *</label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              value={pollOption3}
                              onChange={(e) => setPollOption3(e.target.value)}
                              style={{ padding: "12px", borderRadius: "10px" }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: "700" }}>أصوات الخيار الثالث</label>
                            <input
                              type="number"
                              className="form-control"
                              required
                              value={pollVotes3}
                              onChange={(e) => setPollVotes3(Number(e.target.value) || 0)}
                              style={{ padding: "12px", borderRadius: "10px" }}
                            />
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("هل أنت متأكد من تصفير وإعادة تعيين جميع الأصوات إلى 0؟")) {
                                setPollVotes1(0);
                                setPollVotes2(0);
                                setPollVotes3(0);
                              }
                            }}
                            className="btn btn-secondary"
                            style={{ background: "#ef4444", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem" }}
                          >
                            🔄 تصفير أصوات الاستطلاع
                          </button>

                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ padding: "12px 35px", fontSize: "0.95rem", background: "#da9127", border: "none" }}
                          >
                            💾 حفظ وتثبيت التعديلات التفاعلية
                          </button>
                        </div>

                      </form>
                    </div>

                  </div>
                </div>
              )}

              {activeTab === ("users" as any) && currentUserRole === "ADMIN" && (
                <div className="fade-in">
                  <div className={styles.panelHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h2 className={styles.panelTitle}>أعضاء هيئة التحرير والمدراء 👥</h2>
                      <p className={styles.panelSubtitle}>إضافة وتعديل حسابات المستخدمين وصلاحياتهم للتحكم في المنصة الرقمية.</p>
                    </div>
                    <button
                      onClick={openAddUser}
                      className="btn btn-primary"
                      style={{ padding: "10px 24px", background: "#da9127", border: "none", borderRadius: "10px", fontSize: "0.88rem" }}
                    >
                      ➕ إضافة عضو جديد
                    </button>
                  </div>

                  <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th>الاسم الكامل</th>
                          <th>البريد الإلكتروني</th>
                          <th>كلمة المرور</th>
                          <th>الصلاحية والوظيفة</th>
                          <th style={{ textAlign: "center" }}>الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminUsers.map((u: any) => (
                          <tr key={u.id}>
                            <td style={{ fontWeight: "700", color: "#ffffff" }}>{u.name || "عضو تحرير"}</td>
                            <td style={{ direction: "ltr", textAlign: "right" }}>{u.email}</td>
                            <td style={{ fontFamily: "monospace" }}>{u.password}</td>
                            <td>
                              <span className={`${styles.rowBadge} ${u.role === "ADMIN" ? styles.badgeLive : styles.badgeYoutube}`}>
                                {u.role === "ADMIN" ? "Super Admin (مدير النظام)" : "Editor (محرر محتوى)"}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                <button
                                  onClick={() => openEditUser(u)}
                                  className="btn btn-secondary"
                                  style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "8px" }}
                                >
                                  ✏️ تعديل
                                </button>
                                {u.id !== 99 && (
                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="btn"
                                    style={{ padding: "6px 12px", fontSize: "0.8rem", background: "#ef4444", color: "#fff", borderRadius: "8px", border: "none" }}
                                  >
                                    🗑️ حذف
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Sidebar Nav (Right Side) */}
        <aside className={styles.sidebar}>

          {/* Sidebar Top Brand Header */}
          <div className={styles.sidebarBrand}>
            <img src="/logl.png" className={styles.sidebarLogo} alt="ليبيا بلس" />
            <h3 className={styles.sidebarTitle}> ليبيا بلس</h3>
            <span className={styles.sidebarSubtitle}>إدارة المحتوى الرقمي</span>
          </div>

          {/* User Editor greetings area */}
          <div className={styles.greetingsCard}>
            <h4 className={styles.greetingsTitle}>مرحباً، {currentUserName} 👤</h4>
            <span className={styles.greetingsRole}>
              {currentUserRole === "ADMIN" ? "Super Admin (مدير النظام)" : "Editor (محرر محتوى)"}
            </span>
          </div>

          {/* Golden Cta create button depending on active state */}
          <button
            onClick={() => {
              if (activeTab === "reels") {
                openAddVideo("REEL");
              } else if (activeTab === "vr360") {
                openAddVideo("VR360");
              } else if (activeTab === "categories") {
                openAddCategory();
              } else {
                openAddVideo("YOUTUBE");
              }
            }}
            className={styles.sidebarCtaBtn}
          >
            {activeTab === "reels" ? "➕ إضافة ريل جديد" : activeTab === "vr360" ? "➕ إضافة فيديو 360" : activeTab === "categories" ? "➕ إضافة قسم جديد" : "➕ إضافة فيديو جديد"}
          </button>

          {/* Navigation Buttons list */}
          <button
            onClick={() => { setActiveTab("overview"); setSearchQuery(""); }}
            className={`${styles.tabBtn} ${activeTab === "overview" ? styles.activeTabBtn : ""}`}
          >
            📊 لوحة التحكم
          </button>
          <button
            onClick={() => { setActiveTab("youtube-videos"); setSearchQuery(""); }}
            className={`${styles.tabBtn} ${activeTab === "youtube-videos" ? styles.activeTabBtn : ""}`}
          >
            📰 الأخبار والتقارير
          </button>
          <button
            onClick={() => { setActiveTab("reels"); setSearchQuery(""); }}
            className={`${styles.tabBtn} ${activeTab === "reels" ? styles.activeTabBtn : ""}`}
          >
            📱 فيديوهات الريلز (إيجاز)
          </button>
          <button
            onClick={() => { setActiveTab("vr360"); setSearchQuery(""); }}
            className={`${styles.tabBtn} ${activeTab === "vr360" ? styles.activeTabBtn : ""}`}
          >
            🌐 فيديوهات 360 درجة
          </button>
          <button
            onClick={() => { setActiveTab("live-control"); setSearchQuery(""); }}
            className={`${styles.tabBtn} ${activeTab === "live-control" ? styles.activeTabBtn : ""}`}
          >
            📡 البث المباشر
          </button>
          <button
            onClick={() => { setActiveTab("categories"); setSearchQuery(""); }}
            className={`${styles.tabBtn} ${activeTab === "categories" ? styles.activeTabBtn : ""}`}
          >
            📁 أقسام المنصة
          </button>
          <button
            onClick={() => { setActiveTab("settings"); setSearchQuery(""); }}
            className={`${styles.tabBtn} ${activeTab === "settings" ? styles.activeTabBtn : ""}`}
          >
            ⚙️ باقات الإعلانات والتواصل
          </button>
          <button
            onClick={() => { setActiveTab("interactive-widgets"); setSearchQuery(""); }}
            className={`${styles.tabBtn} ${activeTab === "interactive-widgets" ? styles.activeTabBtn : ""}`}
          >
            🗳️ شريط الأخبار والاستطلاعات
          </button>

          {currentUserRole === "ADMIN" && (
            <button
              onClick={() => { setActiveTab("users" as any); setSearchQuery(""); }}
              className={`${styles.tabBtn} ${activeTab === ("users" as any) ? styles.activeTabBtn : ""}`}
            >
              👥 أعضاء هيئة التحرير
            </button>
          )}

          {/* Exit Action at the bottom */}
          <button onClick={handleLogout} className={`${styles.tabBtn} ${styles.logoutBtn}`}>
            🚪 تسجيل الخروج
          </button>
        </aside>

      </div>

      {/* ==========================================
          MODAL: VIDEO ADD/EDIT (High-End Form Layout)
          ========================================== */}
      {showVideoModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{videoForm.id ? "✏️ تعديل بيانات المحتوى" : "➕ إضافة محتوى جديد للمنصة"}</h3>
              <button onClick={() => setShowVideoModal(false)} className={styles.modalCloseBtn}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVideo} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: "700" }}>نوع الفيديو *</label>
                  <select
                    className="form-control"
                    value={videoForm.type}
                    onChange={(e) => setVideoForm({ ...videoForm, type: e.target.value })}
                    required
                    style={{ padding: "10px", borderRadius: "10px" }}
                  >
                    <option value="YOUTUBE">📰 الأخبار والتقارير (فيديو يوتيوب)</option>
                    <option value="REEL">📱 مقطع ريلز قصير (عمودي)</option>
                    <option value="LIVE">🔴 قناة البث المباشر (يوتيوب لايف)</option>
                    <option value="VR360">🌐 فيديو 360 درجة</option>
                  </select>
                </div>

                {videoForm.type !== "LIVE" && (
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: "700" }}>القسم الملحق</label>
                    <select
                      className="form-control"
                      value={videoForm.categoryId}
                      onChange={(e) => setVideoForm({ ...videoForm, categoryId: e.target.value })}
                      style={{ padding: "10px", borderRadius: "10px" }}
                    >
                      <option value="">-- بدون قسم / غير مصنف --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: "700" }}>عنوان الفيديو *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="أدخل عنواناً جذاباً وملفتاً..."
                  style={{ padding: "12px", borderRadius: "10px" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: "700" }}>الوصف / التفاصيل</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  placeholder="اكتب وصفاً تفصيلياً يظهر للمشاهدين..."
                  style={{ padding: "12px", borderRadius: "10px" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: "700" }}>رابط الفيديو (URL) *</label>
                <input
                  type="url"
                  className="form-control"
                  required
                  value={videoForm.url}
                  onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                  placeholder={videoForm.type === "REEL" ? "مثال: https://assets...mp4" : "مثال: https://www.youtube.com/watch?v=..."}
                  style={{ padding: "12px", borderRadius: "10px", direction: "ltr" }}
                />
              </div>



              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px", background: "rgba(255,255,255,0.02)", padding: "14px", borderRadius: "14px", border: "1px dashed rgba(255,255,255,0.08)" }}>
                <input
                  type="checkbox"
                  id="isFeaturedCheck"
                  checked={videoForm.isFeatured}
                  onChange={(e) => setVideoForm({ ...videoForm, isFeatured: e.target.checked })}
                  style={{ width: "20px", height: "20px", accentColor: "#da9127", cursor: "pointer" }}
                />
                <label htmlFor="isFeaturedCheck" className="form-label" style={{ marginBottom: 0, cursor: "pointer", fontWeight: "700", color: "#e2e8f0" }}>
                  ⭐ تثبيت وتحديد كبث/فيديو مميز في الصفحة الرئيسية
                </label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowVideoModal(false)} className="btn btn-secondary" style={{ padding: "10px 24px", borderRadius: "10px" }}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: "10px 30px", borderRadius: "10px", background: "#da9127", border: "none" }}>
                  💾 حفظ وتثبيت المحتوى
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CATEGORY ADD/EDIT
          ========================================== */}
      {showCategoryModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: "460px" }}>
            <div className={styles.modalHeader}>
              <h3>{categoryForm.id ? "✏️ تعديل بيانات القسم" : "📁 إضافة قسم تصنيف جديد"}</h3>
              <button onClick={() => setShowCategoryModal(false)} className={styles.modalCloseBtn}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: "700" }}>اسم القسم (بالعربية) *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="مثال: رياضة، فن، ثقافة..."
                  style={{ padding: "12px", borderRadius: "10px" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: "700" }}>اسم الوسم المعرف الفريد (Slug - بالإنجليزية)</label>
                <input
                  type="text"
                  className="form-control"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="مثال: sports"
                  style={{ padding: "12px", borderRadius: "10px", direction: "ltr", textAlign: "left" }}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowCategoryModal(false)} className="btn btn-secondary" style={{ padding: "10px 24px", borderRadius: "10px" }}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: "10px 30px", borderRadius: "10px", background: "#da9127", border: "none" }}>
                  💾 حفظ القسم التحريري
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: USER ADD/EDIT
          ========================================== */}
      {showUserModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: "480px" }}>
            <div className={styles.modalHeader}>
              <h3>{userForm.id ? "✏️ تعديل بيانات عضو التحرير" : "👥 إضافة عضو مجلس تحرير جديد"}</h3>
              <button onClick={() => setShowUserModal(false)} className={styles.modalCloseBtn}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: "700" }}>الاسم الكامل للمستخدم *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="مثال: أحمد مصطفى..."
                  style={{ padding: "12px", borderRadius: "10px" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: "700" }}>البريد الإلكتروني (اسم المستخدم) *</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="name@example.com"
                  style={{ padding: "12px", borderRadius: "10px", direction: "ltr", textAlign: "left" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: "700" }}>كلمة المرور للدخول *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder="اكتب كلمة مرور قوية..."
                  style={{ padding: "12px", borderRadius: "10px", direction: "ltr", textAlign: "left" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: "700" }}>الصلاحية والوظيفة في المنصة *</label>
                <select
                  className="form-control"
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  style={{ padding: "10px", borderRadius: "10px" }}
                >
                  <option value="EDITOR">Editor (محرر محتوى - لا يستطيع إدارة الأعضاء)</option>
                  <option value="ADMIN">Super Admin (مدير النظام - صلاحيات كاملة)</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowUserModal(false)} className="btn btn-secondary" style={{ padding: "10px 24px", borderRadius: "10px" }}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: "10px 30px", borderRadius: "10px", background: "#da9127", border: "none" }}>
                  💾 حفظ العضو وتثبيت الصلاحية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
