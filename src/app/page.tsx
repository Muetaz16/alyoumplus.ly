"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import db from "@/lib/db";
import { toDirectImageUrl } from "@/lib/utils";
import YouTubeGrid from "@/components/YouTubeGrid";
import VideoRow from "@/components/VideoRow";
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
  createdAt: any;
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategorySlug = searchParams ? searchParams.get("category") || "all" : "all";

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [liveStream, setLiveStream] = useState<Video | null>(null);
  const [reels, setReels] = useState<Video[]>([]);
  const [allYoutubeVideos, setAllYoutubeVideos] = useState<Video[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Search input state
  const [searchQuery, setSearchQuery] = useState("");

  // News Ticker Dynamic State
  const [tickerItems, setTickerItems] = useState<string[]>([
    " اليوم plus الرقمية تطلق منصتها التفاعلية الجديدة كلياً للبث الحي والمباشر.",
    "تغطية خاصة ومجاهرة لفعاليات مهرجان بنغازي الثقافي والفني الدولي.",
    "تحديث مستمر على مدار 24 ساعة لآخر الأخبار والتقارير الإقليمية والمحلية.",
    "ترقبوا اللقاء الإعلامي الحصري مع نخبة من صناع القرار والمبدعين الليلة."
  ]);

  // Interactive Poll Dynamic state
  const [votedOption, setVotedOption] = useState<number | null>(null);
  const [pollData, setPollData] = useState({
    question: "ما هي نوعية التغطية الإعلامية التي تود رؤيتها بكثافة أكبر على منصة اليوم plus؟",
    option1: "التغطيات الإخبارية المباشرة للأحداث المحلية",
    option2: "تقارير الفيديو الوثائقية والبرامج السياسية",
    option3: "مقاطع الريلز القصيرة والتغطيات الميدانية الخفيفة",
    votes1: 154,
    votes2: 108,
    votes3: 78
  });

  // Hero Background Slideshow
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const heroBgs = ["/111.jpg", "/2222.jpg", "/33333.jpg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroBgs.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [currentBgIndex]); // Dependency added to reset timer on manual change

  const handleNextHero = () => {
    setCurrentBgIndex((prev) => (prev + 1) % heroBgs.length);
  };

  const handlePrevHero = () => {
    setCurrentBgIndex((prev) => (prev - 1 + heroBgs.length) % heroBgs.length);
  };

  const goToHero = (index: number) => {
    setCurrentBgIndex(index);
  };
  const handleVote = async (optionId: number) => {
    if (votedOption !== null) return; // Prevent double voting
    setVotedOption(optionId);

    const updatedVotes = {
      votes1: optionId === 1 ? pollData.votes1 + 1 : pollData.votes1,
      votes2: optionId === 2 ? pollData.votes2 + 1 : pollData.votes2,
      votes3: optionId === 3 ? pollData.votes3 + 1 : pollData.votes3,
    };

    setPollData((prev) => ({
      ...prev,
      ...updatedVotes
    }));

    try {
      await db.generalSetting.upsert({
        where: { id: "poll" },
        create: {
          question: pollData.question,
          option1: pollData.option1,
          option2: pollData.option2,
          option3: pollData.option3,
          ...updatedVotes
        },
        update: updatedVotes
      });
    } catch (e) {
      console.error("Error registering vote to database:", e);
    }
  };

  const totalVotes = pollData.votes1 + pollData.votes2 + pollData.votes3;
  const getPercent = (optionVotes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((optionVotes / totalVotes) * 100);
  };

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch categories (exclude 'live')
        const cats = await db.category.findMany({
          orderBy: { id: "asc" }
        });
        setCategories(cats.filter((c: any) => c.slug !== "live"));

        // Fetch Live Stream
        const live = await db.video.findFirst({
          where: { type: "LIVE", isFeatured: true }
        });
        setLiveStream(live);

        // Fetch Reels (up to 12)
        const latestReels = await db.video.findMany({
          where: { type: "REEL" },
          orderBy: { createdAt: "desc" },
          take: 12
        });
        setReels(latestReels);

        // Fetch all Widescreen/YouTube videos for dynamic rows
        const widescreen = await db.video.findMany({
          where: { type: "YOUTUBE" },
          orderBy: { createdAt: "desc" }
        });

        const serializedWidescreen = widescreen.map((v: any) => ({
          ...v,
          createdAt: typeof v.createdAt === "object" && v.createdAt?.toISOString
            ? v.createdAt.toISOString()
            : String(v.createdAt)
        }));
        setAllYoutubeVideos(serializedWidescreen);

        // Fetch interactive poll settings
        try {
          const pollDoc = await db.generalSetting.findUnique({ where: { id: "poll" } }) as any;
          if (pollDoc) {
            setPollData({
              question: pollDoc.question || "",
              option1: pollDoc.option1 || "",
              option2: pollDoc.option2 || "",
              option3: pollDoc.option3 || "",
              votes1: Number(pollDoc.votes1) || 0,
              votes2: Number(pollDoc.votes2) || 0,
              votes3: Number(pollDoc.votes3) || 0
            });
          }
        } catch (e) {
          console.error("Error fetching poll settings:", e);
        }

      } catch (err) {
        console.error("Error loading static client-side features:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Fetch videos dynamically when activeCategorySlug changes (for search/filtered view)
  useEffect(() => {
    async function loadVideos() {
      if (activeCategorySlug === "all") {
        setYoutubeVideos(allYoutubeVideos);
        return;
      }
      setLoading(true);
      try {
        const videos = await db.video.findMany({
          where: {
            type: "YOUTUBE",
            category: {
              slug: activeCategorySlug
            }
          },
          orderBy: { createdAt: "desc" }
        });

        const serialized = videos.map((v: any) => ({
          ...v,
          createdAt: typeof v.createdAt === "object" && v.createdAt?.toISOString
            ? v.createdAt.toISOString()
            : String(v.createdAt)
        }));

        setYoutubeVideos(serialized);
      } catch (err) {
        console.error("Error loading category videos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, [activeCategorySlug, allYoutubeVideos]);

  const handleFilterClick = (slug: string) => {
    if (slug === "all") {
      router.push("/", { scroll: false });
    } else {
      router.push(`/?category=${slug}`, { scroll: false });
    }
  };

  // Filter videos client-side instantly for search
  const filteredYoutubeVideos = (activeCategorySlug === "all" ? allYoutubeVideos : youtubeVideos).filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine if we show search results / grid view or the full Shahid home page
  const isGridView = searchQuery.trim() !== "" || activeCategorySlug !== "all";

  // Helper to render the background slideshow
  const renderHeroBackgrounds = () => (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, backgroundColor: "#0b0c0e" }}>
      {heroBgs.map((bg, idx) => (
        <div key={idx} style={{
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          background: `linear-gradient(to right, rgba(11, 12, 14, 0.98) 25%, rgba(11, 12, 14, 0.6) 50%, rgba(11, 12, 14, 0) 100%), linear-gradient(to top, rgba(11, 12, 14, 1) 0%, rgba(11, 12, 14, 0) 40%), url("${bg}") center/cover no-repeat`,
          opacity: currentBgIndex === idx ? 1 : 0,
          transition: "opacity 1.5s ease-in-out"
        }} />
      ))}
    </div>
  );

  const renderHeroControls = () => (
    <>
      <button className={`${styles.heroNavBtn} ${styles.heroNavNext}`} onClick={handleNextHero} aria-label="Next Slide">
        ❯
      </button>
      <button className={`${styles.heroNavBtn} ${styles.heroNavPrev}`} onClick={handlePrevHero} aria-label="Previous Slide">
        ❮
      </button>
      <div className={styles.heroDotsContainer}>
        {heroBgs.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.heroDot} ${currentBgIndex === idx ? styles.heroDotActive : ""}`}
            onClick={() => goToHero(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </>
  );

  return (
    <div className={styles.container}>

      {/* Grid View / Search Results / Filtered View */}
      {isGridView ? (
        <section style={{ animation: "fadeIn 0.5s ease-out forwards" }}>
          <div className={styles.searchBarRow}>
            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
              {activeCategorySlug !== "all"
                ? categories.find(c => c.slug === activeCategorySlug)?.name
                : "نتائج البحث والتصفح"}
            </h2>

            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="البحث في التقارير والفيديوهات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className={styles.searchIcon}>🔍</span>
            </div>
          </div>

          {/* Filter Navigation */}
          <div className={styles.filterBar}>
            <button
              onClick={() => handleFilterClick("all")}
              className={`${styles.filterTab} ${activeCategorySlug === "all" ? styles.activeTab : ""}`}
              style={{ background: "transparent", border: "none", cursor: "pointer", outline: "none" }}
            >
              الكل
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => handleFilterClick(cat.slug)}
                className={`${styles.filterTab} ${activeCategorySlug === cat.slug ? styles.activeTab : ""}`}
                style={{ background: "transparent", border: "none", cursor: "pointer", outline: "none" }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "250px" }}>
              <div className={styles.loadingSpinner}>جاري تحميل التقارير...</div>
            </div>
          ) : (
            <YouTubeGrid initialVideos={filteredYoutubeVideos} />
          )}
        </section>
      ) : (
        /* Full Shahid-style dynamic landing page */
        <>
          {/* 1. Hero Live Billboard Section */}
          {liveStream ? (
            <section className={styles.hero}>
              <div className={styles.heroContent}>
                <span className="badge-live">
                  <span className="live-dot"></span>
                  البث المباشر المفتوح
                </span>
                <h1 className={styles.heroTitle}>{liveStream.title}</h1>
                <p className={styles.heroDesc}>
                  {liveStream.description || "شاهد البث المباشر لقناتنا بجودة عالية وتغطية شاملة ومستمرة على مدار اليوم."}
                </p>
                <div className={styles.heroActions}>
                  <Link href="/live" prefetch={false} className="btn btn-primary">
                    ▶ شاهد البث المباشر الآن
                  </Link>
                </div>
              </div>
              {renderHeroBackgrounds()}
              {renderHeroControls()}
            </section>
          ) : (
            <section className={styles.hero}>
              <div className={styles.heroContent}>
                <span className="badge-live">بث تجريبي</span>
                <h1 className={styles.heroTitle}>منصة اليوم plus الإعلامية الرقمية</h1>
                <p className={styles.heroDesc}>
                  مرحباً بكم في بوابتكم التفاعلية المفضلة لمشاهدة البث المباشر، فيديوهات الريلز القصيرة الحية، وأروع التقارير الإخبارية والبرامج الترفيهية المباشرة.
                </p>
                <div className={styles.heroActions}>
                  <Link href="/reels" prefetch={false} className="btn btn-primary">
                    📱 تصفح الريلز القصيرة
                  </Link>
                </div>
              </div>
              {renderHeroBackgrounds()}
              {renderHeroControls()}
            </section>
          )}

          {/* Search Trigger for Home Layout */}
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 4%", marginTop: "-20px" }}>
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="ابحث في جميع التقارير..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className={styles.searchIcon}>🔍</span>
            </div>
          </div>

          {/* 2. Reels Horizontal Swipe Section */}
          {reels.length > 0 && (
            <section style={{ padding: "0 4%" }}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>أحدث ريلز اليوم plus 📱</h2>
                <Link href="/reels" prefetch={false} className={styles.sectionLink}>
                  مشاهدة الكل ←
                </Link>
              </div>
              <div className={reels.length > 4 ? styles.reelsScrollWrapper : styles.reelsGrid}>
                {reels.map((reel: any) => {
                  const getYtThumb = (url: string) => {
                    let vid = "";
                    if (url.includes("shorts/")) vid = url.split("shorts/")[1]?.split("?")[0]?.split("&")[0] || "";
                    else if (url.includes("embed/")) vid = url.split("embed/")[1]?.split("?")[0]?.split("&")[0] || "";
                    else if (url.includes("v=")) vid = url.split("v=")[1]?.split("&")[0] || "";
                    else if (url.includes("youtu.be/")) vid = url.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0] || "";
                    return vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : "";
                  };
                  const thumbSrc = toDirectImageUrl(reel.thumbnail) || getYtThumb(reel.url);
                  const fallbackSrc = getYtThumb(reel.url);

                  return (
                    <Link href={`/reels?id=${reel.id}`} prefetch={false} key={reel.id} className={styles.reelTeaserCard}>
                      {thumbSrc ? (
                        <img
                          src={thumbSrc}
                          alt={reel.title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            if (fallbackSrc) e.currentTarget.src = fallbackSrc;
                          }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: "2.5rem" }}>🎬</span>
                        </div>
                      )}
                      <div className={styles.reelTeaserOverlay}>
                        <h3 className={styles.reelTeaserTitle}>{reel.title}</h3>
                      </div>
                      <div className={styles.playIconWrapper}>
                        <span style={{ fontSize: "1.3rem", color: "#fff" }}>▶</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* 3. Widescreen Rows Grouped in Two Blocks */}
          <VideoRow
            title="فيديوهات مميزة"
            videos={allYoutubeVideos.filter(v => v.isFeatured).length > 0
              ? allYoutubeVideos.filter(v => v.isFeatured)
              : allYoutubeVideos.slice(0, 4)}
          />
          <VideoRow
            title="أحدث الفيديوهات والتقارير"
            videos={allYoutubeVideos}
          />

          {/* B. Glassmorphic Interactive Opinion Poll Widget */}
          <section className={styles.pollContainer} style={{ margin: "0 4%" }}>
            <div className={styles.pollInfo}>
              <h2 className={styles.pollTitle}>استطلاع الرأي التفاعلي</h2>
              <p className={styles.pollSub}>
                {pollData.question}
              </p>
              <span style={{ fontSize: "0.8rem", color: "#a3a3a3", fontWeight: "750", marginTop: "10px" }}>
                إجمالي الأصوات المشاركة: {totalVotes.toLocaleString()} صوت
              </span>
            </div>

            <div className={styles.pollOptionsList}>
              <button onClick={() => handleVote(1)} className={styles.pollOptionBtn}>
                <div className={styles.pollProgressBg} style={{ width: votedOption !== null ? `${getPercent(pollData.votes1)}%` : "0%" }}></div>
                <div className={styles.pollOptionContent}>
                  <span>{pollData.option1}</span>
                  {votedOption !== null && <span className={styles.pollPercent}>{getPercent(pollData.votes1)}%</span>}
                </div>
              </button>

              <button onClick={() => handleVote(2)} className={styles.pollOptionBtn}>
                <div className={styles.pollProgressBg} style={{ width: votedOption !== null ? `${getPercent(pollData.votes2)}%` : "0%" }}></div>
                <div className={styles.pollOptionContent}>
                  <span>{pollData.option2}</span>
                  {votedOption !== null && <span className={styles.pollPercent}>{getPercent(pollData.votes2)}%</span>}
                </div>
              </button>

              <button onClick={() => handleVote(3)} className={styles.pollOptionBtn}>
                <div className={styles.pollProgressBg} style={{ width: votedOption !== null ? `${getPercent(pollData.votes3)}%` : "0%" }}></div>
                <div className={styles.pollOptionContent}>
                  <span>{pollData.option3}</span>
                  {votedOption !== null && <span className={styles.pollPercent}>{getPercent(pollData.votes3)}%</span>}
                </div>
              </button>
            </div>
          </section>

          {/* C. Premium Milestones Stats Section */}
          <section style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "0 4%" }}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>اليوم plus في أرقام 📊</h2>
            </div>

            <div className={styles.milestonesRow}>
              <div className={styles.milestoneCard}>
                <div className={styles.milestoneIconWrapper}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" /><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" /><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" /><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" /></svg>
                </div>
                <div className={styles.milestoneNum}>24/7</div>
                <div className={styles.milestoneLabel}>بث مباشر مستمر دون انقطاع</div>
              </div>
              <div className={styles.milestoneCard}>
                <div className={styles.milestoneIconWrapper}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7a2 2 0 0 0-2.45-1.45L16 7V5a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2l4.55 1.45A2 2 0 0 0 23 17V7z" /></svg>
                </div>
                <div className={styles.milestoneNum}>+500</div>
                <div className={styles.milestoneLabel}>تقرير وفيديو وثائقي مسجل</div>
              </div>
              <div className={styles.milestoneCard}>
                <div className={styles.milestoneIconWrapper}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <div className={styles.milestoneNum}>+150K</div>
                <div className={styles.milestoneLabel}>متابع متفاعل عبر المنصة</div>
              </div>
              <div className={styles.milestoneCard}>
                <div className={styles.milestoneIconWrapper}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                </div>
                <div className={styles.milestoneNum}>100%</div>
                <div className={styles.milestoneLabel}>تغطية وطنية شاملة وحيادية</div>
              </div>
            </div>
          </section>
        </>
      )}

    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <span style={{ color: "var(--text-secondary)", fontSize: "1.2rem" }}>جاري تحميل المنصة الرقمية...</span>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
