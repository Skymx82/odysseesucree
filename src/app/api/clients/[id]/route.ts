import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// GET /api/clients/[id] - Récupérer un client spécifique avec ses enfants
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Récupérer les informations du client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (clientError) {
      console.error('Erreur lors de la récupération du client:', clientError);
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les enfants du client
    const { data: enfants, error: enfantsError } = await supabase
      .from('enfants')
      .select('*')
      .eq('id_client', id);

    if (enfantsError) {
      console.error('Erreur lors de la récupération des enfants:', enfantsError);
      // On continue même s'il y a une erreur avec les enfants
    }

    // Récupérer les commandes du client
    const { data: commandes, error: commandesError } = await supabase
      .from('commandes')
      .select('*')
      .eq('id_client', id)
      .order('date_commande', { ascending: false });

    if (commandesError) {
      console.error('Erreur lors de la récupération des commandes:', commandesError);
      // On continue même s'il y a une erreur avec les commandes
    }

    // Récupérer les événements liés au client
    const { data: evenements, error: evenementsError } = await supabase
      .from('evenements')
      .select('*')
      .eq('id_client', id)
      .order('date', { ascending: true });

    if (evenementsError) {
      console.error('Erreur lors de la récupération des événements:', evenementsError);
      // On continue même s'il y a une erreur avec les événements
    }

    return NextResponse.json({
      client,
      enfants: enfants || [],
      commandes: commandes || [],
      evenements: evenements || []
    });
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}

// PUT /api/clients/[id] - Mettre à jour un client
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const { data, error } = await supabase
      .from('clients')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du client' },
        { status: 500 }
      );
    }

    return NextResponse.json({ client: data });
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/[id] - Supprimer un client
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du client:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du client' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Client supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}
