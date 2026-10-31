"use client";

import * as React from "react";
import { ExternalLink, Images, Pencil, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

import type { HeroSlide } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import {
  deleteHeroSlide,
  listHeroSlides,
  reorderHeroSlides,
  setHeroSlideActive,
} from "@/lib/api/hero-slides";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/page-header";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
} from "@/components/shared/states";
import { ConfirmDialog, useConfirm } from "@/components/shared/confirm-dialog";
import { OrderControls, moveItem } from "@/components/shared/order-controls";
import { HeroSlideDialog } from "@/components/hero/hero-slide-dialog";

export function HeroSlidesView() {
  const [reordering, setReordering] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<HeroSlide | null>(null);
  const confirm = useConfirm<HeroSlide>();
  const {
    data: slides,
    setData: setSlides,
    loading,
    error,
    reload,
  } = useResource<HeroSlide[]>(listHeroSlides, []);

  async function handleMove(from: number, to: number) {
    const next = moveItem(slides, from, to);
    if (next === slides) return;

    setSlides(next);
    setReordering(true);
    try {
      await reorderHeroSlides(next.map((slide) => slide.id));
    } catch (caught) {
      toast.error(getErrorMessage(caught));
      reload();
    } finally {
      setReordering(false);
    }
  }

  async function handleToggle(slide: HeroSlide, isActive: boolean) {
    const previous = slides;
    setSlides((current) =>
      current.map((item) =>
        item.id === slide.id ? { ...item, is_active: isActive } : item
      )
    );

    try {
      const saved = await setHeroSlideActive(slide.id, isActive);
      setSlides((current) =>
        current.map((item) => (item.id === saved.id ? saved : item))
      );
    } catch (caught) {
      setSlides(previous);
      toast.error(getErrorMessage(caught));
      reload();
    }
  }

  async function handleDelete(slide: HeroSlide) {
    try {
      await deleteHeroSlide(slide);
      toast.success("Hero slide deleted");
      reload();
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hero slides"
        description="The rotating banner at the top of the home page. Arrange slides with the arrows — the first one shows first."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus />
            New slide
          </Button>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <LoadingBlock label="Loading hero slides…" />
      ) : slides.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={<Images />}
              title="No hero slides yet"
              description="Add your first slide to fill the banner on the home page."
              action={
                <Button
                  onClick={() => {
                    setEditing(null);
                    setDialogOpen(true);
                  }}
                >
                  <Plus />
                  New slide
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, index) => (
            <Card key={slide.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3 sm:w-auto">
                  <OrderControls
                    index={index}
                    total={slides.length}
                    disabled={reordering}
                    onMove={handleMove}
                  />
                  {slide.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={slide.image_url}
                      alt={slide.heading}
                      className="h-16 w-28 shrink-0 rounded-md border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground">
                      <Images className="size-4" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-sm font-semibold">
                    {slide.heading}
                  </p>
                  {slide.supporting_text ? (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {slide.supporting_text}
                    </p>
                  ) : null}
                  {slide.cta_label || slide.cta_url ? (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {slide.cta_label || "Button"}
                      </span>
                      {slide.cta_url ? (
                        <a
                          href={slide.cta_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          {slide.cta_url}
                          <ExternalLink className="size-3" />
                        </a>
                      ) : null}
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`active-${slide.id}`}
                      checked={slide.is_active}
                      onCheckedChange={(checked) =>
                        void handleToggle(slide, checked)
                      }
                    />
                    <Label
                      htmlFor={`active-${slide.id}`}
                      className="text-xs text-muted-foreground"
                    >
                      {slide.is_active ? "Live" : "Draft"}
                    </Label>
                  </div>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label={`Edit ${slide.heading}`}
                    onClick={() => {
                      setEditing(slide);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${slide.heading}`}
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => confirm.ask(slide)}
                  >
                    <Trash />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <HeroSlideDialog
        slide={editing}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={reload}
      />

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.setOpen}
        title="Delete this hero slide?"
        description={
          confirm.target
            ? `"${confirm.target.heading}" and its image will be removed. This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete slide"
        destructive
        onConfirm={async () => {
          if (confirm.target) await handleDelete(confirm.target);
        }}
      />
    </div>
  );
}
