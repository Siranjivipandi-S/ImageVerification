import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import FetchImage from "./components/FetchImage.jsx";
import YupValidation from "./components/YupValidation.jsx";
import "./index.css";
import FetchImageByID from "./components/FetchImageByID.jsx";
const router = createBrowserRouter([
  {
    path: "/fetchimage",
    element: <FetchImage />,
  },
  {
    path: "/uploadImages",
    element: <YupValidation />,
  },
  {
    path: "/ImagebyId",
    element: <FetchImageByID />,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </StrictMode>
);
