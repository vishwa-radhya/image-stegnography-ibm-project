import { useNavigate } from "react-router-dom";
import { selectionArraySliced } from "../utils/application-data";
import { Fragment } from "react";
const Selections = () => {
    const navigateRouter = useNavigate();
    return ( 
        <Fragment>
        <div className="flex flex-col gap-10 h-[90vh] p-3">
  <h1 className="text-4xl text-center">Stegnography options</h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 w-full">
    {selectionArraySliced.map((obj, index) => (
      <div
        key={`selection-tile-${index}`}
        className="bg-black text-white px-[20px] py-[30px] cursor-pointer flex flex-col items-center gap-4 min-w-[200px] flex-1 rounded-[4px]"
        style={{ backgroundImage: 'linear-gradient(to bottom right, #2b2b2b, #060501, #2b2b2b)' }}
        onClick={() => navigateRouter(obj.link)}
      >
        <obj.icon size={'45px'} color='#616a6f' />
        <h3 className="font-bold text-[20px] text-center">{obj.title}</h3>
        <span className="text-center text-[rgb(142,142,142)]">{obj.description}</span>
      </div>
    ))}
  </div>
</div>
        </Fragment>
     );
}
 
export default Selections;