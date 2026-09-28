import { Navigate } from 'react-router';

import { useAuth } from '../../context/AuthContext';

const AccountPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const createdAt = new Date(user.date_created).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="page-body">
      <div className="mx-auto max-w-xl rounded-[32px] border border-blue-200 bg-white/80 p-6 shadow-sm">
        <h1 className="mb-6">Account</h1>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Username</p>
            <p className="text-lg font-semibold text-slate-900">{user.username}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">First name</p>
            <p className="text-lg font-semibold text-slate-900">{user.first_name}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Last name</p>
            <p className="text-lg font-semibold text-slate-900">{user.last_name}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Account created</p>
            <p className="text-lg font-semibold text-slate-900">{createdAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
