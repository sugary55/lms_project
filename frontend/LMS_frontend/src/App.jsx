import { useEffect , useState} from 'react';
import Navbar from './components/navbar';
// import { useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import './App.css'
import {supabase} from './library/supabaseClient';
import { syncUserWithMongoDb} from './library/api';



// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// function App(){
//   const handleLogin = async ()=>{
//     //1.trigger supabase google login
//     const {error} = await supabase.auth.signInWithOAuth({
//       provider:'google',
//       options:{
//         redirectTo: "http://localhost:5173"
//       }
//     });
//     if(error) console.log("supabase login error",error.message);
//   };
//   useEffect(()=>{
//     //
//      //2.this "listener detects when the user returns from google"
//     const {data :{subscription}}=supabase.auth.onAuthStateChange(async (event , session)=>{
//     if(event === 'SIGNED_IN'&& session){
//       console.log("logged into supabase, syncing with mongo...");
//   //3.this is where we sync the user data with our backend mongodb
//       await syncUserWithMongoDb(session.user);
//       console.log("user successfully saved in mongodb")
//          }
//   });
//   return () => 
//     subscription.unsubscribe();
//   },[]);
//    return(
//     <div>
//       <h1>LMS PROJECT</h1>
//       <button onClick={handleLogin}>login in with google</button>
//     </div>
//    )}


function App(){
  const [User,setUser]=useState(null);
  useEffect(()=>{
    //1.check for an existing session on load
    const checkUser = async()=>{
      const {data :{session}} = await supabase.auth.getSession();
      if(session) setUser(session.user);
    }
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
    }

    //only one return block for any component
      return(
        <div className='App'>
          <Navbar
            User = {User}
            handleLogout= {handleLogout}
            handleLogin = {() => supabase.auth.signInWithOAuth({
              provider:'google',
              options:{queryParams:{prompt:'select_account'}}
            })}
          />
          <main style={{textAlign:'center',padding:'50px'}}>
            {User? (
              <div>
                <h1>welcome back,{User.user_metadata?.full_name || User.email}!</h1>
                <p>your ID :{User.id}</p>
              </div>
            ):(
              <h1>please log in to see your courses.</h1>
            )}
          </main>
        </div>
      )
    // return(
    //   <div style={{textAlign:'center',marginTop:'50px'}}>
    //     <h1>LMS PROJECT</h1>
    //     {User ? (
    //       <div>
    //         <h2>welcome, {User.user_metadata?.full_name || User.email}!</h2>
    //         <p>your ID :{User.id}</p>
    //         <button onClick={handleLogout} style={{background : '#ff4b4b' ,color :'white'}}>logout</button>
    //       </div>
    //     ) :(
    //       <button onClick={()=> supabase.auth.signInWithOAuth({provider :'google'})}>login with google</button>
    //     )}
    //   </div>
    // );
    // return(
    //   <div className="App">
    //     <navbar 
    //       User={User}
    //       handleLogout={handleLogout}
    //       handlelogin={() => supabase.auth.signInWithOAuth({
    //         provider:'google',
    //         options:{queryParams:{prompt:'select_account'}}
    //       })}
    //     />
    //     <main style={{textAlign:'center',padding:'50px'}}>
    //       {User ? (
    //         <h1>Welcome back,{User.user_metadata?.full_name}!</h1>
    //       ):(
    //         <h1>please log in to see your courses</h1>
    //       )}
    //     </main>
    //   </div>
    // );

  }
export default App
