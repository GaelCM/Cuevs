import {Navbar} from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import { Outlet } from "react-router"



export function Container() {

  return (
    <>
     <div>
        <Navbar></Navbar>        
        <div className="flex overflow-hidden bg-white pt-16">
          <Sidebar></Sidebar>
          <div className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10" id="sidebarBackdrop"></div>
          <div id="main-content" className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64  mt-10">
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </>
  )
}


