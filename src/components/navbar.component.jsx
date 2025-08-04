import { Fragment } from "react";
import { Outlet } from "react-router-dom";

const Navbar = () => {
    return ( 
        <Fragment>
        <div>
            navbar
        </div>
        <Outlet/>
        </Fragment>
     );
}
 
export default Navbar;