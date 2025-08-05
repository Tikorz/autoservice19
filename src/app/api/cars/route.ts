// app/api/cars/route.ts  – NEU
import { createClient } from "../../../lib/supabaseServer.server";
import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { CarSchema } from "@/lib/schemas";

/* -------------------------------------------------- */
/* GET  /api/cars                                     */
/* -------------------------------------------------- */
export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from("cars").select("*").order("id");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/* -------------------------------------------------- */
/* POST /api/cars                                     */
/* -------------------------------------------------- */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CarSchema.parse(body);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cars")
    .insert(body)
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}

/* -------------------------------------------------- */
/* PUT  /api/cars                                     */
/* -------------------------------------------------- */
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...update } = body;
  if (!id) return NextResponse.json({ error: "id missing" }, { status: 400 });

  const supabase = createClient();
  const { data, error } = await supabase
    .from("cars")
    .update(update)
    .eq("id", id)
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { error } = await supabase.from("cars").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
