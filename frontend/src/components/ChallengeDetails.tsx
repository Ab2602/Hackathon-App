import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

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

  if (!challenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="challenge-detail">
      <img src={challenge.image} alt={challenge.challengeName} />
      <h1>{challenge.challengeName}</h1>
      <p>{challenge.description}</p>
      <p><strong>Start Date:</strong> {new Date(challenge.startDate).toLocaleDateString()}</p>
      <p><strong>End Date:</strong> {new Date(challenge.endDate).toLocaleDateString()}</p>
      <p><strong>Level:</strong> {challenge.level}</p>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default ChallengeDetail;
