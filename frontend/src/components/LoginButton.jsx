import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const { login, isValidEmail } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      // Decode JWT token to get user info
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const userData = JSON.parse(jsonPayload);

      if (isValidEmail(userData.email)) {
        const success = login({
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
        });
        if (success) {
          navigate('/upload');
        }
      } else {
        alert(
          'Access denied. Only IIITN students with email format bt2xxxxxxx@iiitn.ac.in can upload.'
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleError = () => {
    console.error('Login failed');
    alert('Login failed. Please try again.');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      theme="filled_black"
      size="large"
      text="signin_with"
      shape="rectangular"
    />
  );
};

export default LoginButton;

