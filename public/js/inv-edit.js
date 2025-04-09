const form = document.querySelector("#editForm")
    form.addEventListener("change", function() {
        const editBtn = document.querySelector("button")
        editBtn.removeAttribute("disabled")
    })