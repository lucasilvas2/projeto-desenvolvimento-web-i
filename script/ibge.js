//https://imsea.herokuapp.com/api/1?q=
//api para buscar bandeira dos paises
function xhttpAssincrono(callBackFunction, type, value1, value2) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        // Chama a função em callback e passa a resposta da requisição
        callBackFunction(this.responseText);
    }
    };
    // Path para a requisição AJAX.
    var url = "https://servicodados.ibge.gov.br/api/v1/paises/";
    switch (type) {
        case 1:
            url
            break;
        case 2:
            url += value1
            break;
        case 3:
            url += value1 + "|" + value2
            break;      
        case 4:
            url += value1 + "/indicadores/77827|77819|77821";
            break;
        case 5:
            url += value1 + "|" + value2 + "/indicadores/77827|77819|77821";
            break;
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}
//77827 - Economia - Total do PIB
//77819- Economia - Gastos públicos com educação
//77821- Economia - Investimentos em pesquisa e desenvolvimento
//77835- Indicadores sociais - Taxa bruta de matrículas para todos os níveis de ensino
//77836- Indicadores sociais - Taxa de alfabetização das pessoas de 15 anos ou mais de idade
function loadOptionsJson(){
    xhttpAssincrono(carregandoOpcaoPaises,1,)
}
var listaJson;
var listaPaises = [];
function carregandoOpcaoPaises(value){
    
    var dataList = document.getElementById('listaPaises')
    var add_option;
    
    listaJson = JSON.parse(value);
    for (let i = 0; i < listaJson.length; i++) {
        var codeAlpha2 = listaJson[i].id["ISO-3166-1-ALPHA-2"]
        var nomeAbreviado = listaJson[i].nome["abreviado"];
        listaPaises.push(new pais(codeAlpha2, nomeAbreviado));
    }
    //listaPaises.sort();
    for (let i = 0; i < listaPaises.length; i++) {
        add_option = new Option
        add_option.value = listaPaises[i].nomeAbreviado;
        add_option.innerHTML = listaPaises[i].nomeAbreviado;
        dataList.appendChild(add_option);
    }
}


function pais(codeAlpha2, nomeAbreviado){
    this.codeAlpha2 = codeAlpha2;
    this.nomeAbreviado = nomeAbreviado;
}

function retornaCodeAlpha2ComparandoONomeAbreviado(nomeAbreviado){
    let codeAlpha2Encontrado = null;
    listaPaises.forEach(pais => {
        if (nomeAbreviado == pais.nomeAbreviado) {
            codeAlpha2Encontrado = pais.codeAlpha2;
        }        
    });
    return codeAlpha2Encontrado;
}

$("#buscar").click(function(){
    buscarDados();
});

$(".radio-option").change(function(){
        var opcaoEscolhida = document.getElementsByName('opcao_escolhida');
        var inputDisplaySegundoPais = document.getElementById('escolhaPais2')
        if (opcaoEscolhida[0].checked == true) {        
            inputDisplaySegundoPais.style.display = 'none'     
        }
        else{
            inputDisplaySegundoPais.style.display = 'inline' 
        }
        
    }
);


var controle;
function cacheInfo(v_controle, pais1, code1){
    this.v_controle = v_controle;
    this.pais1 = pais1;
    this.code1 = code1;
}
function buscarDados(){
    var opcaoEscolhida;
    var paisEscolhido1;
    opcaoEscolhida = document.getElementsByName('opcao_escolhida');
    paisEscolhido1 = document.getElementById('escolhaPais1');
    paisEscolhido2 = document.getElementById('escolhaPais2');
    var codePais1;
    var codePais2;
    
    
    if (opcaoEscolhida[0].checked == true) {
        codePais1 = retornaCodeAlpha2ComparandoONomeAbreviado(paisEscolhido1.value)
        controle = 1;
        xhttpAssincrono(mostrarInformacaoPais, 2, codePais1); 
        xhttpAssincrono(dadosGrafico, 4, codePais1); 
    }
    else if (opcaoEscolhida[1].checked == true){
        
        codePais1 = retornaCodeAlpha2ComparandoONomeAbreviado(paisEscolhido1.value);
        codePais2 = retornaCodeAlpha2ComparandoONomeAbreviado(paisEscolhido2.value);
        controle = 2;
        xhttpAssincrono(mostrarInformacaoPais, 3, codePais1, codePais2);
        

    }
    alertaEscolha(controle, paisEscolhido1.value, paisEscolhido2.value);
}

var infoPais
function mostrarInformacaoPais(value){
    infoPais = JSON.parse(value);
    var resultado = document.getElementById('resultado');
    verificaSeTemResultadoNatela();
    if(controle == 1){
        resultado.insertAdjacentHTML('beforeend', `<div class="container" id="info_pais"> <h1>`+ infoPais[0].nome['abreviado'] + ` ` + infoPais[0].id['ISO-3166-1-ALPHA-3'] + `</h1> <p> Área Total: ` + infoPais[0].area['total'] + ` Km² | Continente: `+ infoPais[0].localizacao.regiao.nome + ` | Capital: ` + infoPais[0].governo.capital.nome +` </p> </div>`);
        resultado.insertAdjacentHTML('beforeend', `<div id="grafico" class="" style="width: 900px; height: 500px;"> Gráfico </div>`)
        google.charts.setOnLoadCallback(drawVisualization);    
    }
    else if(controle == 2){
        resultado.insertAdjacentHTML('beforeend', `<div class="d-flex justify-content-center" id="info_pais">  </div>`);
        var infoDiv1 = document.getElementById('info_pais');
        var infoDiv2 = document.getElementById('info_pais');
        infoDiv1.insertAdjacentHTML('beforeend',`<div class="me-5" id = "info_pais1"> <h1>`+ infoPais[1].nome['abreviado'] + ` ` + infoPais[1].id['ISO-3166-1-ALPHA-3'] + `</h1> <p> Área Total: ` + infoPais[1].area['total'] + ` Km² | Continente: `+ infoPais[1].localizacao.regiao.nome + ` | Capital: ` + infoPais[1].governo.capital.nome +` </p> </div>` );
        infoDiv2.insertAdjacentHTML('beforeend', `<div class="ms-5" id = "info_pais2"> <h1>`+ infoPais[0].nome['abreviado'] + ` ` + infoPais[0].id['ISO-3166-1-ALPHA-3'] + `</h1> <p> Área Total: ` + infoPais[0].area['total'] + ` Km² | Continente: `+ infoPais[0].localizacao.regiao.nome + ` | Capital: ` + infoPais[0].governo.capital.nome +` </p> </div>`);       
    }
}

function verificaSeTemResultadoNatela(){
    let x = document.getElementById('info_pais');
    let y = document.getElementById('grafico')
    if(x != null ){
        x.remove();
        y.remove();
    }
}

function alertaEscolha(controle, pais1, pais2){
    if (controle == 1) {
        if (pais1 == "") {
            window.alert("Preencha todos os campos!");
        }
    } else {
        if (pais1 == "" || pais2 == "" || pais1 == "" && pais2 == "") {
            window.alert("Preencha todos os campos!");
        }
    }
}
var dadosTabela = [];
var dados;
function dadosGrafico(value){
    dados = JSON.parse(value);
}

function printConsole(value1){
    console.log(value1);
}

function drawVisualization() {
    // Some raw data (not necessarily accurate)
    var data = google.visualization.arrayToDataTable([
      ['Month', 'Bolivia', 'Equador'],
      ['2004/05',  165,      938],
      ['2005/06',  135,      1120],
      ['2006/07',  157,      1167],
      ['2007/08',  139,      1110],
      ['2008/09',  136,      691]
    ]);

    var options = {
      title : 'PIB',
      vAxis: {title: 'US$'},
      hAxis: {title: 'Anos'},
      seriesType: 'bars',
      series: {2: {type: 'line'}},
    };

    var chart = new google.visualization.ComboChart(document.getElementById('grafico'));
    chart.draw(data, options);
  }