import { useRoutes } from 'react-router-dom'
import FormPage from '../pages/FormPage'
import FrontendConfig from '../config/FrontendConfig'

// Initialize config with environment variables
const config = new FrontendConfig()

const AppRoutes = () => {
  return useRoutes([
    { path: '/', element: <FormPage config={config}/> }
  ])
}

export default AppRoutes
