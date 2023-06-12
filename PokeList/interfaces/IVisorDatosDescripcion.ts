import { IInputs } from "../generated/ManifestTypes";
import IDescripcion from "./IDescripcion";

interface IVisorDatosDescripcion {
  context: ComponentFramework.Context<IInputs>;
  descriptions: IDescripcion[];
}

export default IVisorDatosDescripcion;
