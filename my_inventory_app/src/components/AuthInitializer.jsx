import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "../supabase/supabaseClient";
import { clearAuth, setAuth } from "../store/authSlice";

function AuthInitializer({children}) {
    const dispatch = useDispatch();

    useEffect(() => {
        const initializeAuth = async () => {
            const { data: { session }} = await supabase.auth.getSession(); //upon refreshing the page, we check to see if supabase
            //has a valid key saved in the browser's hidden storage
            if(session) {
                dispatch(setAuth(session.user)); //if there is a valid key, it dispatches the user to redux
            }
        };

        initializeAuth();

        const { data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
            //we create a live listener/subscription so that when the auth state changes, the supabase actions upon it
            if(session) {
                dispatch(setAuth(session.user)); //if the session exists, it updates the redux
            }
            else {
                dispatch(clearAuth()); //if it doesn't anymore, then it wipes redux 
            }
        });

        return () => subscription.unsubscribe(); //we have to clear our subscription so that when the component re-renders 
        // we don't set up another live listener
    }, [dispatch]);

    return children;
}

export default AuthInitializer;