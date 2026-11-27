import { Component, computed, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'cam-ex01-compteur',
  styleUrl: './ex01-compteur.scss',
  templateUrl: './ex01-compteur.html',
})
export class Ex01Compteur {

  compteur = signal(0);

  isDisabled = computed(() => {return this.compteur()<=0;});

  increment(){
    this.compteur.update((v) => v+1);
  }

  decrement(){
    this.compteur.update((v) => ((v-1)>=0)?v-1:0);
  }

}
