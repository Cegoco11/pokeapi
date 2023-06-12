import React from "react";
import { Text } from "@fluentui/react/lib/Text";
import { Stack } from "@fluentui/react/lib/Stack";
import IVisorDatosDescripcion from "../interfaces/IVisorDatosDescripcion";

function VisorDatosDescripcion({
  descriptions,
  context,
}: IVisorDatosDescripcion) {
  return (
    <Stack className="visordatosdescripcion-contenedor-detalles">
      <span className="visordatosdescripcion-titulo">
        {context.resources.getString(`description-text`)}
      </span>
      <Stack>
        {descriptions.length == 1
          ? descriptions.map((x) => {
              return (
                <Text className="visordatosdescripcion-text">{x.text}</Text>
              );
            })
          : descriptions.map((x) => {
              return (
                <Text className="visordatosdescripcion-text">
                  <span className="visordatosdescripcion-span-bold">
                    {context.resources.getString(`game-${x.version}`) + ": "}
                  </span>
                  {x.text}
                </Text>
              );
            })}
      </Stack>
    </Stack>
  );
}

export default VisorDatosDescripcion;
