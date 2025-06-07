import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// GET /api/commandes - Récupérer toutes les commandes
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('commandes')
      .select('*')
      .order('date_commande', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des commandes' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}

// POST /api/commandes - Créer une nouvelle commande
export async function POST(request: NextRequest) {
  try {
    const commandeData = await request.json();

    // Validation des données
    if (!commandeData.id_client || !commandeData.date_commande || !commandeData.montant_total) {
      return NextResponse.json(
        { error: 'Données de commande incomplètes' },
        { status: 400 }
      );
    }

    // Insertion dans la base de données
    const { data, error } = await supabase
      .from('commandes')
      .insert(commandeData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de la commande:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la commande' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la commande' },
      { status: 500 }
    );
  }
}
