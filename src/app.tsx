// import 'src/global.css';

// import { useEffect } from 'react';

// import Fab from '@mui/material/Fab';

// import { usePathname } from 'src/routes/hooks';

// import { ThemeProvider } from 'src/theme/theme-provider';

// import { Iconify } from 'src/components/iconify';

// // ----------------------------------------------------------------------

// type AppProps = {
//   children: React.ReactNode;
// };

// export default function App({ children }: AppProps) {
//   useScrollToTop();

//   const githubButton = () => (
//     <Fab
//       size="medium"
//       aria-label="Github"
//       href="https://github.com/minimal-ui-kit/material-kit-react"
//       sx={{
//         zIndex: 9,
//         right: 20,
//         bottom: 20,
//         width: 48,
//         height: 48,
//         position: 'fixed',
//         bgcolor: 'grey.800',
//       }}
//     >
//       <Iconify width={24} icon="socials:github" sx={{ '--color': 'white' }} />
//     </Fab>
//   );

//   return (
//     <ThemeProvider>
//       {children}
//       {githubButton()}
//     </ThemeProvider>
//   );
// }

// // ----------------------------------------------------------------------

// function useScrollToTop() {
//   const pathname = usePathname();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// }

import 'src/global.css';

import { useEffect } from 'react';
import Fab from '@mui/material/Fab';
import { usePathname } from 'src/routes/hooks';
import { ThemeProvider } from 'src/theme/theme-provider';
import { Iconify } from 'src/components/iconify';

// Toastify imports
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();

  const githubButton = () => (
    <Fab
      size="medium"
      aria-label="Github"
      href="https://github.com/minimal-ui-kit/material-kit-react"
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        width: 48,
        height: 48,
        position: 'fixed',
        bgcolor: 'grey.800',
      }}
    >
      <Iconify width={24} icon="socials:github" sx={{ '--color': 'white' }} />
    </Fab>
  );

  return (
    <ThemeProvider>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ThemeProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
