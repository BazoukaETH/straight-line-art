import { createFileRoute } from "@tanstack/react-router";
import { AppShell, SidebarHeader, SidebarTreeItem } from "@/components/wasla/AppShell";
import { files, memberById, pillarMeta, spaces, type Pillar } from "@/lib/mock-data";
import { Avatar } from "@/components/wasla/Avatar";
import { FileText, FileImage, FileSpreadsheet, Presentation, Layers, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/files")({ component: FilesPage });

const iconFor = { pdf: FileText, doc: FileText, sheet: FileSpreadsheet, slide: Presentation, image: FileImage } as const;

function Sidebar() {
  const { currentUserId } = useApp();
  return (
    <>
      <SidebarHeader title="Files" />
      <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin">
        {(Object.keys(pillarMeta) as Pillar[]).map((p) => (
          <div key={p} className="mb-2">
            <SidebarTreeItem label={pillarMeta[p].label} icon={Layers} />
            <div className="ml-3 border-l border-border/60 pl-1">
              {spaces.filter((s) => s.pillar === p && (!s.ownerId || s.ownerId === currentUserId)).map((s) => (
                <SidebarTreeItem key={s.id} label={s.name} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function FilesPage() {
  return (
    <AppShell sidebar={<Sidebar />} breadcrumb={<><span>Files</span><span className="text-border">/</span><span className="font-medium text-foreground">All</span></>}>
      <div className="px-6 py-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Files</h1>
            <p className="text-sm text-muted-foreground">Everything synced from Drive across spaces</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input className="h-9 w-64 pl-8" placeholder="Search files…" />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
              <span className="size-1.5 rounded-full bg-[color:var(--success)]" />
              Connected to Google Drive
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {files.map((f) => {
            const Icon = iconFor[f.kind as keyof typeof iconFor];
            return (
              <div key={f.id} className="overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-md">
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-muted/40 to-muted/10">
                  <Icon className="size-10 text-muted-foreground/60" />
                </div>
                <div className="p-3">
                  <div className="mb-2 truncate text-sm font-medium">{f.name}</div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{f.modified}</span>
                    <Avatar memberId={f.ownerId} size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
