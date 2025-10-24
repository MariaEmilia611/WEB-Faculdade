var url = 'http://200.144.254.118:8000/produtos'

$(document).ready(function() {
    mostraDados()
})

function mostraDados(){
    $.get(url, function(produtos){
        $('#tb_produtos tbody tr').remove();

        var linha = ''
        for(var i = 0; i < produtos.length; i++){
            linha = '<tr>'
            linha += '<td>' + produtos[i].id + '</td>'
            linha += '<td>' + produtos[i].nome + '</td>'
            linha += '<td>' + produtos[i].valor + '</td>'
            linha += '<td><button onclick="alterar(' + produtos[i].id + ')" class="btn btn-warning btn-sm">Alterar</button></td>'
            linha += '<td><button onclick="excluir(' + produtos[i].id + ')" class="btn btn-danger btn-sm">Excluir</button></td>'
            linha += '</tr>'

            $('#tb_produtos tbody').append(linha);
        }
    });
}

function alterar(id){
    alert('ALTERAR: ' + id)
}

function excluir(id){
    alert('EXCLUIR:' + id)
}