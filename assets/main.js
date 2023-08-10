if (navigator.serviceWorker) {
    console.log("Service worker is supported!")
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../serviceWorker.js').then((resp) => {
            console.log("Service worker registered!")
        })
    })
}