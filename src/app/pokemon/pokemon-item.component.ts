import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  resource,
  ResourceLoader,
} from '@angular/core';
import { ProgressBarComponent } from '../progressbar.component';
import { Skeleton } from '../skeleton.component';
import { PokemonListResult, PokemonResult } from './pokemon.model';

function wait(msec: number, signal: AbortSignal | undefined = undefined) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    const timeoutId = setTimeout(() => {
      resolve();
    }, msec);

    signal?.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

function debounce<T, U>(
  loader: ResourceLoader<T, U>,
  time = 300
): ResourceLoader<T, U> {
  return async param => {
    await wait(time, param.abortSignal);
    return await loader(param);
  };
}

@Component({
  selector: 'app-pokemon-item',
  imports: [ProgressBarComponent, Skeleton],
  template: `
    <div class="w-[200px] border rounded-lg shadow-sm p-4">
      @if (pokemonResource.value(); as pokemonData) {
        <img
          [src]="pokemonData.spriteUrl"
          [alt]="pokemonData.name"
          class="mx-auto w-32 h-32 mb-4" />
        <p class="text-lg font-bold capitalize mb-2 text-center">
          {{ pokemonData.name }}
        </p>
        <div class="space-y-4">
          <div class="space-y-1">
            <div class="flex justify-between">
              <span class="font-medium"
                >HP ({{ pokemonData.hp.base_stat }})</span
              >
              <span class="text-gray-600"
                >{{ pokemonData.hp.base_stat }}/100</span
              >
            </div>
            <app-progress-bar [progress]="pokemonData.hp.base_stat" />
          </div>
          <div class="space-y-1">
            <div class="flex justify-between">
              <span class="font-medium"
                >Attack ({{ pokemonData.attack.base_stat }})</span
              >
              <span class="text-gray-600"
                >{{ pokemonData.attack.base_stat }}/100</span
              >
            </div>
            <app-progress-bar [progress]="pokemonData.attack.base_stat" />
          </div>
          <div class="space-y-1">
            <div class="flex justify-between">
              <span class="font-medium"
                >Defense ({{ pokemonData.defense.base_stat }})</span
              >
              <span class="text-gray-600"
                >{{ pokemonData.defense.base_stat }}/100</span
              >
            </div>
            <app-progress-bar [progress]="pokemonData.defense.base_stat" />
          </div>
        </div>
      } @else if (pokemonResource.isLoading()) {
        <ui-skeleton class="h-32 w-32 mx-auto mb-4" />
        <ui-skeleton class="h-6 w-3/4 mx-auto mb-2" />
        <div class="space-y-4">
          <div class="space-y-1">
            <ui-skeleton class="h-6" />
            <ui-skeleton class="h-4" />
          </div>
          <div class="space-y-1">
            <ui-skeleton class="h-6" />
            <ui-skeleton class="h-4" />
          </div>
          <div class="space-y-1">
            <ui-skeleton class="h-6" />
            <ui-skeleton class="h-4" />
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonItemComponent {
  pokemonResult = input.required<PokemonListResult>({ alias: 'pokemon' });
  loaded = output<void>();

  pokemonResource = resource({
    request: this.pokemonResult,
    loader: debounce(
      ({ request: pokemon, abortSignal }) =>
        fetch(pokemon.url, { signal: abortSignal })
          .then(res => res.json())
          .then((data: PokemonResult) => ({
            name: data.name,
            spriteUrl: data.sprites.front_default,
            hp: data.stats[0],
            attack: data.stats[1],
            defense: data.stats[2],
          })),
      800
    ),
  });

  ngOnInit() {
    this.loaded.emit();
  }
}
