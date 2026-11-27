import { Component } from '@angular/core';
import { Ex01Compteur } from './ex01-compteur/ex01-compteur';
import { Ex02SignalTexte } from './ex02-signal-texte/ex02-signal-texte';
import { Ex03Surface } from './ex03-surface/ex03-surface';


@Component({
  imports: [Ex01Compteur, Ex02SignalTexte, Ex03Surface],
  selector: 'cam-exos-signals',
  styleUrl: './exos-signals.scss',
  templateUrl: './exos-signals.html',
})
export class ExosSignals {}
