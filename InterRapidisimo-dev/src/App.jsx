import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AppRoutes from "./AppRoutes";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
