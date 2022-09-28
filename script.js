const baseURL = 'https://gutendex.com/books/';

let books = [];
let data;

// Chiamata all'url base per iniziare la pagina
fetchDatA(baseURL)

function fetchDatA(url){
  // Funzione per prendere i dati dall'url.
  // Mostro il div del caricamento
  document.getElementById('loading-div').style.display = 'flex';
  fetch(url)
    .then(resp => resp.json())
    .then(resu =>{
      data = resu
      books = resu.results;
      console.log(data)
      // Una volta che i dati sono arrivati, tolgo il div del caricamento
      document.getElementById('loading-div').style.display = 'none';
      // Mostro i libri
      displayBooks(books)
      // Aggiorno la visiblità dei bottoni next & prev
      updateButtonsVisibility()
    })
    .catch(err => console.log(err))
}

function displayBooks(books){
  // Prendo il div che conterrà i libri
  const booksContainer = document.getElementById('books-container');
  // Tolgo i libri precedenti
  booksContainer.innerHTML = '';
  // Per ogni libro della lista di libri, creo un div e lo riempo con le informazioni del singolo libro
  for(const book of books){
  // Con `` (alt+96) Posso mischiare facilmente testo e variabili, inserendole in ${}
    const bookTemplate = `
    <div>
      <div>${book.title}</div>
      ${getAuthorsTemplate(book.authors)}
      <ul>Genres ${getGenres(book.subjects)}</ul>
    </div>`;

    // Una volta creato il div del singolo libro, lo aggiungo al contenitore di libri
    booksContainer.innerHTML+=bookTemplate;
  }

  // Resetto lo scroll in cima
  document.getElementById('content-container').scrollTop = '0px'
}


function getAuthorsTemplate(authors){
  let string = '';
  for(const author of authors){
    // pre ogni autore presente in book.authors, creo un div con le sue informazioni
    const authorTemplate = `
      <div class="author-container">
        <div>${author.name}</div>
        <div>Birth year: ${
          // Se la data di nascita dell'autore è sconosciuta, scrivo "unknown"
          author.birth_year === null
            ? "Unknown"
            : author.birth_year
        }</div>
        <div>Death year: ${
          // Se la data di morte dell'autore è sconosciuta, controllo prima se anche la data di nascita è sconosciuta.
          // Se la data di nascita è sconosciuta, posso presumere che non si conosca la data di morte.
          // Se la data di nascita è conosciuta ma quella di morte no, metto che l'autore è ancora vivo (o ha 102 anni, aye)
          author.death_year === null
            ? author.birth_year === null || author.birth_year < 1920 ? 'Unknown' : 'Alive'
            : author.death_year
        }</div>
      </div>
    `;
    string += authorTemplate;
  }
  return string;
}

function getGenres(genres){
  // Per ogni genere, creo un elemento di lista
  let string = '';
  for(const genre of genres){
    const template = `<li>${genre}</li>`;
    string += template;
  }
  // Ritorno tutta la lista di generi
  return string;
}

function goNextPage(){
  fetchDatA(data.next)
}

function goPrevPage(){
  fetchDatA(data.previous)
}

// Aggiungo le funzioni ai bottoni
const nextButton = document.getElementById('next-page');
const prevButton = document.getElementById('prev-page');
nextButton.onclick = () => goNextPage();
prevButton.onclick = () => goPrevPage();

function updateButtonsVisibility(){
  // Se nei dati manca 'next' o 'previous', suppongo che siamo arrivati in fondo o all'inizio dei dati.
  // In quel caso disattivo il bottone.
  if(data.previous === null){
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
  }
  if(data.next === null){
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
  }
}
