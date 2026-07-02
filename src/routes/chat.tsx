import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, useSidebarCollapse } from "@/components/wasla/AppShell";
import {
  channels, channelMessages, memberById, taskById, pillarMeta, spaceById,
  channelHomeSpaceId, dmMessages, type Channel, type Message,
} from "@/lib/mock-data";
import {
  Hash, Pin, Settings, Paperclip, Mic, Smile, Send, AtSign, MessageSquare,
  CheckSquare, Link as LinkIcon, MoreHorizontal, Reply, Slash, X,
  ChevronsLeft, ChevronsRight,
} from "lucide-react";
import { Avatar } from "@/components/wasla/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/wasla/StatusPill";
import { useApp } from "@/lib/app-context";
import { useTaskNav } from "@/lib/task-nav";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useTasks } from "@/lib/tasks-store";
import {
  readPromoted, setPromoted, addDiscussed, readExtras, pushExtra,
  readChannelSettings, writeChannelSetting, readThreadRead, markThreadRead,
  readReactions, toggleReaction,
  readMsgOverrides, editMessage, deleteMessage, type MsgOverridesMap,
  readPinned, togglePin,
} from "@/lib/chat-store";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { renderWithMentions, useMentionPicker } from "@/lib/mentions";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  validateSearch: (search: Record<string, unknown>): { channel?: string; m?: string } => ({
    channel: typeof search.channel === "string" ? search.channel : undefined,
    m: typeof search.m === "string" ? search.m : undefined,
  }),
});

function useChatStorage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener("storage", bump);
    window.addEventListener("wasla.chat.changed", bump);
    return () => {
      window.removeEventListener("storage", bump);
      window.removeEventListener("wasla.chat.changed", bump);
    };
  }, []);
  return tick;
}

function ChatPage() {
  const search = Route.useSearch();
  const [activeId, setActiveId] = useState<string>(
    search.channel && channels.some((c) => c.id === search.channel) ? search.channel : "client-smg",
  );
  useEffect(() => {
    if (search.channel && channels.some((c) => c.id === search.channel)) {
      setActiveId(search.channel);
    }
  }, [search.channel]);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const isDM = activeId.startsWith("dm-");
  const dmUserId = isDM ? activeId.slice(3) : null;
  const dmUser = dmUserId ? memberById(dmUserId) : null;
  const active = channels.find((c) => c.id === activeId) ?? channels[0];
  const tick = useChatStorage();
  const seeded = isDM && dmUserId ? (dmMessages[dmUserId] ?? []) : (channelMessages[activeId] ?? []);
  const extras = useMemo(() => readExtras(activeId), [activeId, tick]);
  const allMsgs = useMemo(
    () => [...seeded, ...extras].sort((a, b) => a.at.localeCompare(b.at)),
    [seeded, extras],
  );
  const overrides = useMemo(() => readMsgOverrides(), [tick]);
  // Only top-level messages appear in the main feed. Replies live in threads.
  const msgs = useMemo(() => allMsgs.filter((m) => !m.parentMessageId), [allMsgs]);
  // Group replies by parent message id. Deleted replies are hidden.
  const repliesByParent = useMemo(() => {
    const map: Record<string, Message[]> = {};
    for (const m of allMsgs) {
      if (m.parentMessageId && !overrides[m.id]?.deleted) {
        (map[m.parentMessageId] ??= []).push(m);
      }
    }
    return map;
  }, [allMsgs, overrides]);
  const threadRead = useMemo(() => readThreadRead(), [tick]);
  const promoted = useMemo(() => readPromoted(), [tick]);
  const reactionsMap = useMemo(() => readReactions(), [tick]);
  const pinnedIds = useMemo(() => readPinned(activeId), [activeId, tick]);
  const pinnedSet = useMemo(() => new Set(pinnedIds), [pinnedIds]);
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const scrollToMessage = (id: string) => {
    const el = document.getElementById(`msg-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightId(id);
    setTimeout(() => setHighlightId((cur) => (cur === id ? null : cur)), 2000);
  };
  const { goTask } = useTaskNav();
  const { currentUserId, openQuickCreate } = useApp();
  const [convertMsg, setConvertMsg] = useState<Message | null>(null);
  const [threadFor, setThreadFor] = useState<Message | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const beginEdit = (m: Message) => {
    const ov = overrides[m.id];
    setEditingId(m.id);
    setEditDraft(ov?.body ?? m.body);
  };
  const saveEdit = () => {
    if (!editingId) return;
    const t = editDraft.trim();
    if (t) editMessage(editingId, t);
    setEditingId(null);
  };
  const cancelEdit = () => setEditingId(null);

  const openThread = (m: Message) => {
    setThreadFor(m);
    markThreadRead(m.id);
  };

  // Keep threadFor in sync with latest message data (e.g., after reload).
  const threadParent = threadFor ? allMsgs.find((x) => x.id === threadFor.id) ?? threadFor : null;
  const threadReplies = threadParent ? (repliesByParent[threadParent.id] ?? []) : [];

  // Scroll to a specific message when navigated with ?m=<id>
  useEffect(() => {
    if (!search.m) return;
    if (activeId !== (search.channel ?? activeId)) return;
    const id = search.m;
    const t = setTimeout(() => {
      const el = document.getElementById(`msg-${id}`);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightId(id);
      setTimeout(() => setHighlightId((cur) => (cur === id ? null : cur)), 2000);
    }, 80);
    return () => clearTimeout(t);
  }, [search.m, search.channel, activeId, msgs.length]);

  return (
    <AppShell
      sidebar={<ChannelsSidebar active={activeId} onSelect={setActiveId} />}
      breadcrumb={<><span>Chat</span><span className="text-border">/</span><span className="font-medium text-foreground">{isDM && dmUser ? `@${dmUser.name}` : `#${active.name}`}</span></>}
    >
      <div className="flex h-full min-w-0">
        <div className="flex h-full flex-1 min-w-0 flex-col">

        {/* Header */}
        {isDM && dmUser ? (
          <div className="flex items-center gap-3 border-b border-border bg-card px-5 py-3">
            <Avatar memberId={dmUser.id} size={28} status />
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold">{dmUser.name}</h2>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground">Direct message</span>
            </div>
          </div>
        ) : (
          <>
          <div className="flex items-center gap-3 border-b border-border bg-card px-5 py-3">
            <Hash className="size-4 text-muted-foreground" />
            <h2 className="text-base font-semibold">{active.name}</h2>
            <span className="text-xs text-muted-foreground">· 7 members</span>
            <div className="ml-auto flex gap-1">
              <Button
                size="icon"
                variant={pinnedOpen && pinnedIds.length > 0 ? "secondary" : "ghost"}
                onClick={() => setPinnedOpen((v) => !v)}
                title={pinnedIds.length ? `${pinnedIds.length} pinned` : "No pinned messages"}
                className="relative"
              >
                <Pin className="size-4" />
                {pinnedIds.length > 0 && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-accent px-1 text-[9px] font-bold leading-4 text-accent-foreground">
                    {pinnedIds.length}
                  </span>
                )}
              </Button>
              <ChannelSettingsPopover channelId={activeId} />
            </div>
          </div>
          {pinnedOpen && pinnedIds.length > 0 && (
            <div className="border-b border-border bg-muted/30 px-5 py-2">
              <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Pin className="size-3" /> Pinned · {pinnedIds.length}
              </div>
              <ul className="space-y-1">
                {pinnedIds.map((pid) => {
                  const pm = allMsgs.find((x) => x.id === pid);
                  if (!pm) return null;
                  const pu = memberById(pm.authorId);
                  const body = overrides[pm.id]?.deleted
                    ? "This message was deleted"
                    : (overrides[pm.id]?.body ?? pm.body ?? pm.fileName ?? "");
                  const snippet = body.length > 80 ? body.slice(0, 80) + "…" : body;
                  return (
                    <li key={pid} className="group/pin flex items-center gap-2 rounded-md px-2 py-1 hover:bg-background">
                      <Avatar memberId={pu.id} size={18} />
                      <button
                        type="button"
                        onClick={() => scrollToMessage(pid)}
                        className="flex-1 min-w-0 text-left text-xs"
                      >
                        <span className="font-semibold">{pu.name}: </span>
                        <span className="text-muted-foreground">{snippet}</span>
                      </button>
                      <button
                        type="button"
                        title="Unpin"
                        onClick={() => togglePin(activeId, pid)}
                        className="flex size-5 items-center justify-center rounded text-muted-foreground opacity-0 hover:bg-muted hover:text-foreground group-hover/pin:opacity-100"
                      >
                        <X className="size-3" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          </>
        )}

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 scrollbar-thin">
          {msgs.map((m) => {
            const u = memberById(m.authorId);
            const promo = promoted[m.id];
            const replies = repliesByParent[m.id] ?? [];
            const derivedCount = replies.length;
            const displayReplyCount = derivedCount || m.replies || 0;
            const lastReply = replies[replies.length - 1];
            const lastReadAt = threadRead[m.id];
            const unread = replies.filter((r) => !lastReadAt || r.at > lastReadAt).length;
            return (
              <div key={m.id} id={`msg-${m.id}`} className={cn("group relative flex gap-3 rounded-md p-1 -m-1 hover:bg-muted/30 transition-colors", highlightId === m.id && "ring-2 ring-accent bg-accent/10")}>
                <Avatar memberId={u.id} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="mb-0.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold">{u.name}</span>
                    <ClientTime iso={m.at} className="text-[11px] text-muted-foreground" />
                    {overrides[m.id]?.editedAt && !overrides[m.id]?.deleted && (
                      <span className="text-[11px] text-muted-foreground/70">(edited)</span>
                    )}
                  </div>
                  {overrides[m.id]?.deleted ? (
                    <p className="text-sm italic text-muted-foreground">This message was deleted</p>
                  ) : editingId === m.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        autoFocus
                        value={editDraft}
                        onChange={(e) => setEditDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") { e.preventDefault(); saveEdit(); }
                          if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
                        }}
                        className="h-8 text-sm"
                      />
                      <Button size="sm" onClick={saveEdit}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                    </div>
                  ) : m.kind === "voice" ? (
                    <div className="flex w-72 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground"><Mic className="size-3.5" /></div>
                      <div className="flex-1"><div className="h-1 rounded-full bg-muted"><div className="h-full w-1/3 rounded-full bg-accent" /></div></div>
                      <span className="text-xs text-muted-foreground">0:24</span>
                    </div>
                  ) : m.kind === "image" ? (
                    <div className="w-72 overflow-hidden rounded-lg border border-border">
                      {m.fileUrl ? (
                        <img src={m.fileUrl} alt={m.fileName ?? "image"} className="block aspect-video w-full object-cover" />
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-[color:var(--accent)]/30 via-[color:var(--accent)]/10 to-transparent" />
                      )}
                      <div className="px-3 py-2 text-xs text-muted-foreground">{m.fileName ?? "hero-option-b.png"}</div>
                    </div>
                  ) : m.kind === "file" ? (
                    <a
                      href={m.fileUrl}
                      download={m.fileName}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-72 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 transition hover:border-foreground/20"
                    >
                      <div className="flex size-9 items-center justify-center rounded-md bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-accent">
                        <Paperclip className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{m.fileName ?? "attachment"}</div>
                        <div className="text-[11px] text-muted-foreground">Click to download</div>
                      </div>
                    </a>
                  ) : m.kind === "task" && m.taskId ? (
                    <button onClick={() => goTask(m.taskId!)} className="block w-96 rounded-lg border border-border bg-card p-3 text-left transition hover:border-foreground/20">
                      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Task · {m.taskId}</div>
                      <div className="mb-2 text-sm font-semibold">{taskById(m.taskId!)?.title}</div>
                      <div className="flex items-center justify-between">
                        <StatusPill status={taskById(m.taskId!)?.status ?? "To Do"} />
                        <span className="text-xs text-accent">View task →</span>
                      </div>
                    </button>
                  ) : (
                    <p className="text-sm text-foreground/90">{renderWithMentions(overrides[m.id]?.body ?? m.body)}</p>
                  )}
                  {promo && (
                    <button
                      onClick={() => goTask(promo.taskId)}
                      className="mt-1.5 inline-flex h-[26px] items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2 text-[11px] font-medium text-foreground/80 transition hover:bg-muted"
                    >
                      <CheckSquare className="size-3 text-emerald-600" />
                      Promoted to task: "{promo.taskTitle.length > 40 ? promo.taskTitle.slice(0, 40) + "…" : promo.taskTitle}"
                      <span className="text-accent">→</span>
                    </button>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {(() => {
                      const stored = reactionsMap[m.id] ?? {};
                      const emojis = new Set<string>([
                        ...(m.reactions ?? []).map((r) => r.emoji),
                        ...Object.keys(stored),
                      ]);
                      return Array.from(emojis).map((emoji) => {
                        const seeded = m.reactions?.find((r) => r.emoji === emoji)?.count ?? 0;
                        const users = stored[emoji] ?? [];
                        const total = seeded + users.length;
                        if (total === 0) return null;
                        const mine = users.includes(currentUserId);
                        return (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => toggleReaction(m.id, emoji, currentUserId)}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] transition",
                              mine
                                ? "border-accent bg-accent/15 text-accent"
                                : "border-border bg-muted hover:bg-muted/70",
                            )}
                          >
                            {emoji} {total}
                          </button>
                        );
                      });
                    })()}
                  </div>
                  {displayReplyCount > 0 && (
                    <button
                      type="button"
                      onClick={() => openThread(m)}
                      className="mt-1.5 inline-flex items-center gap-2 rounded-md border border-transparent px-1.5 py-1 text-[11px] font-medium text-accent transition hover:border-border hover:bg-muted/60"
                    >
                      <span className="flex -space-x-1.5">
                        {Array.from(new Set(replies.map((r) => r.authorId))).slice(0, 3).map((id) => (
                          <span key={id} className="ring-2 ring-background rounded-full">
                            <Avatar memberId={id} size={18} />
                          </span>
                        ))}
                      </span>
                      <span>{displayReplyCount} {displayReplyCount === 1 ? "reply" : "replies"}</span>
                      {lastReply && (
                        <ClientTime iso={lastReply.at} className="text-[11px] font-normal text-muted-foreground" prefix="Last " />
                      )}
                      {unread > 0 && (
                        <span className="rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                          {unread}
                        </span>
                      )}
                    </button>
                  )}
                </div>
                <MessageActions
                  m={m}
                  channelId={activeId}
                  isDM={isDM}
                  currentUserId={currentUserId}
                  isDeleted={!!overrides[m.id]?.deleted}
                  isPinned={pinnedSet.has(m.id)}
                  onConvert={() => openQuickCreate({ tab: "task", title: m.body })}
                  onReplyInThread={() => openThread(m)}
                  onEdit={() => beginEdit(m)}
                  onDelete={() => deleteMessage(m.id)}
                />
              </div>
            );
          })}
        </div>

        {/* Composer */}
        <Composer
          channelId={activeId}
          channelName={isDM && dmUser ? dmUser.name : active.name}
          currentUserId={currentUserId}
          isDM={isDM}
        />
        </div>

        {threadParent && (
          <ThreadPanel
            parent={threadParent}
            replies={threadReplies}
            channelId={activeId}
            channelName={active.name}
            currentUserId={currentUserId}
            overrides={overrides}
            onClose={() => setThreadFor(null)}
          />
        )}
      </div>

      {convertMsg && (
        <ConvertMessageDialog
          msg={convertMsg}
          channel={active}
          onClose={() => setConvertMsg(null)}
        />
      )}
    </AppShell>
  );
}

/* -------------------- Client-only time (SSR-safe) -------------------- */
function ClientTime({ iso, className, prefix }: { iso: string; className?: string; prefix?: string }) {
  const [text, setText] = useState<string>("");
  useEffect(() => {
    setText(new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
  }, [iso]);
  return <span className={className} suppressHydrationWarning>{text ? `${prefix ?? ""}${text}` : ""}</span>;
}

/* -------------------- Thread panel -------------------- */
function ThreadPanel({
  parent, replies, channelId, channelName, currentUserId, overrides, onClose,
}: {
  parent: Message; replies: Message[]; channelId: string; channelName: string;
  currentUserId: string; overrides: MsgOverridesMap; onClose: () => void;
}) {
  const author = memberById(parent.authorId);
  const parentOv = overrides[parent.id];
  return (
    <aside className="flex h-full w-[420px] shrink-0 flex-col border-l border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <MessageSquare className="size-4 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">Thread</div>
          <div className="truncate text-[11px] text-muted-foreground">#{channelName}</div>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose} title="Close thread">
          <X className="size-4" />
        </Button>
      </div>

      {/* Parent (pinned) */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex gap-3">
          <Avatar memberId={author.id} size={32} />
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-baseline gap-2">
              <span className="text-sm font-semibold">{author.name}</span>
              <ClientTime iso={parent.at} className="text-[11px] text-muted-foreground" />
              {parentOv?.editedAt && !parentOv?.deleted && (
                <span className="text-[11px] text-muted-foreground/70">(edited)</span>
              )}
            </div>
            {parentOv?.deleted ? (
              <p className="text-sm italic text-muted-foreground">This message was deleted</p>
            ) : (
              <p className="text-sm text-foreground/90 break-words">{renderWithMentions(parentOv?.body ?? parent.body)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Reply count divider */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-1 text-[11px] font-medium text-muted-foreground">
        <span>{replies.length} {replies.length === 1 ? "reply" : "replies"}</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* Replies */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 scrollbar-thin">
        {replies.length === 0 && (
          <div className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
            No replies yet. Start the thread below.
          </div>
        )}
        {replies.map((r) => {
          const u = memberById(r.authorId);
          const rov = overrides[r.id];
          return (
            <div key={r.id} className="flex gap-3">
              <Avatar memberId={u.id} size={28} />
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-baseline gap-2">
                  <span className="text-sm font-semibold">{u.name}</span>
                  <ClientTime iso={r.at} className="text-[11px] text-muted-foreground" />
                  {rov?.editedAt && <span className="text-[11px] text-muted-foreground/70">(edited)</span>}
                </div>
                <p className="text-sm text-foreground/90 break-words">{renderWithMentions(rov?.body ?? r.body)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reuse existing composer, in thread mode */}
      <Composer
        channelId={channelId}
        channelName={channelName}
        currentUserId={currentUserId}
        threadParentId={parent.id}
      />
    </aside>
  );
}


/* -------------------- Message hover actions -------------------- */
function MessageActions({ m, channelId, isDM, currentUserId, isDeleted, isPinned, onConvert, onReplyInThread, onEdit, onDelete }: { m: Message; channelId: string; isDM?: boolean; currentUserId: string; isDeleted?: boolean; isPinned?: boolean; onConvert: () => void; onReplyInThread: () => void; onEdit: () => void; onDelete: () => void }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const copyLink = () => {
    const link = `${window.location.origin}/chat?channel=${channelId}&m=${m.id}`;
    navigator.clipboard?.writeText(link).catch(() => {});
    toast.success("Link copied");
  };
  const quickEmojis = ["👍", "❤️", "🔥", "✅", "😂", "🎉"];
  return (
    <div className="absolute right-2 top-0 flex translate-y-[-50%] items-center gap-0.5 rounded-md border border-border bg-card px-1 py-0.5 opacity-0 shadow-sm transition group-hover:opacity-100">
      <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            title="React"
            className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Smile className="size-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-1">
          <div className="flex items-center gap-0.5">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => { toggleReaction(m.id, emoji, currentUserId); setPickerOpen(false); }}
                className="flex size-8 items-center justify-center rounded text-base hover:bg-muted"
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <IconBtn title="Reply in thread" onClick={onReplyInThread}><Reply className="size-3.5" /></IconBtn>
      {!isDM && (
        <IconBtn title={isPinned ? "Unpin" : "Pin"} onClick={() => togglePin(channelId, m.id)}>
          <Pin className={cn("size-3.5", isPinned && "text-accent")} />
        </IconBtn>
      )}
      {!isDM && <IconBtn title="Create task" onClick={onConvert}><CheckSquare className="size-3.5" /></IconBtn>}
      <IconBtn title="Copy link" onClick={copyLink}><LinkIcon className="size-3.5" /></IconBtn>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            title="More"
            className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <MoreHorizontal className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={copyLink}>
            <LinkIcon className="mr-2 size-3.5" /> Copy link
          </DropdownMenuItem>
          {m.authorId === currentUserId && !isDeleted && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onEdit}>Edit message</DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                Delete message
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
function IconBtn({ children, title, onClick }: { children: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button type="button" title={title} onClick={onClick} className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground">
      {children}
    </button>
  );
}

/* -------------------- Convert dialog -------------------- */
function ConvertMessageDialog({ msg, channel, onClose }: { msg: Message; channel: Channel; onClose: () => void }) {
  const { lists, createTask, updateTask } = useTasks();
  const homeSpaceId = channelHomeSpaceId(channel.id);
  const spaceLists = lists.filter((l) => l.spaceId === homeSpaceId);
  const author = memberById(msg.authorId);

  const [title, setTitle] = useState(msg.body.slice(0, 80) + (msg.body.length > 80 ? "…" : ""));
  const [listId, setListId] = useState(spaceLists[0]?.id ?? lists[0]?.id ?? "");
  const [assigneeId, setAssigneeId] = useState(msg.authorId);
  const [due, setDue] = useState<Date | undefined>(undefined);
  const [backlink, setBacklink] = useState(true);
  const { goTask } = useTaskNav();

  const submit = () => {
    const t = createTask({ title, listId, assigneeId, due });
    const formattedDate = new Date(msg.at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
    updateTask(t.id, {
      description: `${msg.body}\n\n---\nFrom #${channel.name} by @${author.name} on ${formattedDate}`,
    });
    if (backlink) {
      setPromoted(msg.id, t.id, t.title);
    }
    addDiscussed(t.id, channel.id, msg.id);
    const listName = lists.find((l) => l.id === listId)?.name ?? "list";
    toast.success(`Task created in ${listName}`, {
      action: { label: "Open task", onClick: () => goTask(t.id) },
    });
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Turn message into task</DialogTitle></DialogHeader>
        <div className="mb-2 text-xs text-muted-foreground">
          From #{channel.name} · @{author.name} · {new Date(msg.at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label className="text-xs">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">List</Label>
              <Select value={listId} onValueChange={setListId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(spaceLists.length ? spaceLists : lists).map((l) => {
                    const sp = spaceById(l.spaceId);
                    return <SelectItem key={l.id} value={l.id}>{sp.name} / {l.name}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Assignee</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["bassel","moaz","usef","ali","hagry","osama","saif"].map((id) => (
                    <SelectItem key={id} value={id}>{memberById(id).name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Due (optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  {due ? due.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={due} onSelect={setDue} className="p-3 pointer-events-auto" /></PopoverContent>
            </Popover>
          </div>
          <label className="flex items-start gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-xs">
            <Checkbox checked={backlink} onCheckedChange={(c) => setBacklink(!!c)} className="mt-0.5 rounded-[5px]" />
            <span>
              <span className="font-medium text-foreground">Post a "Promoted to task" backlink in #{channel.name}</span>
              <span className="block text-muted-foreground">Recommended — keeps the conversation linked.</span>
            </span>
          </label>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Create task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------- Channel settings popover -------------------- */
function ChannelSettingsPopover({ channelId }: { channelId: string }) {
  const tick = useChatStorage();
  const settings = useMemo(() => readChannelSettings()[channelId] ?? {}, [channelId, tick]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost"><Settings className="size-4" /></Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-4">
        <div className="mb-3 text-sm font-semibold">Channel settings</div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <Label className="text-sm">Post task updates to this channel</Label>
            <p className="text-[11px] text-muted-foreground">When tasks created here change status, post a system message in this channel. Off by default.</p>
          </div>
          <Switch
            checked={!!settings.postTaskUpdates}
            onCheckedChange={(v) => writeChannelSetting(channelId, { postTaskUpdates: v })}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* -------------------- Composer with slash commands -------------------- */
function Composer({ channelId, channelName, currentUserId, threadParentId, isDM }: { channelId: string; channelName: string; currentUserId: string; threadParentId?: string; isDM?: boolean }) {
  const isThread = !!threadParentId;
  const [value, setValue] = useState("");
  const { tasks, lists } = useTasks();
  const { openQuickCreate } = useApp();
  const { goTask } = useTaskNav();
  const nav = useNavigate();
  const homeSpaceId = channelHomeSpaceId(channelId);
  const defaultList = lists.find((l) => l.spaceId === homeSpaceId)?.id;

  // slash command modes
  const mode: "none" | "menu" | "find" = isThread || isDM ? "none" :
    value === "/" ? "menu" :
    value.startsWith("/find") ? "find" :
    value === "/task" ? "menu" : "none";

  const showPopover = mode !== "none";

  const findQuery = mode === "find" ? value.slice(5).trim().toLowerCase() : "";
  const findResults = useMemo(() => {
    if (mode !== "find" || !findQuery) return [];
    return tasks.filter((t) => t.title.toLowerCase().includes(findQuery)).slice(0, 8);
  }, [mode, findQuery, tasks]);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [highlight, setHighlight] = useState(0);
  useEffect(() => { setHighlight(0); }, [value]);
  const mention = useMentionPicker({ value, setValue, inputRef });

  const pickTask = () => {
    setValue("");
    openQuickCreate({ tab: "task", listId: defaultList });
  };
  const pickFind = (taskId: string) => {
    pushExtra(channelId, {
      id: `x-${Date.now()}`,
      authorId: currentUserId,
      body: "",
      at: new Date().toISOString(),
      kind: "task",
      taskId,
    });
    setValue("");
    toast.success("Task linked in channel");
  };

  const menuItems = ["/task", "/find"];

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (mention.onKeyDown(e)) return;
    if (!showPopover) return;
    if (e.key === "Escape") { setValue(""); return; }
    if (mode === "menu") {
      if (e.key === "ArrowDown") { e.preventDefault(); setHighlight((h) => (h + 1) % menuItems.length); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setHighlight((h) => (h - 1 + menuItems.length) % menuItems.length); }
      if (e.key === "Enter")     {
        e.preventDefault();
        const chosen = menuItems[highlight];
        if (chosen === "/task") pickTask();
        else setValue("/find ");
      }
    } else if (mode === "find") {
      if (e.key === "ArrowDown") { e.preventDefault(); setHighlight((h) => Math.min(h + 1, Math.max(findResults.length - 1, 0))); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
      if (e.key === "Enter" && findResults[highlight]) {
        e.preventDefault();
        pickFind(findResults[highlight].id);
      }
    }
  };

  return (
    <div className="border-t border-border bg-card p-3">
      <div className="relative">
        {mention.dropdown}
        {showPopover && !mention.active && (
          <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
            {mode === "menu" && (
              <ul className="py-1 text-sm">
                {menuItems.map((it, i) => (
                  <li
                    key={it}
                    onMouseEnter={() => setHighlight(i)}
                    onMouseDown={(e) => { e.preventDefault(); if (it === "/task") pickTask(); else setValue("/find "); }}
                    className={cn("flex cursor-pointer items-center gap-2 px-3 py-2", highlight === i && "bg-muted")}
                  >
                    <Slash className="size-3.5 text-muted-foreground" />
                    <span className="font-medium">{it}</span>
                    <span className="text-xs text-muted-foreground">{it === "/task" ? "Create a new task" : "Insert an existing task"}</span>
                  </li>
                ))}
              </ul>
            )}
            {mode === "find" && (
              <div className="max-h-64 overflow-y-auto">
                {findResults.length === 0 && (
                  <div className="px-3 py-3 text-xs text-muted-foreground">
                    {findQuery ? "No tasks match" : "Type to search tasks…"}
                  </div>
                )}
                {findResults.map((t, i) => {
                  const sp = spaceById(t.spaceId);
                  return (
                    <button
                      key={t.id}
                      onMouseEnter={() => setHighlight(i)}
                      onMouseDown={(e) => { e.preventDefault(); pickFind(t.id); }}
                      className={cn("flex w-full items-center gap-2 px-3 py-2 text-left text-sm", highlight === i && "bg-muted")}
                    >
                      <span className="font-mono text-[10px] text-muted-foreground">{t.id}</span>
                      <span className="flex-1 truncate">{t.title}</span>
                      <span className="text-[11px] text-muted-foreground">{sp.name}</span>
                      <StatusPill status={t.status} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = URL.createObjectURL(file);
              const isImage = file.type.startsWith("image/");
              pushExtra(channelId, {
                id: `x-${Date.now()}`,
                authorId: currentUserId,
                body: "",
                at: new Date().toISOString(),
                kind: isImage ? "image" : "file",
                fileUrl: url,
                fileName: file.name,
                ...(isThread ? { parentMessageId: threadParentId } : {}),
              });
              if (isThread) markThreadRead(threadParentId!);
              e.target.value = "";
            }}
          />
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
          >
            <Paperclip className="size-4" />
          </Button>
          <Button size="icon" variant="ghost" className="size-7"><AtSign className="size-4" /></Button>
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={isThread ? "Reply in thread…" : isDM ? `Message ${channelName}` : `Message #${channelName} — type / for commands`}
            className="h-8 border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
          />
          <Button size="icon" variant="ghost" className="size-7"><Smile className="size-4" /></Button>
          <Button size="icon" variant="ghost" className="size-7"><Mic className="size-4" /></Button>
          <Button size="icon" className="size-8" onClick={() => {
            const text = value.trim();
            if (!text) return;
            if (isThread) {
              pushExtra(channelId, {
                id: `x-${Date.now()}`,
                authorId: currentUserId,
                body: text,
                at: new Date().toISOString(),
                parentMessageId: threadParentId,
              });
              setValue("");
              markThreadRead(threadParentId!);
            } else if (isDM) {
              pushExtra(channelId, {
                id: `x-${Date.now()}`,
                authorId: currentUserId,
                body: text,
                at: new Date().toISOString(),
              });
              setValue("");
            } else {
              setValue("");
              toast.success("Sent");
            }
          }}><Send className="size-3.5" /></Button>
        </div>
      </div>
    </div>
  );
}

function ChannelsSidebar({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const { collapsed, toggle } = useSidebarCollapse();
  const grouped = channels.reduce<Record<string, Channel[]>>((acc, c) => {
    (acc[c.pillar] ??= []).push(c); return acc;
  }, {});
  const dmIds = ["moaz", "usef", "ali", "hagry"];

  if (collapsed) {
    return (
      <div className="flex h-full w-full min-w-0 flex-col items-center gap-1.5 overflow-hidden py-3">
        <button
          onClick={toggle}
          className="flex size-8 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Expand sidebar  (⌘B)"
          aria-label="Expand sidebar"
        >
          <ChevronsRight className="size-4" />
        </button>
        <div className="my-1 h-px w-6 bg-border" />
        {(Object.keys(grouped) as Array<keyof typeof pillarMeta>).map((p) => (
          <div key={p} className="flex size-8 items-center justify-center" title={pillarMeta[p].label}>
            <span className="size-2.5 rounded-full" style={{ background: pillarMeta[p].color }} />
          </div>
        ))}
        <div className="my-1 h-px w-6 bg-border" />
        {dmIds.map((id) => {
          const dmId = `dm-${id}`;
          return (
            <button
              key={id}
              onClick={() => onSelect(dmId)}
              className={`flex size-8 items-center justify-center rounded-md ${active === dmId ? "bg-accent/10" : "hover:bg-muted"}`}
              title={memberById(id).name}
            >
              <Avatar memberId={id} size={20} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/60 pl-4 pr-2 py-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Chat</h2>
        <button
          onClick={toggle}
          className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Collapse (⌘B)"
          aria-label="Collapse sidebar"
        >
          <ChevronsLeft className="size-3.5" />
        </button>
      </div>
      <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-2 py-2 scrollbar-thin">

        {(Object.keys(grouped) as Array<keyof typeof pillarMeta>).map((p) => (
          <div key={p} className="mb-3 min-w-0">
            <div className="mb-1 flex items-center gap-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: pillarMeta[p].color }} />
              <span className="truncate">{pillarMeta[p].label}</span>
            </div>
            {grouped[p].map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`group flex w-full min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition ${active === c.id ? "bg-accent/10 text-accent" : "text-foreground/75 hover:bg-muted/60"}`}
              >
                <Hash className="size-3.5 shrink-0" />
                <span className="flex-1 truncate text-left">{c.name}</span>
                {c.unread && <span className="shrink-0 rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">{c.unread}</span>}
              </button>
            ))}
          </div>
        ))}
        <div className="mt-2 mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Direct messages</div>
        {dmIds.map((id) => {
          const dmId = `dm-${id}`;
          return (
            <button
              key={id}
              onClick={() => onSelect(dmId)}
              className={`flex w-full min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition ${active === dmId ? "bg-accent/10 text-accent" : "text-foreground/75 hover:bg-muted/60"}`}
            >
              <Avatar memberId={id} size={18} status />
              <span className="truncate">{memberById(id).name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

