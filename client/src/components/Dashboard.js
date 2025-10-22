import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
    const [todos, setTodos] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        active: 0,
        completionRate: 0
    });

    const navigate = useNavigate();
    const apiUrl = "http://localhost:8000";

    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    const authHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

    useEffect(() => {
        getTodos();
    }, []);

    const getTodos = () => {
        fetch(`${apiUrl}/todos`, { headers: authHeaders })
            .then(res => {
                if (res.status === 401) {
                    toast.error("Unauthorized. Please log in again.");
                    navigate("/login");
                }
                return res.json();
            })
            .then(res => {
                setTodos(res);
                calculateStats(res);
            })
            .catch(err => toast.error("Error fetching tasks"));
    };

    const calculateStats = (todoList) => {
        const total = todoList.length;
        const completed = todoList.filter(todo => todo.completed).length;
        const active = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        setStats({ total, completed, active, completionRate });
    };

    return (
        <>
        <ToastContainer position="top-right" autoClose={3000} />
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            paddingBottom: '50px'
        }}>
            <div className="container py-5" style={{ maxWidth: '1200px' }}>
                {/* Header */}
                <div className="mb-4">
                    <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: '36px', fontWeight: '700', color: '#fff', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                        Dashboard
                    </h1>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', color: 'rgba(255,255,255,0.85)', marginBottom: 0 }}>
                        Track your productivity and progress
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="row g-4 mb-4">
                    {["Total Tasks", "Completed", "Active Tasks", "Completion Rate"].map((label, index) => {
                        const colors = [
                            { bg: '#fff', iconBg: '#edf2f7', icon: '📋', text: '#1a202c' },
                            { bg: '#fff', iconBg: '#c6f6d5', icon: '✓', text: '#38a169' },
                            { bg: '#fff', iconBg: '#bee3f8', icon: '⏰', text: '#3182ce' },
                            { bg: '#fff', iconBg: '#fbb6ce', icon: '📈', text: '#d53f8c' },
                        ];
                        const value = [stats.total, stats.completed, stats.active, stats.completionRate + (index === 3 ? "%" : "")][index];

                        return (
                            <div className="col-md-3" key={index}>
                                <div className="card border-0" style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '24px', background: colors[index].bg }}>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '600', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: colors[index].iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '20px' }}>{colors[index].icon}</span>
                                        </div>
                                    </div>
                                    <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '48px', fontWeight: '700', color: colors[index].text, marginBottom: 0 }}>{value}</h2>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Progress / Insights */}
                <div className="row g-4 mb-4">
                    <div className="col-md-6">
                        <div className="card border-0" style={{ borderRadius: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', padding: '32px', background: '#fff', height: '100%' }}>
                            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '22px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>Overall Progress</h3>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#718096', marginBottom: '32px' }}>Your task completion overview</p>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Completion Rate</span>
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '700', color: '#667eea' }}>{stats.completionRate}%</span>
                                </div>
                                <div style={{ width: '100%', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div style={{ width: `${stats.completionRate}%`, height: '100%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', transition: 'width 0.5s ease' }}></div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-6">
                                    <div style={{ padding: '20px', backgroundColor: '#f7fafc', borderRadius: '12px' }}>
                                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '600', color: '#718096', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Completed</p>
                                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '32px', fontWeight: '700', color: '#38a169', marginBottom: 0 }}>{stats.completed}</h3>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div style={{ padding: '20px', backgroundColor: '#f7fafc', borderRadius: '12px' }}>
                                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '600', color: '#718096', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remaining</p>
                                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '32px', fontWeight: '700', color: '#3182ce', marginBottom: 0 }}>{stats.active}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Productivity Insights */}
                    <div className="col-md-6">
                        <div className="card border-0" style={{ borderRadius: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', padding: '32px', background: '#fff', height: '100%' }}>
                            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '22px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>Productivity Insights</h3>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#718096', marginBottom: '32px' }}>Tips to boost your efficiency</p>
                            <div className="d-flex flex-column gap-3">
                                {stats.total === 0 && <div style={{ padding: '16px', backgroundColor: '#fef5e7', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>💡 Get Started</p>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#78350f', marginBottom: 0 }}>Add your first task to start tracking your productivity!</p>
                                </div>}
                                {stats.completionRate === 100 && stats.total > 0 && <div style={{ padding: '16px', backgroundColor: '#d1fae5', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '600', color: '#065f46', marginBottom: '4px' }}>🎉 Amazing Work!</p>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#047857', marginBottom: 0 }}>You've completed all your tasks! Keep up the great momentum.</p>
                                </div>}
                                {stats.completionRate > 0 && stats.completionRate < 100 && <div style={{ padding: '16px', backgroundColor: '#dbeafe', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '600', color: '#1e3a8a', marginBottom: '4px' }}>💪 Keep Going!</p>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#1e40af', marginBottom: 0 }}>You're {stats.completionRate}% done. Just {stats.active} more task{stats.active !== 1 ? 's' : ''} to go!</p>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Tasks */}
                <div className="card border-0" style={{ borderRadius: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', padding: '32px', background: '#fff' }}>
                    <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '22px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>Recent Tasks</h3>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#718096', marginBottom: '24px' }}>Your latest task activity</p>
                    {todos.length === 0 ? (
                        <div className="text-center py-4">
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', color: '#a0aec0' }}>No tasks yet. Create your first task to get started!</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {todos.slice(0, 5).map((todo, index) => (
                                <div key={index} style={{ padding: '16px 20px', backgroundColor: '#f7fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', border: '2px solid #e2e8f0' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #cbd5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {todo.completed && <span style={{ fontSize: '12px', color: '#38a169' }}>✓</span>}
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>{todo.title}</h5>
                                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#718096', marginBottom: 0 }}>{todo.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}
