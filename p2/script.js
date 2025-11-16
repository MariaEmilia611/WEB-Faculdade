document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://200.144.254.118:8000/produtos";
    const PLACEHOLDER_IMG = "https://via.placeholder.com/300x200.png?text=Produto+sem+imagem";

    
    const PRODUCT_IMAGE_MAP = {
        "feijao": "images/feijao.png", 
        "tomate": "images/tomate.jpeg",
        "ovo": "images/ovo.jpeg",
        "farinha": "images/farinha.jpg",
        "leite": "images/leite.jpeg",
        "macarrao": "images/macarrao.jpg",
        "batata": "images/batata.jpg",
        "cebola roxa": "images/cebola_roxa.jpeg",
    };

    function getProductImage(productName) {
        const normalizedName = productName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""); // Remove acentos
        return PRODUCT_IMAGE_MAP[normalizedName] || PLACEHOLDER_IMG;
    }

    const viewHome = document.getElementById("viewHome");
    const viewCadastro = document.getElementById("viewCadastro");
    const navHome = document.getElementById("navHome");
    const navCadastro = document.getElementById("navCadastro");
    const productGrid = document.getElementById("productGrid");
    const form = document.getElementById("productForm");
    const formTitle = document.getElementById("formTitle");
    
    const produtoIdInput = document.getElementById("produtoId");
    const nomeInput = document.getElementById("nome");
    const valorInput = document.getElementById("valor");

    const btnNovoProduto = document.getElementById("btnNovoProduto");
    const btnCancelar = document.getElementById("btnCancelar");
    const btnProcurar = document.getElementById("btnProcurar");
    const btnLimpar = document.getElementById("btnLimpar");
    const searchInput = document.getElementById("searchNome");

    function showView(view) {
        viewHome.classList.add("hidden");
        viewCadastro.classList.add("hidden");
        
        if (view === "home") {
            viewHome.classList.remove("hidden");
            navHome.classList.add("active");
            navCadastro.classList.remove("active");
        } else {
            viewCadastro.classList.remove("hidden");
            navHome.classList.remove("active");
            navCadastro.classList.add("active");
        }
    }

    navHome.addEventListener("click", () => showView("home"));
    navCadastro.addEventListener("click", () => {
        formTitle.textContent = "Novo Produto"; 
        form.reset();
        produtoIdInput.value = "";
        showView("cadastro");
    });
    btnNovoProduto.addEventListener("click", () => {
        formTitle.textContent = "Novo Produto";
        form.reset();
        produtoIdInput.value = "";
        showView("cadastro");
    });
    btnCancelar.addEventListener("click", () => showView("home"));


    async function fetchProdutos(searchTerm = "") {
        let url = API_URL;
        if (searchTerm) {
            url += `?nome_like=${encodeURIComponent(searchTerm)}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Erro ao buscar produtos");
            const produtos = await response.json();
            renderGrid(produtos);
        } catch (error) {
            console.error("Falha ao carregar produtos:", error);
            alert("Não foi possível carregar os produtos.");
        }
    }

    function renderGrid(produtos) {
        productGrid.innerHTML = "";
        if (produtos.length === 0) {
            productGrid.innerHTML = '<p>Nenhum produto encontrado.</p>';
            return;
        }

        produtos.forEach(produto => {
            const card = document.createElement("div");
            card.className = "product-card";

            const imgUrl = getProductImage(produto.nome);

            card.innerHTML = `
                <img src="${imgUrl}" alt="${produto.nome}">
                <div class="product-card-body">
                    <h3>${produto.nome}</h3>
                    <p>R$ ${Number(produto.valor).toFixed(2)}</p>
                </div>
                <div class="product-card-actions">
                    <button class="btn-edit" data-id="${produto.id}">Editar</button>
                    <button class="btn-danger" data-id="${produto.id}">Apagar</button>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    async function handleSave(event) {
        event.preventDefault();

        const id = produtoIdInput.value;
        const produto = {
            nome: nomeInput.value,
            valor: parseFloat(valorInput.value),
        };

        const isUpdating = id;
        const url = isUpdating ? `${API_URL}/${id}` : API_URL;
        const method = isUpdating ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(produto)
            });

            if (!response.ok) throw new Error("Erro ao salvar produto");

            alert("Produto salvo com sucesso!");
            form.reset();
            showView("home");
            fetchProdutos();
        } catch (error) {
            console.error("Falha ao salvar:", error);
            alert("Não foi possível salvar o produto.");
        }
    }

    async function handleEdit(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error("Erro ao buscar dados do produto");
            const produto = await response.json();

            formTitle.textContent = "Alterar Produto";
            produtoIdInput.value = produto.id;
            nomeInput.value = produto.nome;
            valorInput.value = produto.valor;
            
            showView("cadastro");
        } catch (error) {
            console.error("Falha ao editar:", error);
            alert("Não foi possível carregar dados para edição.");
        }
    }

    async function handleDelete(id) {
        if (!confirm("Tem certeza que deseja excluir este produto?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Erro ao excluir produto");

            alert("Produto excluído com sucesso!");
            fetchProdutos();
        } catch (error) {
            console.error("Falha ao excluir:", error);
            alert("Não foi possível excluir o produto.");
        }
    }

    
    btnProcurar.addEventListener("click", () => fetchProdutos(searchInput.value));
    btnLimpar.addEventListener("click", () => {
        searchInput.value = "";
        fetchProdutos();
    });

    form.addEventListener("submit", handleSave);

    productGrid.addEventListener("click", (event) => {
        const target = event.target;
        const id = target.dataset.id;

        if (target.classList.contains("btn-edit")) {
            handleEdit(id);
        } else if (target.classList.contains("btn-danger")) {
            handleDelete(id);
        }
    });

    fetchProdutos();
});