import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

import UpdateBlog from "./pages/updateBlog/UpdateBlog";
import { useSelector } from "react-redux";
import Create from "./pages/create/Create";
import BlogDetails from "./pages/blogDetails/BlogDetails";
import Navbar from "./components/navbar/Navbar";

import Footer from "./components/footer/Footer";
import NotFound from "./components/notFound/NotFound";
import UpdateProfile from "./components/updateProfile/UpdateProfile";
import UserDetails from "./pages/userDetails/UserDetails";
import VerifyBlog from "./pages/verifyBlogs/VerifyBlog";
import About from "./pages/about/About";
function App() {
  const { user } = useSelector((state) => state.auth);
  //console.log(user);
  // console.log(user._id);

  return (
    <div>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/create"
          element={user ? <Create /> : <Navigate to="/login" />}
        />
        <Route
          path="/blogDetails/:id"
          element={user ? <BlogDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/updateBlog/:id"
          element={user ? <UpdateBlog /> : <Navigate to="/login" />}
        />
        <Route
          path="/verifyBlog"
          element={user?.IsAdmin ? <VerifyBlog /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <NotFound />
              <Footer />
            </>
          }
        />
        <Route
          path="/userDetails/:id"
          element={user ? <UserDetails /> : <Navigate to="/login" />}
        />
        <Route
          strict
          path="/about"
          element={user ? <About /> : <Navigate to="/login" />}
        />
        <Route
          path="/updateProfile/:id"
          element={
            user ? (
              <>
                <Navbar />
                <UpdateProfile />
                <Footer />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
