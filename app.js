import buildGoogleChart from './modules/charts.js';
import UneCarte from './modules/carte.js'
import suggestion from './modules/suggestions.js'
//import {API_KEY, API_KEY} from './modules/conf.js'

const API_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTU4OTQwNywiZXhwIjoxOTU1MTY1NDA3fQ.baE0cZZF2CpyzFYUVN8wqSycVkBv_rSe-pf75ZXV2Uk"
const API_URL = "https://iwzfnnetuctxnxwbfqlc.supabase.co/rest/v1/idee"


// RECUPERATIONS DES ELEMENTS DOM
const propositionElement = document.getElementById("propositions")
const ideeForm = document.querySelector("form")
const inputTitre = document.querySelector("input#titre")
const inputSuggestion = document.querySelector("textarea#suggestion")
let metrique = {total:0, accepte:0, refuse:0}

// NOS FONCTIONS

/**
 * Cette fonction permet de créer une carte et de l'inserrer dans le DOM
 * @param un idee
 */

 const creerUneCarte = (idee)=>{
     UneCarte(idee)
 }

 suggestion()

// RECUPERATION DES INFORMAIONS DU FORMULAIRE
ideeForm.addEventListener("submit", (event) => {
    //validForm()
    event.preventDefault()

    // Récupération des informations saisies
    const titreSaisi = inputTitre.value
    const suggestionSaisi = inputSuggestion.value
  
    if (titreSaisi.trim().length < 5 || suggestionSaisi.trim().length < 10) {
      inputTitre.classList.add("invalid")
      inputSuggestion.classList.add("invalid")
      alert("Merci de saisir des informations correctes")
      return
    }
  
    // mettre les informations sous forme
    const nouvelleIdee = {
      titre: titreSaisi,
      suggestion: suggestionSaisi,
      statut: false,
    }
  
    //ENVOYER LES DONNEES VERS SUPABASE
    fetch(API_URL, {
      method: "POST",
      headers: {
        apikey: API_KEY,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(nouvelleIdee),
    })
      .then((response) => response.json())
      .then((data) => {
        const ideeCreeAuNiveauAPI = data[0]
        //AJOUT DE LA NOUVELLE IDEE AU NIVEAU DE LA PAGE
        creerUneCarte(ideeCreeAuNiveauAPI)
      })
  
    // on vide les champs
    inputTitre.value = ""
    inputSuggestion.value = ""
})

function rendreLesCartes() {
  fetch(API_URL, {
    headers: {
      apikey: API_KEY,
    },
  })
    .then((response) => response.json())
    .then((idees) => {
      idees.forEach((idee) => creerUneCarte(idee))

      buildGoogleChart()
    })
}
rendreLesCartes();


document.querySelector('.filtre-refuse').addEventListener('click', ()=>{
  let cartes = propositionElement.children
  for (const carte of cartes) {
    if(carte.getAttribute('data-state') == "true"){
      carte.classList.add('d-none')
    }else{
      carte.classList.remove('d-none')
    }
  }
})
document.querySelector('.filtre-accepte').addEventListener('click', ()=>{
  let cartes = propositionElement.children
  for (const carte of cartes) {
    if(carte.getAttribute('data-state') == "false"){
      carte.classList.add('d-none')
    }else{
      carte.classList.remove('d-none')
    }
  }
})

document.querySelector('.filtre-tous').addEventListener('click', ()=>{
  let cartes = propositionElement.children
  for (const carte of cartes) {
    carte.classList.remove('d-none')
  }
})

//buildGoogleChart();