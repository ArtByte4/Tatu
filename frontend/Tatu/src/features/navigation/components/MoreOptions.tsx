import '../styles/MoreOptions.css';
import { useClearSession } from '../hooks/useClearSession';

function MoreOptions() {
  const { callLogout } = useClearSession();
  return (
    <div className="options">
        <div className="container-options">
            <div className='item-options'>
                <span>Cambiar cuenta</span>
            </div>
            <div className='item-options' onClick={callLogout}>
                <span>Salir</span>
            </div>
            
        </div>
    </div>
  )
}

export default MoreOptions