import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// GET /api/commandes/[id] - Récupérer une commande spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commandeId = params.id;

    const { data, error } = await supabase
      .from('commandes')
      .select('*')
      .eq('id', commandeId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de la commande' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de la commande' },
      { status: 500 }
    );
  }
}

// PUT /api/commandes/[id] - Mettre à jour une commande
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commandeId = params.id;
    const commandeData = await request.json();

    // Validation des données
    if (!commandeData) {
      return NextResponse.json(
        { error: 'Données de commande manquantes' },
        { status: 400 }
      );
    }

    // Mise à jour dans la base de données
    const { data, error } = await supabase
      .from('commandes')
      .update(commandeData)
      .eq('id', commandeId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la commande' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour de la commande' },
      { status: 500 }
    );
  }
}

// DELETE /api/commandes/[id] - Supprimer une commande
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commandeId = params.id;

    const { error } = await supabase
      .from('commandes')
      .delete()
      .eq('id', commandeId);

    if (error) {
      console.error('Erreur lors de la suppression de la commande:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de la commande' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Commande supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression de la commande' },
      { status: 500 }
    );
  }
}
