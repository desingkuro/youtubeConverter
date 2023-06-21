const entrada = document.getElementById('inputText');
const boton = document.getElementById('inputBoton');
const loader = document.getElementById('loader');
const formatos = document.querySelectorAll('td')
const password = 'anmalima601262'; // Contraseña

let archivoDeDescarga = null;

let formatoSeleccionado = 0;

const listado={
  'mp4':{
    '480p':135,
    '720p':22,
    '1080p':137
  },
  'mp3':{
    '128kbps':140,
    '192kbps':141,
    '256kbps':139
  }
}

formatos.forEach((formato,index)=>{
  formato.addEventListener('click',()=>selectFormato(index))
})

function selectFormato(i){
  console.log(formatos[i].textContent)
  let format = formatos[i].textContent;
  let separado = format.split('p')
  if(separado[1] == 's'){
    let numero = parseInt(listado['mp3'][format]);
    formatoSeleccionado = numero;
  }else{
    let numero = parseInt(listado['mp4'][format])
    formatoSeleccionado = numero;
  }
}

boton.addEventListener('click',(e)=>{
    e.preventDefault();
    let palabra = obtenerPalabra();
    descargarArchivo(palabra,formatoSeleccionado)
})

function obtenerPalabra(){
    const palabra = entrada.value;
    return palabra;
}

function separarArray(array,caracter){
    const nuevoArray = array.split(caracter)
    return nuevoArray;
}

function insertarSrc(nuevoArray){
    document.getElementById('prevista').src = 'https://img.youtube.com/vi/'+nuevoArray[1]+'/0.jpg';
}

function mostrarVistaPrev(){
    let contenedor = document.getElementById('contenedor');
    contenedor.classList.remove('ocultar')
    contenedor.classList.add('container')
}

entrada.addEventListener('change',()=>{
    if(entrada.value != ''){
        let link = obtenerPalabra();
        let array = separarArray(link,'/');
        let nuevoArray = separarArray(array[3],'=')

        insertarSrc(nuevoArray);
        mostrarVistaPrev();
        //let enlace = encodeURIComponent(link);
        //descargarArchivo(link,140)
    }
})


  function descargarArchivo(link, itag) {
    loader.classList.add('containerLoad')
    fetch('http://127.0.0.1:5600/descargar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${password}`
      },
      body: JSON.stringify({
        'texto': link,
        'itag': itag
      })
    })
      .then(response => {
        if (response.ok) {
          return response.blob();
        }else {
          throw new Error('Error en la respuesta del servidor');
        }
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `descarga.${blob.type.split('/')[1]}`;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
        loader.classList.remove('containerLoad')
      })
      .catch(error => {
        console.log(error);
      });
  }
  
  