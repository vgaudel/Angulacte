import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  imports: [CommonModule],
  selector: 'cam-pipes',
  styleUrl: './pipes.scss',
  templateUrl: './pipes.html',
})
export class Pipes {
  
  // Pipes sur les chaînes de caractères
  nom = "John Legend BAGUETTE";

  // pipes sur les nombres
  prix = 1234.567;
  pourcentage = 0.8542;

  // pipes sur les dates
  maintenant = new Date();

  hier = new Date("2026-11-26T11:07:00") ;

  // Pipes sur les objets / JSON
  utilisateur = {
    prenom : 'Marie',
    nom : 'Curie',
    age : 66,
    prix_nobel : ['Physique','Chimie', 'Maths', 'Biologie']
  }
}
