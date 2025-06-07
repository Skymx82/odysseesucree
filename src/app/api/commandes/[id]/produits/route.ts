import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// GET /api/commandes/[id]/produits - Récupérer tous les produits d'une commande
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commandeId = params.id;

    const { data, error } = await supabase
      .from('produits_commande')
      .select('*')
      .eq('id_commande', commandeId);

    if (error) {
      console.error('Erreur lors de la récupération des produits de la commande:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des produits de la commande' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des produits de la commande' },
      { status: 500 }
    );
  }
}

// POST /api/commandes/[id]/produits - Ajouter un produit à une commande
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commandeId = params.id;
    const produitData = await request.json();

    // Vérifier que l'ID de la commande dans les données correspond à celui de l'URL
    if (produitData.id_commande !== commandeId) {
      produitData.id_commande = commandeId;
    }

    // Validation des données
    if (!produitData.nom_produit || !produitData.quantite || !produitData.prix_unitaire) {
      return NextResponse.json(
        { error: 'Données de produit incomplètes' },
        { status: 400 }
      );
    }

    // Insertion dans la base de données
    const { data, error } = await supabase
      .from('produits_commande')
      .insert(produitData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de l\'ajout du produit à la commande:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'ajout du produit à la commande' },
        { status: 500 }
      );
    }

    // Mettre à jour le montant total de la commande
    await updateCommandeTotal(commandeId);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'ajout du produit à la commande' },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour mettre à jour le montant total d'une commande
async function updateCommandeTotal(commandeId: string) {
  try {
    // Récupérer tous les produits de la commande
    const { data: produits, error: produitsError } = await supabase
      .from('produits_commande')
      .select('quantite, prix_unitaire')
      .eq('id_commande', commandeId);

    if (produitsError) {
      console.error('Erreur lors de la récupération des produits pour le calcul du total:', produitsError);
      return;
    }

    // Calculer le montant total
    const montantTotal = produits.reduce(
      (total, produit) => total + (produit.quantite * produit.prix_unitaire),
      0
    );

    // Mettre à jour la commande
    const { error: updateError } = await supabase
      .from('commandes')
      .update({ montant_total: montantTotal })
      .eq('id', commandeId);

    if (updateError) {
      console.error('Erreur lors de la mise à jour du montant total de la commande:', updateError);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du montant total:', error);
  }
}
