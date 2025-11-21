import { Outlet } from "react-router-dom";
import Navber from "../Pages/Shared/Navber";
import Footer from "../Pages/Shared/Footer";


const Main = () => {
    return (
        <div className="min-h-screen bg-base-200">
            <Navber></Navber>
            <Outlet></Outlet>
            <Footer> </Footer>
        </div>
    );
};

export default Main;