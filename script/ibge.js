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
var paisEscolhido1;
var codePais1;
var codePais2;
function buscarDados(){
    var opcaoEscolhida;
    
    opcaoEscolhida = document.getElementsByName('opcao_escolhida');
    paisEscolhido1 = document.getElementById('escolhaPais1');
    paisEscolhido2 = document.getElementById('escolhaPais2');
    
    
    
    if (opcaoEscolhida[0].checked == true) {
        codePais1 = retornaCodeAlpha2ComparandoONomeAbreviado(paisEscolhido1.value)
        controle = 1;
        xhttpAssincrono(dadosGrafico, 4, codePais1);
        xhttpAssincrono(mostrarInformacaoPais, 2, codePais1);    
          
    }
    else if (opcaoEscolhida[1].checked == true){
        
        codePais1 = retornaCodeAlpha2ComparandoONomeAbreviado(paisEscolhido1.value);
        codePais2 = retornaCodeAlpha2ComparandoONomeAbreviado(paisEscolhido2.value);
        controle = 2;
        xhttpAssincrono(dadosGrafico, 5, codePais1, codePais2);
        xhttpAssincrono(mostrarInformacaoPais, 3, codePais1, codePais2);        
    }
    
    alertaEscolha(controle, paisEscolhido1.value, paisEscolhido2.value);
}

var infoPais
function mostrarInformacaoPais(value){
    infoPais = JSON.parse(value);
    verificaresultado();
    
    var resultado = document.getElementById('resultado');
    //verificaSeTemResultadoNatela();
    
    if(controle == 1){
        resultado.insertAdjacentHTML('beforeend', `<div class="container" id="info_pais"> <h1>`+ infoPais[0].nome['abreviado'] + ` ` + infoPais[0].id['ISO-3166-1-ALPHA-3'] + `</h1> <p> Área Total: ` + infoPais[0].area['total'] + ` Km² | Continente: `+ infoPais[0].localizacao.regiao.nome + ` | Capital: ` + infoPais[0].governo.capital.nome +` </p> </div>`);
        
        resultado.insertAdjacentHTML('beforeend', '<div id="graficoTotaldoPib" class="grafico container-fluid justify-content-center" > Gráfico </div>');

        resultado.insertAdjacentHTML('beforeend', '<div id="graficoInvestimentosemPesquisaeDesenvolvimento" class="grafico container-fluid justify-content-center" > Gráfico </div>');

        resultado.insertAdjacentHTML('beforeend', '<div id="graficoGastosComEducacao" class="grafico container-fluid justify-content-center" > Gráfico </div>');       
    }
    else if(controle == 2){
        resultado.insertAdjacentHTML('beforeend', `<div class="d-flex justify-content-center" id="info_pais">  </div>`);
        var infoDiv1 = document.getElementById('info_pais');
        var infoDiv2 = document.getElementById('info_pais');
        
        infoDiv1.insertAdjacentHTML('beforeend',`<div class="me-5" id = "info_pais1"> <h1>`+ infoPais[1].nome['abreviado'] + ` ` + infoPais[1].id['ISO-3166-1-ALPHA-3'] + `</h1> <p> Área Total: ` + infoPais[1].area['total'] + ` Km² | Continente: `+ infoPais[1].localizacao.regiao.nome + ` | Capital: ` + infoPais[1].governo.capital.nome +` </p> </div>` );

        infoDiv2.insertAdjacentHTML('beforeend', `<div class="ms-5" id = "info_pais2"> <h1>`+ infoPais[0].nome['abreviado'] + ` ` + infoPais[0].id['ISO-3166-1-ALPHA-3'] + `</h1> <p> Área Total: ` + infoPais[0].area['total'] + ` Km² | Continente: `+ infoPais[0].localizacao.regiao.nome + ` | Capital: ` + infoPais[0].governo.capital.nome +` </p> </div>`);
        
        resultado.insertAdjacentHTML('beforeend', '<div id="graficoTotaldoPib" class="grafico container-fluid justify-content-center" > Gráfico </div>');

        resultado.insertAdjacentHTML('beforeend', '<div id="graficoInvestimentosemPesquisaeDesenvolvimento" class="grafico container-fluid justify-content-center" > Gráfico </div>');

        resultado.insertAdjacentHTML('beforeend', '<div id="graficoGastosComEducacao" class="grafico container-fluid justify-content-center" > Gráfico </div>');  
    }
    if(dadosJSON[0].series.length != 0 ){
        google.charts.setOnLoadCallback(drawVisualizationGastosComEducacao);
    }
    if(dadosJSON[1].series.length != 0 ){
        google.charts.setOnLoadCallback(drawVisualizationIPD);
    }
    if(dadosJSON[2].series.length != 0 ){
        google.charts.setOnLoadCallback(drawVisualizationPIB);
    }
    
    
  
}


function verificaresultado(){
    var x = document.getElementById('resultado').children.length;
    //printConsole(x);
    if(x > 0 ){
        document.getElementById("resultado").remove()
        //printConsole('deletei');
        var main = document.getElementById('main');
        main.insertAdjacentHTML('beforeend', '<div class="resultado h-auto" id="resultado"></div>')   
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

var dadosJSON;
var dadosListaGastosComEducacao = [];
var dadosListaIPD  = [];
var dadosListaPIB  = [];
var paisGrafico1;
var paisGrafico2;
function dadosGrafico(value){
    
    dadosJSON = JSON.parse(value);
    if(controle == 1){
        paisGrafico1 = dadosJSON[0].series[0].pais["nome"]
        if(dadosJSON[0].series.length != 0 ){
            dadosListaGastosComEducacao[0] = ["1995", tratandoDado(dadosJSON[0].series[0].serie[3][1995])];
            dadosListaGastosComEducacao[1] = ["2000", tratandoDado(dadosJSON[0].series[0].serie[6][2000])];
            dadosListaGastosComEducacao[2] = ["2005", tratandoDado(dadosJSON[0].series[0].serie[17][2005])];
            dadosListaGastosComEducacao[3] = ["2010", tratandoDado(dadosJSON[0].series[0].serie[28][2010])];
            dadosListaGastosComEducacao[4] = ["2015", tratandoDado(dadosJSON[0].series[0].serie[39][2015])];
            dadosListaGastosComEducacao[5] = ["2020", tratandoDado(dadosJSON[0].series[0].serie[48][2020])];
        }
        if(dadosJSON[1].series.length != 0 ){
            dadosListaIPD[0] = ["1995", tratandoDado(dadosJSON[1].series[0].serie[3][1995])];
            dadosListaIPD[1] = ["2000", tratandoDado(dadosJSON[1].series[0].serie[6][2000])];
            dadosListaIPD[2] = ["2005", tratandoDado(dadosJSON[1].series[0].serie[17][2005])];
            dadosListaIPD[3] = ["2010", tratandoDado(dadosJSON[1].series[0].serie[28][2010])];
            dadosListaIPD[4] = ["2015", tratandoDado(dadosJSON[1].series[0].serie[39][2015])];
            dadosListaIPD[5] = ["2020", tratandoDado(dadosJSON[1].series[0].serie[48][2020])];
        }
        if(dadosJSON[2].series.length != 0 ){
            dadosListaPIB[0] = ["1995", tratandoDado(dadosJSON[2].series[0].serie[3][1995])];
            dadosListaPIB[1] = ["2000", tratandoDado(dadosJSON[2].series[0].serie[6][2000])];
            dadosListaPIB[2] = ["2005", tratandoDado(dadosJSON[2].series[0].serie[17][2005])];
            dadosListaPIB[3] = ["2010", tratandoDado(dadosJSON[2].series[0].serie[28][2010])];
            dadosListaPIB[4] = ["2015", tratandoDado(dadosJSON[2].series[0].serie[39][2015])];
            dadosListaPIB[5] = ["2020", tratandoDado(dadosJSON[2].series[0].serie[48][2020])];
        }
    }
    else if(controle == 2){
        paisGrafico1 = dadosJSON[0].series[0].pais["nome"]
        paisGrafico2 = dadosJSON[0].series[1].pais["nome"];

        if(dadosJSON[0].series.length != 0 && dadosJSON[0].series.length != 0){
            dadosListaGastosComEducacao[0] = ["1995", tratandoDado(dadosJSON[0].series[0].serie[3][1995]),tratandoDado(dadosJSON[0].series[1].serie[3][1995])];
            dadosListaGastosComEducacao[1] = ["2000", tratandoDado(dadosJSON[0].series[0].serie[6][2000]), tratandoDado(dadosJSON[0].series[1].serie[6][2000])];
            dadosListaGastosComEducacao[2] = ["2005", tratandoDado(dadosJSON[0].series[0].serie[17][2005]),tratandoDado(dadosJSON[0].series[1].serie[17][2005])];
            dadosListaGastosComEducacao[3] = ["2010", tratandoDado(dadosJSON[0].series[0].serie[28][2010]),tratandoDado(dadosJSON[0].series[1].serie[28][2010])];
            dadosListaGastosComEducacao[4] = ["2015", tratandoDado(dadosJSON[0].series[0].serie[39][2015]),tratandoDado(dadosJSON[0].series[1].serie[39][2015])];
            dadosListaGastosComEducacao[5] = ["2020", tratandoDado(dadosJSON[0].series[0].serie[48][2020]),tratandoDado(dadosJSON[0].series[1].serie[48][2020])];
        }
        if(dadosJSON[1].series.length != 0 && dadosJSON[1].series.length != 0){
            dadosListaIPD[0] = ["1995", tratandoDado(dadosJSON[1].series[0].serie[3][1995]), tratandoDado(dadosJSON[1].series[1].serie[3][1995])];
            dadosListaIPD[1] = ["2000", tratandoDado(dadosJSON[1].series[0].serie[6][2000]), tratandoDado(dadosJSON[1].series[1].serie[6][2000])];
            dadosListaIPD[2] = ["2005", tratandoDado(dadosJSON[1].series[0].serie[17][2005]), tratandoDado(dadosJSON[1].series[1].serie[17][2005])];
            dadosListaIPD[3] = ["2010", tratandoDado(dadosJSON[1].series[0].serie[28][2010]), tratandoDado(dadosJSON[1].series[1].serie[28][2010])];
            dadosListaIPD[4] = ["2015", tratandoDado(dadosJSON[1].series[0].serie[39][2015]), tratandoDado(dadosJSON[1].series[1].serie[39][2015])];
            dadosListaIPD[5] = ["2020", tratandoDado(dadosJSON[1].series[0].serie[48][2020]), tratandoDado(dadosJSON[1].series[1].serie[48][2020])];
        }
        if(dadosJSON[2].series.length != 0 && dadosJSON[2].series.length != 0){
            dadosListaPIB[0] = ["1995", tratandoDado(dadosJSON[2].series[0].serie[3][1995]), tratandoDado(dadosJSON[2].series[1].serie[3][1995])];
            dadosListaPIB[1] = ["2000", tratandoDado(dadosJSON[2].series[0].serie[6][2000]), tratandoDado(dadosJSON[2].series[1].serie[6][2000])];
            dadosListaPIB[2] = ["2005", tratandoDado(dadosJSON[2].series[0].serie[17][2005]), tratandoDado(dadosJSON[2].series[1].serie[17][2005])];
            dadosListaPIB[3] = ["2010", tratandoDado(dadosJSON[2].series[0].serie[28][2010]), tratandoDado(dadosJSON[2].series[1].serie[28][2010])];
            dadosListaPIB[4] = ["2015", tratandoDado(dadosJSON[2].series[0].serie[39][2015]), tratandoDado(dadosJSON[2].series[1].serie[39][2015])];
            dadosListaPIB[5] = ["2020", tratandoDado(dadosJSON[2].series[0].serie[48][2020]), tratandoDado(dadosJSON[2].series[1].serie[48][2020])];
        }
    }
}

function tratandoDado(value){
    
    if(value == null || isNaN(value)){
        return 0;                  
    }
    else if(value > 99000000000000){
        return 99;
    }   
    return parseFloat(value);    
}

function printConsole(value1){
    console.log(value1);
}

function drawVisualizationGastosComEducacao() {
    printConsole(controle);
    //Some raw data (not necessarily accurate)
    var data;
    if(controle == 1){
        data = google.visualization.arrayToDataTable([
            ['Ano', paisGrafico1],
            [dadosListaGastosComEducacao[0][0], dadosListaGastosComEducacao[0][1]],
            [dadosListaGastosComEducacao[1][0], dadosListaGastosComEducacao[1][1]],
            [dadosListaGastosComEducacao[2][0], dadosListaGastosComEducacao[2][1]],
            [dadosListaGastosComEducacao[3][0], dadosListaGastosComEducacao[3][1]],
            [dadosListaGastosComEducacao[4][0], dadosListaGastosComEducacao[4][1]],
            [dadosListaGastosComEducacao[5][0], dadosListaGastosComEducacao[5][1]]
        ]);
    }
    else if(controle == 2){
        data = google.visualization.arrayToDataTable([
            ['Ano', paisGrafico1, paisGrafico2],
            [dadosListaGastosComEducacao[0][0], dadosListaGastosComEducacao[0][1] , dadosListaGastosComEducacao[0][2]],
            [dadosListaGastosComEducacao[1][0], dadosListaGastosComEducacao[1][1] , dadosListaGastosComEducacao[1][2]],
            [dadosListaGastosComEducacao[2][0], dadosListaGastosComEducacao[2][1] , dadosListaGastosComEducacao[2][2]],
            [dadosListaGastosComEducacao[3][0], dadosListaGastosComEducacao[3][1] , dadosListaGastosComEducacao[3][2]],
            [dadosListaGastosComEducacao[4][0], dadosListaGastosComEducacao[4][1] , dadosListaGastosComEducacao[4][2]],
            [dadosListaGastosComEducacao[5][0], dadosListaGastosComEducacao[5][1] , dadosListaGastosComEducacao[5][2]]
        ]);
    }
    var options = {
      title : 'Economia - Gastos públicos com educação',
      vAxis: {title: '% do PIB'},
      hAxis: {title: 'Anos'},
      seriesType: 'bars',
      series: {2: {type: 'line'}},

    };

    var chart = new google.visualization.ComboChart(document.getElementById('graficoGastosComEducacao'));
    chart.draw(data, options);
}

function drawVisualizationIPD(){
    //Some raw data (not necessarily accurate)
    var data;
    if(controle == 1){
        data = google.visualization.arrayToDataTable([
            ['Ano', paisGrafico1],
            [dadosListaIPD [0][0], dadosListaIPD [0][1]],
            [dadosListaIPD [1][0], dadosListaIPD [1][1]],
            [dadosListaIPD [2][0], dadosListaIPD [2][1]],
            [dadosListaIPD [3][0], dadosListaIPD [3][1]],
            [dadosListaIPD [4][0], dadosListaIPD [4][1]],
            [dadosListaIPD [5][0], dadosListaIPD [5][1]]
        ]);
    }
    else if(controle == 2){
        data = google.visualization.arrayToDataTable([
            ['Ano', paisGrafico1, paisGrafico2],
            [dadosListaIPD [0][0], dadosListaIPD [0][1], dadosListaIPD [0][2]],
            [dadosListaIPD [1][0], dadosListaIPD [1][1], dadosListaIPD [1][2]],
            [dadosListaIPD [2][0], dadosListaIPD [2][1], dadosListaIPD [2][2]],
            [dadosListaIPD [3][0], dadosListaIPD [3][1], dadosListaIPD [3][2]],
            [dadosListaIPD [4][0], dadosListaIPD [4][1], dadosListaIPD [4][2]],
            [dadosListaIPD [5][0], dadosListaIPD [5][1], dadosListaIPD [5][2]]
        ]);
    }
     
    var options = {
        title : 'Economia - Investimentos em pesquisa e desenvolvimento',
        vAxis: {title: '% do PIB'},
        hAxis: {title: 'Anos'},
        seriesType: 'bars',
        series: {2: {type: 'line'}},

    };
  
    var chart = new google.visualization.ComboChart(document.getElementById('graficoInvestimentosemPesquisaeDesenvolvimento'));
    chart.draw(data, options);
}

function drawVisualizationPIB(){
    //Some raw data (not necessarily accurate)
    var data;
    if(controle == 1){
        data = google.visualization.arrayToDataTable([
            ['Ano', paisGrafico1],
            [dadosListaPIB [0][0], dadosListaPIB [0][1]],
            [dadosListaPIB [1][0], dadosListaPIB [1][1]],
            [dadosListaPIB [2][0], dadosListaPIB [2][1]],
            [dadosListaPIB [3][0], dadosListaPIB [3][1]],
            [dadosListaPIB [4][0], dadosListaPIB [4][1]],
            [dadosListaPIB [5][0], dadosListaPIB [5][1]]
        ]);
    }
    else if(controle == 2){
        data = google.visualization.arrayToDataTable([
            ['Ano', paisGrafico1, paisGrafico2],
            [dadosListaPIB [0][0], dadosListaPIB [0][1], dadosListaPIB [0][2]],
            [dadosListaPIB [1][0], dadosListaPIB [1][1], dadosListaPIB [1][2]],
            [dadosListaPIB [2][0], dadosListaPIB [2][1], dadosListaPIB [2][2]],
            [dadosListaPIB [3][0], dadosListaPIB [3][1], dadosListaPIB [3][2]],
            [dadosListaPIB [4][0], dadosListaPIB [4][1], dadosListaPIB [4][2]],
            [dadosListaPIB [5][0], dadosListaPIB [5][1], dadosListaPIB [5][2]]
        ]);
    }

    var options = {
        title : 'Economia - Total do PIB',
        vAxis: {title: 'US$'},
        hAxis: {title: 'Anos'},
        seriesType: 'bars',
        series: {6: {type: 'line'}},

    };
  
    var chart = new google.visualization.ComboChart(document.getElementById('graficoTotaldoPib'));
    chart.draw(data, options);
}

