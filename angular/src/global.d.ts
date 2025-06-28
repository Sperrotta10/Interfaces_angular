import 'jquery';

declare global {
  interface JQuery {
    DataTable(...args: any[]): any;
  }
}

export {};