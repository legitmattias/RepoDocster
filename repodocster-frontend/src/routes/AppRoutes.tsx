import { useRoutes } from 'react-router-dom'
import FormPage from '../pages/FormPage'

const AppRoutes = () => {
  return useRoutes([
    { path: '/', element: <FormPage /> }
  ])
}

export default AppRoutes
