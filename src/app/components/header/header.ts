import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PreferencesService } from '../../services/preferences-service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'cam-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {

  preferenceService = inject(PreferencesService);
}
