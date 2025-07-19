import supabase from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  if (!supabase) {
    // Gebe leeres Array zurück wenn Supabase nicht konfiguriert
    // Frontend sollte dann localStorage direkt verwenden
    return NextResponse.json([]);
  }

  const { data, error } = await supabase.from("cars").select("*");
  if (error) {
    console.error("Supabase Fehler:", error.message);
    return NextResponse.json([]);
  }
  return NextResponse.json(data || []);
}

export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase nicht konfiguriert" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { data, error } = await supabase.from("cars").insert([body]).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "Kein Datensatz erstellt." },
      { status: 500 }
    );
  }

  return NextResponse.json(data[0]);
}
