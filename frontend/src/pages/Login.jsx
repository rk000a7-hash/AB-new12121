import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestOtp, verifyOtp } from '../services/api';
import { Mail, KeyRound, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1 = Get OTP, 2 = Verify OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await requestOtp(email);
            setSuccess('OTP sent to your email!');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await verifyOtp(email, otp);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('email', res.data.email);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Welcome to Shopifyz</h2>

                {error && <div className="error-msg">{error}</div>}
                {success && <div className="success-msg">{success}</div>}

                {step === 1 ? (
                    <form onSubmit={handleRequestOtp}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} color="#94a3b8" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }} />
                                <input
                                    type="email"
                                    required
                                    className="form-input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="Enter your Gmail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading || !email}>
                            {loading ? <Loader2 className="animate-spin m-auto" size={20} /> : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Enter 6-Digit OTP</label>
                            <div style={{ position: 'relative' }}>
                                <KeyRound size={20} color="#94a3b8" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }} />
                                <input
                                    type="text"
                                    required
                                    className="form-input"
                                    style={{ paddingLeft: '2.5rem', letterSpacing: '4px', textAlign: 'center' }}
                                    placeholder="------"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading || otp.length < 6}>
                            {loading ? <Loader2 className="animate-spin m-auto" size={20} /> : 'Verify & Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setStep(1); setOtp(''); setSuccess(''); }}
                            style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Back to Email
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
