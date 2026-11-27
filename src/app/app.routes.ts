import { Routes } from '@angular/router';
import { TextInterpolation } from './components/text-interpolation/text-interpolation';
import { Bindings } from './components/bindings/bindings';
import { ExosBindings } from './components/exos-bindings/exos-bindings';
import { Signals } from './components/signals/signals';
import { BureauVoteList } from './components/bureau-vote-list/bureau-vote-list';
import { ExosSignals } from './components/exos-signals/exos-signals';
import { ProduitList } from './components/produit-list/produit-list';
import { ControlFlow } from './components/control-flow/control-flow';
import { Pipes } from './components/pipes/pipes';

export const routes: Routes = [
    { path: '', redirectTo: 'textinterpolation', pathMatch: 'full' },
    { path: 'textinterpolation', component: TextInterpolation},
    { path: 'bindings', component: Bindings},
    { path: 'control-flow', component: ControlFlow},
    { path: 'exos-bindings', component: ExosBindings},
    { path: 'signals', component: Signals},
    { path: 'exos-signals', component: ExosSignals},
    { path: 'produit-list', component: ProduitList},
    { path: 'bureau-vote-list', component: BureauVoteList},
    { path: 'pipes', component: Pipes},
    { path: '**', component: Signals},
];
