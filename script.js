// === SELETORES PRINCIPAIS ===
const loadingScreen = document.getElementById("loadingScreen");
const loginScreen = document.getElementById("loginScreen");
const adminPanel = document.getElementById("adminPanel");
const site = document.getElementById("site");

// --- Inputs Admin ---
const tituloInput = document.getElementById("tituloInput");
const descricaoInput = document.getElementById("descricaoInput");
const corInput = document.getElementById("corInput");
const dataInicioInput = document.getElementById("dataInicio");
const addFotoAdmin = document.getElementById("addFotoAdmin");
const salvarFotosAdmin = document.getElementById("salvarFotosAdmin");
const addCartaInput = document.getElementById("addCartaInput");
const salvarCartaAdmin = document.getElementById("salvarCartaAdmin");
const definirVisitante = document.getElementById("definirVisitante");
const gerarQRAdmin = document.getElementById("gerarQRAdmin");
const exportPDFAdmin = document.getElementById("exportPDFAdmin");

// --- Login ---
const loginNome = document.getElementById("loginNome");
const loginSenha = document.getElementById("loginSenha");
const btnLogin = document.getElementById("btnLogin");

// --- Visitante ---
const tituloSite = document.getElementById("tituloSite");
const descricaoSite = document.getElementById("descricaoSite");
const contador = document.getElementById("contador");
const memoriaGrid = document.getElementById("memoriaGrid");
const galeria = document.getElementById("galeria");
const cartasSalvas = document.getElementById("cartasSalvas");
const qrcodeDiv = document.getElementById("qrcode");

// --- Abas ---
const tabs = document.querySelectorAll(".tab");
const menuBtns = document.querySelectorAll(".menu-btn");

// --- VARIÁVEIS ---
let fotosMemoria = [];
let cartasData = [];
let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let visitante = JSON.parse(localStorage.getItem("visitante")) || {nome:"", senha:""};

// === LOADING ===
window.addEventListener("load", ()=>{
    setTimeout(()=>{
        loadingScreen.style.display="none";
        loginScreen.style.display="block";
    },1000);
});

// === LOGIN ===
btnLogin.addEventListener("click", ()=>{
    const nome = loginNome.value.trim();
    const senha = loginSenha.value.trim();

    if(nome==="mateussxl7" && senha==="887766"){
        loginScreen.style.display="none";
        adminPanel.style.display="block";
        carregarAdmin();
        return;
    }

    if(nome===visitante.nome && senha===visitante.senha){
        loginScreen.style.display="none";
        site.style.display="flex";
        carregarSite();
        return;
    }

    alert("Login inválido 💔");
});

// === CARREGAR ADMIN ===
function carregarAdmin(){
    const config = JSON.parse(localStorage.getItem("configAmor")) || {};
    tituloInput.value = config.titulo || "";
    descricaoInput.value = config.descricao || "";
    corInput.value = config.cor || "#ff5f8f";
    dataInicioInput.value = config.data || "";

    fotosMemoria = JSON.parse(localStorage.getItem("fotosAmor")) || [];
    cartasData = JSON.parse(localStorage.getItem("cartasAmor")) || [];
    mostrarGaleria();
    mostrarCartas();
}

// === CARREGAR SITE VISITANTE ===
function carregarSite(){
    const config = JSON.parse(localStorage.getItem("configAmor")) || {};
    tituloSite.textContent = config.titulo || "Nosso Amor 💘";
    descricaoSite.textContent = config.descricao || "Cada segundo ao seu lado é eterno 💖";
    document.body.style.background = `linear-gradient(135deg, ${config.cor || "#ff9eb5"}, #ffd1a9)`;

    fotosMemoria = JSON.parse(localStorage.getItem("fotosAmor")) || [];
    cartasData = JSON.parse(localStorage.getItem("cartasAmor")) || [];
    mostrarGaleria();
    mostrarCartas();
    iniciarJogo();
    if(config.data) contadorTempo(config.data);
}

// === ABAS ===
menuBtns.forEach(btn=>{
    btn.addEventListener("click", ()=>{
        const alvo = btn.getAttribute("data-tab");
        tabs.forEach(tab => tab.classList.remove("active"));
        document.getElementById(alvo).classList.add("active");
    });
});

// === SALVAR CONFIG ADMIN ===
document.getElementById("salvarConfigAdmin").addEventListener("click", ()=>{
    const config = {
        titulo: tituloInput.value,
        descricao: descricaoInput.value,
        cor: corInput.value,
        data: dataInicioInput.value
    };
    localStorage.setItem("configAmor", JSON.stringify(config));
    alert("Configurações salvas 💖");
});

// === GALERIA ADMIN ===
addFotoAdmin.addEventListener("change", e=>{
    const files = e.target.files;
    for(let file of files){
        const reader = new FileReader();
        reader.onload = evt=>{
            fotosMemoria.push(evt.target.result);
            mostrarGaleria();
        };
        reader.readAsDataURL(file);
    }
});

salvarFotosAdmin.addEventListener("click", ()=>{
    localStorage.setItem("fotosAmor", JSON.stringify(fotosMemoria));
    alert("Fotos salvas com sucesso 💞");
});

// === CARTAS ADMIN ===
salvarCartaAdmin.addEventListener("click", ()=>{
    const texto = addCartaInput.value.trim();
    if(!texto) return alert("Escreva algo 💌");
    cartasData.push({texto, data: new Date().toLocaleDateString("pt-BR")});
    localStorage.setItem("cartasAmor", JSON.stringify(cartasData));
    mostrarCartas();
    addCartaInput.value="";
});

// === DEFINIR LOGIN VISITANTE ===
definirVisitante.addEventListener("click", ()=>{
    const nome = document.getElementById("visitanteNome").value.trim();
    const senha = document.getElementById("visitanteSenha").value.trim();
    if(!nome || !senha) return alert("Preencha ambos os campos");
    visitante = {nome, senha};
    localStorage.setItem("visitante", JSON.stringify(visitante));
    alert("Login visitante definido 💖");
});

// === MOSTRAR GALERIA ===
function mostrarGaleria(){
    galeria.innerHTML="";
    fotosMemoria.forEach(src=>{
        const img = document.createElement("img");
        img.src = src;
        galeria.appendChild(img);
    });
}

// === MOSTRAR CARTAS ===
function mostrarCartas(){
    cartasSalvas.innerHTML="";
    cartasData.forEach(carta=>{
        const div = document.createElement("div");
        div.classList.add("cartaItem");
        div.innerHTML = `<p>${carta.texto}</p><small>💘 ${carta.data}</small>`;
        cartasSalvas.appendChild(div);
    });
}

// === JOGO DA MEMÓRIA ===
function iniciarJogo(){
    memoriaGrid.innerHTML="";
    if(fotosMemoria.length<2){
        memoriaGrid.innerHTML="<p>Adicione pelo menos 2 fotos 💕</p>";
        return;
    }

    let imagensDuplicadas = [...fotosMemoria,...fotosMemoria];
    imagensDuplicadas = imagensDuplicadas.sort(()=>Math.random()-0.5);

    imagensDuplicadas.forEach(src=>{
        const carta = document.createElement("div");
        carta.classList.add("carta");
        const img = document.createElement("img");
        img.src=src;
        carta.appendChild(img);
        carta.addEventListener("click", ()=>virarCarta(carta));
        memoriaGrid.appendChild(carta);
    });
}

function virarCarta(carta){
    if(bloqueado || carta.classList.contains("virada")) return;
    carta.classList.add("virada");

    if(!primeiraCarta) primeiraCarta=carta;
    else{
        segundaCarta=carta;
        bloqueado=true;

        if(primeiraCarta.querySelector("img").src === segundaCarta.querySelector("img").src){
            primeiraCarta=null;
            segundaCarta=null;
            bloqueado=false;
        } else{
            setTimeout(()=>{
                primeiraCarta.classList.remove("virada");
                segundaCarta.classList.remove("virada");
                primeiraCarta=null;
                segundaCarta=null;
                bloqueado=false;
            },1000);
        }
    }
}

// === CONTADOR ===
function contadorTempo(dataInicio){
    function atualizarContador(){
        const inicio = new Date(dataInicio);
        const agora = new Date();
        const diff = agora - inicio;
        const dias = Math.floor(diff/(1000*60*60*24));
        const horas = Math.floor((diff/(1000*60*60))%24);
        const minutos = Math.floor((diff/(1000*60))%60);
        contador.textContent = `${dias} dias, ${horas}h e ${minutos}min juntos 💕`;
    }
    atualizarContador();
    setInterval(atualizarContador,60000);
}

// === QR CODE ADMIN ===
gerarQRAdmin.addEventListener("click", ()=>{
    qrcodeDiv.innerHTML="";
    const url = window.location.href.split("?")[0];
    new QRCode(qrcodeDiv,{
        text: url,
        width:200,
        height:200,
        colorDark:"#ff5f8f",
        colorLight:"#fff"
    });
    alert("QR Code gerado! 💕");
});

// === EXPORTAR PDF ADMIN ===
exportPDFAdmin.addEventListener("click", ()=>{
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(tituloInput.value||"Nosso Amor 💘",20,20);
    doc.setFontSize(16);
    doc.text(descricaoInput.value||"Cada momento é eterno 💖",20,30);
    doc.save("nosso_amor.pdf");
});
