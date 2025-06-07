import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// GET /api/commandes/[id]/produits/[produitId] - Récupérer un produit spécifique d'une commande
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; produitId: string } }
) {
  try {
    const { id: commandeId, produitId } = params;

    const { data, error } = await supabase
      .from('produits_commande')
      .select('*')
      .eq('id', produitId)
      .eq('id_commande', commandeId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du produit' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du produit' },
      { status: 500 }
    );
  }
}

// PUT /api/commandes/[id]/produits/[produitId] - Mettre à jour un produit
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; produitId: string } }
) {
  try {
    const { id: commandeId, produitId } = params;
    const produitData = await request.json();

    // Validation des données
    if (!produitData) {
      return NextResponse.json(
        { error: 'Données de produit manquantes' },
        { status: 400 }
      );
    }

    // Mise à jour dans la base de données
    const { data, error } = await supabase
      .from('produits_commande')
      .update(produitData)
      .eq('id', produitId)
      .eq('id_commande', commandeId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du produit' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le montant total de la commande
    await updateCommandeTotal(commandeId);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour du produit' },
      { status: 500 }
    );
  }
}

// DELETE /api/commandes/[id]/produits/[produitId] - Supprimer un produit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; produitId: string } }
) {
  try {
    const { id: commandeId, produitId } = params;

    const { error } = await supabase
      .from('produits_commande')
      .delete()
      .eq('id', produitId)
      .eq('id_commande', commandeId);

    if (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du produit' },
        { status: 500 }
      );
    }

    // Mettre à jour le montant total de la commande
    await updateCommandeTotal(commandeId);

    return NextResponse.json(
      { message: 'Produit supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression du produit' },
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
