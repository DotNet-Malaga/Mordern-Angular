import { computed, Injectable, resource } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon, PokemonListResult } from './pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  #pokemonListResource = resource({
    loader: () =>
      fetch('https://pokeapi.co/api/v2/pokemon?limit=1&offset=0')
        .then(res => res.json())
        .then(data =>
          data.results.map((pokemon: PokemonListResult) => ({
            name: pokemon.name,
            url: pokemon.url,
          }))
        ),
  });

  #pokemonResource = resource({
    loader: () =>
      fetch(this.pokemonList().at(0)?.url ?? '').then(res => res.json()),
  });

  pokemonList = computed(() => this.#pokemonListResource.value());

  getPokemonList(): Observable<Pokemon[]> {
    return this.#pokemonListResource.value();
  }
}
