import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { FloatingContactButtons } from "@/components/FloatingContactButtons";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="store-root">
      <TopNav />
      <div className="store-body">
        <BottomNav />
        <main className="main-content">{children}</main>
      </div>
      <FloatingContactButtons />
    </div>
  );
}
