//Api de busca de imagem é um acesso gratuito
//Tem um limite de 3 requisições por segundo
//Alterações mais rápidas que esse tempo provoca problema de carregamento da página
//Intenção é utilizar a api apenas como teste
//Ao utilizar a verificação de 2 países utilizo duas requisições simultâneas
//Provocando ainda mais problema nas interações realizadas de forma rápida

function xhttpAssincronoBandeira(callBackFunction, pais) {
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            callBackFunction(this.responseText);
        }
    });
    var url = "https://bing-image-search1.p.rapidapi.com/images/search?q=bandeira " + pais;
    xhr.open("GET", url);
    xhr.setRequestHeader("x-rapidapi-host", "bing-image-search1.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "11ca683198mshd910c0532f1c1f3p1488c4jsn3a0fbb212eda");
    
    xhr.send(data);
}

function bandeiraPais1(value){
    var dadobandeira = JSON.parse(value);
    var bandeiraLink = dadobandeira.value[1]["contentUrl"];
    var imgPais1 = document.getElementById('imgPais1');
    imgPais1.src = bandeiraLink;
}
function bandeiraPais2(value){
    var dadobandeira = JSON.parse(value);
    var bandeiraLink = dadobandeira.value[1]["contentUrl"];
    var imgPais2 = document.getElementById('imgPais2');
    imgPais2.src = bandeiraLink;
}
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
//indicadores utilizados
//77827 - Economia - Total do PIB
//77819- Economia - Gastos públicos com educação
//77821- Economia - Investimentos em pesquisa e desenvolvimento

function loadOptionsJson(){
    xhttpAssincrono(carregandoOpcaoPaises,1,)
}
function Pais(code2, nomeAbreviado){
    this.code2 = code2;
    this.nomeAbreviado = nomeAbreviado;
}
var listaJson;
var listaPaises = [];

function carregandoOpcaoPaises(value){
    
    listaJson = JSON.parse(value);
    for (let i = 0; i < listaJson.length; i++) {
        var select1 = document.getElementById('escolhaPais1')
        var select2 = document.getElementById('escolhaPais2')
        var codeAlpha2 = listaJson[i].id["ISO-3166-1-ALPHA-2"]
        var nomeAbreviado = listaJson[i].nome["abreviado"];
        var novaOpcao = document.createElement('option');
        novaOpcao.value = codeAlpha2;
        novaOpcao.innerHTML = nomeAbreviado;
        novaOpcao.id = codeAlpha2
        select1.appendChild(novaOpcao);
        novoPaisLista = new Pais(codeAlpha2,nomeAbreviado);
        listaPaises.push(novoPaisLista);
    }
    for (let i = 0; i < listaJson.length; i++) {
        var codeAlpha2 = listaJson[i].id["ISO-3166-1-ALPHA-2"]
        var nomeAbreviado = listaJson[i].nome["abreviado"];
        var novaOpcao = document.createElement('option');
        novaOpcao.value = codeAlpha2;
        novaOpcao.innerHTML = nomeAbreviado;
        novaOpcao.id = codeAlpha2
        select2.appendChild(novaOpcao);
    }
    carregamentoLocalStorage();
}

function retornaNomeAbreviadoComparandoOCodeAlpha2(code){
    let nomeAbreviadoEncontrado = null;
    
    listaPaises.forEach(pais => {
        if (code == pais.code2) {
            nomeAbreviadoEncontrado = pais.nomeAbreviado;
        }        
    });
    return nomeAbreviadoEncontrado;
}
var controle = 1;
$(".radio-option").change(function(){
    var opcaoEscolhida = document.getElementsByName('opcao_escolhida');
    var inputDisplaySegundoPais = document.getElementById('escolhaPais2');
    
    if (opcaoEscolhida[0].checked == true) {        
        inputDisplaySegundoPais.style.display = 'none';
        cachePageOpcaoEscolhida = localStorage.setItem('opcaoEscolhida', (document.getElementsByName('opcao_escolhida')[0].value), 'mais um valor');
        controle = 1;     
    }
    else{
        inputDisplaySegundoPais.style.display = 'inline'
        cachePageOpcaoEscolhida= localStorage.setItem('opcaoEscolhida', document.getElementsByName('opcao_escolhida')[1].value);
        controle = 2; 
    }
    
}
);
var cachePais1;
var cachePais2;
$(".entradaPais").change(function(){
    var opcao_escolhida = document.getElementsByName('opcao_escolhida');
    var paisEscolhido1 = document.getElementById('escolhaPais1');
    var paisEscolhido2 = document.getElementById('escolhaPais2'); 
    if((opcao_escolhida[0].checked == true && localStorage.getItem('pais1escolhido') != paisEscolhido1.value) || (opcao_escolhida[1].checked == true && paisEscolhido1.value != paisEscolhido2.value)){
        buscarDados();
    }
});

function carregamentoLocalStorage(){   
    var paisEscolhido1 = document.getElementById('escolhaPais1');
    var paisEscolhido2 = document.getElementById('escolhaPais2'); 
    
    if(localStorage.length == 3){
        if(localStorage.getItem('opcaoEscolhida') == 'opcao2'){           
            $( "#opcao2" ).trigger( "click" );
            paisEscolhido1.value = localStorage.getItem('pais1escolhido');
            paisEscolhido2.value = localStorage.getItem('pais2escolhido');
            buscarDados();
        }
        else if(localStorage.getItem('opcaoEscolhida') == 'opcao1'){
            paisEscolhido1.value = localStorage.getItem('pais1escolhido');
            buscarDados();
            
        }
    }
}
var cachePageOpcaoEscolhida;
var paisEscolhido1;
var paisEscolhido2
var codePais1;
var codePais2;
function buscarDados(){
    var opcaoEscolhida;
    
    opcaoEscolhida = document.getElementsByName('opcao_escolhida');
    paisEscolhido1 = document.getElementById('escolhaPais1');
    paisEscolhido2 = document.getElementById('escolhaPais2');
    cachePais1 = localStorage.setItem('pais1escolhido', paisEscolhido1.value);
    cachePais2 = localStorage.setItem('pais2escolhido', paisEscolhido2.value);
    verificaresultado();
    if (opcaoEscolhida[0].checked == true) {
        codePais1 = paisEscolhido1.value;
        xhttpAssincrono(mostrarInformacaoPais, 2, codePais1); 
        xhttpAssincrono(dadosGrafico, 4, codePais1);                      
    }
    else if (opcaoEscolhida[1].checked == true){
        
        codePais1 = paisEscolhido1.value;
        codePais2 = paisEscolhido2.value;
        xhttpAssincrono(mostrarInformacaoPais, 3, codePais1, codePais2);   
        xhttpAssincrono(dadosGrafico, 5, codePais1, codePais2);            
    }     
}

var infoPais
function mostrarInformacaoPais(value){
    infoPais = JSON.parse(value);
    
    var resultado = document.getElementById('resultado');
    
    if(controle == 1){
        resultado.insertAdjacentHTML('beforeend', `<div class="container align-items-center" id="info_pais"> <h1>`+ infoPais[0].nome['abreviado'] + ` ` + infoPais[0].id['ISO-3166-1-ALPHA-2'] + `<img id="imgPais1" class="bandeira ms-2 border border-dark" src="" alt="" srcset=""> </h1> <p> Área Total: ` + infoPais[0].area['total'] + ` Km² | Continente: `+ infoPais[0].localizacao.regiao.nome + ` | Capital: ` + infoPais[0].governo.capital.nome +` </p> </div>`);
        
        resultado.insertAdjacentHTML('beforeend', '<div id="graficoTotaldoPib" class="grafico container-fluid justify-content-center" > País não possui dados</div>');

        resultado.insertAdjacentHTML('beforeend', '<div id="graficoInvestimentosemPesquisaeDesenvolvimento" class="grafico container-fluid justify-content-center" > País não possui dados </div>');

        resultado.insertAdjacentHTML('beforeend', '<div id="graficoGastosComEducacao" class="grafico container-fluid justify-content-center" > País não possui dados </div>');
                   
    }
    else if(controle == 2){
        resultado.insertAdjacentHTML('beforeend', `<div class="d-flex justify-content-center" id="info_pais">  </div>`);
        var infoDiv1 = document.getElementById('info_pais');
        var infoDiv2 = document.getElementById('info_pais');
        
        infoDiv1.insertAdjacentHTML('beforeend',`<div class="me-5" id = "info_pais1"> <h1>`+ infoPais[1].nome['abreviado'] + ` ` + infoPais[1].id['ISO-3166-1-ALPHA-2'] + ` <img id="imgPais1" class="bandeira" src="" alt="" srcset=""></h1> <p> Área Total: ` + infoPais[1].area['total'] + ` Km² | Continente: `+ infoPais[1].localizacao.regiao.nome + ` | Capital: ` + infoPais[1].governo.capital.nome +` </p> </div>` );

        infoDiv2.insertAdjacentHTML('beforeend', `<div class="ms-5" id = "info_pais2"> <h1>`+ infoPais[0].nome['abreviado'] + ` ` + infoPais[0].id['ISO-3166-1-ALPHA-2'] + ` <img id="imgPais2" class="bandeira" src="" alt="" srcset=""> </h1> <p> Área Total: ` + infoPais[0].area['total'] + ` Km² | Continente: `+ infoPais[0].localizacao.regiao.nome + ` | Capital: ` + infoPais[0].governo.capital.nome +` </p> </div>`);
        
        resultado.insertAdjacentHTML('beforeend', '<div id="graficoTotaldoPib" class="grafico container-fluid justify-content-center" > País não possui dados </div>');

        resultado.insertAdjacentHTML('beforeend', '<div id="graficoInvestimentosemPesquisaeDesenvolvimento" class="grafico container-fluid justify-content-center" > País não possui dados </div>');

        resultado.insertAdjacentHTML('beforeend', '<div id="graficoGastosComEducacao" class="grafico container-fluid justify-content-center" > País não possui dados </div>'); 
       
    }
  
}

function verificaresultado(){
    var x = document.getElementById('resultado').childElementCount;
    document.getElementById("resultado").remove()
    var main = document.getElementById('main');
    main.insertAdjacentHTML('beforeend', '<div class="resultado h-auto justify-content-center" id="resultado"></div>')   
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
function verificarOrdemDadosPaises(){
    if(dadosJSON[0].series.length  == 2){
        if(paisEscolhido1.value == dadosJSON[0].series[0].pais["id"]){
            paisGrafico1 = paisEscolhido1.value;
            paisGrafico2 = paisEscolhido2.value;
        }else{
            paisGrafico1 = paisEscolhido2.value;
            paisGrafico2 = paisEscolhido1.value;
        }
    }
    else if(dadosJSON[1].series.length == 2){
        if(paisEscolhido1.value == dadosJSON[1].series[0].pais["id"]){
            paisGrafico1 = paisEscolhido1.value;
            paisGrafico2 = paisEscolhido2.value;
        }else{
            paisGrafico1 = paisEscolhido2.value;
            paisGrafico2 = paisEscolhido1.value;
        }
    }
    else if(dadosJSON[3].series.length == 2){
        if(paisEscolhido1.value == dadosJSON[2].series[0].pais["id"]){
            paisGrafico1 = paisEscolhido1.value;
            paisGrafico2 = paisEscolhido2.value;
        }else{
            paisGrafico1 = paisEscolhido2.value;
            paisGrafico2 = paisEscolhido1.value;
        }
    }else{
        paisGrafico1 = paisEscolhido2.value;
        paisGrafico2 = paisEscolhido1.value;
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
        paisGrafico1 = paisEscolhido1.value;
        if(dadosJSON[0].series.length != 0 ){
            dadosListaGastosComEducacao[0] = [tratandoDado(dadosJSON[0].series[0].serie[3][1995])];
            dadosListaGastosComEducacao[1] = [tratandoDado(dadosJSON[0].series[0].serie[6][2000])];
            dadosListaGastosComEducacao[2] = [tratandoDado(dadosJSON[0].series[0].serie[17][2005])];
            dadosListaGastosComEducacao[3] = [tratandoDado(dadosJSON[0].series[0].serie[28][2010])];
            dadosListaGastosComEducacao[4] = [tratandoDado(dadosJSON[0].series[0].serie[39][2015])];
            dadosListaGastosComEducacao[5] = [tratandoDado(dadosJSON[0].series[0].serie[48][2020])];
        }else{
            
            dadosListaGastosComEducacao[0] = [0];
            dadosListaGastosComEducacao[1] = [0];
            dadosListaGastosComEducacao[2] = [0];
            dadosListaGastosComEducacao[3] = [0];
            dadosListaGastosComEducacao[4] = [0];
            dadosListaGastosComEducacao[5] = [0];
        }

        if(dadosJSON[1].series.length != 0 ){
            dadosListaIPD[0] = [tratandoDado(dadosJSON[1].series[0].serie[3][1995])];
            dadosListaIPD[1] = [tratandoDado(dadosJSON[1].series[0].serie[6][2000])];
            dadosListaIPD[2] = [tratandoDado(dadosJSON[1].series[0].serie[17][2005])];
            dadosListaIPD[3] = [tratandoDado(dadosJSON[1].series[0].serie[28][2010])];
            dadosListaIPD[4] = [tratandoDado(dadosJSON[1].series[0].serie[39][2015])];
            dadosListaIPD[5] = [tratandoDado(dadosJSON[1].series[0].serie[48][2020])];
        }else{

            dadosListaIPD[0] = [0];
            dadosListaIPD[1] = [0];
            dadosListaIPD[2] = [0];
            dadosListaIPD[3] = [0];
            dadosListaIPD[4] = [0];
            dadosListaIPD[5] = [0];
        }

        if(dadosJSON[2].series.length != 0 ){
            dadosListaPIB[0] = [tratandoDado(dadosJSON[2].series[0].serie[3][1995])];
            dadosListaPIB[1] = [tratandoDado(dadosJSON[2].series[0].serie[6][2000])];
            dadosListaPIB[2] = [tratandoDado(dadosJSON[2].series[0].serie[17][2005])];
            dadosListaPIB[3] = [tratandoDado(dadosJSON[2].series[0].serie[28][2010])];
            dadosListaPIB[4] = [tratandoDado(dadosJSON[2].series[0].serie[39][2015])];
            dadosListaPIB[5] = [tratandoDado(dadosJSON[2].series[0].serie[48][2020])];
        }else{

            dadosListaPIB[0] = [0];
            dadosListaPIB[1] = [0];
            dadosListaPIB[2] = [0];
            dadosListaPIB[3] = [0];
            dadosListaPIB[4] = [0];
            dadosListaPIB[5] = [0];
        }
        xhttpAssincronoBandeira(bandeiraPais1, retornaNomeAbreviadoComparandoOCodeAlpha2(codePais1));
    }
    else if(controle == 2){
        verificarOrdemDadosPaises();
        if(dadosJSON[0].series.length == 2){
            dadosListaGastosComEducacao[0] = [tratandoDado(dadosJSON[0].series[0].serie[3][1995]),tratandoDado(dadosJSON[0].series[1].serie[3][1995])];
            dadosListaGastosComEducacao[1] = [tratandoDado(dadosJSON[0].series[0].serie[6][2000]), tratandoDado(dadosJSON[0].series[1].serie[6][2000])];
            dadosListaGastosComEducacao[2] = [tratandoDado(dadosJSON[0].series[0].serie[17][2005]),tratandoDado(dadosJSON[0].series[1].serie[17][2005])];
            dadosListaGastosComEducacao[3] = [tratandoDado(dadosJSON[0].series[0].serie[28][2010]),tratandoDado(dadosJSON[0].series[1].serie[28][2010])];
            dadosListaGastosComEducacao[4] = [tratandoDado(dadosJSON[0].series[0].serie[39][2015]),tratandoDado(dadosJSON[0].series[1].serie[39][2015])];
            dadosListaGastosComEducacao[5] = [tratandoDado(dadosJSON[0].series[0].serie[48][2020]),tratandoDado(dadosJSON[0].series[1].serie[48][2020])];
        }else if(dadosJSON[0].series.length == 1){
            if(dadosJSON[0].series[0] == null){
                dadosListaGastosComEducacao[0] = [0,tratandoDado(dadosJSON[0].series[1].serie[3][1995])];
                dadosListaGastosComEducacao[1] = [0,tratandoDado(dadosJSON[0].series[1].serie[6][2000])];
                dadosListaGastosComEducacao[2] = [0,tratandoDado(dadosJSON[0].series[1].serie[17][2005])];
                dadosListaGastosComEducacao[3] = [0,tratandoDado(dadosJSON[0].series[1].serie[28][2010])];
                dadosListaGastosComEducacao[4] = [0,tratandoDado(dadosJSON[0].series[1].serie[39][2015])];
                dadosListaGastosComEducacao[5] = [0,tratandoDado(dadosJSON[0].series[1].serie[48][2020])];
            }else if(dadosJSON[0].series[1] == null){
                dadosListaGastosComEducacao[0] = [tratandoDado(dadosJSON[0].series[1].serie[3][1995]), 0];
                dadosListaGastosComEducacao[1] = [tratandoDado(dadosJSON[0].series[1].serie[6][2000]), 0];
                dadosListaGastosComEducacao[2] = [tratandoDado(dadosJSON[0].series[1].serie[17][2005]), 0];
                dadosListaGastosComEducacao[3] = [tratandoDado(dadosJSON[0].series[1].serie[28][2010]), 0];
                dadosListaGastosComEducacao[4] = [tratandoDado(dadosJSON[0].series[1].serie[39][2015]), 0];
                dadosListaGastosComEducacao[5] = [tratandoDado(dadosJSON[0].series[1].serie[48][2020]), 0];
            }
        }else{
            dadosListaGastosComEducacao[0] = [0, 0];
            dadosListaGastosComEducacao[1] = [0, 0];
            dadosListaGastosComEducacao[2] = [0, 0];
            dadosListaGastosComEducacao[3] = [0, 0];
            dadosListaGastosComEducacao[4] = [0, 0];
            dadosListaGastosComEducacao[5] = [0, 0];
        }

        if(dadosJSON[1].series.length == 2){
            dadosListaIPD[0] = [ tratandoDado(dadosJSON[1].series[0].serie[3][1995]), tratandoDado(dadosJSON[1].series[1].serie[3][1995])];
            dadosListaIPD[1] = [ tratandoDado(dadosJSON[1].series[0].serie[6][2000]), tratandoDado(dadosJSON[1].series[1].serie[6][2000])];
            dadosListaIPD[2] = [ tratandoDado(dadosJSON[1].series[0].serie[17][2005]), tratandoDado(dadosJSON[1].series[1].serie[17][2005])];
            dadosListaIPD[3] = [ tratandoDado(dadosJSON[1].series[0].serie[28][2010]), tratandoDado(dadosJSON[1].series[1].serie[28][2010])];
            dadosListaIPD[4] = [ tratandoDado(dadosJSON[1].series[0].serie[39][2015]), tratandoDado(dadosJSON[1].series[1].serie[39][2015])];
            dadosListaIPD[5] = [ tratandoDado(dadosJSON[1].series[0].serie[48][2020]), tratandoDado(dadosJSON[1].series[1].serie[48][2020])];
        }else if(dadosJSON[1].series.length == 1){
            if(dadosJSON[1].series[0] == null){
                dadosListaIPD[0] = [0,tratandoDado(dadosJSON[0].series[1].serie[3][1995])];
                dadosListaIPD[1] = [0,tratandoDado(dadosJSON[0].series[1].serie[6][2000])];
                dadosListaIPD[2] = [0,tratandoDado(dadosJSON[0].series[1].serie[17][2005])];
                dadosListaIPD[3] = [0,tratandoDado(dadosJSON[0].series[1].serie[28][2010])];
                dadosListaIPD[4] = [0,tratandoDado(dadosJSON[0].series[1].serie[39][2015])];
                dadosListaIPD[5] = [0,tratandoDado(dadosJSON[0].series[1].serie[48][2020])];
            }else if(dadosJSON[1].series[1] == null){
                dadosListaIPD[0] = [tratandoDado(dadosJSON[0].series[1].serie[3][1995]), 0];
                dadosListaIPD[1] = [tratandoDado(dadosJSON[0].series[1].serie[6][2000]), 0];
                dadosListaIPD[2] = [tratandoDado(dadosJSON[0].series[1].serie[17][2005]), 0];
                dadosListaIPD[3] = [tratandoDado(dadosJSON[0].series[1].serie[28][2010]), 0];
                dadosListaIPD[4] = [tratandoDado(dadosJSON[0].series[1].serie[39][2015]), 0];
                dadosListaIPD[5] = [tratandoDado(dadosJSON[0].series[1].serie[48][2020]), 0];
            }
        }else{
            dadosListaIPD[0] = [0, 0];
            dadosListaIPD[1] = [0, 0];
            dadosListaIPD[2] = [0, 0];
            dadosListaIPD[3] = [0, 0];
            dadosListaIPD[4] = [0, 0];
            dadosListaIPD[5] = [0, 0];
        }
        
        if(dadosJSON[2].series.length == 2){
            dadosListaPIB[0] = [ tratandoDado(dadosJSON[2].series[0].serie[3][1995]), tratandoDado(dadosJSON[2].series[1].serie[3][1995])];
            dadosListaPIB[1] = [ tratandoDado(dadosJSON[2].series[0].serie[6][2000]), tratandoDado(dadosJSON[2].series[1].serie[6][2000])];
            dadosListaPIB[2] = [ tratandoDado(dadosJSON[2].series[0].serie[17][2005]), tratandoDado(dadosJSON[2].series[1].serie[17][2005])];
            dadosListaPIB[3] = [ tratandoDado(dadosJSON[2].series[0].serie[28][2010]), tratandoDado(dadosJSON[2].series[1].serie[28][2010])];
            dadosListaPIB[4] = [ tratandoDado(dadosJSON[2].series[0].serie[39][2015]), tratandoDado(dadosJSON[2].series[1].serie[39][2015])];
            dadosListaPIB[5] = [ tratandoDado(dadosJSON[2].series[0].serie[48][2020]), tratandoDado(dadosJSON[2].series[1].serie[48][2020])];
        }else if(dadosJSON[2].series.length == 1){
            if(dadosJSON[2].series[0] == null){
                dadosListaPIB[0] = [0,tratandoDado(dadosJSON[0].series[1].serie[3][1995])];
                dadosListaPIB[1] = [0,tratandoDado(dadosJSON[0].series[1].serie[6][2000])];
                dadosListaPIB[2] = [0,tratandoDado(dadosJSON[0].series[1].serie[17][2005])];
                dadosListaPIB[3] = [0,tratandoDado(dadosJSON[0].series[1].serie[28][2010])];
                dadosListaPIB[4] = [0,tratandoDado(dadosJSON[0].series[1].serie[39][2015])];
                dadosListaPIB[5] = [0,tratandoDado(dadosJSON[0].series[1].serie[48][2020])];
            }else if(dadosJSON[2].series[1] == null){
                dadosListaPIB[0] = [tratandoDado(dadosJSON[0].series[1].serie[3][1995]), 0];
                dadosListaPIB[1] = [tratandoDado(dadosJSON[0].series[1].serie[6][2000]), 0];
                dadosListaPIB[2] = [tratandoDado(dadosJSON[0].series[1].serie[17][2005]), 0];
                dadosListaPIB[3] = [tratandoDado(dadosJSON[0].series[1].serie[28][2010]), 0];
                dadosListaPIB[4] = [tratandoDado(dadosJSON[0].series[1].serie[39][2015]), 0];
                dadosListaPIB[5] = [tratandoDado(dadosJSON[0].series[1].serie[48][2020]), 0];
            }
        }else{
            dadosListaPIB[0] = [0, 0];
            dadosListaPIB[1] = [0, 0];
            dadosListaPIB[2] = [0, 0];
            dadosListaPIB[3] = [0, 0];
            dadosListaPIB[4] = [0, 0];
            dadosListaPIB[5] = [0, 0];
        }
        xhttpAssincronoBandeira(bandeiraPais1, retornaNomeAbreviadoComparandoOCodeAlpha2(infoPais[1].id['ISO-3166-1-ALPHA-2']));
        xhttpAssincronoBandeira(bandeiraPais2, retornaNomeAbreviadoComparandoOCodeAlpha2(infoPais[0].id['ISO-3166-1-ALPHA-2']));
    }

    criarGrafico();
}
function criarGrafico(){

    google.charts.setOnLoadCallback(drawVisualizationIPD);
    google.charts.setOnLoadCallback(drawVisualizationGastosComEducacao);
    google.charts.setOnLoadCallback(drawVisualizationPIB);
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
    //Some raw data (not necessarily accurate)
    var data;
    if(controle == 1){
        data = google.visualization.arrayToDataTable([
            ['Ano', paisGrafico1],
            ["1995", dadosListaGastosComEducacao[0][0]],
            ["2000", dadosListaGastosComEducacao[1][0]],
            ["2005", dadosListaGastosComEducacao[2][0]],
            ["2010", dadosListaGastosComEducacao[3][0]],
            ["2015", dadosListaGastosComEducacao[4][0]],
            ["2020", dadosListaGastosComEducacao[5][0]]
        ]);
    }
    else if(controle == 2){
        data = google.visualization.arrayToDataTable([
            ['Ano', paisGrafico1, paisGrafico2],
            ["1995", dadosListaGastosComEducacao[0][0] , dadosListaGastosComEducacao[0][1]],
            ["2000", dadosListaGastosComEducacao[1][0] , dadosListaGastosComEducacao[1][1]],
            ["2005", dadosListaGastosComEducacao[2][0] , dadosListaGastosComEducacao[2][1]],
            ["2010", dadosListaGastosComEducacao[3][0] , dadosListaGastosComEducacao[3][1]],
            ["2015", dadosListaGastosComEducacao[4][0] , dadosListaGastosComEducacao[4][1]],
            ["2020", dadosListaGastosComEducacao[5][0] , dadosListaGastosComEducacao[5][1]]
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
            ["1995", dadosListaIPD[0][0]],
            ["2000", dadosListaIPD[1][0]],
            ["2005", dadosListaIPD[2][0]],
            ["2010", dadosListaIPD[3][0]],
            ["2015", dadosListaIPD[4][0]],
            ["2020", dadosListaIPD[5][0]]
        ]);
    }
    else if(controle == 2){
        data = google.visualization.arrayToDataTable([
            ['Ano', paisGrafico1, paisGrafico2],
            ["1995", dadosListaIPD[0][0], dadosListaIPD[0][1]],
            ["2000", dadosListaIPD[1][0], dadosListaIPD[1][1]],
            ["2005", dadosListaIPD[2][0], dadosListaIPD[2][1]],
            ["2010", dadosListaIPD[3][0], dadosListaIPD[3][1]],
            ["2015", dadosListaIPD[4][0], dadosListaIPD[4][1]],
            ["2020", dadosListaIPD[5][0], dadosListaIPD[5][1]]
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
            ["1995", dadosListaPIB[0][0]],
            ["2000", dadosListaPIB[1][0]],
            ["2005", dadosListaPIB[2][0]],
            ["2010", dadosListaPIB[3][0]],
            ["2015", dadosListaPIB[4][0]],
            ["2020", dadosListaPIB[5][0]]
        ]);
    }
    else if(controle == 2){
        data = google.visualization.arrayToDataTable([
            ['Ano', paisGrafico1, paisGrafico2],
            ["1995", dadosListaPIB[0][0], dadosListaPIB[0][1]],

            
            ["2000", dadosListaPIB[1][0], dadosListaPIB[1][1]],
            ["2005", dadosListaPIB[2][0], dadosListaPIB[
                2][1]],
            ["2010", dadosListaPIB[3][0], dadosListaPIB[3][1]],
            ["2015", dadosListaPIB[4][0], dadosListaPIB[4][1]],
            ["2020", dadosListaPIB[5][0], dadosListaPIB[5][1]]
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

