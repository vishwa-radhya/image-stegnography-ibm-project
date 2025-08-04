import {Button} from '@/components/ui/button'
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigateRouter = useNavigate();
    return ( 
        <div>
            home
            <Button onClick={()=>navigateRouter('selections')}>Button</Button>
        </div>
     );
}
 
export default Home;