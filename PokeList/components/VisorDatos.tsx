import React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Pivot, PivotItem } from "@fluentui/react/lib/Pivot";
import IVisorDatos from "../interfaces/IVisorDatos";
import IPokemon from "../interfaces/IPokemon";
import VisorDatosDescripcion from "./VisorDatosDescripcion";
import { FontIcon } from "@fluentui/react/lib/Icon";
import IDescripcion from "../interfaces/IDescripcion";
import { TooltipHost } from "@fluentui/react/lib/Tooltip";
import Stats from "./Stats";

function VisorDatos({
  pokemon,
  generation,
  game,
  setGame,
  gamesRender,
  shiny,
  context,
  descriptions,
  rare,
  stats,
}: IVisorDatos) {
  type ObjectKey = keyof typeof pokemon;

  const descripcionFiltrada = (
    descriptions: IDescripcion[]
  ): IDescripcion[] => {
    let retorno: IDescripcion[] = [];
    if (descriptions.length > 0) {
      retorno = descriptions.filter(
        (z, index, array) => array.findIndex((j) => j.text === z.text) === index
      );
    }
    return retorno;
  };

  const imagenSet = (pokemon: IPokemon, nombre: string) => {
    let valor: string = "";
    if (generation === "default") {
      if (shiny) {
        valor = pokemon.sprites[`${nombre}_shiny` as ObjectKey];
      } else {
        valor = pokemon.sprites[`${nombre}_default` as ObjectKey];
      }
    } else {
      if (shiny) {
        valor =
          pokemon.sprites.versions[generation as ObjectKey][game as ObjectKey][
            `${nombre}_shiny` as ObjectKey
          ];
      } else {
        valor =
          pokemon.sprites.versions[generation as ObjectKey][game as ObjectKey][
            `${nombre}_default` as ObjectKey
          ];
      }
    }

    if (!valor) {
      valor = "../img/NotAvailable.png";
    }

    return valor;
  };

  const rarezaSet = (rare: string) => {
    let retorno: React.JSX.Element = <></>;
    let rareza = "";
    if (rare !== "") {
      if (rare === "common") {
        rareza = context.resources.getString("common");
      }
      if (rare === "mythic") {
        rareza = context.resources.getString("mythic");
      }
      if (rare === "legendary") {
        rareza = context.resources.getString("legendary");
      }
      retorno = (
        <TooltipHost content={rareza} directionalHint={12} className={rare}>
          <FontIcon
            aria-label="StarburstSolid"
            iconName="StarburstSolid"
            className={`visordatos-contenedor-titulo-icon ${rare}`.trimEnd()}
          />
        </TooltipHost>
      );
    }

    return retorno;
  };

  if (pokemon === undefined || generation === "" || game === undefined) {
    return (
      <Stack className="visordatos-contenedor">
        <h3>{context.resources.getString("notfound-text")}</h3>
        <Stack className="visordatos-contenedor-img">
          <img src="../img/NotAvailable.png" alt="pokemon not found" />
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack className="visordatos-contenedor">
        <Stack className="visordatos-contenedor-titulo">
          <span className="visordatos-contenedor-titulo-text">
            {pokemon.name
              .charAt(0)
              .toUpperCase()
              .concat(pokemon.name.substring(1))}
          </span>
          {rarezaSet(rare)}
        </Stack>
        <Pivot
          aria-label="Basic Pivot Example"
          selectedKey={game}
          onLinkClick={(item) =>
            setGame(
              item === undefined || item.props.itemKey === undefined
                ? ""
                : item?.props.itemKey?.toString()
            )
          }
        >
          {Object.keys(gamesRender).map((x) => (
            <PivotItem
              itemKey={x}
              key={x}
              headerText={context.resources.getString(`game-${x}`)}
            ></PivotItem>
          ))}
        </Pivot>

        <Stack
          className={(
            "visordatos-contenedor-img " +
            (shiny ? "visordatos-contenedor-shiny" : "")
          ).trimEnd()}
        >
          <img
            src={imagenSet(pokemon, "back")}
            alt={shiny ? "back_shiny" : "back_default"}
          />
          <img
            src={imagenSet(pokemon, "front")}
            alt={shiny ? "front_shiny" : "front_default"}
          />
        </Stack>
        <VisorDatosDescripcion
          descriptions={descripcionFiltrada(descriptions)}
          context={context}
        />
        <Stats stats={stats}></Stats>
      </Stack>
    );
  }
}

export default VisorDatos;
