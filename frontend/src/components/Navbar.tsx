import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import  LogoutButton  from '../components/Logout';
import LoginAndRegisterButtons from './LoginAndRegisterButton';
const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();




  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        
        <div>
          {isAuthenticated ? (
            <>
               <LogoutButton />
            </>
          ) : (
            <>
             <LoginAndRegisterButtons/>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;