import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { store, persistor } from "./store/store"
import AppRoutes from "./routes/AppRoutes.jsx"

const theme = createTheme({
  palette: { primary: { main: "#1877f2" }, secondary: { main: "#42a5f5" }, background: { default: "#f0f2f5" } },
  typography: { fontFamily: "Helvetica, Arial, sans-serif" },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none", borderRadius: "6px", fontWeight: 600 } } },
  },
})

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <div className="App">
              <AppRoutes />
              <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App