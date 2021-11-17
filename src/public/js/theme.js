const toggleButton = document.querySelector('button.themetoggle')

document.querySelector('button.themetoggle').addEventListener('click', () => {
    document.body.classList.toggle('light')
})