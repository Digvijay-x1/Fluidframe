import { NextResponse } from "next/server";
import ImageKit from "imagekit";

export async function GET() {
  try {
    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    });

    const files = await imagekit.listFiles({
      limit: 100,
      fileType: "image",
      path: "/wallpapers",
    });

    console.log(`Found ${files.length} images`);

    const wallpapers = files.map((file: any) => {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return {
        fileId: file.fileId,
        name: cleanName,
        url: file.url,
        thumbnailUrl: `${file.url}?tr=w-400,h-300,q-80`,
      };
    });

    return NextResponse.json(wallpapers);
  } catch (error: any) {
    console.error("Error fetching wallpapers:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch wallpapers" },
      { status: 500 },
    );
  }
}
