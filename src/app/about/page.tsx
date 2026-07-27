import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن",
  description: "تعرف على منصة ليبيا بلس الإعلامية",
};

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-black text-[#111827] mb-6">من نحن</h1>
        <div className="prose prose-lg text-[#374151] space-y-6 leading-relaxed">
          <p>
            <strong className="text-[#C1121F]">ليبيا بلس</strong> هي منصة إعلامية عربية حديثة
            تقدم محتوى إخباري وترفيهي بجودة عالمية. نسعى لأن نكون الوجهة الأولى للمشاهد
            الليبي والعربي الباحث عن محتوى موثوق وسريع.
          </p>
          <p>
            نغطي الأخبار المحلية والعالمية، الرياضة، الاقتصاد، والثقافة عبر قنواتنا
            المتخصصة وبرامجنا المتنوعة، مع دعم كامل للبث المباشر عبر تقنيات HLS وM3U8.
          </p>
          <p>
            رؤيتنا هي بناء منصة إعلامية وطنية احترافية تنافس القنوات العالمية من حيث
            التصميم والأداء وتجربة المستخدم.
          </p>
        </div>
      </div>
    </div>
  );
}
