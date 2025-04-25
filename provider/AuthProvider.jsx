import React, { useState, useEffect, createContext } from 'react'
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';


export const AuthContext = createContext({})


// Custom hook to read the context values
export function useAuth() {
    return React.useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            setUser(session ? session.user : null);
            setInitialized(true);
        });

        return () => {
            data.subscription.unsubscribe();
        };
    }, [])

    // Log out the user
    const signOut = async () => {
        await supabase.auth.signOut();
    }

    const value = {
        user,
        session,
        initialized,
        signOut
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

