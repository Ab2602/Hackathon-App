import {useNavigate} from 'react-router-dom'
import Logo from "../assets/images/logo.png";
import Rocket from "../assets/images/rocket.svg";
import Ai from "../assets/images/ai.svg";
import DataScienc from "../assets/images/Group 1000002516.svg";
import AiChallenge from "../assets/images/Group 1000002518.svg";


import "../assets/styles/intro.css";

const Intro = () => {
  const navigate = useNavigate();
  
  const handleRedirect =()=>{
    navigate('/create');
  }
  return (
    <>
      <div className="nav">
        <img src={Logo} alt="logo" width="7%" />
      </div>
      <div className="about">
        <div className="intro_desc">
          <div className="heading">
            <h1>Accelerate Innovation with Global AI Challenges</h1>
          </div>
          <p>
            AI Challenges at DPhi simulate real-world problems. It is a great
            place to put your AI/Data Science skills to test on diverse datasets
            allowing you to foster learning through competitions. Create
            Challenge
          </p>
          <button onClick={handleRedirect}>Create Challenge</button>
        </div>
        <div className="intro_img">
          <img src={Rocket} alt="rocketimg" />
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <img src={Ai} alt="ai" />
          <div className="stat-text">
            <h4>100K+</h4>
            <p>AI model submissions</p>
          </div>
        </div>
        <div className="line"></div>
        <div className="stat" style={{width:'15%'}}>
          <img src={DataScienc} alt="ai" />
          <div className="stat-text" >
            <h4>50K+</h4>
            <p>Data Scientists</p> 
          </div>
        </div>
        <div className="line"></div>
        <div className="stat">
          <img src={AiChallenge} alt="ai" />
          <div className="stat-text">
            <h4>100+</h4>
            <p>AI Challenges hosted</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Intro;
