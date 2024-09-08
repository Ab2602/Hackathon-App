import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logo from "../assets/images/logo.png";
import "../assets/styles/Challenge_detail.css";

interface Challenge {
  id: number;
  challengeName: string;
  startDate: string;
  endDate: string;
  description: string;
  level: string;
  image: string;
}

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/api/challenges/${id}`)
        .then(response => response.json())
        .then(data => setChallenge(data))
        .catch(error => console.error('Error fetching challenge details:', error));
    }
  }, [id]);

  const handleDelete = () => {
    if (id) {
      fetch(`http://localhost:3001/api/challenges/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            alert('Challenge deleted successfully.');
            navigate('/challenges'); // Redirect to the challenges list page
          } else {
            alert('Error deleting challenge.');
          }
        })
        .catch(error => console.error('Error deleting challenge:', error));
    }
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/edit-challenge/${id}`); // Redirect to the edit page
    }
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);

    // Get parts of the date
    const day = date.getUTCDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getUTCFullYear();

    // Get time in 12-hour format
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 24-hour to 12-hour format

    return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  };

  if (!challenge) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="nav">
        <img src={Logo} alt="logo" width="7%" />
      </div>

      <div className="challenge_detail_card">
        <div className="" >
          <p className='challenge_time'>Starts on {formatDate(challenge.startDate)} (India Standard Time)</p>
          <h1>{challenge.challengeName}</h1>
          <span>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi, aliquid. Quos, accusantium ratione impedit modi</span> 
          <br/>
          <p className="challenge_level"> {challenge.level}</p>

        </div>
        
        <div className=""></div>
      </div>
      <div className="challenge_buttons">
        <p>Overview</p>
        <div className="">
        <button className='challenge_edit' onClick={handleEdit}>Edit</button>
        <button className='challenge_delete' onClick={handleDelete}>Delete</button>
        </div>
      </div>
      <div className="challenge-detail">
        <p>{challenge.description}</p>
      </div>
    </>
  );
};

export default ChallengeDetail;
