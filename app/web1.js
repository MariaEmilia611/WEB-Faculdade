var url = 'http://10.11.10.43/web1/public/produtos'

function mostraDados() {

   $.get(url, function(produtos) {
      $('#tb_produtos tbody').remove(linha);
      var linha = ''
      for(var i = 0; i< produtos.length; i++) {
         linha = '<tr>'
         linha += '<td>' + produtos(i).id + '</td>'
         linha += '<td>' + produtos(i).nome + '</td>'
         linha += '<td>' + produtos(i).valor + '</td>'
         linha += '<button class="btn btn-warning btn-sm">Alterar</button>'
         linha += ''
         linha += '</tr>'

         $('#tb_produtos tbody').append(linha);
      }

   });


}

function alterar(id) {
   alert(id)
}

function excluir(id) {
   alert(id)
}