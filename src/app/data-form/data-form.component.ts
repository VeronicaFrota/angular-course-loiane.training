import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { EstadoBr } from './../shared/models/estado-br.model';
import { DropdownService } from './../shared/services/dropdown.service';
import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  // variáveis
  formulario: FormGroup;      // representa o formulario
  estados: EstadoBr[];       

  constructor(
    private formBuilder: FormBuilder,  //construtor do formulário, menos verboso
    private http: Http,               // para requisições HTTP
    private dropdownService: DropdownService, // para utilizar o arquivo Json com os estados
    private cepService: ConsultaCepService
  ) {}

  // para obter a lista de estados a partir do cep
  ngOnInit() {
    this.dropdownService.getEstadosBr().subscribe(dados => {
      this.estados = dados;
      console.log(dados);
    });

    /*this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),

      endereco: new FormGroup({  // para agrupar todos os campos realcionados ao endereço
        cep: new FormControl(null)
      })
    });*/

    // sintax mais simplificadas para se passar os campos do form
   // formulario recebendo o tipo forGroup, através do ForBuilser
    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],

      endereco: this.formBuilder.group({        // para agrupar todos os campos realcionados ao endereço
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    });

    // tslint:disable-next-line:max-line-length
    // Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
    // [Validators.required, Validators.minLength(3), Validators.maxLength(20)]
  }

  // submit do botão enviar
  onSubmit() {
    console.log(this.formulario);     // para realizar o debug

    // chamada Http para emular o envio do formulário para o link https://httpbin.org/post, pois não esta utilizando o backend
    if (this.formulario.valid) {
      this.http
        .post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
        .map(res => res)
        .subscribe(dados => {console.log(dados);   // console.log do recebimento da resposta
            // reseta o form
            // this.formulario.reset(); // para fazer o reset do form
            // this.resetar();
          },
          (error: any) => alert('erro') // tratamento do erro
        );
    } else {    // realiza todas as validações necessárias
      console.log('formulario invalido');
      this.verificaValidacoesForm(this.formulario); // chamada para verificar as validações do formulário
    }
  }

  // método para verificar se os campos estão válidos, incuindo os FormGroups
  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle.markAsDirty(); // markAsDirty: marca o campo como modificado

      // para realizar as verificações de FormGroups
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  // para resetar o form
  resetar() {
    this.formulario.reset();
  }

  // verifica se o campo foi preenchido e se está valido (sem foco no campo)
  verificaValidTouched(campo: string) {
    // para pegar os dados dos campos e realizar as validações
    return (
      !this.formulario.get(campo).valid &&
      (this.formulario.get(campo).touched || this.formulario.get(campo).dirty)
    );
  }

  // verifica se o campo email esta preenchi e no formato de email
  verificaEmailInvalido() {
    const campoEmail = this.formulario.get('email');
    if (campoEmail.errors) {
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }

  // para indicar e adicionar cor nos campos do form quando o mesmo não estiver preecnido
  aplicaCssErro(campo: string) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    };
  }

  consultaCEP() {
    let cep = this.formulario.get('endereco.cep').value;  // para se ter acesso ao valor do cep
    this.cepService.consultaCEP(cep, this.resetaDadosForm, this.formulario)
      .subscribe(dados => this.populaDadosForm(dados));
  }

  populaDadosForm(dados) {
    //this.formulario.setValue({}); // setValue: precisa setar rodos co campos do formulário

    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        // cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });

    this.formulario.get('nome').setValue('Veronica'); // para popupar com um valor o campo em especifico

    // console.log(form);
  }

  resetaDadosForm(formulario) {
    formulario.patchValue({   // patchValue: para popular os campos com os dados (faz uma correção)
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }
}
