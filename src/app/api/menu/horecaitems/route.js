// app/api/menu/route.js

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {

  try {

    const { selectHoreca } = await request.json();

    if (!selectHoreca) {
      return NextResponse.json(
        {
          success: false,
          message: "ID Horeca mancante",
        },
        { status: 400 }
      );
    }

    const db = await createClient();

    const { data, error } = await db
      .from("menu")
      .select(`
        *,
        categoria:menu_categoria(
          id_supercategoria,
          alias,
          supercategoria:menu_supercategoria(alias)
        )
      `)
      .eq("id_horeca", selectHoreca)
      .order("id_categoria", { ascending: true });

    if (error) {
      console.error("Errore recupero menu:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Errore durante il recupero del menu",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error("Errore API menu:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Errore interno del server",
      },
      { status: 500 }
    );
  }
}