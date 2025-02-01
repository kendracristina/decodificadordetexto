const textArea = document.querySelector(".text-area");
const mensagem = document.querySelector(".mensagem");
const imagemFundoOriginal = 'url(./assets/whale.png)';
const simbolos = geraArrayDeSimbolos();

textArea.addEventListener("input", function() {
    
    this.value = this.value.replace(/[^\x20-\x7E]/g, '');

});

function geraArrayDeSimbolos() {
    let arrayDeSimbolos = [
	...Array.from({length: 15}, (_, i) => String.fromCharCode(i + 33)),
	...Array.from({length: 7}, (_, i) => String.fromCharCode(i + 58)),
	...Array.from({length: 6}, (_, i) => String.fromCharCode(i + 91)),
	...Array.from({length: 4}, (_, i) => String.fromCharCode(i + 123))
    ]

    return arrayDeSimbolos;
}

function removerImagemDeFundo() {
    mensagem.style.backgroundImage = "none";
}

function restaurarImagemDeFundo(){
    mensagem.style.backgroundImage = imagemFundoOriginal;
}

function btnEncriptar() {
    const textoEncriptado = criptografar(textArea.value);
    mensagem.value = textoEncriptado;
    textArea.value = "";
    removerImagemDeFundo();
}

function converteNumero(numero) {
    if (numero < 8) {
	numero ^= 0b11;
    } else {
	numero = numero == 8 ? 9 : 8;
    }

    return numero;
}

function criptografar(stringEncriptada) {
    let matrizCodigo = [["e" ,"enter",], ["i", "imes"], ["a", "ai"], ["o", "ober"], ["u", "ufat"]];
    stringEncriptada = stringEncriptada.toLowerCase();
    let rotacao = stringEncriptada.charCodeAt(0);

    for(let i = 0; i < matrizCodigo.length; i++) {
        if(stringEncriptada.includes(matrizCodigo[i][0])) {
            stringEncriptada = stringEncriptada.replaceAll(matrizCodigo[i][0], matrizCodigo[i][1]);
        }
    }

    for(let i = 0; i < stringEncriptada.length; i++) {
	let numero = Number.parseInt(stringEncriptada[i]);
	
	if (!isNaN(numero)) {
	    numero = converteNumero(numero);

	    stringEncriptada = stringEncriptada.slice(0, i) + numero.toString() + stringEncriptada.slice(i + 1);
	} else if (simbolos.includes(stringEncriptada[i]) && i != 0) {
	    let indice = simbolos.indexOf(stringEncriptada[i]);

	    indice = (indice + rotacao) % simbolos.length;

	    stringEncriptada = stringEncriptada.slice(0, i) + simbolos[indice] + stringEncriptada.slice(i + 1);
	}
    }
    
    return stringEncriptada
}

function btnDesencriptar() {
    const textoDesencriptado = descriptografar(textArea.value);
    mensagem.value = textoDesencriptado;
    textArea.value = "";
    removerImagemDeFundo();
}

function descriptografar(stringDesencriptada) {
    let matrizCodigo = [["e" ,"enter",], ["i", "imes"], ["a", "ai"], ["o", "ober"], ["u", "ufat"]];
    stringDesencriptada = stringDesencriptada.toLowerCase();
    let rotacao = stringDesencriptada.charCodeAt(0);
    
    for(let i = 0; i < matrizCodigo.length; i++) {
        if(stringDesencriptada.includes(matrizCodigo[i][1])) {
            stringDesencriptada = stringDesencriptada.replaceAll(matrizCodigo[i][1], matrizCodigo[i][0]);
        }
    }

    for(let i = 0; i < stringDesencriptada.length; i++) {
	let numero = Number.parseInt(stringDesencriptada[i]);

	if (!isNaN(numero)) {
	    numero = converteNumero(numero);

	    stringDesencriptada = stringDesencriptada.slice(0, i) + numero.toString() + stringDesencriptada.slice(i + 1);
	} else if(simbolos.includes(stringDesencriptada[i]) && i != 0) {
	    let indice = simbolos.indexOf(stringDesencriptada[i]);

	    indice = indice - (rotacao % simbolos.length);

	    if (indice < 0) {
		indice = simbolos.length - Math.abs(indice);
	    }

	    stringDesencriptada = stringDesencriptada.slice(0, i) + simbolos[indice] + stringDesencriptada.slice(i + 1);
	}
    }
    
    return stringDesencriptada
}

function copiar() {
    const mensagem = document.querySelector(".mensagem");
    // Usando a API Clipboard moderna
    navigator.clipboard.writeText(mensagem.value).then(() => {
        alert("Texto copiado!");
    });
}

   
function limpar() {
    mensagem.value = "";
    restaurarImagemDeFundo();
    
}

document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(() => {
        if (mensagem.value.trim() !== "") {
            removerImagemDeFundo(); // Remove a imagem de fundo se houver texto
        } else {
            restaurarImagemDeFundo(); // Restaura a imagem de fundo se a caixa de mensagem estiver vazia
        }
    });

    observer.observe(mensagem, { attributes: true, childList: true, subtree: true });
});
