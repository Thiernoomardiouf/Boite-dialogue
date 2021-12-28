export default function suggestion(){
    const inputSuggestion = document.querySelector("textarea#suggestion")
    // VERIFICATION DES MOTS SAISIS
    inputSuggestion.addEventListener("input", (event) => {
        const longueurMax = 130
        const contenuSaisi = inputSuggestion.value
        const longueurSaisi = contenuSaisi.length
        const reste = longueurMax - longueurSaisi
    
        //actualiser le dom pour afficher le nombre
        const paragraphCompteur = document.getElementById("limite-text")
        const compteurText = document.getElementById("text-progress")
        const restantText = document.getElementById("text-restant")
        const btnSuggestion = document.getElementById("btn-suggestion")
        compteurText.textContent = longueurSaisi
        restantText.textContent = " Il vous reste " + reste
    
        //changer couleur
    
        if (reste < 0) {
        paragraphCompteur.style.color = "#ce0033"
        btnSuggestion.disabled = true
        } else if (reste <= 16) {
        paragraphCompteur.style.color = "yellow"
        btnSuggestion.disabled = false
        } else {
        paragraphCompteur.style.color = "#00000"
        btnSuggestion.disabled = false
        }
    })
}