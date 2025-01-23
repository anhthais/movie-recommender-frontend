import { Provider } from 'react-redux'
import { store } from './app/api/store'
import { Toaster } from './components/ui/toaster'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { AuthLoader } from './app/context/auth-loader'
import LoadingBar, {LoadingBarRef} from 'react-top-loading-bar'
import { useRef } from 'react'
import { TopLoaderContextProvider } from './app/context/top-bar-loader-context'
import ErrorBoundary from './components/error-boundary'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { ThemeProvider } from './app/context/theme-provider'

function App() {
  const loaderRef = useRef<LoadingBarRef>(null);


  const staticStart = () => {
    loaderRef.current?.staticStart();
  };

  const complete = () => {
      loaderRef.current?.complete();
  };

  const continuousStart = () => {
      loaderRef.current?.continuousStart();
  };
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LoadingBar ref={loaderRef} />
      <Provider store={store}>
        <TopLoaderContextProvider
          values={{ staticStart, complete, continuousStart }}
        >
          <TooltipProvider>
            <AuthLoader>
              <ErrorBoundary>
                <RouterProvider router={router}></RouterProvider>
                <Toaster />
              </ErrorBoundary>
            </AuthLoader>
          </TooltipProvider>
        </TopLoaderContextProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
