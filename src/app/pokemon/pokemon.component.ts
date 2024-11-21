import {
  ChangeDetectionStrategy,
  Component,
  effect,
  resource,
  signal,
} from '@angular/core';
import { PokemonItemComponent } from './pokemon-item.component';
import { PokemonListResult } from './pokemon.model';

@Component({
  selector: 'app-pokemon',
  imports: [PokemonItemComponent],
  template: `
    <div class="m-8">
      <h1 class="text-2xl font-bold mb-8">Pokemon List</h1>
      <div class="flex flex-row flex-wrap gap-8">
        @for (pokemon of pokemonList(); track pokemon.name; let i = $index) {
          @defer (on viewport) {
            <app-pokemon-item
              [pokemon]="pokemon"
              (loaded)="onPokemonLoaded(i)" />
          } @placeholder {
            <div class="h-[366px]">Loading...</div>
          }
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonComponent {
  offset = signal(0);
  pokemonList = signal<PokemonListResult[]>([]);

  #pokemonListResource = resource({
    request: this.offset,
    loader: ({ request: offset }) =>
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=100&offset=${offset}`)
        .then(res => res.json())
        .then(data =>
          data.results.map((pokemon: PokemonListResult) => ({
            name: pokemon.name,
            url: pokemon.url,
          }))
        ),
  });

  constructor() {
    effect(() => {
      const newPokemon = this.#pokemonListResource.value();
      if (newPokemon) {
        this.pokemonList.update(current => [...current, ...newPokemon]);
      }
    });
  }

  onPokemonLoaded(index: number) {
    if (index === this.offset() + 48) {
      // 50 - 2 from current offset
      this.offset.update(current => current + 50);
    }
  }
}
