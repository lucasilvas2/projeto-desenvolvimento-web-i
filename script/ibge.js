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
            url += value1 + "/indicadores";
            break;
        case 3:
            url += value1 + "|" + value2 + "/indicadores/";
            break;
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

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


function buscarDados(){
    var opcaoEscolhida;
    var paisEscolhido1;
    opcaoEscolhida = document.getElementsByName('opcao_escolhida');
    paisEscolhido1 = document.getElementById('escolhaPais1');
    paisEscolhido2 = document.getElementById('escolhaPais2');
    var codePais1;
    var codePais2;
    var controle;
    if (opcaoEscolhida[0].checked == true) {
        printConsole(  paisEscolhido1.value);
        codePais1 = retornaCodeAlpha2ComparandoONomeAbreviado(paisEscolhido1.value)
        controle = 1;
        xhttpAssincrono(printConsole, 2, codePais1);
    }
    else{
        
        codePais1 = retornaCodeAlpha2ComparandoONomeAbreviado(paisEscolhido1.value);
        codePais2 = retornaCodeAlpha2ComparandoONomeAbreviado(paisEscolhido2.value);
        printConsole(  paisEscolhido1.value, paisEscolhido2.value);
        printConsole(  codePais1, codePais2);
        controle = 2;
        xhttpAssincrono(printConsole, 3, codePais1, codePais2);
    }
    alertaEscolha(controle, paisEscolhido1.value, paisEscolhido2.value);

}

function alertaEscolha(controle, pais1, pais2){
    if (controle == 1) {
        if (pais1 == "") {
            window.alert("Preencha todos os campos!");
        }
    } else {
        if (pais1 == ""|| pais2 == "" || pais1 == "" && pais2 == "") {
            window.alert("Preencha todos os campos!");
        }
    }
}
function printConsole(value1){
    console.log(value1);
}

function printConsole(value1, value2){
    console.log(value1 + " - " + value2);
}