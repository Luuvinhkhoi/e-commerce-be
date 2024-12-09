import { useState } from 'react'
import './login.css'
import clevr from '../../util/clevr'
import {Link, useNavigate} from 'react-router-dom'
import facebookImg from '../../Assets/facebook.png'
import gmailImg from '../../Assets/gmail.png'
export const Login = ()=>{
    const [emailState, setEmailState]=useState('')
    const [passwordState, setPasswordState]=useState('')
    const navigate=useNavigate()
    function handleEmailInput(e){
        setEmailState(prev=>prev=e.target.value)    
    }
    function handlePasswordInput(e){
        setPasswordState(prev=>prev=e.target.value)    
    }
    async function handleLogin(){
        const result= await clevr.logIn(emailState, passwordState)
        console.log(result)
        if (!result){
            console.error('fail');
        } else{
            navigate('/')
        }
    }
    function handleSubmit(e) {
        e.preventDefault(); // Ngăn trang bị reload
        handleLogin(); // Gọi hàm đăng ký
    }
    return (
        <form onSubmit={handleSubmit} className="login">
            <div className='login-box'>
                <div className="login-box-row-1">
                    <span>Login</span>
                </div>
                <div className='login-box-row-2'>
                        <div className='login-email-input'>
                            <input type='email' placeholder='Type your email here' onChange={handleEmailInput}></input>
                        </div>
                        <div className='login-password-input'>
                            <input type='password' placeholder='Type your password here' onChange={handlePasswordInput}></input>
                        </div>
                        <div className='login-button'>
                            <button>Login</button>
                        </div>
                </div>
                <div className='third-party-login'>
                    <span>Or login with:</span>
                    <a href="http://localhost:4001/login/facebook" class="button"><img src={facebookImg}></img></a>
                    <a href="http://localhost:4001/login/google" class="button"><img src={gmailImg}></img></a>
                </div>
                <div className='sign-up-link'>
                    <span>Not a member yet?</span>
                    <Link to={'/sign-up'}>Sign up</Link>
                </div>
            </div>    
        </form>
    )
}