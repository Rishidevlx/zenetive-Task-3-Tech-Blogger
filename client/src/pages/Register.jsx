import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [formError, setFormError] = useState('');

  const { name, email, password, confirmPassword } = formData;
  const navigate = useNavigate();
  const { registerUser, user } = useContext(AuthContext);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    try {
      await registerUser({ name, email, password });
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card" 
        style={{ maxWidth: '450px', width: '100%', margin: '40px auto', padding: '50px 40px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h2 style={{ fontSize: '2.4rem', color: 'var(--text-main)', marginBottom: '10px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)' }}>Join Tech Blogs and start writing today.</p>
        </div>
        
        {formError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ color: '#FCA5A5', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', border: '1px solid var(--danger)', borderRadius: '6px', marginBottom: '25px', textAlign: 'center', fontSize: '0.95rem', fontWeight: '500' }}
          >
            {formError}
          </motion.div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={name} onChange={onChange} required placeholder="Rishi Developer" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={email} onChange={onChange} required placeholder="dev@hashnode.clone" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={password} onChange={onChange} required placeholder="••••••••" minLength="6" style={{ letterSpacing: '2px' }} />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} required placeholder="••••••••" minLength="6" style={{ letterSpacing: '2px' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '14px', fontSize: '1.05rem' }}>
            Create Account
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '35px', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: '600', color: 'var(--secondary)' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
