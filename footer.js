document.addEventListener('DOMContentLoaded', function () {
    const footer = document.querySelector('footer');
    function handleScroll() {
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        const distanceToBottom = documentHeight - (scrollPosition + windowHeight);
        const opacity = Math.min(1, 1 - (distanceToBottom / 40)); // 200px range for opacity change
        footer.style.opacity = opacity;
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();
});