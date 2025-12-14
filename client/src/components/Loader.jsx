import  { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams, useNavigate } from 'react-router-dom';

const Loader = () => {

  const navigate = useNavigate();
  const {nextUrl}= useParams();

  useEffect(() => {
    if(nextUrl){
      setTimeout(() => {
        navigate(`/${nextUrl}`);
      },8000);
    }
  },[nextUrl])

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='animation-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary'>
      </div>
      
    </div>
  )
}

export default Loader
