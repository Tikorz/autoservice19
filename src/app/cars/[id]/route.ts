// app/api/cars/[id]/route.ts
import { createClient } from "../../../lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  const { error } = await supabase.from("cars").delete().eq("id", params.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
