import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Link2, Star, Pencil, FolderInput, Archive } from "lucide-react";
import { useFavorites, type FavoriteKind } from "@/lib/favorites";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PageActionsMenuProps {
  kind: FavoriteKind;
  id: string;
  label: string;
  /** Optional handler for Rename. */
  onRename?: () => void;
  /** Optional handler for Move to… */
  onMove?: () => void;
  /** Optional handler for Archive. */
  onArchive?: () => void;
  className?: string;
}

export function PageActionsMenu({ kind, id, label, onRename, onMove, onArchive, className }: PageActionsMenuProps) {
  const { isStarred, toggle } = useFavorites();
  const starred = isStarred(kind, id);

  const copyLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const toggleStar = () => {
    const href = typeof window !== "undefined" ? window.location.pathname : "";
    toggle({ kind, id, label, href });
    toast.success(starred ? "Removed from Starred" : "Added to Starred");
  };

  const notImpl = (what: string) => toast(`${what} — coming soon`);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className={cn("size-8 shrink-0", className)} aria-label="Page actions">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={copyLink}>
          <Link2 className="size-3.5" /> Copy link to this page
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleStar}>
          <Star className={cn("size-3.5", starred && "fill-amber-400 text-amber-400")} />
          {starred ? "Unstar this page" : "Star this page"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onRename ?? (() => notImpl("Rename"))}>
          <Pencil className="size-3.5" /> Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onMove ?? (() => notImpl("Move to"))}>
          <FolderInput className="size-3.5" /> Move to…
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onArchive ?? (() => notImpl("Archive"))} className="text-destructive focus:text-destructive">
          <Archive className="size-3.5" /> Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
