
import ReactDOM from 'react-dom/client';
import './index.css'
import { routes } from '@/ui/routes';
import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';



const root=ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <>
    <Toaster position="top-right" richColors></Toaster>
    <RouterProvider router={routes} />
  </>
)

