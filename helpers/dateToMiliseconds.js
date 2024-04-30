export const dateToMilliseconds = (dateString) => {
  // Separar el string de fecha en día, mes y año
  const parts = dateString.split('-');

  // Crear un objeto Date con los componentes de la fecha
  const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

  // Obtener los milisegundos desde el 1 de enero de 1970 hasta la fecha proporcionada
  return date.getTime();
};
