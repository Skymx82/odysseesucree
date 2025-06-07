import { NextRequest, NextResponse } from 'next/server';
import { NouvelEnfant } from '@/types/database';
import { supabase } from '@/utils/supabase';
// POST /api/clients/[id]/enfants - Ajouter un enfant à un client
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id;
    const enfantData: NouvelEnfant = await request.json();

    // Vérifier que l'ID du client dans les données correspond à celui de l'URL
    if (enfantData.id_client !== clientId) {
      enfantData.id_client = clientId;
    }
    // Insérer l'enfant dans la base de données
    const { data, error } = await supabase
      .from('enfants')
      .insert(enfantData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de l\'ajout de l\'enfant:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'ajout de l\'enfant' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'ajout de l\'enfant' },
      { status: 500 }
    );
  }
}

// GET /api/clients/[id]/enfants - Récupérer tous les enfants d'un client
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id;

    const { data, error } = await supabase
      .from('enfants')
      .select('*')
      .eq('id_client', clientId)
      .order('prenom');

    if (error) {
      console.error('Erreur lors de la récupération des enfants:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des enfants' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des enfants' },
      { status: 500 }
    );
  }
}
