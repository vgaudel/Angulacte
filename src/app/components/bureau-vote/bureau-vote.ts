import { Component, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'cam-bureau-vote',
  styleUrl: './bureau-vote.scss',
  templateUrl: './bureau-vote.html',
})
export class BureauVote {

  // -------------------------------------------------------
  // output() — Émet un événement VERS le parent
  // -------------------------------------------------------

  // output<string>() crée un OutputEmitterRef qui émet des valeurs de type string.
  // Le parent écoute cet événement avec (aVote)="maMethode($event)"

  aVote = output<string>();

  voter(choix: string){
    this.aVote.emit(choix); // le choix entre parenthèse corresponds à l'évènement émis.
                            // on le récupèrera à l'aide de $event dans l composant parent
  }
}
