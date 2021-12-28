const API_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTU4OTQwNywiZXhwIjoxOTU1MTY1NDA3fQ.baE0cZZF2CpyzFYUVN8wqSycVkBv_rSe-pf75ZXV2Uk"
const API_URL = "https://iwzfnnetuctxnxwbfqlc.supabase.co/rest/v1/idee"
import buildGoogleChart from './charts.js';

export let metrique = {total:0, accepte:0, refuse:0}

export default function UneCarte(idee){
  //création de nos ids
  const idButtonValider = "btn_valider-" + idee.id
  const idButtonRefuser = "btn_refuser-" + idee.id
  const idCardIdee = "numero_card-" + idee.id

  const propositionElement = document.getElementById("propositions")

  //Insertion de la carte au niveau du DOM
  propositionElement.insertAdjacentHTML(
    "beforeend",
    `
  <div class="card card-idea m-2" style="width: 18rem" id="${idCardIdee}" data-state="${idee.statut}">
      <div class="card-body flex-column d-flex justify-content-between">
          <div class="card-block-titre">
            <h5 class="card-title fw-bold">${idee.titre}</h5>
            <h6 class="card-subtitle mb-2 text-gris">
                approuvée / réfusée
            </h6>
          </div>
          <p class="card-text">${idee.suggestion}
          </p>
          <div class="d-flex justify-content-between">
              <i
                  class="bi bi-check-circle text-success card-link btn"
                  id="${idButtonValider}"
                  style="font-size: 2rem"
              ></i>
              <i
                  class="bi bi-x-circle card-link btn"
                   id="${idButtonRefuser}"
                  style="font-size: 2rem; color: #ce0033"
              ></i>
          </div>
      </div>
  </div>
  `
  )

  //Ajout des évenements  sur les bouttons valider et refuser
  const btnValider = document.getElementById(idButtonValider)
  const btnRefuser = document.getElementById(idButtonRefuser)

  // fonction pour changer le style de la carte
  function styleCarte(colorBorder, etat, rouge, vert, hid, vis){
    const divCard = document.getElementById(idCardIdee)
    divCard.style.border = "1px solid " + colorBorder
    btnValider.style.visibility = hid
    btnRefuser.style.visibility = vis

    //Chage le message au niveau du h6
    const h6 = document.querySelector("#" + idCardIdee + " h6")
    h6.textContent = etat
    h6.classList.remove(rouge)
    h6.classList.add(vert)
  }

   // Appel des fonctions 

    if(idee.statut === true){
      styleCarte("#198754", "Approuve", "text-red", "text-green", "hidden", "visible" )
    }else{
      styleCarte("#ce0033", "Refusé", "text-green", "text-red", "visible", "hidden" )
    }

// Calcul pourcentage 
function pourcentage(){
  let pourcentageAccepte = (metrique.accepte*100)/metrique.total
  let pourcentageRefuse = (metrique.refuse*100)/metrique.total
  let cercle =  document.querySelector('.percentage')
  cercle.style.background = `conic-gradient(#198754 ${pourcentageAccepte}%, #ce0033 0)`
  document.querySelector('.pourcentage-accepte').innerHTML = `${pourcentageAccepte.toFixed(2)}%`
  document.querySelector('.pourcentage-refuse').innerHTML = `${pourcentageRefuse.toFixed(2)}%` 
}

  //Ecouter l'évenement click sur les boutons
  btnValider.addEventListener("click", (event) => {
    //on prend l'id de l'idée
    fetch(API_URL + "?id=eq." + idee.id, {
      method: "PATCH",
      headers: {
        apikey: API_KEY,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ statut: true }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data[0].statut === true) {
          styleCarte("#198754", "Approuve", "text-red", "text-green", "hidden", "visible" )
          metrique.accepte++
          metrique.refuse--
          buildGoogleChart()
          pourcentage() 
        }
      })
  })

  btnRefuser.addEventListener("click", (event) => {
    //on prend l'id de l'idée
    fetch(API_URL + "?id=eq." + idee.id, {
      method: "PATCH",
      headers: {
        apikey: API_KEY,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ statut: false }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data[0].statut === false) {
          //On change le style accepter
          styleCarte("#ce0033", "Refusé", "text-green", "text-red", "visible", "hidden" )
          
          metrique.accepte--
          metrique.refuse++
          buildGoogleChart()
          pourcentage()
        }
      })
  })


  if (idee.statut){
    metrique.accepte++
  }else{
    metrique.refuse++
  }metrique.total++

  pourcentage()

  // mise à jour des data-set

  let chartDiv = document.getElementById('chart_div')

  chartDiv.setAttribute('data-accept', metrique.accepte)
  chartDiv.setAttribute('data-refuse', metrique.refuse)

}
