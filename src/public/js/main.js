const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('show')
        } else {
            entry.target.classList.remove('show')
        }
    })
})

const hiddenElements = document.querySelectorAll('.hidden')
hiddenElements.forEach((el) => observer.observe(el))

function enviarEmail() {
    const sugestao = document.getElementById('sugestoes_email').value
    const meuEmail = 'dev.nexus.developer@gmail.com'
    const assunto = `Sugestão para o site DevNexus`
    const corpo = `Sugestão para o site DevNexus: ${sugestao}`

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${meuEmail}&su=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`

    window.open(gmailUrl, '_blank')
}
function abrirPerfil(userId) { 
    console.log('ID do usuario: ', userId);
    window.location.href = `/profile/${userId}` 
}

function abrirFiltro() {
    document.querySelector('.filter_back').style.display = 'flex'
}
function fecharFiltro() {
    document.querySelector('.filter_back').style.display = 'none'
}

function abrirPesquisa() {
    document.querySelector('.search-container').style.display = 'flex'
}

function fecharPesquisa() {
    document.querySelector('.search-container').style.display = 'none'
}