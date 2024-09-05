//import React from 'react'
import '../assets/styles/participation.css'
import Book from '../assets/images/carbon_notebook-reference.svg';
import Id from '../assets/images/IdentificationCard.svg';
import Robot from '../assets/images/Robot.svg';
import People from '../assets/images/Vector.svg';

const Participation = () => {
  return (
    <>
    <div className="partiDiv">

      <div className="participationHeading">
        <h1>
          Why Participate in{" "}
          <span style={{ color: "rgba(15, 169, 88, 1)" }}>AI Challenges?</span>
        </h1>
      </div>
      <div className='cards-partici'>
        <div className="card">
            <img src={Book} alt="" />
            <h3>Prove your skills</h3>
            <p>Gain substantial experience by solving real-world problems and pit against others to come up with innovative solutions.</p>
        </div>
        <div className="card">
        <img src={People} alt="" />
            <h3>Learn from community</h3>
            <p>One can look and analyze the solutions submitted by the other Data Scientists in the community and learn from them.</p>
        </div>
        <div className="card">
        <img src={Robot} alt="" />
            <h3>Challenge yourself</h3>
            <p>There is nothing for you to lose by participating in a challenge. You can fail safe, learn out of the entire experience and bounce back harder.</p>
        </div>
        <div className="card">
        <img src={Id} alt="" />
            <h3>Earn recognition</h3>
            <p>You will stand out from the crowd if you do well in AI challenges, it not only helps you shine in the community but also earns rewards.</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Participation;
