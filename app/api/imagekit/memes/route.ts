import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    });

    const files = await imagekit.listFiles({
      skip,
      limit,
      fileType: "image",
      path: "/memes",
    });

    console.log(`Fetched ${files.length} memes for page ${page}`);

    const memes = files.map((file: any) => {
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
        thumbnailUrl: `${file.url}?tr=w-400,h-300,q-75,f-webp`,
      };
    });

    return NextResponse.json({
      memes,
      page,
      limit,
      total: files.length,
      hasMore: files.length === limit,
    });
  } catch (error: any) {
    console.error("Error fetching memes:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch memes" },
      { status: 500 }
    );
  }
}
