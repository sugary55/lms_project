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
          <CourseDetails/>
        ):(
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <h1 className="text-2xl font-bold">Please login to view course details</h1>
            <p className="text-gray-500 mt-2">You need an account to see the syllabus and enroll.</p>
          </div>
        )
      }/>
    </Routes>
  </div>
  );
};

export default App;
