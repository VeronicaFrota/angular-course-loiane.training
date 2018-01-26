import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DropdownService {

  constructor(private http: Http) {}  // injeta o objeto Http

  // método que pega os estados em Json apartir de umr arviso Json (em assets -> estaodsBr.Json)
  getEstadosBr() {
    return this.http.get('assets/dados/estadosbr.json') // retorna a chada
      .map((res: Response) => res.json());  // resposta do servidor através do mapeamento
  }
}
