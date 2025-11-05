// === SELETORES PRINCIPAIS ===
const loadingScreen = document.getElementById("loadingScreen");
const loginScreen = document.getElementById("loginScreen");
const adminPanel = document.getElementById("adminPanel");
const site = document.getElementById("site");

// Login Inputs
const loginNome = document.getElementById("loginNome");
const loginSenha = document.getElementById("loginSenha");
const btnLogin = document.getElementById("btnLogin");

// Admin Inputs
const tituloInput = document.getElementById("tituloInput");
const descricaoInput = document.getElementById("descricaoInput");
const corInput = document.getElementById("corInput");
const dataInicio = document.getElementById("dataInicio");

const addFotoAdmin = document.getElementById("addFotoAdmin");
const salvarFotosAdmin = document.getElementById("salvarFotosAdmin");

const addCartaInput = document.getElementById("addCartaInput");
const salvarCartaAdmin = document.getElementById("salvarCartaAdmin");

const visitanteNome = document.getElementById("visitanteNome");
const visitanteSenha = document.getElementById("visitanteSenha");
const definirVisitante = document.getElementById("definirVisitante");

const gerarQRAdmin = document.getElementById("gerarQRAdmin");
const exportPDFAdmin = document.getElementById("exportPDFAdmin");

const memoriaGrid = document.getElementById("memoriaGrid");
const galeria = document.getElementById("galeria");
const cartasSalvas = document.getElementById("cartasSalvas");

// Menu Tabs
const menuBtns = document.querySelectorAll(".menu-btn");
const tabs = document.querySelectorAll(".tab");

// === LOADING ===
window.addEventListener("load", () => {
  setTimeout(() => {
    loadingScreen.style.display = "none";
    loginScreen.style.display = "flex";
    carregarConfigs();
  }, 1200);
});

// === LOGIN ===
btnLogin.addEventListener("click", () => {
  const nome = loginNome.value;
  const senha = loginSenha.value;

  const admin = JSON.parse(localStorage.getItem("adminLogin")) || {nome:"mateussxl7", senha:"887766"};
  const visitante = JSON.parse(localStorage.getItem("visitanteLogin"));

  if(nome === admin.nome && senha === admin.senha){
    loginScreen.style.display = "none";
    adminPanel.style.display = "flex";
    carregarConfigs();
  } else if(visitante && nome === visitante.nome && senha === visitante.senha){
    loginScreen.style.display = "none";
    site.style.display = "flex";
    aplicarConfigsVisitante();
  } else {
    alert("Login inválido 💔");
  }
});

// === CARREGAR CONFIGS ===
function carregarConfigs(){
  const config = JSON.parse(localStorage.getItem("configAmor"));
  if(config){
    tituloInput.value = config.titulo || "";
    descricaoInput.value = config.descricao || "";
    corInput.value = config.cor || "#ff5f8f";
    dataInicio.value = config.data || "";
    const fotos = config.fotos || [];
    mostrarGaleriaAdmin(fotos);
    const cartas = config.cartas || [];
    mostrarCartasAdmin(cartas);
  }
}

// === SALVAR CONFIGS ADMIN ===
document.getElementById("salvarConfigAdmin").addEventListener("click", () => {
  const config = {
    titulo: tituloInput.value,
    descricao: descricaoInput.value,
    cor: corInput.value,
    data: dataInicio.value,
    fotos: JSON.parse(localStorage.getItem("fotosAmor") || "[]"),
    cartas: JSON.parse(localStorage.getItem("cartasAmor") || "[]")
  };
  localStorage.setItem("configAmor", JSON.stringify(config));
  alert("Configurações salvas com sucesso 💖");
});

// === GALERIA ADMIN ===
let fotosMemoria = [];
addFotoAdmin.addEventListener("change", e => {
  const files = e.target.files;
  fotosMemoria = [];
  let count = 0;
  for(let file of files){
    if(count>=3) break; // máximo 3 fotos
    const reader = new FileReader();
    reader.onload = evt => {
      fotosMemoria.push(evt.target.result);
      mostrarGaleriaAdmin(fotosMemoria);
      localStorage.setItem("fotosAmor", JSON.stringify(fotosMemoria));
      iniciarJogo();
    }
    reader.readAsDataURL(file);
    count++;
  }
});

function mostrarGaleriaAdmin(fotos){
  galeria.innerHTML = "";
  fotos.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    galeria.appendChild(img);
  });
}

// === CARTAS ADMIN ===
salvarCartaAdmin.addEventListener("click", () => {
  const texto = addCartaInput.value.trim();
  if(!texto) return alert("Digite algo 💌");
  let cartas = JSON.parse(localStorage.getItem("cartasAmor") || "[]");
  cartas.push({texto, data: new Date().toLocaleDateString("pt-BR")});
  localStorage.setItem("cartasAmor", JSON.stringify(cartas));
  mostrarCartasAdmin(cartas);
  addCartaInput.value = "";
});

function mostrarCartasAdmin(cartas){
  cartasSalvas.innerHTML = "";
  cartas.forEach(c => {
    const div = document.createElement("div");
    div.classList.add("cartaItem");
    div.innerHTML = `<p>${c.texto}</p><small>💘 ${c.data}</small>`;
    cartasSalvas.appendChild(div);
  });
}

// === DEFINIR LOGIN VISITANTE ===
definirVisitante.addEventListener("click", () => {
  if(!visitanteNome.value || !visitanteSenha.value) return alert("Preencha os campos!");
  const visitor = {nome: visitanteNome.value, senha: visitanteSenha.value};
  localStorage.setItem("visitanteLogin", JSON.stringify(visitor));
  alert("Login visitante definido 💞");
});

// === QR CODE AUTOMÁTICO ===
gerarQRAdmin.addEventListener("click", () => {
  const url = window.location.href.split("?")[0]+"?view=interativa";
  const qrcodeContainer = document.getElementById("qrcode");
  qrcodeContainer.innerHTML = "";
  const qr = new QRCode(qrcodeContainer,{
    text: url,
    width:200,
    height:200,
    colorDark:"#ff5f8f",
    colorLight:"#fff"
  });
  setTimeout(() => {
    const a = document.createElement("a");
    a.href = qrcodeContainer.querySelector("img").src;
    a.download = "QRCodeNossoAmor.png";
    a.click();
  },500);
});

// === EXPORT PDF ===
exportPDFAdmin.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const config = JSON.parse(localStorage.getItem("configAmor"));
  doc.setFontSize(20);
  doc.text(config.titulo || "Nosso Amor 💘", 20, 20);
  doc.setFontSize(14);
  doc.text(config.descricao || "", 20, 30);
  doc.save("NossoAmor.pdf");
});

// === APLICAR CONFIG VISITANTE ===
function aplicarConfigsVisitante(){
  const config = JSON.parse(localStorage.getItem("configAmor"));
  if(!config) return;
  document.getElementById("tituloSite").textContent = config.titulo || "Nosso Amor 💘";
  document.getElementById("descricaoSite").textContent = config.descricao || "Cada segundo juntos é eterno 💖";
  document.body.style.background = `linear-gradient(135deg, ${config.cor}, #ffd1a9)`;
  contadorTempo(config.data);
  mostrarGaleriaAdmin(config.fotos);
  mostrarCartasAdmin(config.cartas);
}

// === CONTADOR ===
function contadorTempo(dataInicio){
  const contador = document.getElementById("contador");
  function atualizar(){
    const inicio = new Date(dataInicio);
    const agora = new Date();
    const diff = agora - inicio;
    const dias = Math.floor(diff / (1000*60*60*24));
    const horas = Math.floor((diff / (1000*60*60)) % 24);
    const minutos = Math.floor((diff / (1000*60)) % 60);
    contador.textContent = `${dias} dias, ${horas}h e ${minutos}min juntos 💕`;
  }
  atualizar();
  setInterval(atualizar,60000);
}

// === ABAS ===
menuBtns.forEach(btn=>{
  btn.addEventListener("click",()=>{
    const alvo = btn.getAttribute("data-tab");
    tabs.forEach(tab=>tab.classList.remove("active"));
    document.getElementById(alvo).classList.add("active");
  });
});

// === JOGO DA MEMÓRIA ===
let cartasViradas = [];
let bloqueado = false;

function iniciarJogo(){
  memoriaGrid.innerHTML="";
  if(fotosMemoria.length<1){memoriaGrid.innerHTML="<p>Adicione pelo menos 1 foto 💕</p>"; return;}
  let imgs = [...fotosMemoria,...fotosMemoria]; // duplica
  imgs = imgs.sort(()=>Math.random()-0.5); // embaralha
  imgs.forEach(src=>{
    const carta = document.createElement("div");
    carta.classList.add("carta");
    const img = document.createElement("img");
    img.src = src;
    carta.appendChild(img);
    carta.addEventListener("click",()=>virarCarta(carta));
    memoriaGrid.appendChild(carta);
  });
}

function virarCarta(carta){
  if(bloqueado||carta.classList.contains("virada")) return;
  carta.classList.add("virada");
  cartasViradas.push(carta);
  if(cartasViradas.length===2) verificarCartas();
}

function verificarCartas(){
  const [c1,c2] = cartasViradas;
  bloqueado=true;
  if(c1.querySelector("img").src===c2.querySelector("img").src){
    cartasViradas=[];
    bloqueado=false;
  } else {
    setTimeout(()=>{
      c1.classList.remove("virada");
      c2.classList.remove("virada");
      cartasViradas=[];
      bloqueado=false;
    },1000);
  }
}
