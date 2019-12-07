import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context';
import styles from './login.module.scss';
import { composeClasses, serializeForm } from '../../libs';
import { CaretRight, Logo, Spin } from '../../assets/svg';
import utilStyles from '../../styles/utils.module.scss';
import { loginUser } from '../../services/auth';
import Input from '../../components/Input';

const Login = ({ history }) => {
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateUser, isLoggedIn } = useContext(UserContext);

  if (isLoggedIn) history.replace('/dashboard');

  const handleLogin = async e => {
    e.preventDefault();
    e.persist();
    setLoading(true);

    let errorMessage = '';
    const formData = serializeForm(e.target);

    if (!formData.phone || !formData.pin)
      errorMessage = 'Please provide your login details';

    const userDetails = {
      username: formData.phone,
      password: formData.pin
    };

    await loginUser(userDetails)
      .then(response => {
        updateUser(response.data);
        return history.push('/dashboard');
      })
      .catch(err => {
        errorMessage = 'Invalid phone number or password';
      });

    setLoading(false);
    setFormError(errorMessage);
    return;
  };

  return (
    <div className={styles.loginContainer}>
      <div className={composeClasses(styles.halfColumn, styles.loginArea)}>
        <header className={styles.brandName}>
          <Logo />
        </header>
        <main className={styles.loginBox}>
          <h3 className={styles.welcomeText}>
            {formError || 'Hello, welcome back.'}
          </h3>
          <form action="/" method="post" onSubmit={handleLogin}>
            <Input
              type="tel"
              name="phone"
              className={styles.loginInput}
              label="Phone Number"
              htmlFor="phone"
              error={formError && ''}
              required
            />
            <Input
              type="password"
              name="pin"
              className={styles.loginInput}
              label="Kudi Pin"
              htmlFor="pin"
              error={formError && ''}
              required
            />
            <div className={styles.loginAction}>
              <button type="submit" className={styles.loginButton}>
                Sign In
                {loading ? <Spin /> : <CaretRight />}
              </button>
              <Link to="/signup">Can't sign in?</Link>
            </div>
          </form>
        </main>
        <div className={styles.loginAlternative}>
          <span>Don’t have an account? </span>
          <Link to="/signup">Create an Account</Link>
        </div>
      </div>
      <div className={composeClasses(styles.halfColumn, utilStyles.showOnMd)}>
        <div className={styles.loginImage} />
      </div>
    </div>
  );
};

export default Login;
