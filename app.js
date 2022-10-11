class Despesa {
  constructor(ano,mes,dia,tipo,descricao,valor){
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor
  }

  validarDados(){
    for (const i in this) {
      if(this[i] == undefined || this[i] == '' || this[i] == null){
        return false
      }
    }
    return true
  }
}

class Bd {
  constructor(){
    let id = localStorage.getItem('id')

    if(id === null){
      localStorage.setItem('id', 0)
    }
  }

  getProximoId(){
    let proximoId = localStorage.getItem('id')
    return parseInt(proximoId) + 1;
  }
  
  
  gravarDados(despesa){
    let id = this.getProximoId()
    
    localStorage.setItem(id, JSON.stringify(despesa))

    localStorage.setItem('id', id)
  }

  recuperarTodosRegistros(){

    const despesas = [];

    let id = localStorage.getItem('id')

    for (let index = 1; index <= id; index++) {
      let despesa = JSON.parse(localStorage.getItem(index))
      if (despesa===null) {
        continue
      }
      
      despesa.id = index
      
      despesas.push(despesa)
    }

    return despesas
  }

  pesquisar(despesa){

    let despesas = this.recuperarTodosRegistros()

    if (despesa.ano != '') {
      despesas = despesas.filter(d => d.ano == despesa.ano)
    }
    if(despesa.mes != '') {
      despesas = despesas.filter(d => d.mes == despesa.mes)
    }
    if(despesa.dia != '') {
      despesas = despesas.filter(d => d.dia == despesa.dia)
    }  
    if(despesa.tipo != '') {
      despesas = despesas.filter(d => d.tipo == despesa.tipo)
    }  
    if(despesa.descricao != '') {
      despesas = despesas.filter(d => d.descricao == despesa.descricao)
    }  
    if(despesa.valor != '') {
      despesas = despesas.filter(d => d.valor == despesa.valor)
    }

    return despesas

  }

  remover(id){
    localStorage.removeItem(id)
  }

}

let bd = new Bd()

function cadastrarDespesas() {
  let ano = document.getElementById('ano')
  let mes = document.getElementById('mes')
  let dia = document.getElementById('dia')
  let tipo = document.getElementById('tipo')
  let descricao = document.getElementById('descricao')
  let valor = document.getElementById('valor')

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  )

  if(despesa.validarDados()){
    bd.gravarDados(despesa)

    document.getElementById('modalLabel').innerHTML = "Sucesso na gravacao"
    document.getElementById('modalLabel').className = "modal-title text-success"
    document.getElementById('modalBody').innerHTML = "Os campos obrigatórios foram preenchidos!"
    document.getElementById('btnModal').innerHTML = "Voltar"
    document.getElementById('btnModal').className = "btn btn-success"

    $('#modalRegistraDespesa').modal('show')

    ano.value = ''
    mes.value = ''
    dia.value = ''
    tipo.value = ''
    descricao.value = ''
    valor.value = ''

  }else{
    document.getElementById('modalLabel').innerHTML = "Erro na gravacao"
    document.getElementById('modalLabel').className = "modal-title text-danger"
    document.getElementById('modalBody').innerHTML = "Existem campos obrigatórios que nao foram preenchidos!"
    document.getElementById('btnModal').innerHTML = "Voltar e Corrigir"
    document.getElementById('btnModal').className = "btn btn-danger"
    
    $('#modalRegistraDespesa').modal('show')
  }
}

function carregarListasDespesas() {
  let despesas = bd.recuperarTodosRegistros()

  tableDespesas(despesas)
  
}

function pesquisarDespesas() {

  let ano = document.getElementById('ano').value
  let mes = document.getElementById('mes').value
  let dia = document.getElementById('dia').value
  let tipo = document.getElementById('tipo').value
  let descricao = document.getElementById('descricao').value
  let valor = document.getElementById('valor').value

  let despesa = new Despesa(
    ano,
    mes,
    dia,
    tipo,
    descricao,
    valor
  )

  let despesasFiltradas = bd.pesquisar(despesa)

  tableDespesas(despesasFiltradas)
}

function tableDespesas(objeto) {

  let listasDespesas = document.getElementById('listasDespesas')

  listasDespesas.innerHTML = ''

  objeto.forEach(function (d) {
    let linha = listasDespesas.insertRow()

    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

    switch (d.tipo) {
      case '1':
        d.tipo = 'Alimentação'
        break;
      case '2':
        d.tipo = 'Educação'
        break;
      case '3':
        d.tipo = 'Lazer'
        break;
      case '4':
        d.tipo = 'Saúde'
        break;
      case '5':
        d.tipo = 'Transporte'
        break;
      default:
        break;
    }
    linha.insertCell(1).innerHTML = d.tipo
    linha.insertCell(2).innerHTML = d.descricao
    linha.insertCell(3).innerHTML = d.valor

    let btn = document.createElement('button')
    btn.className = 'btn btn-danger'
    btn.innerHTML = '<i class="fas fa-times"></i>'
    btn.id = `id_despesa_${d.id}`
    btn.onclick = function () {
      // let id = this.id.slice(-1)
      let id = this.id.replace('id_despesa_', '')
      bd.remover(id)
      carregarListasDespesas()
    }
    linha.insertCell(4).append(btn)
  })
}