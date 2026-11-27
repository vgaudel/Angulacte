import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'cam-text-interpolation',
  styleUrl: './text-interpolation.scss',
  templateUrl: './text-interpolation.html',
})
export class TextInterpolation {

  message: string = "Bonjour les alsaciens, bienvenus sur Angulacte, votre application de formation !"
  user = {name: "Baguette", firstname:"John", age: 40};

} 
 