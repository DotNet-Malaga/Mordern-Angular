export type Pokemon = {
  name: string;
  spriteUrl: string;
  hp: PokemonStat;
  attack: PokemonStat;
  defense: PokemonStat;
};

export type PokemonListResult = {
  name: string;
  url: string;
};

type PokemonStat = {
  base_stat: number;
  stat: {
    name: string;
  };
};

export type PokemonResult = {
  name: string;
  sprites: {
    front_default: string;
  };
  stats: PokemonStat[];
};
