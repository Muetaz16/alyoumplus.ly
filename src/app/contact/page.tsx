"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
    setLoading(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h1 className="text-4xl font-black text-[#111827] mb-4">اتصل بنا</h1>
            <p className="text-gray-500 mb-8">نحن هنا للاستماع إليك</p>
            <div className="space-y-4">
              {[
                { icon: Mail, text: "info@libyaplus.ly" },
                { icon: Phone, text: "+218 21 000 0000" },
                { icon: MapPin, text: "طرابلس، ليبيا" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-[#374151]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-[#C1121F]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-8 rounded-2xl border border-gray-100 bg-[#F8F9FA]">
            <div>
              <Label htmlFor="name">الاسم</Label>
              <Input id="name" name="name" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" name="email" type="email" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="message">الرسالة</Label>
              <Textarea id="message" name="message" required className="mt-1" rows={5} />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
