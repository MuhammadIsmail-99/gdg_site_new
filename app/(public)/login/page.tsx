import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export default async function LoginPage() {
    const session = await auth();

    if (session?.user) {
        const role = session.user.role;
        if (role === 'admin') redirect('/admin');
        if (role === 'core') redirect('/core');
        redirect('/dashboard');
    }

    return <LoginForm />;
}
