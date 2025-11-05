// === SELETORES ===
const loadingScreen = document.getElementById("loadingScreen");
const loginScreen = document.getElementById("loginScreen");
const adminPanel = document.getElementById("adminPanel");
const site = document.getElementById("site");

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

const loginNome = document.getElementById("loginNome");
const loginSenha = document.getElementById("loginSenha");
const btnLogin = document.getElementById("btnLogin");

const tituloSite = document.getElementById("tituloSite");
const descricaoSite = document.getElementById("descricaoSite");
const contador = document.getElementById("contador");
const memoriaGrid = document.getElementById("memoriaGrid");
const galeria = document.getElementById("galeria");
const cartasSalvas = document.getElementById("cartasSalvas");

const tabs = document.querySelectorAll(".tab");
const menuBtns = document.querySelectorAll(".menu-btn");
const qrcodeDivs = document.querySelectorAll("#qrcode");

// === VARIÁVEIS ===
let fotosMemoria = [];
let cartasData = [];
let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let visitante = JSON.parse(localStorage.getItem("visitante")) || {nome:"", senha:""};

// === LOADING ===
window.addEventListener("load", ()=>{
    setTimeout(()=>{
        loadingScreen.style.display = "none";
        loginScreen.style.display = "block";
    },1000);
});

// === LOGIN ===
btnLogin.addEventListener("click", ()=>{
    const nome = loginNome.value.trim();
    const senha = loginSenha.value.trim();

    if(nome === "mateussxl7" && senha === "887766"){
        loginScreen.style.display = "none";
        adminPanel.style.display = "block";
        carregarAdmin();
        return;
    }

    if(nome === visitante.nome && senha === visitante.senha){
        loginScreen.style.display = "none";
        site.style.display = "flex";
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

    mostrarGaleriaAdmin();
    mostrarCartasAdmin();
}

// === CARREGAR SITE VISITANTE ===
function carregarSite(){
    const config = JSON.parse(localStorage.getItem("configAmor")) || {};
    tituloSite.textContent = config.titulo || "Nosso Amor 💘";
    descricaoSite.textContent = config.descricao || "Cada segundo ao seu lado é um pedaço de eternidade 💖";
    document.body.style.background = `linear-gradient(135deg, ${config.cor || "#ff9eb5"}, #ffd1a9)`;

    fotosMemoria = JSON.parse(localStorage.getItem("fotosAmor")) || [];
    cartasData = JSON.parse(localStorage.getItem("cartasAmor")) || [];

    mostrarGaleriaVisitante();
    mostrarCartasVisitante();
    iniciarJogo();

    if(config.data) contadorTempo(config.data);
}

// === ABAS ===
menuBtns.forEach(btn=>{
    btn.addEventListener("click", ()=>{
        const alvo = btn.getAttribute("data-tab");
        tabs.forEach(tab=>tab.classList.remove("active"));
        document.getElementById(alvo).classList.add("active");
    });
});

// === CONFIGURAÇÕES ADMIN ===
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
            mostrarGaleriaAdmin();
        };
        reader.readAsDataURL(file);
    }
});

salvarFotosAdmin.addEventListener("click", ()=>{
    localStorage.setItem("fotosAmor", JSON.stringify(fotosMemoria));
    alert("Fotos salvas 💞");
});

function mostrarGaleriaAdmin(){
    const container = document.createElement("div");
    container.id = "galeriaAdmin";
    container.innerHTML = "";
    fotosMemoria.forEach(src=>{
        const img = document.createElement("img");
        img.src = src;
        img.style.width="100px";
        img.style.margin="5px";
        container.appendChild(img);
    });
    if(!document.getElementById("galeriaAdmin")) adminPanel.appendChild(container);
}

function mostrarGaleriaVisitante(){
    galeria.innerHTML = "";
    fotosMemoria.forEach(src=>{
        const img = document.createElement("img");
        img.src = src;
        galeria.appendChild(img);
    });
}

// === CARTAS ADMIN ===
salvarCartaAdmin.addEventListener("click", ()=>{
    const texto = addCartaInput.value.trim();
    if(!texto) return alert("Escreva algo 💌");
    cartasData.push({texto, data:new Date().toLocaleDateString("pt-BR")});
    localStorage.setItem("cartasAmor", JSON.stringify(cartasData));
    mostrarCartasAdmin();
    addCartaInput.value = "";
});

function mostrarCartasAdmin(){
    const container = document.getElementById("cartasAdmin") || document.createElement("div");
    container.id="cartasAdmin";
    container.innerHTML="";
    cartasData.forEach(carta=>{
        const div = document.createElement("div");
        div.classList.add("cartaItem");
        div.innerHTML=`<p>${carta.texto}</p><small>💘 ${carta.data}</small>`;
        container.appendChild(div);
    });
    if(!document.getElementById("cartasAdmin")) adminPanel.appendChild(container);
}

function mostrarCartasVisitante(){
    cartasSalvas.innerHTML="";
    cartasData.forEach(carta=>{
        const div=document.createElement("div");
        div.classList.add("cartaItem");
        div.innerHTML=`<p>${carta.texto}</p><small>💘 ${carta.data}</small>`;
        cartasSalvas.appendChild(div);
    });
}

// === LOGIN VISITANTE ===
definirVisitante.addEventListener("click", ()=>{
    const nome = document.getElementById("visitanteNome").value.trim();
    const senha = document.getElementById("visitanteSenha").value.trim();
    if(!nome||!senha) return alert("Preencha ambos os campos");
    visitante = {nome, senha};
    localStorage.setItem("visitante", JSON.stringify(visitante));
    alert("Login visitante definido 💖");
});

// === JOGO DA MEMÓRIA ===
function iniciarJogo(){
    memoriaGrid.innerHTML="";
    if(fotosMemoria.length<3){
        memoriaGrid.innerHTML="<p>Adicione 3 fotos no admin para jogar 💕</p>";
        return;
    }

    const fotosJogo = fotosMemoria.slice(0,3);
    let imagensDuplicadas = [...fotosJogo, ...fotosJogo];
    imagensDuplicadas.sort(()=>Math.random()-0.5);

    imagensDuplicadas.forEach(src=>{
        const carta = document.createElement("div");
        carta.classList.add("carta");
        const img = document.createElement("img");
        img.src = src;
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

        if(primeiraCarta.querySelector("img").src===segundaCarta.querySelector("img").src){
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
    function atualizar(){
        const inicio=new Date(dataInicio);
        const agora=new Date();
        const diff=agora-inicio;
        const dias=Math.floor(diff/(1000*60*60*24));
        const horas=Math.floor((diff/(1000*60*60))%24);
        const minutos=Math.floor((diff/(1000*60))%60);
        contador.textContent=`${dias} dias, ${horas}h e ${minutos}min juntos 💕`;
    }
    atualizar();
    setInterval(atualizar,60000);
}

// === QR CODE ===
gerarQRAdmin.addEventListener("click", ()=>{
    qrcodeDivs.forEach(div=>div.innerHTML="");
    const url=window.location.href.split("?")[0]+"?view=interativa";
    qrcodeDivs.forEach(div=>{
        new QRCode(div,{text:url,width:200,height:200,colorDark:"#ff5f8f",colorLight:"#fff"});
    });
    alert("QR Code gerado 💖");
});

// === PDF ===
exportPDFAdmin.addEventListener("click", ()=>{
    const doc = new jspdf.jsPDF();
    doc.setFontSize(16);
    doc.text(tituloInput.value||"Nosso Amor 💘",20,20);
    doc.setFontSize(12);
    doc.text(descricaoInput.value||"Cada momento é eterno 💖",20,30);
    doc.text("Cartas 💌:",20,40);
    cartasData.forEach((carta,i)=>doc.text(`${i+1}. ${carta.texto}`,25,50+i*10));
    doc.save("nosso_amor.pdf");
});
