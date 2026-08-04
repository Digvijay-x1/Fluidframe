import {
  HeartIcon,
  ChatCircleIcon,
  RepeatIcon,
  ShareNetworkIcon,
  DotsThreeIcon,
  ThumbsUpIcon,
  PaperPlaneTiltIcon,
  BookmarkSimpleIcon,
  ImageIcon,
  GlobeIcon,
  SealCheckIcon,
  ChartBarIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const PostImages = ({ images }: { images: string[] }) => {
  if (!images || images.length === 0) {
    return (
      <div className="h-48 w-full flex items-center justify-center relative bg-muted/20">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent, transparent 4px, currentColor 4px, currentColor 5px)",
            color: "oklch(var(--border))",
          }}
        />
        <ImageIcon
          size={48}
          className="text-muted-foreground/50 relative z-10"
          strokeWidth={1}
        />
      </div>
    );
  }

  const count = images.length;

  if (count === 1) {
    return (
      <Image
        src={images[0]}
        alt="content-1"
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto max-h-[500px] object-cover"
      />
    );
  }
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-64 w-full overflow-hidden bg-background">
      {count === 2 && (
        <>
          <div className="row-span-2 relative w-full h-full">
            <Image
              src={images[0]}
              alt="1"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="row-span-2 relative w-full h-full">
            <Image
              src={images[1]}
              alt="2"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </>
      )}
      {count === 3 && (
        <>
          <div className="row-span-2 col-span-1 relative w-full h-full">
            <Image
              src={images[0]}
              alt="1"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="col-span-1 row-span-1 relative w-full h-full">
            <Image
              src={images[1]}
              alt="2"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="col-span-1 row-span-1 relative w-full h-full">
            <Image
              src={images[2]}
              alt="3"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </>
      )}
      {count === 4 && (
        <>
          <div className="relative w-full h-full">
            <Image
              src={images[0]}
              alt="1"
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
          <div className="relative w-full h-full">
            <Image
              src={images[1]}
              alt="2"
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
          <div className="relative w-full h-full">
            <Image
              src={images[2]}
              alt="3"
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
          <div className="relative w-full h-full">
            <Image
              src={images[3]}
              alt="4"
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
        </>
      )}
    </div>
  );
};

// --- Updated Interface ---
interface PostProps {
  caption?: string;
  images?: string[]; // Changed to array
  className?: string;
}

export const XPost = ({ caption, images = [], className }: PostProps) => (
  <div
    className={cn(
      "bg-card border-2 p-4 text-card-foreground w-full max-w-md mx-auto shadow-2xl relative z-10",
      className,
    )}
  >
    <div className="flex gap-2">
      <div className="shrink-0">
        <div className="w-10 h-10 bg-muted rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative">
          <Image
            src="/pfp2.jpg"
            alt="avatar"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1 text-[15px] leading-5 overflow-hidden">
            <span className="font-bold text-foreground truncate hover:underline cursor-pointer">
              Alex Creator
            </span>
            <SealCheckIcon
              size={16}
              weight="fill"
              className="text-blue-500 shrink-0"
            />
            <span className="text-muted-foreground truncate">@alexcreates</span>
            <span className="text-muted-foreground shrink-0">·</span>
            <span className="text-muted-foreground shrink-0 hover:underline cursor-pointer">
              Now
            </span>
          </div>
          <div className="flex gap-1 p-1 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors cursor-pointer -mr-2 -mt-1">
            <Image
              src="/grok.svg"
              width={16}
              height={16}
              alt="grok"
              className="dark:invert"
            />
            <DotsThreeIcon size={18} weight="bold" className="text-muted-foreground" />
          </div>
        </div>

        <div className="mt-0.5 mb-3 text-[15px] leading-normal font-normal font-manrope text-foreground whitespace-pre-wrap">
          {caption ||
            "Just used Fluidframe to schedule my whole week of content. The brutalist templates are literally a cheat code."}
        </div>

        {/* Post Media */}
        <div className="rounded-2xl overflow-hidden border border-border/50 mb-3 bg-muted/20 relative flex items-center justify-center group cursor-pointer">
          <PostImages images={images} />
        </div>

        <div className="flex justify-between text-muted-foreground gap-1 w-full max-w-[calc(100%-1rem)]">
          <div className="flex items-center group cursor-pointer transition-colors hover:text-blue-500">
            <div className="p-1.5 -ml-1.5 rounded-full group-hover:bg-blue-500/10 transition-colors">
              <ChatCircleIcon size={18} />
            </div>
            <span className="text-xs">12</span>
          </div>
          <div className="flex items-center group cursor-pointer transition-colors hover:text-green-500">
            <div className="p-1.5 -ml-1.5 rounded-full group-hover:bg-green-500/10 transition-colors">
              <RepeatIcon size={18} />
            </div>
            <span className="text-xs">5</span>
          </div>
          <div className="flex items-center group cursor-pointer transition-colors hover:text-pink-500">
            <div className="p-1.5 -ml-1.5 rounded-full group-hover:bg-pink-500/10 transition-colors">
              <HeartIcon size={18} />
            </div>
            <span className="text-xs">84</span>
          </div>
          <div className="flex items-center group cursor-pointer transition-colors hover:text-blue-500">
            <div className="p-1.5 -ml-1.5 rounded-full group-hover:bg-blue-500/10 transition-colors">
              <ChartBarIcon size={18} />
            </div>
            <span className="text-xs">712</span>
          </div>
          <div className="flex items-center pl-3 gap-2">
            <div className="p-1.5 -ml-1.5 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors cursor-pointer">
              <BookmarkSimpleIcon size={18} />
            </div>
            <div className="p-1.5 -ml-1.5 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors cursor-pointer">
              <ShareNetworkIcon size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const LinkedInPost = ({
  caption,
  images = [],
  className,
}: PostProps) => (
  <div
    className={cn(
      "bg-card border-2 p-6 text-card-foreground w-full max-w-md mx-auto shadow-2xl relative z-10",
      className,
    )}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-muted rounded-full overflow-hidden relative">
          <Image
            src="/pfp1.jpg"
            alt="avatar"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="font-bold text-[16px] font-display leading-tight font-manrope">
            Sarah Design
          </div>
          <div className="text-neutral-500 text-xs font-inter">
            Product Designer
          </div>
          <div className="text-neutral-500 text-xs font-sm flex font-inter items-center gap-1">
            Just now · <GlobeIcon className="size-3.5" weight="duotone" />
          </div>
        </div>
      </div>
      <DotsThreeIcon size={22} weight="bold" className="text-muted-foreground" />
    </div>
    <div className="mb-6 text-[14px] leading-relaxed font-light font-inter whitespace-pre-wrap">
      {caption ||
        "Consistency is the hardest part of building a personal brand.\n\nFinally found a workflow that works with Fluidframe."}

      <div className="w-full bg-muted/30 flex items-center justify-center border-2 mt-4 border-border relative overflow-hidden group">
        <PostImages images={images} />
      </div>
    </div>
    <div className="border-t border-border pt-3 flex justify-between text-muted-foreground">
      <div className="flex flex-col items-center gap-1 hover:bg-muted p-2 cursor-pointer flex-1 transition-colors rounded">
        <ThumbsUpIcon size={16} />
        <span className="text-[10px] uppercase tracking-wider hidden sm:inline font-manrope">
          Like
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 hover:bg-muted p-2 cursor-pointer flex-1 transition-colors rounded">
        <ChatCircleIcon size={16} />
        <span className="text-[10px] uppercase tracking-wider hidden sm:inline font-manrope">
          Comment
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 hover:bg-muted p-2 cursor-pointer flex-1 transition-colors rounded">
        <RepeatIcon size={16} />
        <span className="text-[10px] uppercase tracking-wider hidden sm:inline font-manrope">
          Repost
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 hover:bg-muted p-2 cursor-pointer flex-1 transition-colors rounded">
        <PaperPlaneTiltIcon size={16} className="mb-1" />
        <span className="text-[10px] uppercase tracking-wider hidden sm:inline font-manrope">
          Send
        </span>
      </div>
    </div>
  </div>
);

export const InstagramPost = ({
  caption,
  images = [],
  className,
}: PostProps) => (
  <div
    className={cn(
      "bg-card border-2 text-card-foreground w-full max-w-md mx-auto shadow-2xl pb-2 relative z-10",
      className,
    )}
  >
    <div className="flex justify-between items-center p-3 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-muted rounded-full overflow-hidden relative">
          <Image
            src="/pfp3.jpg"
            alt="avatar"
            fill
            className="object-contain"
          />
        </div>{" "}
        <span className="text-xs font-bold font-display font-manrope">
          visual_architect
        </span>
      </div>
      <DotsThreeIcon size={20} weight="bold" className="text-muted-foreground" />
    </div>

    <div className="w-full bg-muted/30 flex items-center justify-center border-b border-border relative overflow-hidden group">
      <PostImages images={images} />
    </div>

    <div className="px-4 py-2">
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-3 text-foreground">
          <HeartIcon
            size={20}
            className="cursor-pointer hover:text-muted-foreground transition-colors"
          />
          <ChatCircleIcon
            size={20}
            className="cursor-pointer hover:text-muted-foreground transition-colors"
          />
          <PaperPlaneTiltIcon
            size={20}
            className="cursor-pointer hover:text-muted-foreground transition-colors"
          />
        </div>
        <BookmarkSimpleIcon
          size={20}
          className="cursor-pointer hover:text-muted-foreground transition-colors"
        />
      </div>

      <div className="text-xs font-bold mb-1 font-manrope">3,492 likes</div>
      <div className="text-xs leading-snug text-muted-foreground line-clamp-2 ">
        <span className="font-bold mr-2 text-foreground font-manrope">
          visual_architect
        </span>
        <span className="font-inter whitespace-pre-wrap">
          {caption ||
            "Minimalist designs that convert. Built entirely in Fluidframe. Link in bio."}
        </span>
      </div>
    </div>
  </div>
);