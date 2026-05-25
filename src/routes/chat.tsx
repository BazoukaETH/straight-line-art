import { createFileRoute } from "@tanstack/react-router";
import { AppShell, SidebarHeader, SidebarTreeItem } from "@/components/wasla/AppShell";
import { channels, channelMessages, memberById, taskById, pillarMeta, type Channel } from "@/lib/mock-data";
import { Hash, Pin, Settings, Paperclip, Mic, Smile, Send, AtSign, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/wasla/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/wasla/StatusPill";
import { useApp } from "@/lib/app-context";
import { useState } from "react";

export const Route = createFileRoute("/chat")({ component: ChatPage });

function ChatPage() {
  const [activeId, setActiveId] = useState<string>("venture-x");
  const active = channels.find((c) => c.id === activeId)!;
  const msgs = channelMessages[activeId] ?? [];
  const { openTask } = useApp();

  return (
    <AppShell
      sidebar={<ChannelsSidebar active={activeId} onSelect={setActiveId} />}
      breadcrumb={<><span>Chat</span><span className="text-border">/</span><span className="font-medium text-foreground">#{active.name}</span></>}
    >
      <div className="flex h-full flex-col">
        {/* Channel header */}
        <div className="flex items-center gap-3 border-b border-border bg-card px-5 py-3">
          <Hash className="size-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">{active.name}</h2>
          <span className="text-xs text-muted-foreground">· 7 members</span>
          <div className="ml-auto flex gap-1">
            <Button size="icon" variant="ghost"><Pin className="size-4" /></Button>
            <Button size="icon" variant="ghost"><Settings className="size-4" /></Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 scrollbar-thin">
          {msgs.map((m) => {
            const u = memberById(m.authorId);
            return (
              <div key={m.id} className="flex gap-3">
                <Avatar memberId={u.id} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="mb-0.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold">{u.name}</span>
                    <span className="text-[11px] text-muted-foreground">{new Date(m.at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  {m.kind === "voice" ? (
                    <div className="flex w-72 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground"><Mic className="size-3.5" /></div>
                      <div className="flex-1">
                        <div className="h-1 rounded-full bg-muted">
                          <div className="h-full w-1/3 rounded-full bg-accent" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">0:24</span>
                    </div>
                  ) : m.kind === "image" ? (
                    <div className="w-72 overflow-hidden rounded-lg border border-border">
                      <div className="aspect-video bg-gradient-to-br from-[color:var(--accent)]/30 via-[color:var(--accent)]/10 to-transparent" />
                      <div className="px-3 py-2 text-xs text-muted-foreground">hero-option-b.png</div>
                    </div>
                  ) : m.kind === "task" && m.taskId ? (
                    <button onClick={() => openTask(m.taskId!)} className="block w-96 rounded-lg border border-border bg-card p-3 text-left transition hover:border-foreground/20">
                      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Task · {m.taskId}</div>
                      <div className="mb-2 text-sm font-semibold">{taskById(m.taskId!)?.title}</div>
                      <div className="flex items-center justify-between">
                        <StatusPill status={taskById(m.taskId!)?.status ?? "To Do"} />
                        <span className="text-xs text-accent">View task →</span>
                      </div>
                    </button>
                  ) : (
                    <p className="text-sm text-foreground/90">{m.body}</p>
                  )}
                  <div className="mt-1 flex items-center gap-2">
                    {m.reactions?.map((r) => (
                      <span key={r.emoji} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-1.5 py-0.5 text-[11px]">
                        {r.emoji} {r.count}
                      </span>
                    ))}
                    {m.replies && (
                      <button className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:underline">
                        <MessageSquare className="size-3" /> {m.replies} replies
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Composer */}
        <div className="border-t border-border bg-card p-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Button size="icon" variant="ghost" className="size-7"><Paperclip className="size-4" /></Button>
            <Button size="icon" variant="ghost" className="size-7"><AtSign className="size-4" /></Button>
            <Input placeholder={`Message #${active.name}`} className="h-8 border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0" />
            <Button size="icon" variant="ghost" className="size-7"><Smile className="size-4" /></Button>
            <Button size="icon" variant="ghost" className="size-7"><Mic className="size-4" /></Button>
            <Button size="icon" className="size-8"><Send className="size-3.5" /></Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ChannelsSidebar({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const grouped = channels.reduce<Record<string, Channel[]>>((acc, c) => {
    (acc[c.pillar] ??= []).push(c); return acc;
  }, {});
  return (
    <>
      <SidebarHeader title="Chat" />
      <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin">
        {(Object.keys(grouped) as Array<keyof typeof pillarMeta>).map((p) => (
          <div key={p} className="mb-3">
            <div className="mb-1 flex items-center gap-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="size-1.5 rounded-full" style={{ backgroundColor: pillarMeta[p].color }} />
              {pillarMeta[p].label}
            </div>
            {grouped[p].map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition ${active === c.id ? "bg-accent/10 text-accent" : "text-foreground/75 hover:bg-muted/60"}`}
              >
                <Hash className="size-3.5" />
                <span className="flex-1 truncate text-left">{c.name}</span>
                {c.unread && <span className="rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">{c.unread}</span>}
              </button>
            ))}
          </div>
        ))}
        <div className="mt-2 mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Direct messages</div>
        {["moaz","lina","yara"].map((id) => (
          <button key={id} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground/75 hover:bg-muted/60">
            <Avatar memberId={id} size={18} status />
            <span>{memberById(id).name}</span>
          </button>
        ))}
      </div>
    </>
  );
}
