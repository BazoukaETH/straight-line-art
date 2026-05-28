import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/wasla/AppShell";
import { SpaceTreeSidebar } from "@/components/wasla/SpaceTreeSidebar";
import { inboxItems, memberById } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/wasla/Avatar";
import { Button } from "@/components/ui/button";
import { Hash, MessageSquare, CheckSquare, Cog, Bell } from "lucide-react";
import { toast } from "sonner";

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
  return (
    <AppShell sidebar={<SpaceTreeSidebar />} breadcrumb={<span className="font-medium text-foreground">Inbox</span>}>
      <div className="px-6 py-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Inbox</h1>
            <p className="text-sm text-muted-foreground">Everything you need to act on, in one place</p>
          </div>
          <button onClick={() => toast.success("All marked as read")} className="text-sm text-accent hover:underline">Mark all as read</button>
        </div>

        <Tabs defaultValue="unread">
          <TabsList>
            <TabsTrigger value="unread">Unread <span className="ml-1.5 rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">{inboxItems.filter(i => i.unread).length}</span></TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="mt-4">
            <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
              {inboxItems.filter(i => i.unread).map((i) => <Item key={i.id} item={i} />)}
            </div>
          </TabsContent>
          <TabsContent value="all" className="mt-4">
            <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
              {inboxItems.map((i) => <Item key={i.id} item={i} />)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function Item({ item }: { item: typeof inboxItems[number] }) {
  const Icon = iconFor[item.source];
  return (
    <div className={`flex items-center gap-3 px-4 py-3 transition hover:bg-muted/40 ${item.unread ? "bg-[color-mix(in_oklab,var(--accent)_5%,transparent)]" : ""}`}>
      {item.unread && <span className="size-1.5 shrink-0 rounded-full bg-accent" />}
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
        <Button size="sm" variant="ghost">Reply</Button>
        <Button size="sm" variant="ghost">Open</Button>
        <Button size="sm" variant="ghost">Done</Button>
      </div>
    </div>
  );
}
