function xhttpAssincrono(callBackFunction, type, value) {
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
            url += value;
            break;
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

function requisicaoJson(){
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
    let codeAlpha2Encontrado;
    listaPaises.forEach(pais => {
        if (nomeAbreviado == pais.nomeAbreviado) {
            codeAlpha2Encontrado = pais.codeAlpha2;
        }        
    });
    return codeAlpha2Encontrado;
}

$(".buscar").click(function(){
    buscar();
});
var opcaoEscolhida
function buscar(){
    opcaoEscolhida = document.getElementsByClassName('opcao_escolhida')
    paisEscolhido = document.getElementsByClassName('escolhaPais')

    printConsole(opcaoEscolhida, paisEscolhido);

}

function printConsole(value){
    console.log(value);
}