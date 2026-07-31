// src/app/api/menu/categorie/route.js

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const db = await createClient();

    const { data, error } = await db
      .from("menu_categoria")
      .select(`
        *,
        supercategoria:menu_supercategoria(alias)
      `)
      .order("alias", { ascending: true });

    if (error) {
      console.error("Errore recupero categorie menu:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error("Errore API categorie menu:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Errore interno durante il recupero delle categorie",
      },
      { status: 500 }
    );
  }
}