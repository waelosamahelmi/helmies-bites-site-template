import { useBranches } from "@/hooks/use-branches";
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Clock, MapPin } from "lucide-react";

export function MultiBranchStatusHeaderV2() {
  const { t } = useLanguage();
  const { data: branches = [] } = useBranches();

  if (branches.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center gap-6 overflow-x-auto">
          {branches.map((branch) => (
            <div key={branch.id} className="flex items-center gap-2 text-sm whitespace-nowrap">
              <Store className="h-4 w-4 text-orange-600" />
              <span className="font-medium">{branch.name}</span>
              <span className="text-gray-500">
                {branch.opening_hours?.monday?.closed ? "Closed" : "Open"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}