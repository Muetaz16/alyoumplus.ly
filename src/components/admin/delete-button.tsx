"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteButton({
  onDelete,
  label = "حذف",
}: {
  onDelete: () => Promise<{ success?: boolean }>;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    startTransition(async () => {
      await onDelete();
      toast.success("تم الحذف");
      router.refresh();
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={pending}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
      {label}
    </Button>
  );
}
