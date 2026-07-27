"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Radio, Power } from "lucide-react";
import { toggleLiveStream } from "@/actions/admin";

export function LiveToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleLiveStream(id, !isActive);
      toast.success(!isActive ? "تم تشغيل البث" : "تم إيقاف البث");
      router.refresh();
    });
  };

  return (
    <Button variant={isActive ? "destructive" : "default"} size="sm" onClick={handleToggle} disabled={pending}>
      {isActive ? <Power className="h-4 w-4" /> : <Radio className="h-4 w-4" />}
      {isActive ? "إيقاف" : "تشغيل"}
    </Button>
  );
}
