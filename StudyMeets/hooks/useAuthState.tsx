import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { f_auth } from '../firebaseConfig';

export const useAuthState = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(f_auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    return user;
};
