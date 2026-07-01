import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, SidebarHeader, SidebarTreeItem } from "@/components/wasla/AppShell";
import { SpaceTreeSidebar } from "@/components/wasla/SpaceTreeSidebar";
import { inboxItems, memberById, type InboxItem } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/wasla/Avatar";
import { Button } from "@/components/ui/button";
import { Hash, MessageSquare, CheckSquare, Cog, Bell } from "lucide-react";
import { toast } from "sonner";
import { useMemo } from "react";
import { readInboxState, markRead, markAllRead, markDone, useInboxStorage } from "@/lib/inbox-store";
import { taskHrefById } from "@/lib/task-nav";

export const Route = createFileRoute("/inbox")({ component: InboxPage });

function Sidebar() {
  return (
    <>
      <SidebarHeader title="Inbox" />
      <div className="px-2 py-2">
        <SidebarTreeItem label="All notifications" active icon={Bell} />
        <SidebarTreeItem label="Mentions" icon={MessageSquare} />
        <SidebarTreeItem label="Assigned to me" icon={CheckSquare} />
        <SidebarTreeItem label="System" icon={Cog} />
      </div>
    </>
  );
}

const iconFor = { chat: MessageSquare, task: CheckSquare, system: Cog } as const;

function InboxPage() {
  const tick = useInboxStorage();
  const state = useMemo(() => readInboxState(), [tick]);
  const visible = useMemo(() => inboxItems.filter((i) => !state[i.id]?.done), [state]);
  const isUnread = (i: InboxItem) => i.unread && !state[i.id]?.read;
  const unread = visible.filter(isUnread);

  return (
    <AppShell sidebar={<SpaceTreeSidebar />} breadcrumb={<span className="font-medium text-foreground">Inbox</span>}>
      <div className="px-6 py-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Inbox</h1>
            <p className="text-sm text-muted-foreground">Everything you need to act on, in one place</p>
          </div>
          <button
            onClick={() => {
              markAllRead(visible.map((i) => i.id));
              toast.success("All marked as read");
            }}
            className="text-sm text-accent hover:underline"
          >
            Mark all as read
          </button>
        </div>

        <Tabs defaultValue="unread">
          <TabsList>
            <TabsTrigger value="unread">Unread <span className="ml-1.5 rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">{unread.length}</span></TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="mt-4">
            <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
              {unread.map((i) => <Item key={i.id} item={i} unread />)}
            </div>
          </TabsContent>
          <TabsContent value="all" className="mt-4">
            <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
              {visible.map((i) => <Item key={i.id} item={i} unread={isUnread(i)} />)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function Item({ item, unread }: { item: InboxItem; unread: boolean }) {
  const Icon = iconFor[item.source];
  const nav = useNavigate();

  const goToSource = () => {
    markRead(item.id);
    if (item.source === "task" && item.taskId) {
      const href = taskHrefById(item.taskId);
      if (href) nav({ to: href.to, params: href.params } as any);
    } else if (item.source === "chat" && item.channelId) {
      nav({
        to: "/chat",
        search: { channel: item.channelId, m: item.messageId } as any,
      });
    }
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 transition hover:bg-muted/40 ${unread ? "bg-[color-mix(in_oklab,var(--accent)_5%,transparent)]" : ""}`}>
      {unread && <span className="size-1.5 shrink-0 rounded-full bg-accent" />}
      {item.fromId ? <Avatar memberId={item.fromId} size={28} /> : <div className="flex size-7 items-center justify-center rounded-full bg-muted"><Icon className="size-3.5 text-muted-foreground" /></div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {item.fromId && <span className="text-sm font-semibold">{memberById(item.fromId).name}</span>}
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Icon className="size-3" /> {item.source}</span>
          <span className="text-[11px] text-muted-foreground">· 2h ago</span>
        </div>
        <p className="truncate text-sm text-foreground/85">{item.preview}</p>
      </div>
      <div className="flex items-center gap-1">
        {item.source !== "system" && (
          <Button size="sm" variant="ghost" onClick={goToSource}>Reply</Button>
        )}
        <Button size="sm" variant="ghost" onClick={goToSource}>Open</Button>
        <Button size="sm" variant="ghost" onClick={() => markDone(item.id)}>Done</Button>
      </div>
    </div>
  );
}
