import {Button} from '../components/ui/button'
import { useNavigate } from 'react-router-dom';
import HeroImg from '../assets/hero-img-13.jpg';
const Home = () => {
    const navigateRouter = useNavigate();
    return ( 
        <div className="relative h-[90vh] flex justify-around flex-col items-center overflow-hidden">
            {/* <img src={HeroImg} alt="Hero" className="absolute inset-0 w-full h-full object-contain blur-[0px] -z-10"/> */}
        <h1 className="text-[40px] sm:text-[100px] tracking-[10px] sm:tracking-[30px] text-white flex w-full justify-center">STEGO</h1>
        <Button variant="secondary" className="text-[20px] mt-3" onClick={()=>navigateRouter('/selections')}>
            Get started
        </Button>
        </div>
     );
}
export default Home;