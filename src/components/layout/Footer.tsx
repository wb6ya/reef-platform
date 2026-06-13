export const Footer = () => {
  return (
    <footer className="hidden md:block bg-white border-t border-gray-200 mt-auto py-8">
      <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Reef Platform (منصة ريف). All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-4">
          <a href="#" className="hover:text-green-700 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-green-700 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-green-700 transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};
