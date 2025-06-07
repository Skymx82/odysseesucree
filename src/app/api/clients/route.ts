import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { Client, Enfant } from '@/types/database';

// GET /api/clients - Récupérer tous les clients
export async function GET() {
  try {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .order('nom', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des clients' },
        { status: 500 }
      );
    }

    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}

// POST /api/clients - Créer un nouveau client
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data: client, error } = await supabase
      .from('clients')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du client:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création du client' },
        { status: 500 }
      );
    }

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}
