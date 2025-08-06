document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('[aria-label="Toggle mobile menu"]');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    // Create mobile menu if it doesn't exist
    if (!mobileMenu && mobileMenuButton) {
        const nav = document.querySelector('nav');
        const menuHTML = `
            <div id="mobile-menu" class="md:hidden bg-white border-t border-gray-200 hidden">
                <div class="px-2 pt-2 pb-3 space-y-1">
                    <a href="/dist/index.html" class="block px-3 py-2 text-base font-medium text-amber-900 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">Home</a>
                    <a href="#" class="block px-3 py-2 text-base font-medium text-amber-900 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">Safari</a>
                    <a href="#" class="block px-3 py-2 text-base font-medium text-amber-900 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">Chambal Safari</a>
                    <a href="#" class="block px-3 py-2 text-base font-medium text-amber-900 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">Hotels</a>
                    <a href="#" class="block px-3 py-2 text-base font-medium text-amber-900 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">Packages</a>
                    <a href="#" class="block px-3 py-2 text-base font-medium text-amber-900 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">Contact</a>
                    <button class="w-full mt-4 bg-amber-700 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                        Book Now
                    </button>
                </div>
            </div>
        `;
        nav.insertAdjacentHTML('beforeend', menuHTML);
    }

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                menu.classList.remove('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'true');
            } else {
                menu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }
});
