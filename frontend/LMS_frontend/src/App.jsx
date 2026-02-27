import React, { useEffect , useState} from 'react';
import Navbar from './components/navbar';
import HeroSection  from './components/herosection';
import Courses from './pages/Course';
import CourseDetails from './pages/CourseDetails';
import {supabase} from './library/supabaseClient';
import { syncUserWithMongoDb} from './library/api';
import { Routes , Route } from 'react-router-dom';


function App(){
  const [User,setUser]=useState(null);

  useEffect(()=>{
    //1.check for an existing session on load
    const checkUser = async()=>{
      const {data :{session}} = await supabase.auth.getSession();
      if(session) setUser(session.user);
    };
    checkUser();


    //2. listen for login/logout events
    const {data : {subscription}} = supabase.auth.onAuthStateChange(async (event,session)=>{
      if((event === 'SIGNED_IN'|| event === 'INITIAL_SESSION') && session)
        {
        setUser(session.user);
        await syncUserWithMongoDb(session.user);
      }else if(event === 'SIGNED_OUT'){
        setUser(null);
      }
    });
    return ()=> subscription.unsubscribe();},[]);

    const handleLogout = async ()=>{
      await supabase.auth.signOut();
    };

    //only one return block for any component
      return(
        <div className='App'>
          <Navbar
            User={User}
            handleLogout={handleLogout}
            handleLogin={() => supabase.auth.signInWithOAuth({
              provider:'google',
              options:{queryParams:{prompt:'select_account'}}
            })}
          />

          <Routes>
            {/*route1:homepage*/}
            <Route path='/' element={
              <>
                <HeroSection User={User}/>
                <main style={{padding:'20px'}}>
                  <section style={{textAlign:"center",margin:"40px 0"}}>
                    {User? (
                      <div>
                <h1 className="text-2xl font-bold text-blue-600">welcome back,{User.user_metadata?.full_name || User.email}!
                </h1>
              </div>
                    ):(
                      <h1 className="text-2xl font-bold">start your journey today </h1>
                   )}
                 </section>
            {/* 3.the course gallery  */}
            <hr className="my-10 border-gray-100" />
            <Courses/>
          </main>
        </>
      }/>
      {/*route2:course details page*/}
      <Route path='/course/:id' element={
        User ? (
          <CourseDetails user={User}/>
        ):(
          <div className="max-w-4xl mx-auto px-6 py-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-12">
              <svg className="w-20 h-20 text-blue-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Login Required</h1>
                <p className="text-lg text-gray-600 mb-8">
                  Please sign in to view course details, syllabus, and enroll.
                </p>
                <button 
                  onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg">
                  Sign In with Google
                </button>
            </div>
          </div>
        )
      }/>
    </Routes>
  </div>
  );
};

export default App;
