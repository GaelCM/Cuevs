import { useUserData } from "@/hooks/globalUser";
import { Button } from "./ui/button";
import mascota from "@/res/mascota.png"
import logo from "@/res/logo.png"
import { useNavigate } from "react-router";

export function Navbar(){
   const navigate = useNavigate();

    const { user } = useUserData();

    return(
        <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <button id="toggleSidebarMobile" aria-expanded="true" aria-controls="sidebar" className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded">
                      <svg id="toggleSidebarMobileHamburger" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                      </svg>
                      <svg id="toggleSidebarMobileClose" className="w-6 h-6 hidden" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                  </button>
                  <a href="#" className="text-xl font-bold flex items-center lg:ml-2.5">
                  <img src={mascota} className="h-20 mr-2" alt="Windster Logo"/>
                  <img src={logo} className="h-10 mr-2" alt="Windster Logo"/>       
                  </a>
                  
                </div>
                
                <div className="flex flex-grow items-center justify-end">
                  <div className="hidden lg:flex flex-grow items-center justify-center">
                    <img src={mascota} className="h-20 mr-2" alt="Windster Logo"/>
                    <img src={logo} className="h-20 mr-2" alt="Windster Logo"/> 
                  </div>
                  <span className="mr-10 font-semibold text-gray-700">Bienvenido {user.nombre} {user.apellidos}</span>
                  <button id="toggleSidebarMobileSearch" type="button" className="hidden text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg">
                      <span className="sr-only">Search</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                      </svg>
                  </button>
                  
                  <Button className="bg-red-500 hover:bg-rose-400 cursor-pointer" onClick={()=>{
                    localStorage.removeItem('token')
                    navigate("/login")
                  }}>Cerrar sesion</Button>

                </div>
                
            </div>
          </div>
      </nav>
    )
}