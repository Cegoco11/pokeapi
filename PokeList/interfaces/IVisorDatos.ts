import { IInputs } from "../generated/ManifestTypes";
import IDescripcion from "./IDescripcion";
import IPokemon from "./IPokemon";
import IStats from "./IStats";

interface IVisorDatos {
  pokemon: IPokemon | undefined;
  generation: string;
  game: string;
  setGame: React.Dispatch<React.SetStateAction<string>>;
  gamesRender: any;
  shiny: boolean;
  rare: string;
  context: ComponentFramework.Context<IInputs>;
  descriptions: IDescripcion[];
  stats: IStats;
}

export default IVisorDatos;
