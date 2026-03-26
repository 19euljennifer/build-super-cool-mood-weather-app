import { NextResponse } from "next/server";
import { MOODS } from "@/backend/moods";

export async function GET() {
  const moods = MOODS.map(({ id, label, emoji, description }) => ({
    id,
    label,
    emoji,
    description,
  }));

  return NextResponse.json(moods);
}
