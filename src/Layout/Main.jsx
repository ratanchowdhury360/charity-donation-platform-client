import { Outlet } from "react-router-dom";
import Footer from "../Pages/Home/Home/Shared/Footer";
import Navber from "../Pages/Home/Home/Shared/Navber";


const Main = () => {
    return (
        <div>
            <Navber></Navber>
            <Outlet></Outlet>
            <Footer> </Footer>
        </div>
    );
};

export default Main;