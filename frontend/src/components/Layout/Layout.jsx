import Navbar from "../ui/Navbar";

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* The Layout handles the Navbar once for the whole app */}
            <Navbar />
            
            {/* THIS IS CRITICAL: Render whatever page is passed inside */}
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;