// src/types/datatables.d.ts

// Asegúrate de que este archivo SÓLO extienda las interfaces existentes de DataTables y jQuery.
// NO debe contener "declare var $:" o "declare var jQuery:"
// Esos deberían ser manejados por @types/jquery o por la declaración directa en el componente (Paso 1).

// Extiende la interfaz JQuery para incluir los métodos de DataTables
interface JQuery<TElement extends HTMLElement = HTMLElement> {
  DataTable(options?: DataTables.Settings): DataTables.Api;
  // Puedes añadir otros métodos que DataTables extienda directamente en JQuery si los necesitas tipados,
  // por ejemplo, si $.fn.dataTable.isDataTable() da problemas de tipo, podríamos añadir:
  // dataTable: {
  //   isDataTable(table: any): boolean;
  // };
}

// Declara el módulo 'datatables.net' para que TypeScript conozca sus tipos específicos
declare module 'datatables.net' {
  // Extiende las opciones de configuración de DataTables
  interface Settings {
    responsive?: boolean;
    dom?: string;
    buttons?: any; // Mantenemos 'any' para buttons por su complejidad
    language?: any;
    data?: any[];
    columns?: any[];
  }

  // Extiende la API de DataTables
  interface Api {
    destroy(remove?: boolean): Api;
    // Añade aquí cualquier otro método del API de DataTables que uses y necesites tipar
    // (e.g., .draw(), .row().remove(), etc.)
  }
}