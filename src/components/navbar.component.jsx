import { Fragment, useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { selectionArray } from "../utils/application-data";
import { HoverCard,
  HoverCardContent,
  HoverCardTrigger,} from '@/components/ui/hover-card';

const Navbar = () => {
    const [expanded,setExpanded]=useState(false);
    const [subExpanded,setSubExpanded]=useState(false);
    const navigateRouter = useNavigate();
    const handleSubnavButtonClick=(e,obj)=>{
      e.stopPropagation();
      if(obj.subTitle=='Xx'){
        setSubExpanded(false)
        setExpanded(true)
        return
      }
      navigateRouter(obj.link)
    }
    return ( 
        <Fragment>
        <div className=" flex justify-center w-full pt-[10px] pb-[10px]">
            <div
          className={`text-white shadow-[0px_4px_10px_rgba(0,0,0,0.4)] rounded-[30px]  cursor-pointer bg-gradient-to-br from-[#111111] to-[#3b3b3b] backdrop-blur-sm
          transition-all duration-500 ease-in-out flex items-center gap-4 relative
          ${expanded ? 'w-[230px]' : 'w-[130px]'} ${subExpanded ? 'w-[350px]' : 'w-[130px]'}
          `}
          onClick={() => setExpanded(true)}  
        >
          {(!expanded && !subExpanded) && <span className="whitespace-nowrap mr-3.5 px-[10px] py-[10px] w-full text-center">STEGO</span>}
          {(expanded && !subExpanded) && (
            <div className="flex gap-3  w-full justify-center  h-full">
            <HoverCard>
            <HoverCardTrigger asChild>
              <span
                className="stego-nav-btn" onClick={(e) => {
                  e.stopPropagation();
                  navigateRouter('/');}} > Ho </span>
            </HoverCardTrigger>
            <HoverCardContent className="stego-nav-btn-hover">Home</HoverCardContent>
          </HoverCard>
          <HoverCard>
            <HoverCardTrigger asChild>
                  <span className="stego-nav-btn" onClick={(e)=>{
                e.stopPropagation()
                setExpanded(false)
                setSubExpanded(true)
              }}>Op</span>
            </HoverCardTrigger>
            <HoverCardContent className="stego-nav-btn-hover">Options</HoverCardContent>
          </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <span className="stego-nav-btn" onClick={(e)=>{
                e.stopPropagation()
                navigateRouter('/selections')
              }}>So</span>
                </HoverCardTrigger>
            <HoverCardContent className="stego-nav-btn-hover">Select options</HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <span className="stego-nav-btn" onClick={(e)=>{
                e.stopPropagation()
                setExpanded(false)
              }}>Xx</span>
                </HoverCardTrigger>
            <HoverCardContent className="stego-nav-btn-hover">Close</HoverCardContent>
              </HoverCard>
            </div>
          )}
          {(subExpanded && !expanded) && (
            <div className="flex gap-3 w-full justify-center h-full">
              {selectionArray.map((obj,index)=>{
                return  <HoverCard>
                  <HoverCardTrigger asChild>
                    <span key={`subnav-${index}`} onClick={(e)=>handleSubnavButtonClick(e,obj)} className="stego-nav-btn">{obj.subTitle}</span>
                  </HoverCardTrigger>
                  <HoverCardContent className="stego-nav-btn-hover">{obj.title}</HoverCardContent>
                </HoverCard>
              })}
            </div>
          )}
        </div>
        </div>
        <Outlet/>
        </Fragment>
     );
}
 
export default Navbar;