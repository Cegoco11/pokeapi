import { Rating } from "@fluentui/react/lib/Rating";
import { Stack } from "@fluentui/react/lib/Stack";
import React, { useState } from "react";
import IStats from "../interfaces/IStats";
import { TooltipHost } from "@fluentui/react/lib/Tooltip";

type Props = {
  stats: IStats;
};

function Stats({ stats }: Props) {
  const calculaValor = (value: number) => {
    const valorFinal: number = (value * 8) / 200;
    return valorFinal;
  };

  return (
    <Stack className="stats-contenedor-principal">
      <span className="stats-contenedor-principal-titulo">Base Stats</span>
      {Object.entries(stats).map((stat: [string, number]) => {
        const [key, value] = stat;

        return (
          <TooltipHost content={value.toString()} directionalHint={12}>
            <Stack horizontal className="stats-contenedor-ratings">
              <span className="stats-contenedor-ratings-header">
                {key.toUpperCase()}
              </span>
              <Rating
                max={8}
                rating={calculaValor(value)}
                ariaLabel="Custom icons"
                ariaLabelFormat="{0} of {1} stars"
                icon="FieldFilled"
                readOnly
                unselectedIcon="FieldEmpty"
              />
            </Stack>
          </TooltipHost>
        );
      })}
    </Stack>
  );
}

export default Stats;
