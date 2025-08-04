import { useNavigate } from "react-router-dom";
import { selectionArray } from "../utils/application-data";
const Selections = () => {
    const navigateRouter = useNavigate();
    return ( 
        <div>
        <div className="flex gap-10">
            {selectionArray.map((obj,index)=>{
                return <div key={`selection-tile-${index}`} className="bg-black text-white p-2 cursor-pointer" onClick={()=>navigateRouter(obj.link)}>
                    <h3>{obj.title}</h3>
                    <p>{obj.sub_title}</p>
                </div>
            })}
        </div>
        </div>
     );
}
 
export default Selections;