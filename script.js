// Efeito nos botões do menu de navegação
const menuLinks = document.querySelectorAll('nav a');

menuLinks.forEach(link => {
    // Quando o mouse entra no link
    link.addEventListener('mouseenter', function() {
        this.style.color = '#0ea5e9';
        this.style.fontWeight = '600';
        this.style.transition = 'all 0.3s ease';
    });

    // Quando o mouse sai do link
    link.addEventListener('mouseleave', function() {
        this.style.color = '#4b5563';
        this.style.fontWeight = '400';
    });
});
