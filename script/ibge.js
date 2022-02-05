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
            url += "BR/";
            break;
        // case 3:
        //     url += "todos?userId=" + value;
        //     break;
        // case 4:
        //     url += "comments?postId=" + value;
        //     break;
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

function requisicaoJson(){
    xhttpAssincrono(printConsole,1,)
}
var listaJson;
var dataList = document.getElementById('lista_paises')
var add_option;
var trem = [];
function printConsole(value){
    listaJson = JSON.parse(value);
    for (let i = 0; i < listaJson.length; i++) {    
        var nome = listaJson[i].nome["abreviado"];
        trem.push(nome);
    }
    trem.sort();
    for (let i = 0; i < trem.length; i++) {
        add_option = new Option
        add_option.value = trem[i];
        add_option.innerHTML = trem[i];
        dataList.appendChild(add_option);
        // console.log(trem[i]);
    }
    // console.log(listaJson);
}