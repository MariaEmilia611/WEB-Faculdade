var url = 'http://200.144.254.118:8000/produtos'

var idProduto = 0;

$(document).ready(function () {
    mostraDados()
})

function mostraDados() {
    $.get(url, function (produtos) {
        $('#tb_produtos tbody tr').remove();

        var linha = ''
        for (var i = 0; i < produtos.length; i++) {
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

function novoProduto() {
    idProduto = 0;
    $('#nome').val('');
    $('#valor').val('');
    $('#dlgProdutos').modal('show');
}

function salvar() {
    if (idProduto == 0) {
        criarProduto();
    } else {
        alterarProduto();
    }
}

function criarProduto() {
    var produto = {
        nome: $('#nome').val(),
        valor: $('#valor').val()
    }

    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(produto),
        success: function (response) {
            mostraDados();
            $('#dlgProdutos').modal('hide');
            $('#msgSucesso').text('Registro Incluído com Sucesso.');
            $('#dlgSucesso').modal('show');
        },
        error: function (erro) {
            console.log(erro);
            alert('Ocorreu um erro ao salvar o produto.');
        }
    });
}

function alterar(id) {
    idProduto = id;
    $.get(url + '/' + id, function (produto) {
        $('#nome').val(produto.nome);
        $('#valor').val(produto.valor);
        $('#dlgProdutos').modal('show');
    });
}

function alterarProduto() {
    var produto = {
        id: idProduto,
        nome: $('#nome').val(),
        valor: $('#valor').val()
    }

    $.ajax({
        type: "PUT",
        url: url + '/' + produto.id,
        contentType: 'application/json',
        data: JSON.stringify(produto),
        success: function (response) {
            mostraDados();
            $('#dlgProdutos').modal('hide');
            $('#msgSucesso').text('Registro Alterado com Sucesso.');
            $('#dlgSucesso').modal('show');
        },
        error: function (erro) {
            console.log(erro);
            alert('Ocorreu um erro ao alterar o produto.');
        }
    });
}

function excluir(id) {
    idProduto = id;
    $('#dlgExcluir').modal('show');
}

function confirmarExclusao() {
    $.ajax({
        type: "DELETE",
        url: url + '/' + idProduto,
        success: function (response) {
            mostraDados();
            $('#dlgExcluir').modal('hide');
            $('#msgSucesso').text('Registro Excluído com Sucesso.');
            $('#dlgSucesso').modal('show');
        },
        error: function (erro) {
            console.log(erro);
            alert('Ocorreu um erro ao excluir o produto.');
            $('#dlgExcluir').modal('hide');
        }
    });
}