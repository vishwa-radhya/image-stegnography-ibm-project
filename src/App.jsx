import { Route,Routes } from "react-router-dom"
import Navbar from "./components/navbar.component"
import Home from "./routes/home.route"
import Selections from "./routes/selections.route"
import BasicEncoding from './routes/basic-encoding.route'
import BasicDecoding from './routes/basic-decoding.route'
import EncryptedEncoding from './routes/encrypted-encoding.route'
import EncryptedDecoding from './routes/encrypted-decoding.route'
import StegnographyOptions from './routes/stegnography-options.route'
import '@fontsource/michroma'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navbar/>}>
      <Route index element={<Home/>} />
      <Route path="selections" element={<Selections/>} />
      <Route path="selection/basic-encoding" element={<BasicEncoding/>} />
      <Route path="selection/basic-decoding" element={<BasicDecoding/>} />
      <Route path="selection/encrypted-encoding" element={<EncryptedEncoding/>} />
      <Route path="selection/encrypted-decoding" element={<EncryptedDecoding/>} />
      <Route path="selection/stegnography-options" element={<StegnographyOptions/>} />
      </Route>
    </Routes>
  )
}

export default App
