const modal = document.getElementById("modal");
const modalCloseButton = document.getElementById("modal-close-btn");
const modalText = document.getElementById("modal-text");

modalCloseButton.addEventListener("click", (e) => {
    modal.close();
})

export function showModal(text){
    modalText.innerText = text;
    modal.showModal();
}