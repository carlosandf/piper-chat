import os from 'os';

export function getFilePath (file) { // recivir el archivo
  const filePath = file.path; // obtener la ruta
  const separator = os.platform() === 'win32' ? '\\' : '/'; // verificación de SO y utilizar el separador adecuado
  const [,, dir, filename] = filePath.split(separator); // obtener los dos ultimos indices del array devuelto
  return `${dir}/${filename}`; // crear la ruta del archivo y devolverla
}
