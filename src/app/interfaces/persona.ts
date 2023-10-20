
// Definición de la interfaz Persona que se utiliza en el frontend para el CRUD de personas
export interface Persona {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  tipoDocumento: string;
  documento: number;
  fechaNacimiento: Date;
}