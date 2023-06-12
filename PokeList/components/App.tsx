import React, { useEffect, useState } from "react";
import { Text } from "@fluentui/react/lib/Text";
import { Separator } from "@fluentui/react/lib/Separator";
import { Stack } from "@fluentui/react/lib/Stack";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { createTheme, ThemeProvider } from "@fluentui/react/lib/Theme";
import VisorDatos from "./VisorDatos";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { IInputs } from "../generated/ManifestTypes";
import { Checkbox } from "@fluentui/react/lib/Checkbox";
import IPokemon from "../interfaces/IPokemon";
import IDescripcion from "../interfaces/IDescripcion";
import IPokemonSpecies from "../interfaces/IPokemonSpecies";
import IStats from "../interfaces/IStats";

function App(context: ComponentFramework.Context<IInputs>) {
  const [pokemon, setPokemon] = useState<IPokemon | undefined>();
  const [textoBuscar, setTextoBuscar] = useState("");
  const [isShiny, setIsShiny] = useState(false);
  const [generation, setGeneration] = useState("generation-iv");
  const [game, setGame] = useState("");
  const [descriptions, setDescriptions] = useState({} as IDescripcion[]);
  const [gamesRender, setGamesRender] = useState([]);
  const [rare, setRare] = useState("");
  const [stats, setStats] = useState({} as IStats);

  type ObjectKey = keyof typeof pokemon;

  const random = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  const num = random(1, 472);

  useEffect(() => {
    fetch(
      `https://pokeapi.co/api/v2/pokemon/${
        textoBuscar === "" ? num : textoBuscar
      }`
    )
      .then((response) => response.json())
      .then(function (data: IPokemon) {
        const propertyMap: { [key: string]: keyof IStats } = {
          hp: "hp",
          attack: "atk",
          defense: "def",
          "special-attack": "atkesp",
          "special-defense": "defesp",
          speed: "speed",
        };

        const statsAux: IStats = {
          hp: 0,
          atk: 0,
          def: 0,
          atkesp: 0,
          defesp: 0,
          speed: 0,
        };

        data.stats.forEach((x) => {
          const { base_stat, stat } = x;
          const { name } = stat;
          const propertyName = propertyMap[name];

          // Assign the base_stat value to the corresponding property
          if (propertyName) {
            statsAux[propertyName] = base_stat;
          }
        });

        let games = data.sprites.versions[generation as ObjectKey];
        const default_game = Object.keys(games)[0];

        setStats(statsAux);
        setGamesRender(games);
        setGame(default_game);
        setPokemon(data);
      })
      .catch((error) => {
        setPokemon(undefined);
      });
  }, [textoBuscar]);

  useEffect(() => {
    if (pokemon !== undefined) {
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
        .then((response) => response.json())
        .then(function (data: IPokemonSpecies) {
          let rareza: string = "common";
          if (data.is_mythical) {
            rareza = "mythic";
          }
          if (data.is_legendary) {
            rareza = "legendary";
          }
          setRare(rareza);

          const language: string = context.resources.getString("language-text");
          let entradas: IDescripcion[] = data.flavor_text_entries
            .filter(
              (x) =>
                x.language.name === language &&
                game.split("-").includes(x.version.name)
            )
            .map((x) => {
              const aux: IDescripcion = {
                lang: x.language.name,
                version: x.version.name,
                text: x.flavor_text,
              };
              return aux;
            });
          setDescriptions(entradas);
        })
        .catch((error) => {
          setPokemon(undefined);
        });
    }
  }, [pokemon, game]);

  const _onSearch = (text: string) => {
    const finalText: string = text.trim().replace(" ", "").toLocaleLowerCase();

    setTextoBuscar(finalText);
  };

  const myTheme = createTheme({
    palette: {
      themePrimary: "#00757c",
      themeLighterAlt: "#f0f9fa",
      themeLighter: "#c5e8ea",
      themeLight: "#97d5d8",
      themeTertiary: "#47acb1",
      themeSecondary: "#11868d",
      themeDarkAlt: "#006b70",
      themeDark: "#005a5f",
      themeDarker: "#004246",
      neutralLighterAlt: "#faf9f8",
      neutralLighter: "#f3f2f1",
      neutralLight: "#edebe9",
      neutralQuaternaryAlt: "#e1dfdd",
      neutralQuaternary: "#d0d0d0",
      neutralTertiaryAlt: "#c8c6c4",
      neutralTertiary: "#a19f9d",
      neutralSecondary: "#605e5c",
      neutralPrimaryAlt: "#3b3a39",
      neutralPrimary: "#323130",
      neutralDark: "#201f1e",
      black: "#000000",
      white: "#ffffff",
    },
  });

  const options: IDropdownOption[] = [
    { key: "generation-i", text: "Generation I" },
    { key: "generation-ii", text: "Generation II" },
    { key: "generation-iii", text: "Generation III" },
    { key: "generation-iv", text: "Generation IV" },
    { key: "generation-v", text: "Generation V" },
  ];

  return (
    <ThemeProvider theme={myTheme}>
      <div className="app-contenedor">
        <Stack horizontal>
          <img
            src="../img/Pokeball.png"
            className="app-contenedor-titulo-icon"
          />
          <Text variant="xxLargePlus">PokeAPI Tester</Text>
          <img
            src="../img/Pokeball.png"
            className="app-contenedor-titulo-icon"
          />
        </Stack>
        <Separator className="app-separador" />
        <Stack className="app-stack-principal">
          <SearchBox
            showIcon={true}
            className="app-search"
            placeholder={context.resources.getString("searchbox-placeholder")}
            underlined={true}
            onSearch={_onSearch}
          />
        </Stack>
        <Stack className="app-stack-filtros">
          <Dropdown
            className="app-stack-filtros-dropdown"
            placeholder={context.resources.getString(
              "combobox-gen-placeholder"
            )}
            options={options}
            onChange={(ev, item) => {
              if (pokemon !== undefined) {
                const gen = item === undefined ? "" : item?.key.toString();
                let games = pokemon.sprites.versions[gen as ObjectKey];
                const default_game = Object.keys(games)[0];
                setGamesRender(games);
                setGame(default_game);
                setGeneration(gen);
              }
            }}
          />
          <Checkbox
            className="app-stack-filtros-checkbox"
            label={context.resources.getString("checkbox-label")}
            onChange={(ev, isChecked) =>
              setIsShiny(isChecked === undefined ? false : isChecked)
            }
          />
        </Stack>
        <VisorDatos
          pokemon={pokemon}
          generation={generation}
          game={game}
          setGame={setGame}
          gamesRender={gamesRender}
          shiny={isShiny}
          context={context}
          descriptions={descriptions}
          rare={rare}
          stats={stats}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
