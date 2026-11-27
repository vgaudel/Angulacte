# Le Routing en Angular

> **Prérequis** : Angular 22, composants standalone, `inject()`, notions de `signal()` et `input()`.
> **Objectif** : Comprendre comment Angular associe une **URL** à un **composant**, savoir déclarer des routes (simples, paramétrées, enfants, *lazy*), naviguer depuis un template ou depuis le code, et lire les paramètres de l'URL.
> **Pour aller plus loin** : la protection des routes est traitée dans [07_Guards.md](07_Guards.md).

---

## 1. Pourquoi un routeur ?

Une application Angular est une **SPA** (*Single Page Application*) : le navigateur ne charge **qu'une seule page HTML** (`index.html`). Pourtant, l'utilisateur voit plusieurs « pages » (`/welcome`, `/login`, `/produitshttp`…), et les boutons *Précédent* / *Suivant* du navigateur fonctionnent.

C'est le travail du **routeur** :

1. il **observe l'URL** de la barre d'adresse ;
2. il cherche la **route** qui correspond dans une table de routage ;
3. il **affiche le composant** associé à un emplacement prévu dans la page ;
4. quand on clique sur un lien interne, il **change l'URL sans recharger** la page.

```
URL : http://localhost:4200/produitshttp
                            └────┬─────┘
                     table de routage : 'produitshttp' → ProduitTableHttp
                                 │
                     <router-outlet/> ← ProduitTableHttp s'affiche ici
```

> **Règle directrice** : l'URL est la **source de vérité** de « où suis-je dans l'application ». Tout ce qui doit survivre à un rafraîchissement ou être partageable par lien (page, id, filtre…) a sa place dans l'URL.

---

## 2. Mise en place : les 3 pièces du puzzle

### a) La table de routage : `app.routes.ts`

Un tableau d'objets `Route`. Chaque route associe un **chemin** (`path`, sans `/` initial) à un **composant**.

```typescript
// app.routes.ts (extrait du projet)
import { Routes } from '@angular/router';
import { Welcome } from './components/layout/welcome/welcome';
import { Bindings } from './components/bindings/bindings';
import { Login } from './components/login/login';
import { NotFound } from './components/layout/not-found/not-found';

export const routes: Routes = [
  { path: 'welcome', component: Welcome },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'bindings', component: Bindings },
  { path: 'login', component: Login },
  { path: '**', component: NotFound },
];
```

### b) L'enregistrement : `app.config.ts`

On **fournit** le routeur à l'application avec `provideRouter()` (pas de `RouterModule` en standalone).

```typescript
// app.config.ts
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ...
  ],
};
```

### c) L'emplacement d'affichage : `<router-outlet/>`

Dans le template du composant racine, `<router-outlet/>` marque **où** le composant de la route active est inséré. Tout ce qui est autour (header, footer) reste affiché en permanence.

```html
<!-- app.html -->
<app-header-v2 [titleHeader]="title()"/>

<router-outlet/>   <!-- Welcome, Login, ProduitTableHttp... s'affichent ICI -->

<app-footer/>
```

> **Piège classique** : oublier d'importer `RouterOutlet` dans le tableau `imports` du composant. Angular signale alors que `router-outlet` n'est pas un élément connu.

---

## 3. Les routes particulières

| Route | Rôle |
|-------|------|
| `{ path: '', redirectTo: 'welcome', pathMatch: 'full' }` | **Redirection** de la racine `/` vers `/welcome` |
| `{ path: '**', component: NotFound }` | **Wildcard** : toute URL inconnue → page 404 |

### `pathMatch: 'full'` : pourquoi est-ce obligatoire ici ?

Par défaut (`pathMatch: 'prefix'`), une route correspond si l'URL **commence par** son chemin. Or **toutes** les URL commencent par la chaîne vide `''` ! Sans `'full'`, `/bindings` serait aussi redirigé vers `/welcome`. `'full'` impose que l'URL restante soit **exactement** `''`.

### L'ordre des routes compte

Le routeur parcourt le tableau **de haut en bas** et prend la **première** route qui correspond (*first match wins*).

> **⚠️ La route `'**'` doit TOUJOURS être la dernière.** Placée au milieu, elle « avalerait » toutes les routes déclarées après elle, qui deviendraient inaccessibles.

C'est exactement le même principe que côté backend Express, où la route `/:id` doit être déclarée après `/organisateurs` (voir `evenementsRouter.ts`).

---

## 4. Naviguer depuis un template : `routerLink`

On n'utilise **jamais** `href` pour un lien interne : il **rechargerait toute l'application** (perte de l'état, des signals…). On utilise la directive `routerLink`.

```html
<!-- Chemin fixe -->
<a routerLink="/login">Connexion</a>

<!-- Chemin construit dynamiquement : tableau de segments -->
<a [routerLink]="['/evenements', evenement.id]">Détail</a>   <!-- /evenements/42 -->

<!-- Avec des query params : /login?retour=/produitshttp -->
<a routerLink="/login" [queryParams]="{ retour: '/produitshttp' }">Connexion</a>
```

### Mettre en évidence le lien actif : `routerLinkActive`

`routerLinkActive` ajoute une classe CSS au lien quand sa route est active. C'est ce que fait le menu du projet (`header-v2.html`) :

```html
<nav class="links">
  @for (link of navLinks; track link.path) {
    <a matButton [routerLink]="link.path" routerLinkActive="active">{{ link.label }}</a>
  }
</nav>
```

```typescript
// header-v2.ts : le menu est construit à partir d'un tableau de données
navLinks: NavLink[] = [
  { path: '/produitshttp', label: 'ProduitsHttp' },
  { path: '/evenementshttp', label: 'EvènementsHttp' },
  // ...
];
```

> **Astuce** : sur un lien vers `/` (accueil), ajoutez `[routerLinkActiveOptions]="{ exact: true }"`, sinon il serait considéré actif sur **toutes** les pages.

> **Imports** : `RouterLink` et `RouterLinkActive` doivent figurer dans les `imports` du composant.

---

## 5. Naviguer depuis le code : le service `Router`

Après une action (connexion réussie, enregistrement d'un formulaire…), on navigue **par programmation** avec le service `Router`.

| Méthode | Paramètre | Exemple |
|---------|-----------|---------|
| `navigate()` | tableau de segments | `router.navigate(['exossignals', 'ex03-surface'])` |
| `navigateByUrl()` | URL complète (chaîne) | `router.navigateByUrl('/welcome')` |

Exemple du projet : le `<select>` des exercices de signals change de route à chaque sélection.

```typescript
// exos-signals.ts
export class ExosSignals {
  private router = inject(Router);
  selectedComponent = 'ex01-compteur';

  goToExercice() {
    this.router.navigate(['exossignals', this.selectedComponent]); // → /exossignals/ex01-compteur
  }
}
```

Et la déconnexion, dans `header-v2.ts` :

```typescript
logout() {
  this.auth.logout();
  this.router.navigate(['welcome']);
}
```

> **Navigation relative** : par défaut, `navigate()` part de la **racine**. Pour naviguer par rapport à la route courante, on précise `relativeTo` :
> ```typescript
> private route = inject(ActivatedRoute);
> this.router.navigate(['ex03-surface'], { relativeTo: this.route });
> ```

---

## 6. Les paramètres de route : `/evenements/:id`

Pour afficher le détail d'**un** élément, on ne crée pas une route par id : on déclare un **paramètre** avec `:`.

```typescript
{ path: 'evenements/:id', component: EvenementDetail }
// correspond à /evenements/1, /evenements/42, /evenements/abc...
```

### Méthode moderne : recevoir le paramètre dans un `input()`

Avec l'option `withComponentInputBinding()`, le routeur **injecte automatiquement** les paramètres de l'URL dans les `input()` du composant **de même nom**.

```typescript
// app.config.ts
provideRouter(routes, withComponentInputBinding()),
```

```typescript
// evenement-detail.ts
export class EvenementDetail {
  private evenementService = inject(EvenementService);

  // Rempli automatiquement avec la valeur de :id
  id = input.required<string>();

  // Recharge l'évènement à chaque changement d'id (voir 06_Cycle_De_Vie.md)
  evenement = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => this.evenementService.getEvenementById$(id),
  });
}
```
 
> **Avantage** : le composant ne dépend plus du routeur. C'est un composant « normal » avec un `input()`, facile à tester et réutilisable.

### Méthode classique : `ActivatedRoute`

On injecte `ActivatedRoute`, qui décrit la route **actuellement affichée**.

```typescript
private route = inject(ActivatedRoute);

// Instantané : valeur au moment de l'appel
const id = this.route.snapshot.paramMap.get('id');

// Observable : suit les changements sans recréer le composant
this.route.paramMap.subscribe((params) => console.log(params.get('id')));
```

> **⚠️ Piège du `snapshot`** : si l'on navigue de `/evenements/1` vers `/evenements/2`, Angular **réutilise** le même composant (même route, autre paramètre). Le `ngOnInit` ne se relance pas et le `snapshot` lu au départ reste `1`. Il faut alors utiliser l'Observable `paramMap`, ou mieux, la méthode `input()` ci-dessus.

> **Les paramètres sont toujours des `string`.** Si vous attendez un nombre : `Number(params.get('id'))`.

---

## 7. Les query params : `/login?retour=/produitshttp`

Les **query params** (après le `?`) servent aux informations **optionnelles** : filtre, tri, page, URL de retour… Ils ne font pas partie du `path` et ne se déclarent pas dans la table de routage.

| | Paramètre de route `:id` | Query param `?cle=valeur` |
|---|---|---|
| Déclaration | dans `path` | aucune |
| Obligatoire ? | oui (sinon la route ne correspond pas) | non |
| Usage | **identifier** une ressource | **options** d'affichage |
| Exemple | `/evenements/42` | `/evenements?organisateur=meetup@exemple.fr` |

Exemple complet du projet : `authGuard` redirige vers le login **en mémorisant** la page demandée, et `Login` y revient après connexion.

```typescript
// auth-guard.ts : écrire le query param
return router.createUrlTree(['/login'], { queryParams: { retour: state.url } });
```

```typescript
// login.ts : lire le query param
const retour = this.route.snapshot.queryParamMap.get('retour');
// On n'accepte qu'un chemin INTERNE, pour éviter une redirection vers un site malveillant.
const safe = retour && retour.startsWith('/') && !retour.startsWith('//');
this.router.navigateByUrl(safe ? retour : '/welcome');
```

> Avec `withComponentInputBinding()`, les query params sont **eux aussi** injectés dans les `input()` de même nom : `retour = input<string>()`.

---

## 8. Les routes enfants : `children`

Une page peut contenir **sa propre zone de navigation**. Exemple du projet : `/exossignals` affiche un `<select>`, et **sous** ce select, l'exercice choisi.

```typescript
// app.routes.ts
{
  path: 'exossignals',
  component: ExosSignals,           // le composant PARENT
  children: [
    { path: 'ex01-compteur', component: Ex01Compteur },
    { path: 'ex02-signal-texte', component: Ex02SignalTexte },
    // ...
    { path: '', redirectTo: 'ex01-compteur', pathMatch: 'full' },
  ],
},
```

```html
<!-- exos-signals.html : le parent possède SON PROPRE <router-outlet/> -->
<select [(ngModel)]="selectedComponent" (change)="goToExercice()">...</select>

<router-outlet/>   <!-- l'exercice enfant s'affiche ICI -->
```

```
/exossignals/ex03-surface
 └────┬────┘ └────┬─────┘
   ExosSignals   Ex03Surface
 (outlet de app)  (outlet de ExosSignals)
```

- Les chemins enfants sont **relatifs** au parent : `ex03-surface` → `/exossignals/ex03-surface`.
- La route enfant `''` avec `redirectTo` définit l'**exercice par défaut** quand on arrive sur `/exossignals`.
- Un guard placé sur le parent protège **tous** les enfants (voir `canActivateChild` dans [07_Guards.md](07_Guards.md)).

---

## 9. Le chargement différé (*lazy loading*) : `loadComponent`

Par défaut, **tous** les composants référencés dans `app.routes.ts` sont inclus dans le fichier JavaScript principal, téléchargé au démarrage. Plus l'application grossit, plus le premier affichage est lent.

Avec `loadComponent`, le code d'un composant n'est téléchargé **qu'au moment où l'on visite sa route** :

```typescript
// Chargement immédiat (classique)
{ path: 'pipes', component: PipesExemples },

// Chargement différé : import() dynamique, pas d'import en haut du fichier
{
  path: 'pipes',
  loadComponent: () =>
    import('./components/pipes-exemples/pipes-exemples').then((m) => m.PipesExemples),
},
```

On peut aussi charger **un groupe de routes** d'un coup avec `loadChildren` :

```typescript
{
  path: 'exossignals',
  loadChildren: () => import('./components/exos-signals/exos-signals.routes').then((m) => m.routes),
},
```

> **Vérifiez l'effet** : après `ng build`, la console liste des fichiers *Lazy chunk files* : ce sont vos composants chargés à la demande.

> **Si le composant est exporté par défaut** (`export default class ...`), on peut simplifier : `loadComponent: () => import('./.../pipes-exemples')`.

---

## 10. Les autres options utiles d'une route

### a) Le titre de l'onglet : `title`

```typescript
{ path: 'evenementshttp', component: EvenementTableHttp, title: 'Évènements' },
```

Le routeur met à jour `document.title` à chaque navigation : utile pour l'utilisateur (onglets, historique) et pour l'accessibilité (les lecteurs d'écran annoncent le changement de page).

### b) Les guards : `canActivate`

```typescript
{ path: 'produitshttp', component: ProduitTableHttp, canActivate: [authGuard] },
```

Détaillé dans [07_Guards.md](07_Guards.md), mis en œuvre dans [13_Authentification_JWT.md](13_Authentification_JWT.md).

### c) Des données statiques : `data`

```typescript
{ path: 'admin', component: Admin, data: { roleRequis: 'admin' } },
// lu avec : inject(ActivatedRoute).snapshot.data['roleRequis']
```

---

## 11. Le routing en production

En développement, `ng serve` renvoie **toujours** `index.html`, quelle que soit l'URL. En production, ce n'est pas automatique : si l'utilisateur rafraîchit `/produitshttp`, le serveur web cherche un fichier `produitshttp`… qui n'existe pas → **erreur 404 du serveur**.

Solution : configurer le serveur pour renvoyer `index.html` pour toute URL inconnue (*fallback*), comme l'indique [10_mise_en_production.md](10_mise_en_production.md).

- **Nginx** : `try_files $uri $uri/ /index.html;`
- **GitHub Pages** (qui ne permet aucune configuration serveur) : on publie une copie de `index.html` nommée `404.html`. GitHub la sert pour toute URL inconnue, et Angular affiche alors la bonne route.

Pensez aussi au `--base-href` quand l'application n'est pas à la racine du domaine (voir [11_publication_githubpages.md](11_publication_githubpages.md)) : sans lui, le routeur construit des URL fausses.

---

## 12. Erreurs fréquentes

| Symptôme | Cause probable |
|---|---|
| `'router-outlet' is not a known element` | `RouterOutlet` absent des `imports` du composant |
| Le lien ne fait rien / `routerLink` affiché tel quel | `RouterLink` absent des `imports` |
| La page se recharge entièrement au clic | `href` utilisé à la place de `routerLink` |
| Toutes les pages affichent la 404 | la route `'**'` n'est pas en dernière position |
| Toutes les pages redirigent vers l'accueil | `pathMatch: 'full'` oublié sur la route `''` |
| Lien vers `/F/bindings` au lieu de `/bindings` | faute de frappe dans le chemin : aucune erreur de compilation, la 404 s'affiche |
| Le détail ne change pas en passant de `/x/1` à `/x/2` | lecture du `snapshot` dans `ngOnInit` (§ 6) |
| L'`input()` du paramètre reste `undefined` | `withComponentInputBinding()` absent, ou nom de l'`input()` ≠ nom du paramètre |
| 404 du serveur après un rafraîchissement en production | pas de *fallback* vers `index.html` (§ 11) |

---

## 13. Exercices

1. **Titre des pages** : ajoutez un `title` à 5 routes de `app.routes.ts` et vérifiez le nom de l'onglet.
2. **Page de détail** : créez un composant `EvenementDetail` sur la route `evenements/:id`. Il récupère l'id via un `input()` (`withComponentInputBinding()`) et affiche l'évènement avec `EvenementService.getEvenementById$()`. Dans `EvenementTableHttp`, rendez chaque titre cliquable avec `[routerLink]="['/evenements', evenement.id]"`.
3. **Bouton retour** : dans `EvenementDetail`, ajoutez un bouton « Retour à la liste » qui utilise `Router.navigate()`.
4. **Filtre dans l'URL** : sur la liste des évènements, ajoutez un filtre par organisateur stocké en query param (`/evenementshttp?organisateur=meetup@exemple.fr`). Rafraîchissez la page : le filtre doit être conservé.
5. **Lazy loading** : passez `PipesExemples` et `ProduitAddFormSignal` en `loadComponent`, lancez `ng build` et repérez les *Lazy chunk files*.
6. **Routes enfants** : regroupez `evenementshttp` et `evenementformhttp` sous un parent `evenements` (`/evenements/liste`, `/evenements/ajout`) avec son propre `<router-outlet/>` et deux liens `routerLinkActive`.

---

## 14. Récapitulatif

| Besoin | Outil |
|--------|-------|
| Associer une URL à un composant | `Routes` dans `app.routes.ts` + `provideRouter()` |
| Indiquer où afficher la page | `<router-outlet/>` |
| Lien dans un template | `routerLink` (+ `routerLinkActive`) |
| Navigation depuis le code | `Router.navigate()` / `navigateByUrl()` |
| Identifier une ressource dans l'URL | paramètre `:id` → `input()` ou `ActivatedRoute.paramMap` |
| Options d'affichage dans l'URL | query params → `queryParamMap` |
| Rediriger / page 404 | `redirectTo` + `pathMatch: 'full'` / `'**'` en dernier |
| Sous-navigation dans une page | `children` + `<router-outlet/>` dans le parent |
| Alléger le chargement initial | `loadComponent` / `loadChildren` |
| Titre de l'onglet | `title` |
| Contrôler l'accès | `canActivate`, `canMatch`… ([07_Guards.md](07_Guards.md)) |

Le routeur transforme une page unique en une **véritable application navigable** : chaque écran a son adresse, que l'on peut partager, mettre en favori et retrouver avec le bouton *Précédent*.
