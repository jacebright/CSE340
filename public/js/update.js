const updateForm = document.querySelector("#updateUserForm");
updateForm.addEventListener("change", function() {
    const updateBtn = document.querySelector("#updateButton")
    updateBtn.removeAttribute("disabled")
})

const passwordForm = document.querySelector("#updatePasswordForm");
passwordForm.addEventListener("change", function() {
    const passBtn = document.querySelector("#passwordButton")
    passBtn.removeAttribute("disabled")
})