import { Component, inject } from '@angular/core';
import { PreferencesService } from '../../services/preferences-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule,FormsModule],
  selector: 'cam-footer',
  styleUrl: './footer.scss',
  templateUrl: './footer.html',
})
export class Footer {

  // On veut faire une injection de dépendance avec le PréférencesService
  preferenceService = inject(PreferencesService);

}
