export default function Header() {
  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">IbexAI</h1>
        </div>

        {/* Navigation Links */}
        <nav className="hidden sm:flex items-center gap-8">
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Amharic Tutor
          </a>
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Lab Help
          </a>
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back to Blog
          </a>
        </nav>

        {/* Mobile Menu */}
        <div className="sm:hidden">
          <button
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
